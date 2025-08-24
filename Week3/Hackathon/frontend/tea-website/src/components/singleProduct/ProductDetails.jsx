"use client"

import React, { useEffect, useState } from "react"
import { TbWorld } from "react-icons/tb"
import { MdOutlineRedeem, MdOutlineEco } from "react-icons/md"
import { IoBagHandleOutline } from "react-icons/io5"
import Button from "../shared/buttons/button"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { addToCart } from "../../redux/slices/cart/cartSlice"

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0])
    }
  }, [product])

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => (prev < 10 ? prev + 1 : prev))
  }

  const handleAddBag = () => {
    if (!product || !selectedVariant) return

    dispatch(
      addToCart({
        product,
        variant: selectedVariant,
        quantity,
      }),
    )
    toast.success("Item added to cart!")
  }

  return (
    <div className="md:max-w-[574px] lg:min-h-[507px] flex flex-col gap-5 px-4 sm:px-10 md:px-0">
      {/* Product Name */}
      <h1 className="lg:text-4xl sm:text-3xl text-2xl font-prosto lg:leading-11 leading-8 text-[#282828]">
        {product?.name || "Unnamed Product"}
      </h1>

      {/* Product Description */}
      {product?.description && (
        <p className="sm:text-base text-sm lg:leading-6 leading-5 font-montserrat text-[#282828]">
          {product.description}
        </p>
      )}

      {/* Attributes */}
      <div className="flex items-center lg:gap-14 md:gap-4 gap-10 flex-wrap">
        {product?.attributes?.origin?.length > 0 && (
          <div className="flex items-center lg:gap-2 gap-1">
            <TbWorld className="lg:h-6 lg:w-6 md:w-5 md:h-5 h-6 w-6 text-[#282828]" />
            <p className="font-montserrat sm:text-base text-sm font-medium text-[#282828]">
              Origin: {product.attributes.origin[0]}
            </p>
          </div>
        )}

        {product?.organic !== undefined && (
          <div className="flex items-center lg:gap-2 gap-1">
            <MdOutlineRedeem className="lg:h-6 lg:w-6 md:w-5 md:h-5 h-6 w-6 text-[#282828]" />
            <p className="font-montserrat sm:text-base text-sm font-medium text-[#282828]">
              {product.organic ? "Organic" : "Non-organic"}
            </p>
          </div>
        )}

        <div className="flex items-center lg:gap-2 gap-1">
          <MdOutlineEco className="lg:h-6 lg:w-6 md:w-5 md:h-5 h-6 w-6 text-[#282828]" />
          <p className="font-montserrat sm:text-base text-sm font-medium text-[#282828]">
            Vegan
          </p>
        </div>
      </div>

      {/* Price */}
      <p className="lg:text-4xl md:text-3xl text-4xl font-prosto text-[#282828]">
        €{selectedVariant?.price ?? "0.00"}
      </p>

      {/* Variants */}
      {product?.variants?.length > 0 && (
        <div>
          <p className="text-base font-medium text-[#282828] font-montserrat">Variants</p>
          <div className="flex py-[10px] xl:gap-3.5 lg:gap-2 gap-3.5 text-[#282828] sm:flex-wrap sm:justify-start justify-between overflow-x-auto">
            {product.variants.map((item, index) => {
              const isActive = selectedVariant?._id === item._id
              return (
                <div
                  key={index}
                  onClick={() => setSelectedVariant(item)}
                  className={`lg:max-w-[84px] w-[84px] cursor-pointer py-[10px] px-1 flex flex-col items-center shrink-0 rounded-sm transition 
                    ${isActive ? "border-2 border-[#282828] bg-gray-100" : "border border-gray-300"}`}
                >
                  <MdOutlineRedeem className="lg:w-[42px] lg:h-[53px] w-8 h-10" />
                  <span className="text-sm font-montserrat">{item.weight} bag</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="md:h-[56px] flex flex-wrap gap-6 items-center">
        <div className="flex w-[96px] gap-2 p-1">
          <button
            className="h-6 w-6 text-[22px] flex items-center justify-center font-montserrat text-black cursor-pointer hover:bg-gray-100"
            onClick={handleDecreaseQuantity}
          >
            -
          </button>
          <span className="h-6 w-6 text-[22px] flex items-center justify-center font-montserrat text-black">
            {quantity}
          </span>
          <button
            className="h-6 w-6 text-[22px] flex items-center justify-center font-montserrat text-black cursor-pointer hover:bg-gray-100"
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>
        <Button
          className="flex items-center gap-2 bg-[#282828] text-white hover:bg-transparent border hover:text-[#282828] justify-center max-w-[264px] md:h-[56px] h-[40px]"
          onClick={handleAddBag}
        >
          <IoBagHandleOutline /> ADD TO BAG
        </Button>
      </div>
    </div>
  )
}

export default React.memo(ProductDetails)