"use client"

import React, { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import ProductCard from "./ProductCard"
import { useNavigate } from "react-router-dom"
import { actions } from "../../redux/slices/product/productsSlice"
import Button from "../shared/buttons/button"

const ProductsGrid = ({ products }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`)
  }

  const handleAddToCart = (product) => {
    dispatch(actions.addToCart(product))
  }

  const [sortBy, setSortBy] = useState("Default")
  const [visibleCount, setVisibleCount] = useState(9)

  const sortedProducts = useMemo(() => {
    const sorted = [...products]

    switch (sortBy) {
      case "High Price":
        sorted.sort((a, b) => b.variants[0].price - a.variants[0].price)
        break
      case "Low Price":
        sorted.sort((a, b) => a.variants[0].price - b.variants[0].price)
        break
      case "A - Z":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "Z - A":
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    return sorted
  }, [products, sortBy])

  // Load more handler
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10) // load 10 more each time
  }

  return (
    <div className="w-full">
      <div className="hidden lg:flex items-center justify-end font-montserrat">
        {/* sortings */}
        <select
          className="w-32 p-2 bg-white text-gray-700 focus:outline-none focus:ring-0 cursor-pointer"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option disabled>Sort By</option>
          <option>High Price</option>
          <option>Low Price</option>
          <option>A - Z</option>
          <option>Z - A</option>
          <option>Default</option>
        </select>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:mt-6 mb-6">
        {sortedProducts.slice(0, visibleCount).map((product) => (
          <ProductCard
            onClick={() => handleProductClick(product.slug)}
            onAddToCart={() => handleAddToCart(product)}
            key={product._id}
            image={product.image}
            title={product.name}
            price={product.variants[0].price}
            weight={product.variants[0].weight}
          />
        ))}
      </div>

      {/* Load more button */}
      {visibleCount < sortedProducts.length && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            className="bg-[#282828] self-start text-white hover:bg-transparent border hover:text-[#282828]"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

export default React.memo(ProductsGrid)