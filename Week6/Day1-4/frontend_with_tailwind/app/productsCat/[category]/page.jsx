"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductsCard from "../../../components/ProductCard";
import SidebarFilters from "../../../components/SidebarFilters";

export default function ProductsPage() {
  const { category } = useParams(); // male / female
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const style = searchParams.get("style");
  const sale = searchParams.get("sale");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (type) params.append("type", type);
      if (style) params.append("style", style);
      if (sale) params.append("sale", sale);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?${params.toString()}`
      );
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [category, type, style, sale]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto flex gap-6 py-8">
      {/* Sidebar Filters */}
      <SidebarFilters category={category} />

      {/* Products Grid */}
      <main className="flex-1">
        <h1 className="text-2xl font-bold mb-6 capitalize">
          {category} Products
        </h1>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductsCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
