import express from "express";
import {
  createProduct,
  deleteAllProducts,
  deleteProductById,
  getAllProducts,
  getAvailableFilterOptions,
  getCollections,
  getFilteredProductsByOption,
  getProductByID,
  getProductBySlug,
  updateProductById,
} from "../controllers/productController.js";

import { upload } from "../multer/multer.js";
import { validateID, validateProduct, validateSlug } from "../validators/productValidator.js";
import { validate } from "../middlewares/productValidate.js";
import { protect, adminOnly, superAdminOnly } from "../middlewares/authMiddleware.js";

const productRoutes = express.Router();

// ✅ Create a new Product (admin + superAdmin)
productRoutes.post(
  "/",
  protect,
  adminOnly,
  upload.single("images"),
  validateProduct,
  validate,
  createProduct
);

// ✅ Get all Products (public)
productRoutes.get("/", getAllProducts);

// ✅ Get Collections (public)
productRoutes.get("/collections", getCollections);

// ✅ Get Filter Options (public)
productRoutes.get("/filters/options", getAvailableFilterOptions);

// ✅ Get Products by filtering the attributes (public)
productRoutes.get("/filter/search", getFilteredProductsByOption);

// ✅ Get product by ID (public)
productRoutes.get("/:id", validateID, validate, getProductByID);

// ✅ Get product by slug (public)
productRoutes.get("/slug/:slug", validateSlug, validate, getProductBySlug);

// ❌ Delete All Products (only superAdmin)
productRoutes.delete("/", protect, superAdminOnly, deleteAllProducts);

// ❌ Delete Product by id (only superAdmin)
productRoutes.delete(
  "/:id",
  protect,
  superAdminOnly,
  validateID,
  validate,
  deleteProductById
);

// ✏️ Update product by id (admin + superAdmin)
productRoutes.patch(
  "/:id",
  protect,
  adminOnly,
  validateID,
  validate,
  upload.array("images", 5),
  updateProductById
);

export default productRoutes;
