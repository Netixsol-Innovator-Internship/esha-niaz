# Real-time Comment System — Frontend (Next.js)

This is a complete Next.js frontend that integrates your NestJS backend (MongoDB + JWT + Socket.IO).

## Features
- Next.js App Router
- RTK Query for API calls (no axios)
- Socket.IO client for realtime notifications (no page refresh)
- Auth: Register, Login, Verify, Profile
- Comments: Create, list, reply, edit, delete
- Likes: like/unlike + like status
- Followers: follow/unfollow + counts + public profiles
- Notifications: live badge + list + mark all read

## Quick Start
```bash
cd frontend
npm i
npm run dev
```

Back-end defaults:
- REST base: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- Websocket: `NEXT_PUBLIC_WS_URL=http://localhost:5000`

You can change these in `.env.local`.

## Important
- The socket connects with `auth: { token }` which aligns with your WebSocketGateway expecting JWT in handshake.
- File upload for profile pictures uses field name `profilePicture` and posts to `/users/profile/upload`.
- All RTK endpoints match your controllers in the provided Postman collection.
