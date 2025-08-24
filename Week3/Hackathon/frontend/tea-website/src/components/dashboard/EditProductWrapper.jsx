// components/dashboard/EditProductWrapper.jsx
"use client";
import { useParams, useNavigate } from "react-router-dom";
import EditProductForm from "./EditProductForm";
import { useGetProductByIdQuery } from "../../redux/slices/product/productsApi";

const EditProductWrapper = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: product, isLoading } = useGetProductByIdQuery(id);

    if (isLoading) return <p className="p-4">Loading...</p>;
    if (!product) return <p className="p-4">Product not found</p>;

    return (
        <EditProductForm
            product={product}
            onClose={() => navigate("/dashboard/products")}
        />
    );
};

export default EditProductWrapper;
