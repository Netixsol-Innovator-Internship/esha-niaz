"use client"

import { useState, useEffect } from "react"
import TopImage from "../../assets/collections/topimage.jpg"
import { ArrowLeft, ChevronDown } from "lucide-react"
import FilterModal from "./FilterModal"

const TopSection = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // open with animation
  useEffect(() => {
    if (isFilterOpen) {
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
    }
  }, [isFilterOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => setIsFilterOpen(false), 300)
  }

  return (
    <div className="w-full relative font-montserrat">
      {/* Background Image */}
      <div className="w-full h-[180px] md:h-[308px]">
        <img src={TopImage} alt="Top section" className="w-full h-full object-cover" />
      </div>

      {/* Overlay Div */}
      <div className="absolute lg:hidden top-0 left-0 w-full flex items-center justify-between px-6 sm:px-10 lg:px-12 py-3 backdrop-blur-xs text-white">
        <ArrowLeft size={24} strokeWidth={2} />
        <button onClick={() => setIsFilterOpen(true)} className="uppercase text-sm font-medium flex items-center gap-2">
          Filter <ChevronDown size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Filter Drawer */}
      {isFilterOpen && <FilterModal handleClose={handleClose} isVisible={isVisible} />}
    </div>
  )
}

export default TopSection