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
                      Sale Price: ${product.sale.salePrice.toFixed(2)} ({product.sale.discountPercent}% off)
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
            <label>Name:</label>
            <input type="text" placeholder="Name" value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border px-2 py-1 rounded" />
              <label htmlFor="">Price</label>
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
             <label htmlFor="">Stock Quantity</label>
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
