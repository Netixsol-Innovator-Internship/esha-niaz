"use client"
import { useGetProductsQuery } from "../lib/services/api";
import ProductCard from "../components/ProductCard";
import io from "socket.io-client";

import { useEffect } from "react";

let socket;

export default function Products() {
  const { data: products, isLoading , refetch  } = useGetProductsQuery();
  useEffect(() => {
    // Socket connection
    socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ["websocket"],
    });

    // Listen for sale started
    socket.on("sale.started", ({ product }) => {
      console.log("Live sale started:", product);

      // Option 1 → Refetch products from server (recommended for consistency)
      refetch();

      // Option 2 (alternative) → Update cached data manually
      // queryClient.setQueryData("products", (old) =>
      //   old.map((p) =>
      //     p._id === product._id
      //       ? { ...p, sale: product.sale, effectivePrice: product.sale.salePrice }
      //       : p
      //   )
      // );
    });

    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  if (isLoading) return <p>Loading products...</p>;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-center">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
