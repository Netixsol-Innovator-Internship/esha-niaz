// backend/models/User.js
import mongoose from "mongoose";
import Cart from "./Cart.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// automatically create a cart for new users
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const cart = await Cart.create({ user: this._id, products: [] });
    this.cart = cart._id;
  }
  next();
});

export default mongoose.model("User", userSchema);
