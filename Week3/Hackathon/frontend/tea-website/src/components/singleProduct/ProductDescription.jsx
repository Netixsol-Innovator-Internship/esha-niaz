import React from "react"

const ProductDescription = ({ product }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h3 className="md:text-[32px] text-2xl leading-7 font-montserrat text-[#282828]">About this tea</h3>
        <div>
          <ul className="flex md:gap-7 gap-[9px] flex-wrap">
            <li>
              <h5 className="text-sm font-montserrat sm:leading-5 text-[#282828] font-medium">FLAVOR</h5>
              <p className="text-sm font-montserrat leading-5 text-[#282828]">
                {(product?.attributes?.flavor?.length ?? 0) > 0 ? product.attributes.flavor[0] : "Sweet"}
              </p>
            </li>
            <div className="border-r border-r-[#A0A0A0] "></div>

            <li>
              <h5 className="text-sm font-montserrat sm:leading-5 text-[#282828] font-medium">QUALITIES</h5>
              <p className="text-sm font-montserrat leading-5 text-[#282828]">
                {(product?.attributes?.qualities?.length ?? 0) > 0 ? product.attributes.qualities[0] : "Relax"}
              </p>
            </li>
            <div className="border-r border-r-[#A0A0A0] "></div>

            <li>
              <h5 className="text-sm font-montserrat sm:leading-5 text-[#282828] font-medium">CAFFEINE</h5>
              <p className="text-sm font-montserrat leading-5 text-[#282828]">
                {product?.caffeine || "Medium Caffeine"}
              </p>
            </li>
            <div className="border-r border-r-[#A0A0A0] "></div>

            <li>
              <h5 className="text-sm font-montserrat sm:leading-5 text-[#282828] font-medium">ALLERGENS</h5>
              <p className="text-sm font-montserrat leading-5 text-[#282828]">
                {(product?.attributes?.allergens?.length ?? 0) > 0 ? product.attributes.allergens[0] : "Gluten-free"}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="md:text-[32px] text-2xl leading-7 font-montserrat text-[#282828]">Ingredient</h3>
        <p className="text-sm leading-5 font-montserrat">
          {Array.isArray(product?.ingredients)
            ? product.ingredients.length > 0
              ? product.ingredients[0].split(", ").join(", ")
              : "No ingredients provided"
            : product?.ingredients || "No ingredients provided"}
        </p>
      </div>
    </div>
  )
}

export default React.memo(ProductDescription)