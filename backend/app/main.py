# app/main.py
import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from . import storage
from .schemas import ProductIn, ProductsOut, CategoriesOut

load_dotenv()

# --- Config
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "changeme-supersecret")

BASE_DIR = Path(__file__).resolve().parent
STATIC_ROOT = BASE_DIR / "static"
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", STATIC_ROOT / "uploads"))

# allow localhost:5173 in dev; add your Netlify URL in prod
ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv("CORS_ALLOW_ORIGINS", "").split(",")
    if o.strip()
] or ["http://localhost:5173"]

# --- Ensure folders exist before mounting
STATIC_ROOT.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Kadambari Creations API", version="0.1.0")

# --- CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Static
app.mount("/static", StaticFiles(directory=str(STATIC_ROOT)), name="static")

# --- Auth helper
def admin_auth(request: Request):
    token = request.headers.get("x-admin-token")  # header is case-insensitive
    if token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

# --- Health
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "static_root": str(STATIC_ROOT),
        "upload_dir": str(UPLOAD_DIR),
        "allowed_origins": ALLOWED_ORIGINS,
    }

# --- Categories
@app.get("/api/categories", response_model=CategoriesOut)
def get_categories():
    return {"categories": storage.list_categories()}

# --- Products
@app.get("/api/products", response_model=ProductsOut)
def get_products(
    category: Optional[str] = None,
    q: Optional[str] = None,
    subcategory: Optional[str] = None,
):
    return {"products": storage.list_products(category=category, q=q, subcategory=subcategory)}

# --- Admin: create product (with image upload)
@app.post("/api/admin/products", dependencies=[Depends(admin_auth)])
async def create_product(
    name: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    subcategory: Optional[str] = Form(None),
    description: str = Form(""),
    image: UploadFile = File(...),
):
    if not category.strip():
        raise HTTPException(status_code=422, detail="Category is required")

    import uuid
    ext = Path(image.filename).suffix.lower() or ".jpg"
    fname = f"{uuid.uuid4()}{ext}"
    dest = UPLOAD_DIR / fname
    with dest.open("wb") as f:
        f.write(await image.read())

    # store a WEB path (not OS path)
    image_url = f"/static/uploads/{fname}"

    product = storage.add_product(
        name=name,
        price=price,
        category=category,
        description=description,
        subcategory=subcategory,
        image_url=image_url,
    )
    return product

# --- Admin: update/delete
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
