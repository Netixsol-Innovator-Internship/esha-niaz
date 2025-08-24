"use client"

import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Minus, Plus } from "lucide-react"
import { useGetFilteredProductsQuery, useGetFilterOptionsQuery } from "../../redux/slices/product/productsApi"
import { actions } from "../../redux/slices/product/productsSlice"

const Sidebar = ({ onProductsFiltered }) => {
  const dispatch = useDispatch()
  const [enabled, setEnabled] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({})
  const [openSections, setOpenSections] = useState({})

  const { data: filterOptionsData, isLoading: isLoadingOptions } = useGetFilterOptionsQuery()
  const filterOptions = filterOptionsData || {}

  const { data: filteredProductsData } = useGetFilteredProductsQuery(selectedFilters, {
    skip: Object.keys(selectedFilters).length === 0 && !enabled,
  })

  useEffect(() => {
    if (filterOptions.attributes) {
      const initialOpenState = {}
      filterOptions.attributes.forEach((attr) => {
        initialOpenState[attr._id] = false
      })
      initialOpenState["caffeine"] = false
      setOpenSections(initialOpenState)
    }
  }, [filterOptions.attributes])

  useEffect(() => {
    if (filteredProductsData?.success && onProductsFiltered) {
      dispatch(actions.setList(filteredProductsData.data))
      onProductsFiltered(filteredProductsData.data)
    }
  }, [filteredProductsData, onProductsFiltered, dispatch])

  const handleCheckboxChange = (category, value) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev }

      if (updated[category] === value) {
        delete updated[category]
      } else {
        updated[category] = value
      }

      dispatch(actions.setCurrentFilters(updated))
      return updated
    })
  }

  const toggleSection = (sectionId) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  if (isLoadingOptions) {
    return (
      <div className="hidden lg:flex flex-col gap-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="hidden lg:flex flex-col gap-4">
        {/* Dynamic attribute filters */}
        {filterOptions.attributes?.map((item) => (
          <div key={item._id}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection(item._id)}>
              <p className="text-base font-medium uppercase w-[216px]">
                {item._id} <span className="text-[#C3B212]">({item.values.length})</span>
              </p>
              {openSections[item._id] ? <Minus size={20} /> : <Plus size={20} />}
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden ${openSections[item._id] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="mt-2">
                {item.values.map((value, index) => (
                  <label key={index} className="flex items-center gap-2 my-2">
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(item._id, value)}
                      checked={selectedFilters[item._id] === value}
                      className="w-4 h-4 accent-black border-2 border-black rounded"
                    />
                    <span className="text-sm">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Caffeine */}
        <div>
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("caffeine")}>
            <p className="text-base font-medium uppercase w-[216px]">
              CAFFEINE <span className="text-[#C3B212]">({filterOptions.caffeineLevels?.length})</span>
            </p>
            {openSections["caffeine"] ? <Minus size={20} /> : <Plus size={20} />}
          </div>
          <div
            className={`transition-all duration-300 overflow-hidden ${openSections["caffeine"] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className="mt-2">
              {filterOptions.caffeineLevels?.map((level, index) => (
                <label key={index} className="flex items-center gap-2 my-2">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange("caffeine", level)}
                    checked={selectedFilters["caffeine"] === level}
                    className="w-4 h-4 accent-black border-2 border-black rounded"
                  />
                  <span className="text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Organic toggle */}
        <div className="flex items-center mt-4">
          <p className="text-base font-medium uppercase">organic</p>
          <button
            onClick={() => {
              setEnabled(!enabled)
              setSelectedFilters((prev) => {
                const updated = { ...prev, organic: !enabled }
                dispatch(actions.setCurrentFilters(updated))
                return updated
              })
            }}
            className={`w-8 h-4 mx-3 cursor-pointer flex items-center rounded-full border p-0.5 transition-colors duration-300 ${enabled ? "bg-[#282828]" : "bg-transparent"
              }`}
          >
            <div
              className={`w-3 h-3 rounded-full shadow transform transition-transform duration-300 ${enabled ? "translate-x-4 bg-white" : "translate-x-0 bg-[#282828] "
                }`}
            />
          </button>
        </div>
      </div>
    </>
  )
}

export default React.memo(Sidebar)