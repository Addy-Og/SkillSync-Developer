# SkillSync 🚀

> Full-stack real-time developer networking and skill-matching platform engineered with React 18, Node.js, Express, MongoDB, Socket.io, and Stripe.

---

## 📐 Visual Architecture

![SkillSync Architecture](docs/architecture.svg)

---

## 🔒 4 Core Security Principles

- **Stateless Token Auth**: Secured via HTTP-only JWT cookies to defend against Cross-Site Scripting (XSS) attacks.
- **Socket Session Guards**: Handshake-level JWT validation enforcing authenticated real-time chat room access.
- **Validation & Hash Boundaries**: Strict schema sanitization via `validator` with salted `bcrypt` password encryption.
- **Environment & Origin Isolation**: Dynamic CORS whitelist protection with strict `.env` credential scoping.

---

## ⚡ 3-Step Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Addy-Og/SkillSync-Developer.git
cd SkillSync-Developer
cd skillSync-Backend && npm install && cd ../SkillSync-Frontend && npm install
```

### 2. Configure Environment Variables
Create `.env` inside `skillSync-Backend/`:
```env
PORT=7777
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Launch Development Servers
```bash
# Terminal 1: Launch Backend
cd skillSync-Backend && npm run dev

# Terminal 2: Launch Frontend
cd SkillSync-Frontend && npm run dev
```

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :---: |
| `POST` | `/signup` | Register new user account | ❌ |
| `POST` | `/login` | Authenticate user & set JWT cookie | ❌ |
| `POST` | `/logout` | Clear authentication token cookie | ❌ |
| `GET` | `/profile/view` | Fetch logged-in user profile details | ✅ |
| `PATCH` | `/profile/edit` | Edit user profile and upload avatar | ✅ |
| `GET` | `/feed` | Fetch recommended developer profiles | ✅ |
| `POST` | `/request/send/:status/:toUserId` | Send interest or ignore a profile | ✅ |
| `POST` | `/request/review/:status/:requestId` | Accept or reject connection request | ✅ |
| `GET` | `/user/connections` | Retrieve matched connections list | ✅ |
| `GET` | `/user/requests/received` | Retrieve pending connection requests | ✅ |
| `GET` | `/chat/:targetUserId` | Fetch chat message history | ✅ |
| `POST` | `/payment/create-checkout-session` | Initialize Stripe checkout session | ✅ |
| `POST` | `/payment/verify` | Verify payment & issue Premium badge | ✅ |