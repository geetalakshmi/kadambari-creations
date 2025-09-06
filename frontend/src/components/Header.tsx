// frontend/src/components/Header.tsx
import { Heart, ShoppingCart, Shield } from "lucide-react"
import { Link } from "react-router-dom"
import MegaMenu from "./MegaMenu"

type Sel = { category?: string; subcategory?: string }

export default function Header({ onSelect }: { onSelect?: (sel: Sel) => void }) {
  const setSel = onSelect ?? (() => {})
  const goAll = () => setSel({})
  const goCat = (id: string) => setSel({ category: id, subcategory: undefined })

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Clicking the brand shows everything */}
        <button onClick={goAll} className="text-xl font-bold tracking-tight">
          <span className="text-rose-600">Kadambari</span> Creations
        </button>

        {/* IMPORTANT: make sure it's visible; remove 'hidden md:flex' */}
        <nav className="flex gap-6 text-sm text-gray-700 items-center">
          <Link to="/" className="hover:text-rose-600" onClick={() => setSel({})} >Home</Link>
          {/* Women with hover/click mega menu */}
          <MegaMenu onSelect={setSel} />

          {/* Other top-level categories */}
          <button className="hover:text-rose-600" onClick={() => goCat("men")}>Men</button>
          <button className="hover:text-rose-600" onClick={() => goCat("kids")}>Kids</button>
          <button className="hover:text-rose-600" onClick={() => goCat("ethnic")}>Ethnic</button>
          <button className="hover:text-rose-600" onClick={() => goCat("accessories")}>Accessories</button>

          {/* Extras (optional) */}
          <a href="#" className="hover:text-rose-600">Sale</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-50" title="Favorites">
            <Heart />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-50" title="Cart">
            <ShoppingCart />
          </button>
          <Link to="/admin" className="p-2 rounded-full hover:bg-gray-50" title="Admin">
            <Shield />
          </Link>
        </div>
      </div>
    </header>
  )
}
