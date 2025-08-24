"use client"

import { useNavigate } from "react-router-dom"
import { useGetAllProductsQuery, useDeleteProductMutation } from "../../redux/slices/product/productsApi"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { getUser } from "../../redux/slices/auth/authSlice"

const ProductManagement = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetAllProductsQuery()
  const [deleteProduct] = useDeleteProductMutation()
  const products = data?.products || []
  const user = useSelector(getUser)

  const handleConfirmDelete = async (product) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"?`)
    if (!confirmed) return

    try {
      await deleteProduct({ id: product._id, token: user.token }).unwrap()
      toast.success("Product deleted successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete product")
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading products...
      </div>
    )

  if (isError)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 font-medium">
        Failed to load products.
      </div>
    )

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-6">
      {/* Header and Add Product Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Product Management
        </h1>
        <button
          onClick={() => navigate("/dashboard/add-product")}
          className="px-6 py-2 bg-black text-white font-medium rounded-md shadow hover:bg-gray-800 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col"
            >
              <div className="h-48 w-full overflow-hidden rounded-t-lg">
                <img
                  src={product.images || "/placeholder.svg?height=200&width=300&query=product placeholder"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/chai.jpg"
                  }}
                />
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h2>
                  <p className="text-gray-500 text-sm mb-2 truncate">{product.description}</p>
                  <p className="text-gray-900 font-bold text-md">€{product.variants?.[0]?.price || "0.00"}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit-product/${product._id}`)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>

                  {/* Delete button only for Super Admin */}
                  {user?.role === "superAdmin" && (
                    <button
                      onClick={() => handleConfirmDelete(product)}
                      className="flex-1 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 font-medium">No products found.</p>
        )}
      </div>
    </div>
  )
}

export default ProductManagement
