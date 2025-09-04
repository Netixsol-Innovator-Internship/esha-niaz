# Ecommerce Backend (NestJS + MongoDB)

**Features**: Auth with OTP email verification, RBAC, Products (sales, variants, Cloudinary uploads), Ratings, Carts, Orders, Loyalty Points, Real-time Notifications (Socket.IO), Swagger docs.

## Quick Start

1. Copy `.env.example` to `.env` and fill values.
2. Install deps: `npm install`
3. Run dev: `npm run start:dev`
4. Swagger: `http://localhost:${PORT or 4000}/docs`

Super Admin seeds automatically from env on boot if not present.

## Role Matrix
- **user**: shop, manage cart, place orders, ratings
- **admin**: product CRUD, manage sales, order status, list users
- **superadmin**: all + manage roles

## Notes
- OTP expiry: 7 minutes; resend ≥60s apart, max 5/hour.
- Delivery fee: $15 fixed.
- Loyalty: earn 1 point per $1 on cash payments; points deducted for points/hybrid purchases.
