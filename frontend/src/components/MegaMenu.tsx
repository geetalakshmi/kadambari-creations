// frontend/src/components/MegaMenu.tsx
import React from "react"

type Sel = { category?: string; subcategory?: string }

export default function MegaMenu({ onSelect }: { onSelect: (sel: Sel) => void }) {
  const goWomenAll = () => onSelect({ category: "women", subcategory: undefined })
  const goSub = (sub: string) => onSelect({ category: "women", subcategory: sub })

  return (
    // group keeps submenu visible on hover/focus anywhere inside
    <div className="relative group" tabIndex={0}>
      {/* Trigger: click = All Women */}
      <button
        className="hover:text-rose-600 focus:text-rose-600 outline-none"
        onClick={goWomenAll}
      >
        Women
      </button>

      {/* Panel: toggled purely via CSS (no flicker) */}
      <div
        className="
          invisible opacity-0
          group-hover:visible group-hover:opacity-100
          group-focus-within:visible group-focus-within:opacity-100
          transition-opacity duration-150
          absolute left-0 top-full mt-3 w-screen max-w-4xl
          rounded-2xl border border-gray-100 bg-white shadow-xl z-[9999]
        "
        role="menu"
      >
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Column 1 */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Featured</div>
            <button
              className="block w-full text-left px-2 py-1.5 rounded hover:bg-gray-50"
              onClick={goWomenAll}
              role="menuitem"
            >
              All Women
            </button>
          </div>

          {/* Column 2 */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Shop by Style</div>
            <button
              className="block w-full text-left px-2 py-1.5 rounded hover:bg-gray-50"
              onClick={() => goSub("lehenga")}
              role="menuitem"
            >
              Lehengas
            </button>
            <button
              className="block w-full text-left px-2 py-1.5 rounded hover:bg-gray-50"
              onClick={() => goSub("saree")}
              role="menuitem"
            >
              Sarees
            </button>
            <button
              className="block w-full text-left px-2 py-1.5 rounded hover:bg-gray-50"
              onClick={() => goSub("blouse")}
              role="menuitem"
            >
              Blouses
            </button>
          </div>

          {/* Column 3 */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Occasion</div>
            <button
              className="block w-full text-left px-2 py-1.5 rounded hover:bg-gray-50"
              onClick={() => goSub("festive")}
              role="menuitem"
            >
              Festive Wear
            </button>
            <button
              className="block w-full text-left px-2 py-1.5 rounded hover:bg-gray-50"
              onClick={() => goSub("casual")}
              role="menuitem"
            >
              Casual Wear
            </button>
            <button
              className="block w-full text-left px-2 py-1.5 rounded hover:bg-gray-50"
              onClick={() => goSub("party")}
              role="menuitem"
            >
              Party Wear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
