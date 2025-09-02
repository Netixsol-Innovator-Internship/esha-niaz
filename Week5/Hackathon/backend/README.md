# Car Bidding Backend (NestJS + MongoDB)

## Quick start
```bash
cp .env.example .env
npm i
npm run start:dev
```

Swagger Docs: `http://localhost:4000/docs`

Socket.IO namespace: `/` with events:
- `auction:start`
- `auction:end`
- `bid:new`
- `notification`

## Modules
- Auth (JWT)
- Users
- Cars
- Bids
- Notifications
- Gateway (Socket.IO)
- Cron (auto close auctions)
