# Full Stack Secure Authentication System

A production-ready authentication system built with **NestJS**, **MongoDB**, **React**, and **TypeScript** as per requirements.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker (for MongoDB)
  - **GUI Users**: If you're using Docker Desktop or another Docker GUI, please ensure it's running before starting the application
- Git

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/Mohammed-Nasif/fullstack-secure-auth-system.git
cd fullstack-secure-auth-system
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Setup Backend Environment**
```bash
cd backend
cp .env.example .env
# Edit .env file with your configuration
```

4. **Start the Full Application**
```bash
# From root directory - starts both backend and frontend
npm run dev
```

> **💡 Docker GUI Reminder**: Make sure Docker Desktop (or your Docker GUI) is running before executing the above command.

The application will be available at:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api

## 📋 Features Implemented

### ✅ Frontend Requirements (React + TypeScript)
- **Sign Up Page**: Email validation, name (3+ chars), password complexity.
- **Sign In Page**: Email and password authentication.
- **Application Page**: Welcome message with logout functionality.
- **Responsive Design**: Clean UI with Material-UI components.
- **TypeScript**: Full type safety throughout the application.

### ✅ Backend Requirements (NestJS + MongoDB)
- **Authentication Endpoints**: Sign up, sign in, logout, profile, refresh token.
- **JWT Security**: Access tokens (1h) + refresh tokens (7d) with automatic rotation.
- **Protected Routes**: JWT-based route protection.
- **MongoDB Integration**: User data persistence with Mongoose.
- **Security Best Practices**: Password hashing, input validation, rate limiting.
- **API Documentation**: Swagger documentation.

### Bonus Features
- **Automatic Token Refresh**: Seamless user experience with automatic token renewal.
- **Comprehensive Logging**: Request/response logging with Winston.
- **Error Handling**: Global exception filters.
- **Health Monitoring**: Multiple health check endpoints.
- **Testing**: Unit tests with Jest.
- **Security Headers**: Helmet middleware with CORS protection.
- **Rate Limiting**: Protection against brute force attacks.

## Project Structure

```
├── backend/          # NestJS API Server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   │   ├── dtos/       # Data transfer objects
│   │   │   └── guards/     # JWT guards
│   │   ├── users/          # User management module
│   │   │   └── schemas/    # MongoDB schemas
│   │   ├── health/         # Health monitoring module
│   │   ├── common/         # Shared utilities
│   │   │   ├── constants/  # Application constants
│   │   │   ├── filters/    # Exception filters
│   │   │   ├── middleware/ # Request middleware
│   │   │   └── utils/      # Helper functions
│   │   └── config/         # Configuration files
│   ├── package.json        # Backend dependencies & scripts
│   └── README.md           # Backend setup guide
├── frontend/         # React Application
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── forms/      # Form components
│   │   │   ├── layouts/    # Layout components
│   │   │   └── ui/         # Reusable UI components
│   │   ├── pages/          # Sign up, Sign in, Home
│   │   ├── hooks/          # Authentication & custom hooks
│   │   ├── services/       # API communication
│   │   └── types/          # TypeScript definitions
│   ├── package.json        # Frontend dependencies & scripts
│   └── README.md           # Frontend setup guide
└── package.json            # Root workspace configuration
```

## 🛠️ Tech Stack

**Backend**
- **Framework**: NestJS (Node.js + TypeScript).
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JWT with refresh tokens.
- **Security**: bcrypt, Helmet, rate limiting.
- **Documentation**: Swagger.
- **Logging**: Winston with colored output.

**Frontend**
- **Framework**: React 19 with TypeScript.
- **Routing**: React Router v7.
- **UI Library**: Material-UI (MUI).
- **Styling**: Tailwind CSS for utility-first styling.
- **Build Tool**: Vite.
- **Form Handling**: React Hook Form.
- **HTTP Client**: Axios.

## 🔐 Security Features

- **Password Security**: bcrypt hashing with salt rounds.
- **Dual Token System**: Access tokens (1h) + refresh tokens (7d) for enhanced security.
- **Automatic Token Refresh**: Frontend automatically handles token expiration.
- **JWT Authentication**: Secure token-based authentication with rotation.
- **Input Validation**: Comprehensive DTO validation.
- **Rate Limiting**: Protection against brute force attacks.
- **CORS Protection**: Configured for secure cross-origin requests.
- **Security Headers**: Helmet middleware for common vulnerabilities.
- **XSS Protection**: Input sanitization and content security policy.

## 📚 API Documentation

Interactive API documentation is available at http://localhost:3000/api when the backend is running.

**Key Endpoints:**
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User authentication  
- `GET /auth/profile` - Get user profile (protected)
- `POST /auth/refresh-token` - Refresh expired access token (protected)
- `POST /auth/logout` - User logout (protected)
- `GET /health` - Application health check

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm run test

# Run all linting
npm run lint
```

## 📖 Individual Setup Guides

For detailed setup instructions, see the README files in each directory:
- [Backend Setup Guide](./backend/README.md)
- [Frontend Setup Guide](./frontend/README.md)

---

**Built for production with security, scalability, and maintainability in mind.**