/* eslint-disable no-unused-vars */
"use client"

import { X } from "lucide-react"
import { useState } from "react"

const FilterModal = ({ handleClose, isVisible, onFiltersChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [sortBy, setSortBy] = useState("Default")

  const applyFilters = () => {
    onFiltersChange({
      category: selectedCategory,
      priceRange,
      sortBy,
    })
    handleClose()
  }

  return (
    // overlay
    <div
      onClick={handleClose}
      className={`fixed inset-0 bg-[#282828]/50 flex justify-end z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* popup drawer */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white w-[270px] sm:w-[500px] h-screen flex flex-col shadow-xl py-6 sm:py-11 px-3 sm:px-6 font-sans transform transition-transform duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <h2 className="text-xs capitalize">SORT & FILTER </h2>
          <button onClick={handleClose} className="cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className="font-medium mb-3">Sort By</h3>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Default">Default</option>
              <option value="High Price">High Price</option>
              <option value="Low Price">Low Price</option>
              <option value="A - Z">A - Z</option>
              <option value="Z - A">Z - A</option>
            </select>
          </div>

          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-2 border border-gray-300 rounded"
                value={priceRange.min}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full p-2 border border-gray-300 rounded"
                value={priceRange.max}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
              />
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="w-full bg-[#282828] text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterModal