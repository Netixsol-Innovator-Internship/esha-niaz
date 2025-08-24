"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useGetAllProductsQuery } from "../../../redux/slices/product/productsApi"
import ProductCard from "../../products/ProductCard"

const RelatedProducts = ({ title }) => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetAllProductsQuery()

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`)
  }

  if (isLoading) return <div className="text-center py-12">Loading products...</div>
  if (isError) return <div className="text-center py-12">Failed to load products</div>

  const products = data?.data || []

  return (
    <div className="flex flex-col items-center justify-center my-12">
      <h1 className="text-2xl md:text-[32px] font-prosto mb-6">{title}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 my-6 max-w-[840px] gap-6 px-6 sm:px-10 lg:px-12 ">
        {products.length > 0 &&
          products
            .slice(0, 3)
            .map((product) => (
              <ProductCard
                onClick={() => handleProductClick(product.slug)}
                key={product._id}
                image={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                title={product.name}
                price={product.variants[0].price}
                weight={product.variants[0].weight}
              />
            ))}
      </div>
    </div>
  )
}

export default React.memo(RelatedProducts)