# Fixed Car Auction Frontend

This frontend has been regenerated to match your NestJS backend routes and swagger.

Key fixes applied:
- Endpoints aligned: /auth/signup, /auth/login, /cars/*, /bids, /notifications, /users/me
- Auth slice stores backend `access_token` into localStorage as 'token'
- placeBid sends `{ carId, amount }` to POST /bids
- endAuction uses POST /cars/:id/end

How to run:
1. Copy `.env.local.sample` to `.env.local` and set NEXT_PUBLIC_API_BASE_URL to your backend (e.g. http://localhost:4000)
2. `npm i`
3. `npm run dev`

If your backend uses a different prefix (for example `/api`), update `NEXT_PUBLIC_API_BASE_URL` to include it (e.g. http://localhost:4000/api) or edit `src/utils/endpoints.js` accordingly.
