// 'use client';

// import { useState } from 'react';
// import { useGetProductsQuery, useUpdateProfileMutation, useGetProductByIdQuery, useSetUserRoleMutation, useAddCartItemMutation, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useSetSaleMutation } from '../../../lib/services/api';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import { Navigation } from 'swiper/modules';
// import { Dialog } from '@headlessui/react';

// export default function ProductsPage() {
//   const { data: products, isLoading } = useGetProductsQuery();
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [createProduct] = useCreateProductMutation();
//   const [updateProduct] = useUpdateProductMutation();
//   const [deleteProduct] = useDeleteProductMutation();
//   const [setSale] = useSetSaleMutation();

//   // Create modal state
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     price: 0,
//     type: 'shirts',
//     category: 'male',
//     style: 'casual',
//     sizes: [],
//     stockQuantity: 0,
//     loyaltyType: 'cash',
//     pointsPrice: 0
//   });

//   const handleCreateProduct = async () => {
//     await createProduct(newProduct);
//     setNewProduct({ name:'', price:0, type:'shirts', category:'male', style:'casual', sizes:[], stockQuantity:0, loyaltyType:'cash', pointsPrice:0 });
//     setIsModalOpen(false);
//   };

//   const handleDelete = async (id) => {
//     if (confirm("Are you sure you want to delete this product?")) {
//       await deleteProduct(id);
//     }
//   };

//   const handleSetSale = async (id) => {
//     const discountPercent = parseInt(prompt("Discount Percent (1-99):"));
//     const startTime = prompt("Start Time (YYYY-MM-DDTHH:mm:ss):");
//     const endTime = prompt("End Time (YYYY-MM-DDTHH:mm:ss):");
//     if (discountPercent && startTime && endTime) {
//       await setSale({ id, discountPercent, startTime, endTime });
//     }
//   };

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className="container-max py-10">
//       <h1 className="text-3xl font-bold mb-6">Products</h1>

//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
//       >
//         Create Product
//       </button>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {products?.map(product => (
//           <div key={product._id} className="p-4 border rounded-xl shadow-sm bg-white">
//             <h2 className="font-bold text-lg">{product.name}</h2>
//             <p>Price: ${product.price}</p>
//             <p>Stock: {product.stockQuantity}</p>
//             <p>Sold: {product.soldCount}</p>
//             <p>Type: {product.type}</p>
//             <p>Category: {product.category}</p>
//             <p>Style: {product.style}</p>
//             <p>Loyalty: {product.loyaltyType} {product.pointsPrice || ''}</p>
//             <p>Average Rating: {product.averageRating}</p>

//             {product.sale && product.sale.active && (
//               <p className="text-green-600">On Sale: {product.sale.discountPercent}% off</p>
//             )}

//             {/* Swiper for variant images */}
//             {product.variants?.length > 0 && (
//               <Swiper navigation={true} modules={[Navigation]} className="my-2 h-48">
//                 {product.variants.map(variant => 
//                   variant.images.map((img, idx) => (
//                     <SwiperSlide key={idx}>
//                       <img src={img} alt={variant.color} className="w-full h-48 object-cover rounded"/>
//                     </SwiperSlide>
//                   ))
//                 )}
//               </Swiper>
//             )}

//             <div className="flex gap-2 mt-2 flex-wrap">
//               <button
//                 onClick={() => handleSetSale(product._id)}
//                 className="px-3 py-1 bg-green-500 text-white rounded"
//               >
//                 Set Sale
//               </button>
//               <button
//                 onClick={() => handleDelete(product._id)}
//                 className="px-3 py-1 bg-red-500 text-white rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Create Product Modal */}
//       <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
//         <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//           <Dialog.Title className="text-xl font-bold mb-4">Create Product</Dialog.Title>
//           <div className="flex flex-col gap-2">
//             <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name:e.target.value})} className="border px-2 py-1 rounded"/>
//             <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price:parseInt(e.target.value)})} className="border px-2 py-1 rounded"/>
//             <input type="number" placeholder="Stock Quantity" value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity:parseInt(e.target.value)})} className="border px-2 py-1 rounded"/>
//             {/* Add more fields as needed */}
//             <button onClick={handleCreateProduct} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">Create</button>
//           </div>
//         </Dialog.Panel>
//       </Dialog>
//     </div>
//   );
// }




// 'use client';

// import { useState } from 'react';
// import { Dialog } from '@headlessui/react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import { Navigation } from 'swiper/modules';
// import { useGetProductsQuery, useCreateProductMutation, useSetSaleMutation } from '../../../lib/services/api';

// export default function ProductsPage() {
//   const { data: products, isLoading, refetch } = useGetProductsQuery();
//   const [createProduct] = useCreateProductMutation();
//   const [setSale] = useSetSaleMutation();

//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     price: 0,
//     type: 'shirts',
//     category: 'male',
//     style: 'casual',
//     sizes: [],
//     stockQuantity: 0,
//     loyaltyType: 'cash',
//     pointsPrice: 0
//   });

//   const [saleData, setSaleData] = useState({
//     discountPercent: 0,
//     startTime: new Date(),
//     endTime: new Date()
//   });

//   const handleCreateProduct = async () => {
//     await createProduct(newProduct);
//     setNewProduct({
//       name: '', price: 0, type: 'shirts', category: 'male',
//       style: 'casual', sizes: [], stockQuantity: 0, loyaltyType: 'cash', pointsPrice: 0
//     });
//     setIsCreateModalOpen(false);
//     refetch();
//   };

//   const openSaleModal = (product) => {
//     setSelectedProduct(product);
//     setSaleData({ discountPercent: 0, startTime: new Date(), endTime: new Date() });
//     setIsSaleModalOpen(true);
//   };

//   const handleSetSale = async () => {
//     await setSale({
//       id: selectedProduct._id,
//       discountPercent: saleData.discountPercent,
//       startTime: saleData.startTime.toISOString(),
//       endTime: saleData.endTime.toISOString()
//     });
//     setIsSaleModalOpen(false);
//     refetch();
//   };

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className="container-max py-10">
//       <h1 className="text-3xl font-bold mb-6">Products</h1>

//       <button
//         onClick={() => setIsCreateModalOpen(true)}
//         className="px-4 py-2 bg-blue-500 text-white rounded mb-6"
//       >
//         Create Product
//       </button>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {products?.map(product => (
//           <div key={product._id} className="border rounded-xl shadow-lg bg-white overflow-hidden flex flex-col">
//             {/* Product Images */}
//             {product.variants?.length > 0 && (
//               <Swiper navigation={true} modules={[Navigation]} className="h-48">
//                 {product.variants.map(variant =>
//                   variant.images.map((img, idx) => (
//                     <SwiperSlide key={idx}>
//                       <img src={img} alt={variant.color} className="w-full h-48 object-cover"/>
//                     </SwiperSlide>
//                   ))
//                 )}
//               </Swiper>
//             )}

//             {/* Product Info */}
//             <div className="p-4 flex-1 flex flex-col justify-between">
//               <div>
//                 <h2 className="font-bold text-lg mb-1">{product.name}</h2>
//                 <p className="text-gray-700">Price: ${product.price}</p>
//                 <p className="text-gray-700">Stock: {product.stockQuantity}</p>
//                 <p className="text-gray-700">Sold: {product.soldCount}</p>
//                 <p className="text-gray-700">Type: {product.type}</p>
//                 <p className="text-gray-700">Category: {product.category}</p>
//                 <p className="text-gray-700">Style: {product.style}</p>
//                 <p className="text-gray-700">Loyalty: {product.loyaltyType} {product.pointsPrice || ''}</p>
//                 <p className="text-gray-700">Avg Rating: {product.averageRating}</p>
//                 {product.sale && product.sale.active && (
//                   <p className="text-green-600 font-semibold mt-2">
//                     On Sale: {product.sale.discountPercent}% off
//                   </p>
//                 )}
//               </div>

//               <button
//                 onClick={() => openSaleModal(product)}
//                 className="mt-3 px-3 py-1 bg-green-500 text-white rounded"
//               >
//                 Set Sale
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Create Product Modal */}
//       <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
//         <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//           <Dialog.Title className="text-xl font-bold mb-4">Create Product</Dialog.Title>
//           <div className="flex flex-col gap-2">
//             <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name:e.target.value})} className="border px-2 py-1 rounded"/>
//             <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price:parseInt(e.target.value)})} className="border px-2 py-1 rounded"/>
//             <input type="number" placeholder="Stock Quantity" value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity:parseInt(e.target.value)})} className="border px-2 py-1 rounded"/>
//             <button onClick={handleCreateProduct} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">Create</button>
//           </div>
//         </Dialog.Panel>
//       </Dialog>

//       {/* Set Sale Modal */}
//       <Dialog open={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
//         <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//           <Dialog.Title className="text-xl font-bold mb-4">Set Sale for {selectedProduct?.name}</Dialog.Title>
//           <div className="flex flex-col gap-3">
//             <input
//               type="number"
//               placeholder="Discount (%)"
//               value={saleData.discountPercent}
//               onChange={e => setSaleData({...saleData, discountPercent: parseInt(e.target.value)})}
//               className="border px-2 py-1 rounded"
//             />
//             <label className="text-gray-700">Start Date:</label>
//             <DatePicker
//               selected={saleData.startTime}
//               onChange={(date) => setSaleData({...saleData, startTime: date})}
//               showTimeSelect
//               dateFormat="Pp"
//               className="border px-2 py-1 rounded w-full"
//             />
//             <label className="text-gray-700">End Date:</label>
//             <DatePicker
//               selected={saleData.endTime}
//               onChange={(date) => setSaleData({...saleData, endTime: date})}
//               showTimeSelect
//               dateFormat="Pp"
//               className="border px-2 py-1 rounded w-full"
//             />
//             <button onClick={handleSetSale} className="mt-3 px-4 py-2 bg-green-500 text-white rounded">Set Sale</button>
//           </div>
//         </Dialog.Panel>
//       </Dialog>
//     </div>
//   );
// }





//  use this codeeeeeeeeeeeeee
// 'use client';

// import { useState } from 'react';
// import { Dialog } from '@headlessui/react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import { Navigation } from 'swiper/modules';
// import { useRouter } from "next/navigation"; // Next.js App Router
// import { useGetProductsQuery, useCreateProductMutation, useUploadImageMutation , useSetSaleMutation } from '../../../lib/services/api';

// export default function ProductsPage() {
//         const router = useRouter();
//   const { data: products, isLoading, refetch } = useGetProductsQuery();
//   const [createProduct] = useCreateProductMutation();
//   const [setSale] = useSetSaleMutation();
//   const [variants, setVariants] = useState([]);
// const [uploadImage] = useUploadImageMutation();
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     price: 0,
//     type: 'shirts',
//     category: 'male',
//     style: 'casual',
//     sizes: [],
//     stockQuantity: 0,
//     loyaltyType: 'cash',
//     pointsPrice: 0
//   });

//   const [saleData, setSaleData] = useState({
//     discountPercent: 0,
//     startTime: new Date(),
//     endTime: new Date()
//   });

//   const handleCreateProduct = async () => {
//     await createProduct(newProduct);
//     setNewProduct({
//       name: '', price: 0, type: 'shirts', category: 'male',
//       style: 'casual', sizes: [], stockQuantity: 0, loyaltyType: 'cash', pointsPrice: 0
//     });
//     setIsCreateModalOpen(false);
//     refetch();
//   };

//   const openSaleModal = (product) => {
//     setSelectedProduct(product);
//     setSaleData({ discountPercent: 0, startTime: new Date(), endTime: new Date() });
//     setIsSaleModalOpen(true);
//   };

//   const handleSetSale = async () => {
//     await setSale({
//       id: selectedProduct._id,
//       discountPercent: saleData.discountPercent,
//       startTime: saleData.startTime.toISOString(),
//       endTime: saleData.endTime.toISOString()
//     });
//     setIsSaleModalOpen(false);
//     refetch();
//   };

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className="container-max py-10">
//                  {/* Back to Dashboard Button */}
//       <div className="mb-6">
//         <button
//           onClick={() => router.push("/dashboard")}
//           className="px-4 py-2 bg-gray-200 text-black rounded-full hover:bg-gray-300"
//         >
//           Back to Dashboard
//         </button>
//       </div>
//       <h1 className="text-3xl font-bold mb-6">Products</h1>

//       <button
//         onClick={() => setIsCreateModalOpen(true)}
//         className="px-4 py-2 bg-blue-500 text-white rounded mb-6"
//       >
//         Create Product
//       </button>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {products?.map(product => {
//           // Flatten all images from variants
//           const allImages = product.variants?.flatMap(v => v.images) || [];

//           return (
//             <div key={product._id} className="border rounded-xl shadow-lg bg-white overflow-hidden flex flex-col">
//               {/* Product Images */}
//         {/* Swiper for variant images */}          
// {/* Product Images */}
// {product.variants?.length > 0 && (
//   <Swiper navigation={true} modules={[Navigation]} className="my-2 h-48">
//     {product.variants.map((variant) => 
//       variant.images.map((img, idx) => (
//         <SwiperSlide key={variant._id + '-' + idx}>
//           <img src={img} alt={variant.color} className="w-full h-48 object-cover rounded"/>
//         </SwiperSlide>
//       ))
//     )}
//   </Swiper>
// )}



//               {/* Product Info */}
//               <div className="p-4 flex-1 flex flex-col justify-between">
//                 <div>
//                   <h2 className="font-bold text-lg mb-1">{product.name}</h2>
//                   <p className="text-gray-700">Price: ${product.price}</p>
//                   {product.sale && product.sale.active && (
//                     <>
//                       <p className="text-red-600 font-semibold">
//                         Sale Price: ${product.sale.salePrice} ({product.sale.discountPercent}% off)
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         Sale: {new Date(product.sale.startTime).toLocaleString()} - {new Date(product.sale.endTime).toLocaleString()}
//                       </p>
//                     </>
//                   )}
//                   <p className="text-gray-700">Stock: {product.stockQuantity}</p>
//                   <p className="text-gray-700">Sold: {product.soldCount}</p>
//                   <p className="text-gray-700">Type: {product.type}</p>
//                   <p className="text-gray-700">Category: {product.category}</p>
//                   <p className="text-gray-700">Style: {product.style}</p>
//                   <p className="text-gray-700">Loyalty: {product.loyaltyType} {product.pointsPrice || ''}</p>
//                   <p className="text-gray-700">Avg Rating: {product.averageRating}</p>
//                 </div>

//                 <button
//                   onClick={() => openSaleModal(product)}
//                   className="mt-3 px-3 py-1 bg-green-500 text-white rounded"
//                 >
//                   Set Sale
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>



//       {/* Create Product Modal */}
// <Dialog
//   open={isCreateModalOpen}
//   onClose={() => setIsCreateModalOpen(false)}
//   className="fixed inset-0 z-50 flex items-center justify-center"
// >
//   <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
//     <Dialog.Title className="text-xl font-bold mb-4">Create Product</Dialog.Title>

//     <div className="flex flex-col gap-3">

//       {/* Name */}
//       <input
//         type="text"
//         placeholder="Name"
//         value={newProduct.name}
//         onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//         className="border px-2 py-1 rounded"
//       />

//       {/* Price */}
//       <input
//         type="number"
//         placeholder="Price"
//         value={newProduct.price}
//         onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
//         className="border px-2 py-1 rounded"
//       />

//       {/* Type Dropdown */}
//       <select
//         value={newProduct.type}
//         onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
//         className="border px-2 py-1 rounded"
//       >
//         {['jeans','shirts','tshirts','hoodies','shorts'].map((type) => (
//           <option key={type} value={type}>{type}</option>
//         ))}
//       </select>

//       {/* Category Dropdown */}
//       <select
//         value={newProduct.category}
//         onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//         className="border px-2 py-1 rounded"
//       >
//         {['male','female'].map((cat) => (
//           <option key={cat} value={cat}>{cat}</option>
//         ))}
//       </select>

//       {/* Style Dropdown */}
//       <select
//         value={newProduct.style}
//         onChange={(e) => setNewProduct({ ...newProduct, style: e.target.value })}
//         className="border px-2 py-1 rounded"
//       >
//         {['casual','formal','party','gym'].map((style) => (
//           <option key={style} value={style}>{style}</option>
//         ))}
//       </select>

//       {/* Sizes */}
//       <input
//         type="text"
//         placeholder="Sizes (comma separated, e.g., S,M,L)"
//         value={newProduct.sizes?.join(',')}
//         onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value.split(',').map(s => s.trim()) })}
//         className="border px-2 py-1 rounded"
//       />

//       {/* Stock Quantity */}
//       <input
//         type="number"
//         placeholder="Stock Quantity"
//         value={newProduct.stockQuantity}
//         onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) })}
//         className="border px-2 py-1 rounded"
//       />

//       {/* Loyalty Type Dropdown */}
//       <select
//         value={newProduct.loyaltyType}
//         onChange={(e) => setNewProduct({ ...newProduct, loyaltyType: e.target.value })}
//         className="border px-2 py-1 rounded"
//       >
//         {['cash','points','hybrid'].map((type) => (
//           <option key={type} value={type}>{type}</option>
//         ))}
//       </select>

//       {/* Points Price */}
//       {newProduct.loyaltyType !== 'cash' && (
//         <input
//           type="number"
//           placeholder="Points Price"
//           value={newProduct.pointsPrice || 0}
//           onChange={(e) => setNewProduct({ ...newProduct, pointsPrice: parseInt(e.target.value) })}
//           className="border px-2 py-1 rounded"
//         />
//       )}

//       {/* Variants Section */}
//       <div className="flex flex-col gap-2">
//         <h3 className="font-semibold">Variants</h3>
//         {variants.map((v, idx) => (
//           <div key={idx} className="flex flex-col gap-2 border p-2 rounded">
//             <input
//               type="text"
//               placeholder="Color"
//               value={v.color}
//               onChange={(e) => {
//                 const updated = [...variants];
//                 updated[idx].color = e.target.value;
//                 setVariants(updated);
//               }}
//               className="border px-2 py-1 rounded"
//             />
//             <input
//               type="file"
//               multiple
//               onChange={(e) => {
//                 const updated = [...variants];
//                 updated[idx].files = Array.from(e.target.files);
//                 setVariants(updated);
//               }}
//               className="border px-2 py-1 rounded"
//             />
//           </div>
//         ))}

//         <button
//           type="button"
//           onClick={() => setVariants([...variants, { color: '', files: [] }])}
//           className="px-3 py-1 bg-gray-300 rounded mt-1"
//         >
//           Add Variant
//         </button>
//       </div>

//       {/* Submit Button */}
//       <button
//         onClick={async () => {
//           // Step 1: Create Product
//           const createdProduct = await createProduct(newProduct).unwrap();

//           // Step 2: Upload images for each variant
//           for (const v of variants) {
//             if (v.files?.length) {
//               await Promise.all(
//                 v.files.map((file) => {
//                   const formData = new FormData();
//                   formData.append('color', v.color);
//                   formData.append('file', file);
//                   return uploadImage({ id: createdProduct._id, formData }).unwrap();
//                 })
//               );
//             }
//           }

//           // Reset state
//           setNewProduct({
//             name: '', price: 0, type: 'shirts', category: 'male',
//             style: 'casual', sizes: [], stockQuantity: 0, loyaltyType: 'cash', pointsPrice: 0
//           });
//           setVariants([]);
//           setIsCreateModalOpen(false);
//           refetch();
//         }}
//         className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Create Product
//       </button>
//     </div>
//   </Dialog.Panel>
// </Dialog>







//       {/* Set Sale Modal */}
//       <Dialog open={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
//         <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//           <Dialog.Title className="text-xl font-bold mb-4">Set Sale for {selectedProduct?.name}</Dialog.Title>
//           <div className="flex flex-col gap-3">
//             <input
//               type="number"
//               placeholder="Discount (%)"
//               value={saleData.discountPercent}
//               onChange={e => setSaleData({...saleData, discountPercent: parseInt(e.target.value)})}
//               className="border px-2 py-1 rounded"
//             />
//             <label className="text-gray-700">Start Date:</label>
//             <DatePicker
//               selected={saleData.startTime}
//               onChange={(date) => setSaleData({...saleData, startTime: date})}
//               showTimeSelect
//               dateFormat="Pp"
//               className="border px-2 py-1 rounded w-full"
//             />
//             <label className="text-gray-700">End Date:</label>
//             <DatePicker
//               selected={saleData.endTime}
//               onChange={(date) => setSaleData({...saleData, endTime: date})}
//               showTimeSelect
//               dateFormat="Pp"
//               className="border px-2 py-1 rounded w-full"
//             />
//             <button onClick={handleSetSale} className="mt-3 px-4 py-2 bg-green-500 text-white rounded">Set Sale</button>
//           </div>
//         </Dialog.Panel>
//       </Dialog>
//     </div>
//   );
// }










// 'use client';

// import { useState } from 'react';
// import { Dialog } from '@headlessui/react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import { Navigation } from 'swiper/modules';
// import { useGetProductsQuery, useCreateProductMutation, useUploadImageMutation , useSetSaleMutation } from '../../../lib/services/api';

// export default function ProductsPage() {
//   const { data: products, isLoading, refetch } = useGetProductsQuery();
//   const [createProduct] = useCreateProductMutation();
//   const [setSale] = useSetSaleMutation();
//   const [uploadImage] = useUploadImageMutation();

//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
//   const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [variants, setVariants] = useState([]);

//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     price: 0,
//     type: 'shirts',
//     category: 'male',
//     style: 'casual',
//     sizes: [],
//     stockQuantity: 0,
//     loyaltyType: 'cash',
//     pointsPrice: 0
//   });

//   const [saleData, setSaleData] = useState({
//     discountPercent: 0,
//     startTime: new Date(),
//     endTime: new Date()
//   });

//   // --- Handlers ---
//   const handleCreateProduct = async () => {
//     await createProduct(newProduct).unwrap();
//     setNewProduct({
//       name: '', price: 0, type: 'shirts', category: 'male',
//       style: 'casual', sizes: [], stockQuantity: 0, loyaltyType: 'cash', pointsPrice: 0
//     });
//     setIsCreateModalOpen(false);
//     refetch();
//   };

//   const openSaleModal = (product) => {
//     setSelectedProduct(product);
//     setSaleData({ discountPercent: 0, startTime: new Date(), endTime: new Date() });
//     setIsSaleModalOpen(true);
//   };

//   const handleSetSale = async () => {
//     await setSale({
//       id: selectedProduct._id,
//       discountPercent: saleData.discountPercent,
//       startTime: saleData.startTime.toISOString(),
//       endTime: saleData.endTime.toISOString()
//     });
//     setIsSaleModalOpen(false);
//     refetch();
//   };

//   const openUploadModal = (product) => {
//     setSelectedProduct(product);
//     setVariants([{ color: '', files: [] }]); // Reset variants
//     setIsUploadModalOpen(true);
//   };

//   const handleUploadVariants = async () => {
//     if (!selectedProduct) return;
//     for (const v of variants) {
//       if (v.files?.length) {
//         await Promise.all(
//           v.files.map((file) => {
//             const formData = new FormData();
//             formData.append('color', v.color);
//             formData.append('file', file);
//             return uploadImage({ id: selectedProduct._id, formData }).unwrap();
//           })
//         );
//       }
//     }
//     setIsUploadModalOpen(false);
//     setVariants([]);
//     refetch();
//   };

//   if (isLoading) return <p>Loading...</p>;

//   return (
//     <div className="container-max py-10">
//       <h1 className="text-3xl font-bold mb-6">Products</h1>

//       <button
//         onClick={() => setIsCreateModalOpen(true)}
//         className="px-4 py-2 bg-blue-500 text-white rounded mb-6"
//       >
//         Create Product
//       </button>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {products?.map(product => {
//           const allImages = product.variants?.flatMap(v => v.images) || [];
//           return (
//             <div key={product._id} className="border rounded-xl shadow-lg bg-white overflow-hidden flex flex-col">
//               {product.variants?.length > 0 && (
//                 <Swiper navigation={true} modules={[Navigation]} className="my-2 h-48">
//                   {product.variants.map((variant) =>
//                     variant.images.map((img, idx) => (
//                       <SwiperSlide key={variant._id + '-' + idx}>
//                         <img src={img} alt={variant.color} className="w-full h-48 object-cover rounded"/>
//                       </SwiperSlide>
//                     ))
//                   )}
//                 </Swiper>
//               )}
//               <div className="p-4 flex-1 flex flex-col justify-between">
//                 <div>
//                   <h2 className="font-bold text-lg mb-1">{product.name}</h2>
//                   <p className="text-gray-700">Price: ${product.price}</p>
//                   {product.sale && product.sale.active && (
//                     <>
//                       <p className="text-red-600 font-semibold">
//                         Sale Price: ${product.sale.salePrice} ({product.sale.discountPercent}% off)
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         Sale: {new Date(product.sale.startTime).toLocaleString()} - {new Date(product.sale.endTime).toLocaleString()}
//                       </p>
//                     </>
//                   )}
//                   <p className="text-gray-700">Stock: {product.stockQuantity}</p>
//                   <p className="text-gray-700">Sold: {product.soldCount}</p>
//                   <p className="text-gray-700">Type: {product.type}</p>
//                   <p className="text-gray-700">Category: {product.category}</p>
//                   <p className="text-gray-700">Style: {product.style}</p>
//                   <p className="text-gray-700">Loyalty: {product.loyaltyType} {product.pointsPrice || ''}</p>
//                   <p className="text-gray-700">Avg Rating: {product.averageRating}</p>
//                 </div>

//                 <div className="flex gap-2 mt-3">
//                   <button onClick={() => openSaleModal(product)} className="px-3 py-1 bg-green-500 text-white rounded">Set Sale</button>
//                   <button onClick={() => openUploadModal(product)} className="px-3 py-1 bg-purple-500 text-white rounded">Upload Variants</button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Create Product Modal */}
//       <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
//         <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
//           <Dialog.Title className="text-xl font-bold mb-4">Create Product</Dialog.Title>
//           <div className="flex flex-col gap-3">
//             <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name:e.target.value})} className="border px-2 py-1 rounded"/>
//             <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price:parseFloat(e.target.value)})} className="border px-2 py-1 rounded"/>
//             <input type="number" placeholder="Stock Quantity" value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity:parseInt(e.target.value)})} className="border px-2 py-1 rounded"/>
//             <button onClick={handleCreateProduct} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">Create</button>
//           </div>
//         </Dialog.Panel>
//       </Dialog>

      // {/* Upload Variants Modal */}
      // <Dialog open={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
      //   <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
      //     <Dialog.Title className="text-xl font-bold mb-4">Upload Variants for {selectedProduct?.name}</Dialog.Title>
      //     <div className="flex flex-col gap-3">
      //       {variants.map((v, idx) => (
      //         <div key={idx} className="flex flex-col gap-2 border p-2 rounded">
      //           <input
      //             type="text"
      //             placeholder="Color"
      //             value={v.color}
      //             onChange={e => {
      //               const updated = [...variants];
      //               updated[idx].color = e.target.value;
      //               setVariants(updated);
      //             }}
      //             className="border px-2 py-1 rounded"
      //           />
      //           <input
      //             type="file"
      //             multiple
      //             onChange={e => {
      //               const updated = [...variants];
      //               updated[idx].files = Array.from(e.target.files);
      //               setVariants(updated);
      //             }}
      //             className="border px-2 py-1 rounded"
      //           />
      //         </div>
      //       ))}
      //       <button type="button" onClick={() => setVariants([...variants, { color: '', files: [] }])} className="px-3 py-1 bg-gray-300 rounded mt-1">Add Variant</button>
      //       <button onClick={handleUploadVariants} className="mt-3 px-4 py-2 bg-purple-500 text-white rounded">Upload</button>
      //     </div>
      //   </Dialog.Panel>
      // </Dialog>

//       {/* Set Sale Modal */}
//       <Dialog open={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
//         <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
//           <Dialog.Title className="text-xl font-bold mb-4">Set Sale for {selectedProduct?.name}</Dialog.Title>
//           <div className="flex flex-col gap-3">
//             <input
//               type="number"
//               placeholder="Discount (%)"
//               value={saleData.discountPercent}
//               onChange={e => setSaleData({...saleData, discountPercent: parseInt(e.target.value)})}
//               className="border px-2 py-1 rounded"
//             />
//             <label className="text-gray-700">Start Date:</label>
//             <DatePicker
//               selected={saleData.startTime}
//               onChange={(date) => setSaleData({...saleData, startTime: date})}
//               showTimeSelect
//               dateFormat="Pp"
//               className="border px-2 py-1 rounded w-full"
//             />
//             <label className="text-gray-700">End Date:</label>
//             <DatePicker
//               selected={saleData.endTime}
//               onChange={(date) => setSaleData({...saleData, endTime: date})}
//               showTimeSelect
//               dateFormat="Pp"
//               className="border px-2 py-1 rounded w-full"
//             />
//             <button onClick={handleSetSale} className="mt-3 px-4 py-2 bg-green-500 text-white rounded">Set Sale</button>
//           </div>
//         </Dialog.Panel>
//       </Dialog>
//     </div>
//   );
// }
























'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useRouter } from "next/navigation";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useSetSaleMutation
} from '../../../lib/services/api';

import { useUploadImageMutation } from '../../../lib/services/uploadApi';

export default function ProductsPage() {
  const router = useRouter();
  const { data: products, isLoading, refetch } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [setSale] = useSetSaleMutation();
  const [uploadImage] = useUploadImageMutation();

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Create Product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    type: 'shirts',
    category: 'male',
    style: 'casual',
    sizes: [],
    stockQuantity: 0,
    loyaltyType: 'cash',
    pointsPrice: 0
  });

  // Upload Variant form state
  const [variantData, setVariantData] = useState({
    color: '',
    files: []
  });

  const [saleData, setSaleData] = useState({
    discountPercent: 0,
    startTime: new Date(),
    endTime: new Date()
  });

  const handleCreateProduct = async () => {
    await createProduct(newProduct).unwrap();
    setNewProduct({
      name: '', price: 0, type: 'shirts', category: 'male',
      style: 'casual', sizes: [], stockQuantity: 0, loyaltyType: 'cash', pointsPrice: 0
    });
    setIsCreateModalOpen(false);
    refetch();
  };

  const openSaleModal = (product) => {
    setSelectedProduct(product);
    setSaleData({ discountPercent: 0, startTime: new Date(), endTime: new Date() });
    setIsSaleModalOpen(true);
  };

  const handleSetSale = async () => {
    await setSale({
      id: selectedProduct._id,
      discountPercent: saleData.discountPercent,
      startTime: saleData.startTime.toISOString(),
      endTime: saleData.endTime.toISOString()
    });
    setIsSaleModalOpen(false);
    refetch();
  };

  const openUploadModal = (product) => {
    setSelectedProduct(product);
    setVariantData({ color: '', files: [] });
    setIsUploadModalOpen(true);
  };

  const handleUploadVariant = async () => {
    for (const file of variantData.files) {
      const formData = new FormData();
      formData.append('color', variantData.color);
      formData.append('file', file);
      await uploadImage({ id: selectedProduct._id, formData }).unwrap();
    }
    setIsUploadModalOpen(false);
    refetch();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="container-max py-10">
      {/* Back to Dashboard Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-gray-200 text-black rounded-full hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-6"
      >
        Create Product
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map(product => (
          <div key={product._id} className="border rounded-xl shadow-lg bg-white overflow-hidden flex flex-col">
            {/* Product Images */}
{product.variants?.length > 0 && (
  <div className="w-full h-48">
    <Swiper
      navigation
      modules={[Navigation]}
      className="w-full h-full"
    >
      {product.variants.flatMap((variant) =>
        variant.images.map((img, idx) => (
          <SwiperSlide key={`${variant._id}-${idx}`} className="flex items-center justify-center">
            <img
              src={img}
              alt={variant.color}
              className="w-full h-48 object-cover rounded"
            />
          </SwiperSlide>
        ))
      )}
    </Swiper>
  </div>
)}



            {/* Product Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="font-bold text-lg mb-1">{product.name}</h2>
                <p className="text-gray-700">Price: ${product.price}</p>
                {product.sale && product.sale.active && (
                  <>
                    <p className="text-red-600 font-semibold">
                      Sale Price: ${product.sale.salePrice} ({product.sale.discountPercent}% off)
                    </p>
                    <p className="text-gray-500 text-sm">
                      Sale: {new Date(product.sale.startTime).toLocaleString()} - {new Date(product.sale.endTime).toLocaleString()}
                    </p>
                  </>
                )}
                <p className="text-gray-700">Stock: {product.stockQuantity}</p>
                <p className="text-gray-700">Sold: {product.soldCount}</p>
                <p className="text-gray-700">Type: {product.type}</p>
                <p className="text-gray-700">Category: {product.category}</p>
                <p className="text-gray-700">Style: {product.style}</p>
                <p className="text-gray-700">Loyalty: {product.loyaltyType} {product.pointsPrice || ''}</p>
                <p className="text-gray-700">Avg Rating: {product.averageRating}</p>
              </div>

              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={() => openSaleModal(product)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Set Sale
                </button>
                <button
                  onClick={() => openUploadModal(product)}
                  className="px-3 py-1 bg-purple-500 text-white rounded"
                >
                  Upload Variant Image
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Product Modal */}
      <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
          <Dialog.Title className="text-xl font-bold mb-4">Create Product</Dialog.Title>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Name" value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border px-2 py-1 rounded" />
            <input type="number" placeholder="Price" value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              className="border px-2 py-1 rounded" />
            <select value={newProduct.type} onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
              className="border px-2 py-1 rounded">
              {['jeans','shirts','tshirts','hoodies','shorts'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="border px-2 py-1 rounded">
              {['male','female'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select value={newProduct.style} onChange={(e) => setNewProduct({ ...newProduct, style: e.target.value })}
              className="border px-2 py-1 rounded">
              {['casual','formal','party','gym'].map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
            <input type="text" placeholder="Sizes (comma separated)" value={newProduct.sizes?.join(',')}
              onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value.split(',').map(s => s.trim()) })}
              className="border px-2 py-1 rounded" />
            <input type="number" placeholder="Stock Quantity" value={newProduct.stockQuantity}
              onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) })}
              className="border px-2 py-1 rounded" />
            <select value={newProduct.loyaltyType} onChange={(e) => setNewProduct({ ...newProduct, loyaltyType: e.target.value })}
              className="border px-2 py-1 rounded">
              {['cash','points','hybrid'].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {newProduct.loyaltyType !== 'cash' && (
              <input type="number" placeholder="Points Price" value={newProduct.pointsPrice || 0}
                onChange={(e) => setNewProduct({ ...newProduct, pointsPrice: parseInt(e.target.value) })}
                className="border px-2 py-1 rounded" />
            )}
            <button onClick={handleCreateProduct}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded">
              Create Product
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Upload Variant Modal */}
      <Dialog open={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Upload Variant for {selectedProduct?.name}</Dialog.Title>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Color" value={variantData.color}
              onChange={(e) => setVariantData({ ...variantData, color: e.target.value })}
              className="border px-2 py-1 rounded" />
            <input type="file" multiple
              onChange={(e) => setVariantData({ ...variantData, files: Array.from(e.target.files) })}
              className="border px-2 py-1 rounded" />
            <button onClick={handleUploadVariant} className="mt-3 px-4 py-2 bg-purple-500 text-white rounded">
              Upload
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Set Sale Modal (unchanged) */}
      <Dialog open={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4">Set Sale for {selectedProduct?.name}</Dialog.Title>
          <div className="flex flex-col gap-3">
            <input type="number" placeholder="Discount (%)" value={saleData.discountPercent}
              onChange={e => setSaleData({...saleData, discountPercent: parseInt(e.target.value)})}
              className="border px-2 py-1 rounded" />
            <label>Start Date:</label>
            <DatePicker selected={saleData.startTime} onChange={(date) => setSaleData({...saleData, startTime: date})}
              showTimeSelect dateFormat="Pp" className="border px-2 py-1 rounded w-full" />
            <label>End Date:</label>
            <DatePicker selected={saleData.endTime} onChange={(date) => setSaleData({...saleData, endTime: date})}
              showTimeSelect dateFormat="Pp" className="border px-2 py-1 rounded w-full" />
            <button onClick={handleSetSale} className="mt-3 px-4 py-2 bg-green-500 text-white rounded">Set Sale</button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
