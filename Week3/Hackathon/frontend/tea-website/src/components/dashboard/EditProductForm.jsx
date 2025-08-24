"use client"
import { useState } from "react"
import { useUpdateProductMutation } from "../../redux/slices/product/productsApi"

const EditProductForm = ({ product, onClose }) => {
  // Prefill product data
  const [name, setName] = useState(product?.name || "")
  const [variants, setVariants] = useState(product?.variants || [])

  const [updateProduct, { isLoading }] = useUpdateProductMutation()

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const handleRemoveVariant = (variantId, index) => {
    if (variantId) {
      // Existing variant from DB
      setVariants((prev) => prev.filter((v) => v._id !== variantId))
    } else {
      // New variant (not saved yet)
      setVariants((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleAddVariant = () => {
    setVariants((prev) => [...prev, { weight: "", price: "" }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Separate add/update/remove for backend
    const addVariants = variants
      .filter((v) => !v._id) // new ones
      .map((v) => ({ weight: v.weight, price: Number(v.price) }))

    const updateVariants = variants
      .filter((v) => v._id) // existing ones
      .map((v) => ({
        variantId: v._id,
        weight: v.weight,
        price: Number(v.price),
      }))

    const removeVariants = product.variants.filter((v) => !variants.find((nv) => nv._id === v._id)).map((v) => v._id)

    await updateProduct({
      id: product._id,
      name,
      updateVariants,
      removeVariants,
      addVariants,
      token: localStorage.getItem("token"),
    })

    onClose?.()
  }

  return (
    <div className="flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-amber-50 border-2 border-amber-200 p-6 w-full max-w-2xl space-y-6">
        <div className="bg-orange-100 border-l-4 border-orange-400 p-4 mb-6">
          <h2 className="text-2xl font-bold text-orange-800 mb-1">Product Editor</h2>
          <p className="text-orange-600 text-sm">Modify product information and manage variants</p>
        </div>

        <div className="bg-white border border-gray-300 p-4">
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Product Name</label>
          <input
            type="text"
            className="w-full border border-gray-400 px-3 py-2 focus:outline-none focus:border-orange-500 focus:bg-orange-50 text-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name..."
            required
          />
        </div>

        <div className="bg-white border border-gray-300 p-4">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Variants</h3>
            <div className="bg-teal-100 text-teal-800 px-3 py-1 text-xs font-bold">
              {variants.length} ITEM{variants.length !== 1 ? "S" : ""}
            </div>
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div key={variant._id || index} className="bg-teal-50 border border-teal-200 p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-bold text-teal-700 mb-1 uppercase">Weight</label>
                    <input
                      type="text"
                      placeholder="e.g., 250g, 1kg"
                      className="w-full border border-teal-300 px-2 py-1 focus:outline-none focus:border-teal-500 focus:bg-white text-sm"
                      value={variant.weight}
                      onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-teal-700 mb-1 uppercase">Price</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full border border-teal-300 px-2 py-1 focus:outline-none focus:border-teal-500 focus:bg-white text-sm"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors"
                    onClick={() => handleRemoveVariant(variant._id, index)}
                    title="Remove variant"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddVariant}
            className="w-full mt-4 py-2 px-4 border-2 border-dashed border-teal-400 text-teal-700 hover:bg-teal-50 hover:border-teal-500 font-bold text-sm uppercase tracking-wide transition-colors"
          >
            + Add Variant
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-300">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-bold text-sm uppercase tracking-wide transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm uppercase tracking-wide transition-colors"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProductForm
