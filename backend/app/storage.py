import json
import os
import uuid
from typing import Dict, List, Optional

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
PRODUCTS_PATH = os.path.join(DATA_DIR, "products.json")
CATEGORIES_PATH = os.path.join(DATA_DIR, "categories.json")

def _read_json(path: str) -> dict:
    if not os.path.exists(path):
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def _write_json(path: str, data: dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def list_categories() -> List[Dict]:
    data = _read_json(CATEGORIES_PATH) or {"categories": []}
    return data.get("categories", [])

#def list_products(category: Optional[str] = None, q: Optional[str] = None) -> List[Dict]:
    data = _read_json(PRODUCTS_PATH) or {"products": []}
    items = data.get("products", [])
    if category:
        items = [p for p in items if p.get("category") == category]
    if q:
        ql = q.lower()
        items = [p for p in items if ql in p.get("name", "").lower() or ql in p.get("description", "").lower()]
    return items

def list_products(category: Optional[str] = None, q: Optional[str] = None, subcategory: Optional[str] = None) -> List[Dict]:
    data = _read_json(PRODUCTS_PATH) or {"products": []}
    items = data.get("products", [])
    if category:
        items = [p for p in items if p.get("category") == category]
    if subcategory:
        items = [p for p in items if (p.get("subcategory") or "").lower() == subcategory.lower()]
    if q:
        ql = q.lower()
        items = [p for p in items if ql in p.get("name", "").lower() or ql in p.get("description", "").lower()]
    return items

def get_product(pid: str) -> Optional[Dict]:
    for p in list_products():
        if p.get("id") == pid:
            return p
    return None

#def add_product(name: str, price: float, category: str, description: str, image_url: str) -> Dict:
    data = _read_json(PRODUCTS_PATH) or {"products": []}
    pid = str(uuid.uuid4())
    product = {
        "id": pid,
        "name": name,
        "price": price,
        "category": category,
        "description": description,
        "image_url": image_url,
        "created_at": __import__("datetime").datetime.utcnow().isoformat() + "Z"
    }
    data["products"].insert(0, product)
    _write_json(PRODUCTS_PATH, data)
    return product

def update_product(pid: str, patch: Dict) -> Optional[Dict]:
    data = _read_json(PRODUCTS_PATH) or {"products": []}
    for i, p in enumerate(data["products"]):
        if p.get("id") == pid:
            p.update(patch)
            data["products"][i] = p
            _write_json(PRODUCTS_PATH, data)
            return p
    return None

def delete_product(pid: str) -> bool:
    data = _read_json(PRODUCTS_PATH) or {"products": []}
    new_products = [p for p in data["products"] if p.get("id") != pid]
    if len(new_products) != len(data["products"]):
        data["products"] = new_products
        _write_json(PRODUCTS_PATH, data)
        return True
    return False

def list_products(category: Optional[str] = None, q: Optional[str] = None, subcategory: Optional[str] = None) -> List[Dict]:
    data = _read_json(PRODUCTS_PATH) or {"products": []}
    items = data.get("products", [])
    if category:
        items = [p for p in items if p.get("category") == category]
    if subcategory:
        items = [p for p in items if (p.get("subcategory") or "").lower() == subcategory.lower()]
    if q:
        ql = q.lower()
        items = [p for p in items if ql in p.get("name", "").lower() or ql in p.get("description", "").lower()]
    return items

def add_product(name: str, price: float, category: str, description: str, image_url: str, subcategory: Optional[str] = None) -> Dict:
    data = _read_json(PRODUCTS_PATH) or {"products": []}
    pid = str(uuid.uuid4())
    product = {
        "id": pid,
        "name": name,
        "price": price,
        "category": category,
        "subcategory": subcategory,  # <-- add
        "description": description,
        "image_url": image_url,
        "created_at": __import__("datetime").datetime.utcnow().isoformat() + "Z"
    }
    data["products"].insert(0, product)
    _write_json(PRODUCTS_PATH, data)
    return product