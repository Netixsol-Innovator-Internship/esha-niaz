import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { errors, success } from "../utils/responses.js";
import User from "../models/User.js";

// Add to cart

export const addToCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { prod_id, variant, quantity } = req.body;

    // 1. Find the product
    const product = await Product.findById(prod_id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product does not exist",
      });
    }

    // 2. Validate variant exists
    const selectedVariant = product.variants.find((v) => v.weight === variant);
    if (!selectedVariant) {
      return res.status(400).json({
        success: false,
        message: "Product with this variant does not exist",
      });
    }

    // 3. Ensure stock is enough (use product.stock, not variant.stock)
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    // 4. Get/create user cart
    let userCart = await Cart.findOne({ user: id });
    if (!userCart) {
      userCart = await Cart.create({ user: id, products: [] });
      await User.findByIdAndUpdate(id, { cart: userCart._id });
    }

    // 5. Check if item already exists in cart
    const itemIndex = userCart.products.findIndex(
      (p) => p.product.toString() === prod_id && p.variant === variant
    );

    if (itemIndex > -1) {
      const newQuantity = userCart.products[itemIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }
      userCart.products[itemIndex].quantity = newQuantity;
    } else {
      userCart.products.push({ product: prod_id, variant, quantity });
    }

    await userCart.save();

    return res.status(201).json({
      success: true,
      data: userCart,
      message: "Item added to cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// Increase Quantity of Product

export const increaseQuantity = async (req, res) => {
  try {
    const { id } = req.user;
    const { cartItemId } = req.params;

    let userCart = await Cart.findOne({ user: id });
    if (!userCart) {
      return res.status(404).json({
        success: false,
        data: null,
        message: errors.INVALID_CART_ID,
      });
    }

    const itemIndex = userCart.products.findIndex(
      (p) => p._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        data: null,
        message: errors.ITEM_NOT_FOUND,
      });
    }

    const product = await Product.findById(
      userCart.products[itemIndex].product
    );
    if (!product) {
      return res.status(400).json({
        success: false,
        data: null,
        message: errors.INVALID_PRODUCT_ID,
      });
    }

    if (userCart.products[itemIndex].quantity + 1 > product.stock) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Requested quantity exceeds available stock",
      });
    }

    userCart.products[itemIndex].quantity += 1;
    await userCart.save();

    return res.status(200).json({
      success: true,
      data: userCart,
      message: success.ITEM_UPDATED,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Decrease Quantity of Product

export const decreaseQuantity = async (req, res) => {
  try {
    const { id } = req.user;
    const { cartItemId } = req.params;

    let userCart = await Cart.findOne({ user: id });
    if (!userCart) {
      return res.status(404).json({
        success: false,
        data: null,
        message: errors.INVALID_CART_ID,
      });
    }

    const itemIndex = userCart.products.findIndex(
      (p) => p._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        data: null,
        message: errors.ITEM_NOT_FOUND,
      });
    }

    if (userCart.products[itemIndex].quantity > 1) {
      userCart.products[itemIndex].quantity -= 1;
    } else {
      userCart.products.splice(itemIndex, 1);
    }

    await userCart.save();

    return res.status(200).json({
      success: true,
      data: userCart,
      message: success.ITEM_UPDATED,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Item from Cart
export const removeItemFromCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { cartItemId } = req.params;

    const userCart = await Cart.findOne({ user: id });
    if (!userCart) {
      return res.status(404).json({
        success: false,
        data: null,
        message: errors.INVALID_CART_ID,
      });
    }

    const itemIndex = userCart.products.findIndex(
      (p) => p._id.toString() === cartItemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        data: null,
        message: errors.INVALID_PRODUCT_ID,
      });
    }

    userCart.products.splice(itemIndex, 1);
    await userCart.save();

    return res.status(200).json({
      success: true,
      data: userCart,
      message: success.ITEM_DELETED,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Cart

export const clearCart = async (req, res) => {
  try {
    const { id } = req.user;

    // Find user cart
    const userCart = await Cart.findOne({ user: id });
    if (!userCart) {
      return res.status(404).json({
        success: false,
        data: null,
        message: errors.INVALID_CART_ID,
      });
    }

    userCart.products = [];

    await userCart.save();

    return res.status(200).json({
      success: true,
      data: userCart,
      message: success.CART_CLEARED,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Getting all Cart Products

export const getUserCartProducts = async (req, res) => {
  try {
    const { id } = req.user;
  
    const userCart = await Cart.findOne({ user: id }).populate(
      "products.product"
    );

    if (!userCart || userCart.products.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: "Cart is empty",
      });
    }

    const cartItems = userCart.products.map((item) => {
      if (!item.product) {
        return {
          productId: null,
          cartItemId: item._id,
          name: "Product removed",
          image: null,
          variant: item.variant,
          quantity: item.quantity,
          price: 0,
          total: 0,
        };
      }

      const variantObj = item.product.variants.find(
        (v) => v.weight === item.variant
      );

      const price = variantObj ? variantObj.price : 0;

      return {
        productId: item.product._id,
        cartItemId: item._id,
        name: item.product.name,
        image: item.product.images[0],
        variant: item.variant,
        quantity: item.quantity,
        price,
        total: price * item.quantity,
      };
    });

    return res.status(200).json({
      success: true,
      data: cartItems,
      message: "Cart retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

