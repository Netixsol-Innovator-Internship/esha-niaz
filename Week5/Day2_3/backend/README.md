# Comment System Backend

A real-time comment system built with NestJS, MongoDB, and WebSocket for instant notifications.

## Features

- **Authentication**: JWT-based user authentication with registration and login
- **User Management**: Profile management, file uploads, user search, and follower system
- **Comments**: Nested comment system with replies, editing, and deletion
- **Real-time Updates**: WebSocket integration for instant notifications
- **Likes**: Like/unlike functionality for comments
- **Notifications**: Comprehensive notification system for all user interactions

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Validation**: Class Validator

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Environment Setup:
\`\`\`bash
cp .env.example .env
\`\`\`

Update the `.env` file with your configuration:
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/comment-system
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
FRONTEND_URL=http://localhost:3000
\`\`\`

4. Start the development server:
\`\`\`bash
npm run start:dev
\`\`\`

The server will start on `http://localhost:5000`

### API Documentation

#### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `GET /api/auth/verify` - Verify JWT token

#### User Management

- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/upload` - Upload profile picture
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/search/:query` - Search users

#### Comments

- `POST /api/comments` - Create comment or reply
- `GET /api/comments` - Get all comments (paginated)
- `GET /api/comments/:id` - Get comment by ID
- `GET /api/comments/:id/replies` - Get comment replies
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

#### Likes

- `POST /api/likes` - Like a comment
- `DELETE /api/likes/:commentId` - Unlike a comment
- `GET /api/likes/comment/:commentId` - Get comment likes
- `GET /api/likes/user/:userId` - Get user's likes
- `GET /api/likes/status/:commentId` - Check like status

#### Followers

- `POST /api/followers/follow` - Follow a user
- `DELETE /api/followers/unfollow/:userId` - Unfollow a user
- `GET /api/followers/:userId/followers` - Get user followers
- `GET /api/followers/:userId/following` - Get user following
- `GET /api/followers/is-following/:userId` - Check follow status

#### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification

### WebSocket Events

The application uses Socket.IO for real-time features:

#### Client Events
- `join` - Join user-specific room
- `leave` - Leave user-specific room

#### Server Events
- `connected` - Connection confirmation
- `notification` - General notifications
- `like_notification` - Like notifications
- `follow_notification` - Follow notifications
- `new_comment` - New comment broadcasts
- `unread_count` - Unread notification count

### Testing with Postman

Import the provided Postman collection (`postman/Comment-System-API.postman_collection.json`) to test all endpoints.

1. Import the collection into Postman
2. Set the `baseUrl` variable to your server URL (default: `http://localhost:5000/api`)
3. Start with authentication endpoints to get a JWT token
4. The token will be automatically set for subsequent requests

### Deployment

#### Environment Variables for Production

\`\`\`env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
PORT=5000
FRONTEND_URL=your-frontend-domain
NODE_ENV=production
\`\`\`

#### Build and Start

\`\`\`bash
npm run build
npm run start:prod
\`\`\`

### Project Structure

\`\`\`
backend/
├── src/
│   ├── auth/              # Authentication module
│   ├── user/              # User management module
│   ├── comment/           # Comment system module
│   ├── like/              # Like functionality module
│   ├── follower/          # Follower system module
│   ├── notification/      # Notification module
│   ├── websocket/         # WebSocket gateway
│   ├── common/            # Shared utilities
│   ├── app.module.ts      # Main application module
│   └── main.ts            # Application entry point
├── postman/               # Postman collection
├── uploads/               # File upload directory
├── .env.example           # Environment template
└── README.md
\`\`\`

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### License

This project is licensed under the MIT License.
