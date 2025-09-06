import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Optional
from dotenv import load_dotenv

from . import storage
from .schemas import ProductIn, Product, ProductsOut, CategoriesOut

load_dotenv()

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "changeme-supersecret")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(__file__), "static", "uploads"))
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("CORS_ALLOW_ORIGINS", "").split(",") if o.strip()] or ["*"]

app = FastAPI(title="Kadambari Creations API", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for images
static_root = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_root), name="static")

def admin_auth(request: Request):
    token = request.headers.get("x-admin-token")
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/categories", response_model=CategoriesOut)
def get_categories():
    return {"categories": storage.list_categories()}

#@app.get("/api/products", response_model=ProductsOut)
#def get_products(category: Optional[str] = None, q: Optional[str] = None):
#    return {"products": storage.list_products(category=category, q=q)}

@app.get("/api/products", response_model=ProductsOut)
def get_products(category: Optional[str] = None, q: Optional[str] = None, subcategory: Optional[str] = None):
    return {"products": storage.list_products(category=category, q=q, subcategory=subcategory)}


@app.post("/api/admin/products", dependencies=[Depends(admin_auth)])
async def create_product(
    name: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    subcategory: Optional[str] = Form(None),  # <-- add
    description: str = Form(""),
    image: UploadFile = File(...),
):
    # Save image
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    # Sanitize filename
    import uuid, pathlib
    ext = pathlib.Path(image.filename).suffix.lower()
    fname = f"{uuid.uuid4()}{ext}"
    dest = os.path.join(UPLOAD_DIR, fname)
    with open(dest, "wb") as f:
        f.write(await image.read())

    image_url = f"/static/uploads/{fname}"
    if not category.strip():
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail="Category is required")

    product = storage.add_product(name=name, price=price, category=category, description=description, subcategory=subcategory, image_url=image_url)
    return product

@app.put("/api/admin/products/{pid}", dependencies=[Depends(admin_auth)])
async def update_product(pid: str, payload: ProductIn):
    existing = storage.get_product(pid)
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")
    updated = storage.update_product(pid, payload.dict())
    return updated

@app.delete("/api/admin/products/{pid}", dependencies=[Depends(admin_auth)])
async def remove_product(pid: str):
    ok = storage.delete_product(pid)
    if not ok:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"deleted": True}
