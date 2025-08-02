# Authentication API - Backend

NestJS-based authentication system with MongoDB.

## 📋 Requirements Fulfilled

- ✅ **NestJS Framework**: Enterprise-grade Node.js framework with TypeScript.
- ✅ **MongoDB Integration**: User data persistence with Mongoose ODM.
- ✅ **Authentication Endpoints**: Sign up, sign in with validation.
- ✅ **Protected Endpoints**: JWT-based route protection.
- ✅ **Security Best Practices**: Password hashing, input validation, rate limiting.
- ✅ **Logging**: Comprehensive request/response logging.
- ✅ **API Documentation**: Interactive Swagger documentation.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker (for MongoDB)
  - **GUI Users**: If you're using Docker Desktop or another Docker GUI, please ensure it's running before starting the application

### Setup & Run

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start MongoDB and development server
npm run dev
```

> **💡 Docker GUI Reminder**: Make sure Docker Desktop (or your Docker GUI) is running before executing the above command.

The API will be available at:
- **Base URL**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## � API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| `POST` | `/auth/signup` | User registration with validation | Public |
| `POST` | `/auth/signin` | User authentication | Public |
| `GET` | `/auth/profile` | Get current user details | **Protected** |
| `POST` | `/auth/refresh-token` | Refresh expired access token | **Protected** |
| `POST` | `/auth/logout` | User logout | **Protected** |

### Health Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Basic health check |
| `GET` | `/health/database` | Database connectivity |
| `GET` | `/health/detailed` | Comprehensive diagnostics |

## � Security Features

### Input Validation & Security
- **DTO Validation**: Comprehensive field validation using class-validator.
- **Password Requirements**: 8+ chars, letter, number, special character.
- **Email Validation**: Proper email format checking.
- **XSS Protection**: Input sanitization and HTML tag detection.

### Authentication & Authorization
- **JWT Security**: Secure token generation with configurable expiration.
- **Dual Token System**: Access tokens (1h) and refresh tokens (7d) for enhanced security.
- **Token Rotation**: Automatic refresh token rotation on each refresh request.
- **Password Hashing**: bcrypt with salt rounds for secure password storage.
- **Protected Routes**: JWT guard for sensitive endpoints.
- **Secure Headers**: Helmet middleware with CORS and security headers.

### Token Management
- **Access Token**: Short-lived (1 hour) for API authentication.
- **Refresh Token**: Long-lived (7 days) stored as secure HTTP-only cookies.
- **Automatic Refresh**: Frontend automatically refreshes expired access tokens.
- **Token Revocation**: Logout invalidates both access and refresh tokens.
- **Secure Storage**: Refresh tokens stored hashed in database.

### Rate Limiting & DoS Protection
- **Global Rate Limiting**: 100 requests per 15 minutes per IP.
- **Auth-Specific Limits**: 5 signup attempts, 10 signin attempts per minute.
- **Request Size Limits**: Protection against large payload attacks.

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js + TypeScript).
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: JWT with passport strategies.
- **Validation**: class-validator & class-transformer.
- **Security**: bcrypt, Helmet, rate limiting.
- **Documentation**: Swagger.
- **Logging**: Winston with colored console output.
- **Testing**: Jest for unit and integration tests.

## 📊 Project Structure

```
src/
├── auth/              # Authentication module
│   ├── auth.controller.ts    # Auth endpoints (signup, signin, profile)
│   ├── auth.service.ts       # Business logic
│   ├── jwt.strategy.ts       # JWT passport strategy
│   ├── dtos/                 # Data transfer objects with validation
│   └── guards/               # JWT authentication guard
├── users/             # User management
│   ├── users.repository.ts   # Database operations
│   └── schemas/user.schema.ts # MongoDB user schema
├── health/            # Health monitoring endpoints
├── common/            # Shared utilities
│   ├── constants/     # Application constants
│   ├── filters/       # Global exception handling
│   ├── middleware/    # Request logging, security
│   └── utils/         # Helper functions
└── config/            # Configuration files
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start with MongoDB and file watching
npm run start        # Start production mode
npm run build        # Build for production

# Database Management  
npm run db:start     # Start MongoDB container
npm run db:stop      # Stop MongoDB container
npm run db:logs      # View database logs

# Code Quality
npm run test         # Run Jest tests
npm run lint         # ESLint code checking
npm run format       # Prettier code formatting

# Monitoring
npm run health       # Test health endpoint
```

## ⚙️ Environment Configuration

Create `.env` file from `.env.example`:

```env
# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Database (MongoDB Docker container)
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=nest-auth
MONGO_USER=admin
MONGO_PASSWORD=adminpass1234

# JWT Configuration (defaults provided)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h                    # Access token expiration
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=7d            # Refresh token expiration
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Test specific modules
npm run test -- --testPathPattern=auth
npm run test -- --testPathPattern=users
```

## 📖 API Documentation

Visit http://localhost:3000/api for interactive Swagger documentation with:
- Request/response examples
- Authentication flow testing
- Schema validation details
- Live API testing interface

## 🔄 Authentication Flow

### Initial Authentication
1. **Sign Up/Sign In**: User provides credentials
2. **Token Generation**: Server creates access token (1h) + refresh token (7d)
3. **Cookie Storage**: Refresh token stored as secure HTTP-only cookie
4. **Response**: Access token returned for API requests

### Token Refresh Cycle
1. **Token Expiration**: Access token expires after 1 hour
2. **Auto Refresh**: Frontend detects 401 errors and calls `/auth/refresh-token`
3. **Token Rotation**: New access token + new refresh token generated
4. **Seamless UX**: User stays logged in without interruption

### Security Benefits
- **Short Access Token Lifespan**: Limits exposure if compromised
- **HTTP-Only Cookies**: Prevents XSS attacks on refresh tokens  
- **Token Rotation**: Each refresh invalidates previous refresh token
- **Automatic Logout**: Failed refresh redirects to sign-in page

## � Production Notes

For production deployment:
1. Generate strong JWT secrets (32+ characters).
2. Use production MongoDB credentials.
3. Configure environment-specific settings.
4. Configure proper CORS origins.
5. Set up log rotation and monitoring.

---

**Built with security, scalability, and maintainability as core principles.**
