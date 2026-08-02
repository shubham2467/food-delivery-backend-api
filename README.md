# 🍔 Food Delivery Backend API

A scalable backend system for a food delivery platform built with **Node.js**, **Express.js**, and **MongoDB**. The project provides authentication, user management, restaurant management, food catalog management, category management, and order processing APIs.

---

# 🚀 Features

- User registration and login using JWT
- Secure authentication and authorization
- Role-based access control (User/Admin)
- Restaurant management
- Food management
- Category management
- Password update for authenticated users
- Order placement and order status tracking
- Logout with token invalidation
- Redis caching support
- RESTful API architecture

---

# 🛠️ Tech Stack

## Backend

- Node.js
- Express.js
- JavaScript (ES6)

## Database

- MongoDB Atlas
- Mongoose ODM

## Authentication & Security

- JWT (JSON Web Token)
- bcryptjs
- Custom authentication middleware
- Role-based authorization

## Caching

- Redis (Upstash)

## API Testing

- Postman

## Deployment

- Northflank

## Utilities

- dotenv
- cors
- morgan
- nodemon

---

# 📐 High-Level Design

```text
Client (Web / Mobile)
          |
          v
     Express Server
          |
  ----------------------
  |         |           |
Auth     Business      Middleware
Layer     Logic        Layer
  |         |           |
  ----------------------
          |
    MongoDB Atlas
          |
        Redis
```

---

# 🏗️ Project Structure

```text
food-delivery-backend/
│
├── config/
│   ├── db.js
│   └── redis.js
│
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── server.js
├── package.json
└── .env
```

---

# 🔐 Authentication Flow

1. User registers.
2. User logs in.
3. Server generates JWT.
4. Client sends JWT in Authorization header.
5. Middleware validates token.
6. Protected resources are returned.

```http
Authorization: Bearer <jwt_token>
```

---

# 📚 API Modules

## Authentication

- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout

## User

- GET /api/v1/user
- PUT /api/v1/user
- PUT /api/v1/user/password
- DELETE /api/v1/user/:id
- PUT /api/v1/user/role/:id

## Restaurant

- POST /api/v1/restaurant
- GET /api/v1/restaurant
- GET /api/v1/restaurant/:id
- PUT /api/v1/restaurant/:id
- DELETE /api/v1/restaurant/:id

## Category

- POST /api/v1/category
- GET /api/v1/category
- PUT /api/v1/category/:id
- DELETE /api/v1/category/:id

## Food

- POST /api/v1/food
- GET /api/v1/food
- GET /api/v1/food/:id
- GET /api/v1/food/category/:title
- GET /api/v1/food/restaurant/:id
- PUT /api/v1/food/:id
- DELETE /api/v1/food/:id

## Orders

- POST /api/v1/food/place-order
- PUT /api/v1/food/order-status/:id

---

# ⚙️ Environment Variables

Create a `.env` file.

```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REDIS_URL=your_redis_url
```

---

# ▶️ Local Setup

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run server
```

Run production server:

```bash
npm start
```

---

# ☁️ Deployment

The application is deployed on Northflank and uses:

- MongoDB Atlas
- Upstash Redis
- Node.js runtime

## Swagger API documentation

When the server is running, open the interactive documentation at:

```text
/api-docs
```

The raw OpenAPI 3 specification is also available at `/api-docs.json`. For protected endpoints, use **Authorize** in Swagger UI and enter the JWT returned by the login endpoint.

---

# 📌 Future Improvements

- Payment gateway integration
- Email notifications
- Swagger/OpenAPI documentation
- Rate limiting
- Docker support
- CI/CD pipeline
- Image uploads using Cloudinary

---



---

# 📖 API Documentation

Detailed API documentation with request payloads, sample responses, authentication requirements, and endpoint descriptions is available here:

- [Comprehensive API Documentation](./comprehensive_food_api_docs.md)

If you are browsing the repository on GitHub, open the `comprehensive_food_api_docs.md` file from the project root.


# 👨‍💻 Author

Shubham Kumar

B.Tech (Artificial Intelligence & Machine Learning)
