"use client"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { actions, getProductsList, getProductsLoading, getProductsError } from "../../redux/slices/product/productsSlice"
import Sidebar from "./Sidebar"
import ProductsGrid from "./ProductsGrid"
import { useGetAllProductsQuery } from "../../redux/slices/product/productsApi"
import Container from "../shared/common/Container"

const MainPage = () => {
    const dispatch = useDispatch()
    const [filters, setFilters] = useState({
        category: "",
        priceRange: { min: "", max: "" },
        sortBy: "Default",
    })

    const products = useSelector(getProductsList)
    const loading = useSelector(getProductsLoading)
    const error = useSelector(getProductsError)

    const { data, isLoading, isError, error: apiError, refetch } = useGetAllProductsQuery()

    useEffect(() => {
        if (data?.products) {
            dispatch(actions.setList(data.products))
        }
        if (isLoading) {
            dispatch(actions.setLoading(true))
        }
        if (isError) {
            dispatch(actions.setError(apiError?.message || "Failed to load products"))
        }
    }, [data, isLoading, isError, apiError, dispatch])

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters)
        dispatch(actions.setCurrentFilters(newFilters))
    }

    if (loading || isLoading)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading products...</p>
            </div>
        )

    if (error || isError)
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p>Failed to load products: {error || apiError?.message || "Unknown error"}</p>
                <button onClick={refetch} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Retry
                </button>
            </div>
        )

    return (
        <div className="flex items-center justify-center py-6">
            <Container>
                <div className="px-6 sm:px-10 lg:px-12 flex justify-between gap-20">
                    <Sidebar onProductsFiltered={handleFiltersChange} />
                    <ProductsGrid products={products} filters={filters} onFiltersChange={handleFiltersChange} />
                </div>
            </Container>
        </div>
    )
}

export default MainPage