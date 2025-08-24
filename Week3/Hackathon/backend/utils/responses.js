export const success = {
  // Auth
  USER_REGISTERED: "User registered successfully",
  USER_LOGGED_IN: "User logged in successfully",
  PROFILE_RETRIEVED: "User profile retrieved successfully",
  ACCOUNT_DELETED: "Account deleted successfully",

  // User Management
  USERS_RETRIEVED: "Users retrieved successfully",
  USER_ROLE_UPDATED: "User role updated successfully",
  USER_BLOCKED: "User blocked successfully",
  USER_UNBLOCKED: "User unblocked successfully",

  // Products
  PRODUCT_CREATED: "Product created successfully",
  PRODUCTS_RETRIEVED: "Products retrieved successfully",
  PRODUCT_RETRIEVED: "Product retrieved successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",

  // Cart
  CART_CREATED: "Cart created successfully",
  ITEM_ADDED: "Item added to cart successfully",
  ITEM_UPDATED: "Cart item updated successfully",
  ITEM_DELETED: "Item removed from cart successfully",
  CART_CLEARED: "All items removed from cart successfully",
  CART_RETRIEVED: "Cart retrieved successfully",
};

export const errors = {
  // Auth
  USER_EXISTS: "User already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Not authorized",
  INVALID_TOKEN: "Invalid token",
  NO_TOKEN: "Not authorized, no token provided",
  USER_NOT_FOUND: "User not found",
  INVALID_EMAIL: "Invalid email format",

  // User Management
  FORBIDDEN_ROLE_CHANGE: "You cannot change this user's role",
  SUPERADMIN_ONLY: "Only superAdmin can perform this action",
  CANNOT_BLOCK_SUPERADMIN: "Super admin cannot be blocked",

  // Validation / General
  VALIDATION_ERROR: "Invalid input data",
  SERVER_ERROR: "Something went wrong",

  // Products
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_ALREADY_EXISTS: "Product with this name or slug already exists",
  INVALID_PRODUCT_ID: "Invalid product ID",
  OUT_OF_STOCK: "Product is out of stock",

  // Cart
  CART_NOT_FOUND: "Cart not found",
  ITEM_NOT_FOUND: "Item not found in cart",
  INVALID_CART_ID: "Invalid cart ID",
  INVALID_PRODUCT_ID: "Invalid product ID",
  OUT_OF_STOCK: "Product is out of stock",

  ACCOUNT_BLOCKED: "Your account is blocked. Contact support.",
  ADMIN_ONLY: "Admin access only",
  SUPERADMIN_ONLY: "SuperAdmin access only",

};
