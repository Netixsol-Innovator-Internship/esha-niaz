"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useCreateProductMutation } from "../../redux/slices/product/productsApi"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { getUser } from "../../redux/slices/auth/authSlice"
import { useState } from "react"
import { X, Plus, Package, Upload, Save } from "lucide-react"

const schema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  caffeine: yup.string().oneOf(["Low Caffeine", "High Caffeine", "Medium Caffeine", "No Caffeine"]).required(),
  organic: yup.boolean(),
  stock: yup.number().min(0, "Stock cannot be negative"),
  image: yup.mixed().test("required", "Product image is required", (value) => value && value.length > 0),
})

const AddProductForm = () => {
  const navigate = useNavigate()
  const [createProduct, { isLoading }] = useCreateProductMutation()
  const user = useSelector(getUser)

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      variants: [{ weight: "", price: "" }],
      attributes: [{ key: "", values: [] }],
      ingredients: [],
    },
  })

  const {
    fields: variantFields,
    append: addVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  })

  const {
    fields: attributeFields,
    append: addAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: "attributes",
  })

  const [ingredientInput, setIngredientInput] = useState("")

  const handleIngredientKeyDown = (e) => {
    if (e.key === "Enter" && ingredientInput.trim() !== "") {
      e.preventDefault()
      const current = getValues("ingredients") || []
      setValue("ingredients", [...current, ingredientInput.trim()])
      setIngredientInput("")
    }
  }

  const removeIngredient = (ing) => {
    const current = getValues("ingredients") || []
    setValue(
      "ingredients",
      current.filter((i) => i !== ing),
    )
  }

  const handleAttributeTagKeyDown = (e, index) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault()
      const newTag = e.target.value.trim()
      const current = getValues(`attributes.${index}.values`) || []
      setValue(`attributes.${index}.values`, [...current, newTag])
      e.target.value = ""
    }
  }

  const removeAttributeTag = (index, tag) => {
    const current = getValues(`attributes.${index}.values`) || []
    setValue(
      `attributes.${index}.values`,
      current.filter((t) => t !== tag),
    )
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      formData.append("name", data.name || "")
      formData.append("description", data.description || "")
      formData.append("caffeine", data.caffeine || "")
      formData.append("organic", data.organic ? "true" : "false")
      formData.append("stock", data.stock || "0")

      const validVariants = data.variants.filter((v) => v.weight && v.price)
      validVariants.forEach((variant, index) => {
        formData.append(`variants[${index}][weight]`, variant.weight)
        formData.append(`variants[${index}][price]`, variant.price)
      })

      const validAttributes = data.attributes.filter((attr) => attr.key && attr.values.length > 0)
      validAttributes.forEach((attr, index) => {
        formData.append(`attributes[${index}][key]`, attr.key)
        attr.values.forEach((value, valueIndex) => {
          formData.append(`attributes[${index}][values][${valueIndex}]`, value)
        })
      })

      const ingredients = data.ingredients || []
      ingredients.forEach((ingredient, index) => {
        formData.append(`ingredients[${index}]`, ingredient)
      })

      if (data.image && data.image[0]) {
        formData.append("images", data.image[0])
      }

      console.log("FormData contents:")
      for (const [key, value] of formData.entries()) {
        console.log(key, value)
      }

      await createProduct(formData).unwrap()
      toast.success("Product created successfully!")
      reset()
      navigate("/dashboard/products")
    } catch (err) {
      console.error("Create product error:", err)
      toast.error(err?.data?.message || "Failed to create product")
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border-l-4 border-amber-500 shadow-sm mb-8 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Product Registration</h1>
              <p className="text-gray-600 text-sm">Fill out the form below to add a new product</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                      placeholder="Enter product name"
                    />
                    {errors.name?.message && <p className="text-red-600 text-xs mt-1">{errors.name?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors resize-none"
                      placeholder="Describe your product"
                    />
                    {errors.description?.message && (
                      <p className="text-red-600 text-xs mt-1">{errors.description?.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Caffeine Level *</label>
                      <select
                        {...register("caffeine")}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                      >
                        <option value="">Select level</option>
                        <option value="Low Caffeine">Low Caffeine</option>
                        <option value="Medium Caffeine">Medium Caffeine</option>
                        <option value="High Caffeine">High Caffeine</option>
                        <option value="No Caffeine">No Caffeine</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        {...register("stock")}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        {...register("organic")}
                        className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                      />
                      Organic Product
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Product Variants</h3>
                  <button
                    type="button"
                    onClick={() => addVariant({ weight: "", price: "" })}
                    className="px-3 py-1 bg-teal-600 text-white text-sm hover:bg-teal-700 transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>

                <div className="space-y-3">
                  {variantFields.map((field, i) => (
                    <div key={field.id} className="flex gap-3 p-3 bg-gray-50 border border-gray-200">
                      <input
                        placeholder="Weight"
                        {...register(`variants.${i}.weight`)}
                        className="flex-1 px-2 py-1 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                      />
                      <input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        {...register(`variants.${i}.price`)}
                        className="flex-1 px-2 py-1 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-1 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Product Attributes</h3>
                  <button
                    type="button"
                    onClick={() => addAttribute({ key: "", values: [] })}
                    className="px-3 py-1 bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>

                <div className="space-y-4">
                  {attributeFields.map((field, i) => (
                    <div key={field.id} className="border border-gray-200 p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <input
                          placeholder="Attribute name (e.g., Color, Size)"
                          {...register(`attributes.${i}.key`)}
                          className="flex-1 px-2 py-1 border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttribute(i)}
                          className="text-red-600 text-xs hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2 min-h-[24px]">
                        {(getValues(`attributes.${i}.values`) || []).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 text-xs"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeAttributeTag(i, tag)}
                              className="hover:bg-emerald-700 transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>

                      <input
                        placeholder="Type value and press Enter"
                        onKeyDown={(e) => handleAttributeTagKeyDown(e, i)}
                        className="w-full px-2 py-1 border border-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Product Image
                </h3>
                <div className="border-2 border-dashed border-gray-300 p-4 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="w-full text-sm text-gray-600 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                  />
                  {errors.image?.message && <p className="text-red-600 text-xs mt-2">{errors.image?.message}</p>}
                </div>
              </div>

              <div className="bg-white shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Ingredients</h3>

                <div className="border border-gray-300 p-3 mb-3 min-h-[80px] bg-gray-50">
                  <div className="flex flex-wrap gap-1">
                    {(getValues("ingredients") || []).map((ing) => (
                      <span
                        key={ing}
                        className="inline-flex items-center gap-1 bg-orange-600 text-white px-2 py-0.5 text-xs"
                      >
                        {ing}
                        <button
                          type="button"
                          onClick={() => removeIngredient(ing)}
                          className="hover:bg-orange-700 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <input
                  placeholder="Type ingredient and press Enter"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={handleIngredientKeyDown}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-800 text-white py-3 px-4 hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductForm

