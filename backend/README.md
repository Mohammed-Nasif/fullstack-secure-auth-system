# 🔐 Secure Authentication API

A production-ready NestJS authentication system with comprehensive security features built for enterprise applications.

## 🌟 Features

- **Secure Authentication**: JWT-based auth with refresh token rotation
- **Password Security**: bcrypt hashing with configurable salt rounds
- **Input Validation**: Comprehensive validation with class-validator
- **Rate Limiting**: Multi-tier protection (global, signup, signin)
- **Security Headers**: Helmet middleware with CSP and HSTS
- **Request Logging**: Detailed HTTP request/response logging with colors
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Health Monitoring**: Multiple health check endpoints for load balancers
- **MongoDB Integration**: Mongoose ODM with connection pooling and transactions

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js) - Enterprise-grade TypeScript framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens and secure cookie storage
- **Validation**: class-validator & class-transformer for DTO validation
- **Documentation**: Swagger/OpenAPI 3.0 with interactive UI
- **Testing**: Jest with comprehensive unit and integration tests
- **Security**: Helmet, rate limiting, input sanitization, XSS protection
- **Logging**: Winston with colored console output and file rotation

## 📋 API Endpoints

### Authentication
- `POST /auth/signup` - User registration with validation
- `POST /auth/signin` - User login with credential verification
- `POST /auth/refresh-token` - Refresh access token using secure cookies
- `POST /auth/logout` - User logout with token invalidation (protected)
- `GET /auth/profile` - Get current user profile (protected)

### Health Monitoring
- `GET /health` - Basic application health check
- `GET /health/database` - Database connectivity and performance
- `GET /health/security` - Security configuration overview
- `GET /health/detailed` - Comprehensive system diagnostics

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+) - JavaScript runtime
- **Docker** - For MongoDB container
- **npm or yarn** - Package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-secure-auth-system/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start MongoDB and development server
npm run start:dev
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Application Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Database Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=nest-auth
MONGO_USER=admin
MONGO_PASSWORD=adminpass1234

# JWT Configuration (Generate strong secrets for production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-32chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-32chars
JWT_REFRESH_EXPIRES_IN=7d
```

## 🧪 Testing

```bash
# Run all tests
npm run test

```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Authentication flow testing
- Schema documentation

## 🔒 Security Features

### Input Protection
- **Validation**: Comprehensive DTO validation with class-validator
- **Sanitization**: XSS protection with HTML tag detection
- **Type Safety**: TypeScript throughout with strict typing

### Authentication & Authorization
- **JWT Security**: Secure token generation with configurable expiration
- **Refresh Tokens**: Automatic token rotation for enhanced security
- **Secure Cookies**: HttpOnly, Secure, SameSite cookie configuration
- **Password Hashing**: bcrypt with configurable salt rounds

### Request Security
- **Rate Limiting**: Configurable per endpoint (5 signup/min, 10 signin/min)
- **Request Size Limits**: Protection against DoS attacks
- **CORS Configuration**: Strict origin control
- **Security Headers**: Comprehensive headers via Helmet middleware

### Monitoring & Logging
- **Request Logging**: Detailed HTTP request/response logging
- **Error Tracking**: Global exception handling with stack traces
- **Health Monitoring**: Multiple health check endpoints
- **Performance Metrics**: Response time and size tracking

## 🏗️ Project Structure

```
src/
├── auth/              # Authentication module
│   ├── dtos/         # Data Transfer Objects
│   ├── guards/       # Route guards (JWT, etc.)
│   └── strategies/   # Passport strategies
├── users/            # User management module
│   ├── schemas/      # MongoDB schemas
│   └── repositories/ # Data access layer
├── health/           # Health monitoring module
├── common/           # Shared utilities and constants
│   ├── constants/    # Application constants
│   ├── filters/      # Exception filters
│   ├── middleware/   # Custom middleware
│   ├── transforms/   # Data transformation
│   └── utils/        # Utility functions
├── config/           # Configuration files
└── docs/             # API documentation
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev      # Start with file watching and database
npm run start:debug    # Start in debug mode

# Production
npm run build          # Build for production
npm run start:prod     # Start production server

# Database Management
npm run db:start       # Start MongoDB container
npm run db:stop        # Stop MongoDB container
npm run db:logs        # View database logs

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier

# Testing & Health
npm run test           # Run all tests
npm run health:check   # Test health endpoint
```

## 🚀 Production Deployment

### Environment Variables for Production

**Critical Security Settings:**
```env
# Generate cryptographically strong secrets (32+ characters)
JWT_SECRET=generate-strong-32char-secret-here
JWT_REFRESH_SECRET=generate-different-32char-secret

# Production environment
NODE_ENV=production

# Secure database credentials
MONGO_USER=secure-username
MONGO_PASSWORD=secure-complex-password

# Production frontend URL
FRONTEND_URL=https://yourdomain.com
```

## 🛡️ Security Considerations

### Pre-Production Checklist
1. **JWT Secrets**: Generate cryptographically strong secrets (32+ characters)
2. **Database Security**: Use strong MongoDB credentials and enable authentication
3. **HTTPS**: Always use HTTPS in production environments
4. **Environment Variables**: Never commit `.env` files to version control
5. **Rate Limiting**: Adjust limits based on your traffic patterns
6. **Logging**: Configure log rotation and monitoring
7. **Updates**: Keep dependencies updated and monitor security advisories

### Production Security Headers
The application automatically sets secure headers including:
- `Strict-Transport-Security` for HTTPS enforcement
- `Content-Security-Policy` for XSS protection
- `X-Content-Type-Options` to prevent MIME sniffing
- `X-Frame-Options` for clickjacking protection

## 📈 Performance Features

- **Request Size Limits**: Protection against large payload DoS attacks (10MB default)
- **Async Operations**: Non-blocking I/O operations throughout the application
- **Response Time Tracking**: Built-in request/response duration monitoring in middleware
- **Efficient Error Handling**: Global exception filter with proper HTTP status codes

## 🎯 Future Enhancements

- [ ] **Role-Based Access Control (RBAC)** - User roles and permissions
- [ ] **Password Reset Flow** - Secure password recovery
- [ ] **User Profile Management** - Extended user information
- [ ] **Redis Integration** - Session management and caching
- [ ] **OAuth2 Integration** - Social login providers

---

**Built with ❤️ for production environments**
