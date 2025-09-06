import { useEffect, useState } from "react"
import { fetchCategories, Category } from "../lib/api"

type Sel = { category?: string; subcategory?: string }

export default function CategoryBar({ onSelect }: { onSelect: (sel: Sel) => void }) {
  const [cats, setCats] = useState<Category[]>([])
  const [active, setActive] = useState<Sel>({})

  useEffect(() => { fetchCategories().then(setCats) }, [])

  const setAll = () => { setActive({}); onSelect({}) }
  const selectCategoryOnly = (id: string) => { const sel = { category: id as string, subcategory: undefined }; setActive(sel); onSelect(sel) }
  const selectWomenSub = (sub: string) => { const sel = { category: "women", subcategory: sub }; setActive(sel); onSelect(sel) }

  const chip = (on:boolean) => `px-3 py-1 rounded-full text-sm ${on ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-700"}`

  return (
    <div className="border-b border-gray-100 bg-white">
      {/* overflow-visible so submenu isn't clipped */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 items-center overflow-visible">
        <button className={chip(!active.category)} onClick={setAll}>All</button>

        {cats.map(c => {
          if (c.id !== "women") {
            return (
              <button
                key={c.id}
                className={chip(active.category === c.id && !active.subcategory)}
                onClick={() => selectCategoryOnly(c.id)}
              >
                {c.name}
              </button>
            )
          }

          // Women — hover/focus to show submenu, click shows all Women
          return (
            <div
              key="women"
              className="relative group"
              tabIndex={0} // enables :focus-within for keyboard users
            >
              <button
                className={chip(active.category === "women" && !active.subcategory)}
                onClick={() => selectCategoryOnly("women")} // click = all Women
              >
                Women
              </button>

              {/* Submenu: appears on group-hover or focus-within; no JS timers needed */}
              <div
                className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100
                           transition-opacity duration-150 absolute left-0 mt-2 w-48
                           bg-white border border-gray-100 rounded-xl shadow-lg z-[9999]"
                role="menu"
              >
                {["lehenga", "blouse", "saree"].map(sub => (
                  <button
                    key={sub}
                    className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      active.category === "women" && active.subcategory === sub
                        ? "text-rose-600 font-medium"
                        : "text-gray-700"
                    }`}
                    onClick={() => selectWomenSub(sub)}
                    role="menuitem"
                  >
                    {sub.charAt(0).toUpperCase() + sub.slice(1)}s
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
