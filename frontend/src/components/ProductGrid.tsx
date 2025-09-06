import { useEffect, useState } from "react"
import { fetchProducts, Product } from "../lib/api"
import ProductCard from "./ProductCard"

export default function ProductGrid({ category, subcategory }: { category?: string; subcategory?: string }) {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts({ category, subcategory }).then(setItems)
  }, [category, subcategory])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(p => (<ProductCard key={p.id} p={p} />))}
      {items.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-12">
          No products yet. Add some in Admin.
        </div>
      )}
    </div>
  )
}
