# 🛒 E-Commerce RESTful API - NestJS & MongoDB

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">
  <b>A Production-Ready, Scalable E-Commerce Backend API built with NestJS, TypeScript, MongoDB, Redis, Stripe, and Cloudinary.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📌 Overview

This project is a high-performance **E-Commerce Backend API** built using **NestJS** and **TypeScript**. Designed following enterprise modular architecture, it provides a comprehensive backend solution for modern online stores, featuring full authentication, product catalog management, shopping cart operations, Stripe payment processing, real-time WebSocket events, and Redis caching.

---

## ✨ Key Features

- 🔐 **Authentication & Security**
  - JWT-based authentication & token validation
  - Custom Role-Based Access Control (RBAC) (e.g. `@Auth('admin')`)
  - Password hashing with `bcrypt`

- 🛍️ **Product Catalog & Management**
  - Full CRUD operations for Products, Categories, Sub-Categories, and Brands
  - Custom query parsing middleware for searching, sorting, filtering, and pagination
  - Product list compilation (`/products/build-list`)

- 🛒 **Shopping Cart & Checkout**
  - Dynamic cart management (add, update, remove items, auto-calculate subtotals)
  - Order creation and status tracking

- 💳 **Payments & Integrations**
  - Integrated **Stripe Payment Gateway** for secure checkouts
  - Cloud-based image upload and management using **Cloudinary** and **Multer**

- ⚡ **Performance & Real-Time Services**
  - High-performance caching layer powered by **Redis** (`@keyv/redis` + `@nestjs/cache-manager`)
  - Real-time events using **WebSockets** (`Socket.IO` / `@nestjs/websockets`)
  - Automated email notifications via **Nodemailer**

- ☁️ **Deployment Flexibility**
  - Dual configuration supporting both **Serverless (Vercel)** and **Standalone Node.js Servers**

---

## 🛠️ Tech Stack

| Domain             | Technology                                                               |
| :----------------- | :----------------------------------------------------------------------- |
| **Framework**      | [NestJS v11](https://nestjs.com/) (Express Platform)                     |
| **Language**       | TypeScript                                                               |
| **Database**       | MongoDB with [Mongoose v9](https://mongoosejs.com/)                      |
| **Caching**        | Redis ([Keyv](https://github.com/jaredwray/keyv) + NestJS Cache Manager) |
| **Authentication** | JWT (`@nestjs/jwt`), Bcrypt                                              |
| **Payments**       | Stripe API                                                               |
| **File Storage**   | Cloudinary & Multer                                                      |
| **Real-time**      | Socket.IO (`@nestjs/platform-socket.io`)                                 |
| **Email**          | Nodemailer                                                               |

---

## 📁 Project Architecture

```
src/
├── auth/           # Authentication & User Management (Login, Register, JWT)
├── brand/          # Brand Management Module
├── cart/           # Shopping Cart Operations
├── category/       # Main Category Module
├── sub-category/   # Sub-Category Module
├── products/       # Products Module & Inventory Management
├── order/          # Order Processing & Checkout Workflow
├── Common/         # Custom Decorators, Guards, Middleware, Utils & Constants
├── Core/           # Global Core Module & Caching Configuration (Redis)
├── DB/             # Database Base Services & Mongoose Repositories
└── main.ts         # Server Entry Point
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed locally:

- **Node.js** (v18 or higher)
- **npm**
- **MongoDB** (Local or MongoDB Atlas instance)
- **Redis Server** (Optional for local dev caching)

### 1. Clone the Repository

```bash
git clone https://github.com/KhaledAlmorse/Ecommerce_API_NEST.git
cd Ecommerce_API_NEST
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce
JWT_SECRET=your_jwt_secret_key
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The server will start at `http://localhost:3000`.

---

## 📑 API Endpoints Summary

| Module         | Method | Endpoint               | Description                                   | Auth Required |
| :------------- | :----- | :--------------------- | :-------------------------------------------- | :-----------: |
| **Auth**       | `POST` | `/auth/signup`         | Register a new user                           |      ❌       |
| **Auth**       | `POST` | `/auth/login`          | User login & return JWT                       |      ❌       |
| **Auth**       | `GET`  | `/auth/me`             | Fetch authenticated user profile              |      🔒       |
| **Products**   | `GET`  | `/products`            | List all products (with pagination & filters) |      ❌       |
| **Products**   | `GET`  | `/products/build-list` | Get product list compilation                  |      ❌       |
| **Products**   | `GET`  | `/products/:id`        | Get single product details                    |      ❌       |
| **Products**   | `POST` | `/products`            | Create product (with image upload)            |   🔒 Admin    |
| **Categories** | `GET`  | `/category`            | Get all categories                            |      ❌       |
| **Categories** | `POST` | `/category`            | Create new category                           |   🔒 Admin    |
| **Cart**       | `GET`  | `/cart/get-cart`       | Fetch user shopping cart                      |      🔒       |
| **Orders**     | `POST` | `/order`               | Create an order / checkout                    |      🔒       |

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
