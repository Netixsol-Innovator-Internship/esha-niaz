// src/components/dashboard/ProductCard.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    
    return (
        <div className="border p-4 flex flex-col justify-between">
            <h2 className="font-bold">{product.name}</h2>
            <p>${product.price}</p>
            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => navigate(`/dashboard/update-product/${product.id}`)}
                    className="px-2 py-1 border border-black hover:bg-black hover:text-white transition"
                >
                    Edit
                </button>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-2 py-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                    Delete
                </button>
            </div>

            {showDeleteModal && (
                <Modal onClose={() => setShowDeleteModal(false)}>
                    <p>Are you sure you want to delete {product.name}?</p>
                    <div className="flex gap-2 mt-4">
                        <button className="px-3 py-1 border border-black" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button className="px-3 py-1 border border-red-600 bg-red-600 text-white">Delete</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProductCard;
