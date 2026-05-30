# StockPilot - Inventory Management API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-D63AFF)
![Swagger](https://img.shields.io/badge/Docs-Swagger-85EA2D?logo=swagger&logoColor=black)

## 📋 Description

StockPilot is a professional REST API for inventory and product management. It provides secure JWT authentication, product and category administration, soft deletion, filtering with pagination, and interactive OpenAPI documentation so teams can integrate and test the platform quickly.

## 🚀 Features

- 🔐 JWT authentication with role-based access control
- 📦 Product CRUD with soft delete and stock-only updates
- 🗂️ Category management with slug generation and product safety checks
- 🔎 Search, filters, sorting, tags, and pagination for products
- 🛡️ Centralized validation and global error handling
- 📖 Swagger UI documentation for every endpoint
- ⚙️ Environment-based configuration ready for local development

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime for the backend |
| Express | HTTP server and routing |
| MongoDB | Persistent data store |
| Mongoose | ODM for schemas, validation, and queries |
| JWT | Stateless authentication |
| express-validator | Request validation |
| Swagger / OpenAPI | API documentation |

## ⚙️ Installation

1. Clone the repository or open this project folder.
2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Update `.env` with your local MongoDB connection and JWT secret.
5. Start the development server:

```bash
npm run dev
```

6. Open the API in your browser at `http://localhost:3000`.

## 🔐 Authentication

StockPilot uses JWT Bearer tokens. Register or log in to receive a token, then include it in protected requests:

```http
Authorization: Bearer <your_jwt_token>
```

Admin-only routes require a token whose payload includes `role: "admin"`.

## 📚 API Endpoints

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user and receive a JWT | No |
| POST | `/api/auth/login` | Authenticate a user and receive a JWT | No |
| GET | `/api/products` | List products with filters, search, sorting, and pagination | No |
| GET | `/api/products/:id` | Get one active product | No |
| POST | `/api/products` | Create a product | Admin |
| PUT | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Soft delete a product by setting `active: false` | Admin |
| PATCH | `/api/products/:id/stock` | Update product stock only | Admin |
| GET | `/api/categories` | List active categories | No |
| GET | `/api/categories/:id` | Get one category with its active products | No |
| POST | `/api/categories` | Create a category | Admin |
| PUT | `/api/categories/:id` | Update a category | Admin |
| DELETE | `/api/categories/:id` | Soft delete a category if it has no products | Admin |

## 📖 API Documentation

Swagger UI is available after starting the server:

```text
GET /api/docs
```

Open [http://localhost:3000/api/docs](http://localhost:3000/api/docs) in your browser to explore schemas, request examples, query filters, and possible responses.

## 📁 Project Structure

```text
stockpilot/
├── src/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── swagger.js          # OpenAPI configuration
│   ├── controllers/
│   │   ├── authController.js   # Registration and login logic
│   │   ├── categoryController.js
│   │   └── productController.js
│   ├── middlewares/
│   │   ├── auth.js             # JWT auth and role authorization
│   │   ├── errorHandler.js     # Global error formatter
│   │   ├── paginate.js         # Pagination helper
│   │   └── validate.js         # express-validator wrapper
│   ├── models/
│   │   ├── Category.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints + Swagger docs
│   │   ├── categoryRoutes.js   # Category endpoints + Swagger docs
│   │   └── productRoutes.js    # Product endpoints + Swagger docs
│   ├── utils/
│   │   ├── apiResponse.js      # Standard success/error payloads
│   │   └── buildFilter.js      # Dynamic product query builder
│   └── app.js                  # Express application instance
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 🧪 Testing with Postman

1. Import the endpoints manually or from Swagger using `http://localhost:3000/api/docs`.
2. Register a user and log in to get a JWT token.
3. Add the token to a Postman environment variable and reuse it in the `Authorization` header.
4. Create categories first, then create products referencing category IDs.
5. Test filters like `search`, `tags`, `minPrice`, `maxPrice`, `page`, and `limit` from the products collection.

## 📝 License

MIT
