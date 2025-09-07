"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function ProductCard({ product }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-500" />);
    }
    return stars;
  };

  return (
    <Link href={`/products/${product._id}`}>
      <div className="border rounded-xl shadow-md p-4 hover:shadow-lg transition bg-white cursor-pointer">
        {/* Product Images Swiper */}
        <Swiper spaceBetween={10} slidesPerView={1}>
          {product.variants.flatMap((variant) =>
            variant.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-60 object-cover rounded-lg"
                />
              </SwiperSlide>
            ))
          )}
        </Swiper>

        {/* Product Info */}
        <div className="mt-3">
          <h3 className="font-semibold text-lg">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm">
            {renderStars(product.averageRating)}
            <span className="ml-1 text-gray-600 text-xs">
              {product.averageRating.toFixed(1)}/5
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl font-bold">${product.effectivePrice}</span>
            {product.sale?.active && (
              <>
                <span className="line-through text-gray-400">${product.price}</span>
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                  -{product.sale.discountPercent}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
