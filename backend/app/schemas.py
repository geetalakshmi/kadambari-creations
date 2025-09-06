from pydantic import BaseModel, Field
from typing import Optional, List

class ProductIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    price: float = Field(..., ge=0)
    category: str = Field(..., min_length=1, max_length=60)
    subcategory: Optional[str] = Field(None, max_length=60)  # <-- add
    description: str = Field("", max_length=1000)

class Product(ProductIn):
    id: str
    image_url: str
    created_at: str

class Category(BaseModel):
    id: str
    name: str

class ProductsOut(BaseModel):
    products: List[Product]

class CategoriesOut(BaseModel):
    categories: List[Category]
