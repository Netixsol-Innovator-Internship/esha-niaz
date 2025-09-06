import { useGetProductsQuery } from "../lib/services/api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const { data: products, isLoading } = useGetProductsQuery();

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
