import { useState } from "react"
import Header from "../components/Header"
import Hero from "../components/Hero"
import CategoryBar from "../components/CategoryBar" // keep if you still want chips
import ProductGrid from "../components/ProductGrid"

export default function App() {
  const [sel, setSel] = useState<{category?: string; subcategory?: string}>({})

  return (
    <div className="min-h-screen">
      <Header onSelect={setSel} />
      <Hero />
      <CategoryBar onSelect={setSel} />
      <ProductGrid category={sel.category} subcategory={sel.subcategory} />
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Kadambari Creations
      </footer>
    </div>
  )
}
