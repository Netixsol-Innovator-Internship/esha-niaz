import Product from "../models/Product.js";
import { errors, success } from "../utils/responses.js";
import fs from "fs";
import slugify from "slugify";  // 👈 install this if not already
import cloudinary from "../config/cloudinary.js";
import { log } from "console";

// export const createProduct = async (req, res) => {
//   try {
//     let data = req.body;

//     // Upload all images to Cloudinary
//     if (req.files && req.files.length > 0) {
//       const uploadPromises = req.files.map((file) => {
//         return new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             { folder: "products" },
//             (error, result) => {
//               if (error) reject(error);
//               else resolve(result.secure_url); // store only URL
//             }
//           );
//           stream.end(file.buffer); // 👈 important
//         });
//       });

//       const imageUrls = await Promise.all(uploadPromises);
//       data.images = imageUrls;
//     }

//     // Auto slug
//     if (!data.slug && data.name) {
//       data.slug = slugify(data.name, { lower: true, strict: true });
//     }

//     // Duplicate check
//     const existingProduct = await Product.findOne({
//       $or: [{ name: data.name }, { slug: data.slug }],
//     });
//     if (existingProduct) {
//       return res.status(400).json({
//         success: false,
//         message:
//           existingProduct.name === data.name
//             ? "Product name already exists"
//             : "Product slug already exists",
//       });
//     }

//     // Save product
//     const product = await Product.create(data);
//     return res.status(201).json({
//       success: true,
//       data: product,
//       message: "Product created successfully",
//     });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const createProduct = async (req, res) => {
  try {
    let data = req.body;
console.log("body data", data);
console.log("file", req.file)

    // Upload single image to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result); // store only URL
          }
        );
        stream.end(req.file.buffer); // 👈 important for multer memory storage
      });

      console.log("image uploaded result", result)

      data.images = result.secure_url; // ✅ store as single field (not array)
    }

    // Auto slug
    if (!data.slug && data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }

    // Duplicate check
    const existingProduct = await Product.findOne({
      $or: [{ name: data.name }, { slug: data.slug }],
    });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message:
          existingProduct.name === data.name
            ? "Product name already exists"
            : "Product slug already exists",
      });
    }

    // Save product
    const product = await Product.create(data);
    return res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Fetching all Products

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $facet: {
          data: [{ $match: {} }],
          count: [{ $count: "total" }],
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: products,
      message: success.PRODUCTS_RETRIEVED,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get product by ID
export const getProductByID = async (req, res) => {
  try {
    let { id } = req.params;

    let product = await Product.findById(id);

    if (product) {
      return res.status(200).json({
        success: true,
        data: product,
        message: success.PRODUCT_RETRIEVED,
      });
    }
    return res.status(400).json({
      success: false,
      data: null,
      message: errors.INVALID_PRODUCT_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Products by Slag

export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug: slug.toLowerCase() });

    if (!product) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Invalid product slug",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: success.PRODUCT_RETRIEVED || "Product retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Filter Products

export const getFilteredProductsByOption = async (req, res) => {
  try {
    let filteredQuery = req.query;

    let query = {};

    if (filteredQuery.caffeine) {
      query.caffeine = filteredQuery.caffeine;
    }
    if (filteredQuery.organic) {
      query.organic = filteredQuery.organic == "true";
    }

    const attributes = [
      "collections",
      "origin",
      "flavor",
      "qualities",
      "allergies",
    ];
    attributes.forEach((key) => {
      if (filteredQuery[key]) {
        query[`attributes.${key}`] = filteredQuery[key];
      }
    });

    const products = await Product.find(query);
    if (products.length > 0) {
      return res.status(200).json({
        success: true,
        data: products,
        message: success.PRODUCTS_RETRIEVED,
      });
    }
    return res.status(400).json({
      success: false,
      data: null,
      message: errors.PRODUCT_NOT_FOUND,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Filter Options

export const getAvailableFilterOptions = async (req, res) => {
  try {
    const attributes = await Product.aggregate([
      {
        $project: {
          attributes: { $objectToArray: "$attributes" },
        },
      },
      { $unwind: "$attributes" },
      { $unwind: "$attributes.v" },
      {
        $group: {
          _id: "$attributes.k",
          values: { $addToSet: "$attributes.v" },
        },
      },
    ]);

    const caffeineLevels = await Product.distinct("caffeine");
    const organicValues = await Product.distinct("organic");

    res.json({ attributes, caffeineLevels, organicValues });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete all products

export const deleteAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: "All products have been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete by Id
export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete images from filesystem
    if (product.images && product.images.length > 0) {
      product.images.forEach((imgPath) => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }

    await product.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update By ID

export const updateProductById = async (req, res) => {
  try {
    let data = req.body;

    // Parse JSON if frontend sends nested objects
    // if (typeof data.attributes === "string") {
    //   data.attributes = JSON.parse(data.attributes);
    // }
    // if (typeof data.variants === "string") {
    //   data.variants = JSON.parse(data.variants);
    // }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // If new images are uploaded → delete old ones first
    if (req.files && req.files.length > 0) {
      if (product.images && product.images.length > 0) {
        product.images.forEach((imgPath) => {
          if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
          }
        });
      }

      data.images = req.files.map((file) => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Get collections

export const getCollections = async (req, res) => {
  try {
    const collections = await Product.aggregate([
      {
        $unwind: "$attributes.collections" // break array into separate docs
      },
      {
        $group: {
          _id: "$attributes.collections", // group by collection name
          productId: { $first: "$_id" },  // pick first product
          name: { $first: "$name" },      // pick first product name
          image: { $first: { $arrayElemAt: ["$images", 0] } } // pick first image
        }
      },
      {
        $project: {
          _id: 0,
          collection: "$_id",
          productId: 1,
          name: 1,
          image: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      collections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch collections",
      error: error.message
    });
  }
};