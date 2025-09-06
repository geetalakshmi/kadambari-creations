import { Heart } from 'lucide-react'
import { Product } from '../lib/api'
const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/5] bg-gray-50">
        <img src={`http://localhost:8000${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-gray-900">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.category}</p>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-50" title="Add to favorites">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-semibold">{fmt.format(p.price)}</span>
          <button className="btn bg-rose-600 text-white">Add to Cart</button>
        </div>
      </div>
    </div>
  )
}
