// "use client";
// import { useParams } from "next/navigation";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { useState } from "react";
// import { useGetProductByIdQuery, useGetRatingsQuery } from "../../../lib/services/api";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const { data: product, isLoading } = useGetProductByIdQuery(id);
//   const { data: ratings, isLoading: loadingRatings } = useGetRatingsQuery(id);

//   const [selectedColor, setSelectedColor] = useState(null);

//   if (isLoading) return <p>Loading product...</p>;
//   if (!product) return <p>Product not found</p>;

//   // Default to first variant color if none selected
//   const activeVariant =
//     product.variants.find((v) => v.color === selectedColor) || product.variants[0];

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
//       else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
//       else stars.push(<FaRegStar key={i} className="text-yellow-500" />);
//     }
//     return stars;
//   };

//   return (
//     <div className="container-max py-8">
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Images */}
//         <div>
//           <Swiper spaceBetween={10} slidesPerView={1}>
//             {activeVariant.images.map((img, idx) => (
//               <SwiperSlide key={idx}>
//                 <img src={img} alt={product.name} className="w-full h-96 object-cover rounded-xl" />
//               </SwiperSlide>
//             ))}
//           </Swiper>

//           {/* Color selector */}
//           <div className="flex gap-2 mt-4">
//             {product.variants.map((variant, idx) => (
//               <button
//                 key={idx}
//                 className={`w-8 h-8 rounded-full border-2 ${
//                   selectedColor === variant.color ? "border-black" : "border-gray-300"
//                 }`}
//                 style={{ backgroundColor: variant.color }}
//                 onClick={() => setSelectedColor(variant.color)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div>
//           <h1 className="text-2xl font-bold">{product.name}</h1>
//           <div className="flex items-center gap-2 mt-2">
//             {renderStars(product.averageRating)}
//             <span className="ml-1 text-gray-600 text-sm">
//               {product.averageRating.toFixed(1)}/5
//             </span>
//           </div>

//           <div className="flex items-center gap-3 mt-4">
//             <span className="text-2xl font-bold">${product.effectivePrice}</span>
//             {product.sale?.active && (
//               <>
//                 <span className="line-through text-gray-400">${product.price}</span>
//                 <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
//                   -{product.sale.discountPercent}%
//                 </span>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Reviews */}
//       <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
//         {loadingRatings && <p>Loading reviews...</p>}
//         {ratings && ratings.length === 0 && <p>No reviews yet.</p>}
//         {ratings &&
//           ratings.map((review) => (
//             <div key={review._id} className="border-t py-3">
//               <div className="flex items-center gap-2">
//                 {renderStars(review.stars)}
//                 <span className="text-xs text-gray-400">
//                   {new Date(review.createdAt).toLocaleDateString()}
//                 </span>
//               </div>
//               <p className="text-sm">{review.comment}</p>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }





// "use client";
// import { useParams } from "next/navigation";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { useState } from "react";
// import {
//   useGetProductByIdQuery,
//   useGetRatingsQuery,
//   useAddCartItemMutation,
// } from "../../../lib/services/api";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const { data: product, isLoading } = useGetProductByIdQuery(id);
//   const { data: ratings, isLoading: loadingRatings } = useGetRatingsQuery(id);

//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [quantity, setQuantity] = useState(1);

//   const [addCartItem, { isLoading: adding }] = useAddCartItemMutation();

//   if (isLoading) return <p>Loading product...</p>;
//   if (!product) return <p>Product not found</p>;

//   // Default to first variant color if none selected
//   const activeVariant =
//     product.variants.find((v) => v.color === selectedColor) ||
//     product.variants[0];

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
//       else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
//       else stars.push(<FaRegStar key={i} className="text-yellow-500" />);
//     }
//     return stars;
//   };

//   const handleAddToCart = async () => {
//     if (!selectedSize) {
//       alert("Please select a size");
//       return;
//     }

//     try {
//       await addCartItem({
//         productId: product._id,
//         quantity,
//         selectedSize,
//         selectedColor: activeVariant.color,
//       }).unwrap();

//       alert("✅ Added to cart!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to add to cart");
//     }
//   };

//   return (
//     <div className="container-max py-8">
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Images */}
//         <div>
//           <Swiper spaceBetween={10} slidesPerView={1}>
//             {activeVariant.images.map((img, idx) => (
//               <SwiperSlide key={idx}>
//                 <img
//                   src={img}
//                   alt={product.name}
//                   className="w-full h-96 object-cover rounded-xl"

//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>

//           {/* Color selector */}
//           <div className="flex gap-2 mt-4">
//             {product.variants.map((variant, idx) => (
//               <button
//                 key={idx}
//                 className={`w-8 h-8 rounded-full border-2 ${
//                   selectedColor === variant.color
//                     ? "border-black"
//                     : "border-gray-300"
//                 }`}
//                 style={{ backgroundColor: variant.color }}
//                 onClick={() => setSelectedColor(variant.color)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div>
//           <h1 className="text-2xl font-bold">{product.name}</h1>
//           <span className="ml-2 px-2 py-1 text-xs rounded bg-gray-200">YOU CAN BUY THIS PRODUCT BY : {product.loyaltyType.toUpperCase()}</span>
//           <p className="text-sm text-gray-500 capitalize">
//             {product.category} • {product.style}
//           </p>

//           <div className="flex items-center gap-2 mt-2">
//             {renderStars(product.averageRating)}
//             <span className="ml-1 text-gray-600 text-sm">
//               {product.averageRating.toFixed(1)}/5
//             </span>
//           </div>

//           <div className="flex items-center gap-3 mt-4">
//             <span className="text-2xl font-bold">${product.effectivePrice}</span>
//             {product.sale?.active && (
//               <>
//                 <span className="line-through text-gray-400">${product.price}</span>
//                 <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
//                   -{product.sale.discountPercent}%
//                 </span>
//               </>
//             )}
//           </div>

//           {/* Size Selector */}
//           <div className="mt-4">
//             <h3 className="text-sm font-semibold mb-2">Size</h3>
//             <div className="flex gap-2">
//               {product.sizes.map((size) => (
//                 <button
//                   key={size}
//                   className={`px-3 py-1 border rounded ${
//                     selectedSize === size
//                       ? "bg-black text-white"
//                       : "bg-white text-black"
//                   }`}
//                   onClick={() => setSelectedSize(size)}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Quantity Selector */}
//           <div className="mt-4 flex items-center gap-3">
//             <button
//               onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//               className="px-3 py-1 border rounded"
//             >
//               -
//             </button>
//             <span>{quantity}</span>
//             <button
//               onClick={() => setQuantity((q) => q + 1)}
//               className="px-3 py-1 border rounded"
//             >
//               +
//             </button>
//           </div>

//           {/* Add to Cart Button */}
//           <button
//             onClick={handleAddToCart}
//             disabled={adding}
//             className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 disabled:opacity-50"
//           >
//             {adding ? "Adding..." : "Add to Cart"}
//           </button>
//         </div>
//       </div>

//       {/* Reviews */}
//       <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
//         {loadingRatings && <p>Loading reviews...</p>}
//         {ratings && ratings.length === 0 && <p>No reviews yet.</p>}
//         {ratings &&
//           ratings.map((review) => (
//             <div key={review._id} className="border-t py-3">
//               <div className="flex items-center gap-2">
//                 {renderStars(review.stars)}
//                 <span className="text-xs text-gray-400">
//                   {new Date(review.createdAt).toLocaleDateString()}
//                 </span>
//               </div>
//               <p className="text-sm">{review.comment}</p>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }












"use client";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useState } from "react";
import {
  useGetProductByIdQuery,
  useGetRatingsQuery,
  useAddCartItemMutation,
  useAddRatingMutation,
} from "../../../lib/services/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const { data: ratings, isLoading: loadingRatings } = useGetRatingsQuery(id);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");

  const [addCartItem, { isLoading: adding }] = useAddCartItemMutation();
  const [addRating, { isLoading: postingReview }] = useAddRatingMutation();

  if (isLoading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found</p>;

  // Default to first variant color if none selected
  const activeVariant =
    product.variants.find((v) => v.color === selectedColor) ||
    product.variants[0];

  const renderStars = (rating, setRating) => {
    const starsArr = [];
    for (let i = 1; i <= 5; i++) {
      const filled = rating >= i;
      starsArr.push(
        <button
          type="button"
          key={i}
          onClick={() => setRating && setRating(i)}
        >
          {filled ? (
            <FaStar className="text-yellow-500" />
          ) : (
            <FaRegStar className="text-yellow-500" />
          )}
        </button>
      );
    }
    return starsArr;
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    try {
      await addCartItem({
        productId: product._id,
        quantity,
        selectedSize,
        selectedColor: activeVariant.color,
      }).unwrap();
      alert("✅ Added to cart!");
    } catch (err) {
      console.error(err);
          // 🔹 Handle insuficient stock case 
    if (err?.data?.message === "Insufficient stock") {
      alert("⚠️ This porduct is out of stock. No more items available.");
    } else if (err?.data?.message === "Unauthorized") {
      alert("⚠️ Please log in to add items to cart.");
    } 
    else {
      alert("❌ Failed to add to cart");
    }
    }
  };

const handleSubmitReview = async (e) => {
  e.preventDefault();
  if (stars === 0) {
    alert("Please select a star rating");
    return;
  }
  try {
    await addRating({
      productId: product._id,
      stars,
      comment,
    }).unwrap();

    alert("✅ Review submitted!");
    setStars(0);
    setComment("");
  } catch (err) {
    console.error(err);

    // 🔹 Handle duplicate review case
    if (err?.data?.message === "You have already rated this product.") {
      alert("⚠️ You already reviewed this product.");
    }
    else if (err?.data?.message === "Unauthorized") {
      alert("⚠️ Please log in to add items to cart.");
    } 
     else {
      alert("❌ Failed to submit review");
    }
  }
};


  return (
    <div className="container-max py-8">
            <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <Swiper spaceBetween={10} slidesPerView={1}>
            {activeVariant.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-xl"

                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Color selector */}
          <div className="flex gap-2 mt-4">
            {product.variants.map((variant, idx) => (
              <button
                key={idx}
                className={`w-8 h-8 rounded-full border-2 ${
                  selectedColor === variant.color
                    ? "border-black"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: variant.color }}
                onClick={() => setSelectedColor(variant.color)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <span className="ml-2 px-2 py-1 text-xs rounded bg-gray-200">YOU CAN BUY THIS PRODUCT BY : {product.loyaltyType.toUpperCase()}</span>
          <p className="text-sm text-gray-500 capitalize">
            {product.category} • {product.style}
          </p>

          <div className="flex items-center gap-2 mt-2">
            {renderStars(product.averageRating)}
            <span className="ml-1 text-gray-600 text-sm">
              {product.averageRating.toFixed(1)}/5
            </span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold">${product.effectivePrice}</span>
            {product.sale?.active && (
              <>
                <span className="line-through text-gray-400">${product.price}</span>
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                  -{product.sale.discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Size Selector */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Size</h3>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-3 py-1 border rounded ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-black/90 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
<h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        {loadingRatings && <p>Loading reviews...</p>}
        {ratings && ratings.length === 0 && <p>No reviews yet.</p>}
        {ratings &&
          ratings.map((review) => (
            <div key={review._id} className="border-t py-3">
              <div className="flex items-center gap-2">
                {renderStars(review.stars)}
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <span className="ml-auto text-sm font-medium text-gray-700">
          {review.userId?.name || "Anonymous"}
        </span>
              </div>
              <p className="text-sm">{review.comment}</p>
            </div>
          ))}
        {/* Post Review Form */}
        <form
          onSubmit={handleSubmitReview}
          className="mt-6 border-t pt-4 flex flex-col gap-3"
        >
          <h3 className="text-lg font-medium">Write a Review</h3>
          <div className="flex gap-1">{renderStars(stars, setStars)}</div>
          <textarea
            className="w-full border rounded p-2 text-sm"
            rows="3"
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            disabled={postingReview}
            className="self-start px-4 py-2 bg-black text-white rounded hover:bg-black/90 disabled:opacity-50"
          >
            {postingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
