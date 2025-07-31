# 🔐 Secure Authentication API

A production-ready NestJS authentication system with comprehensive security features.

## 🌟 Features

- **Secure Authentication**: JWT-based auth with refresh tokens
- **Password Security**: bcrypt hashing with configurable rounds
- **Input Validation**: Comprehensive validation with class-validator
- **Rate Limiting**: Multiple tiers (global, signup, signin)
- **Security Headers**: Helmet middleware for security headers
- **Request Logging**: Detailed HTTP request/response logging
- **API Documentation**: Auto-generated Swagger documentation
- **Health Monitoring**: Multiple health check endpoints
- **MongoDB Integration**: Mongoose ODM with connection pooling

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with refresh tokens
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with comprehensive test coverage
- **Security**: Helmet, rate limiting, input sanitization

## 📋 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - User logout (protected)
- `GET /auth/profile` - Get user profile (protected)

### Health Monitoring
- `GET /health` - Basic health check
- `GET /health/database` - Database connectivity
- `GET /health/security` - Security configuration
- `GET /health/detailed` - Comprehensive system status

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker (for MongoDB)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-secure-auth-system/backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server [Includes also Databse Start Script]
npm run start:dev
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
# Application
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Database
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=nest-auth
MONGO_USER=admin
MONGO_PASSWORD=adminpass1234

# JWT (Generate strong secrets for production)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=7d
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 🔒 Security Features

- **Input Validation**: All inputs validated and sanitized
- **XSS Protection**: HTML/script tag detection and prevention
- **CSRF Protection**: SameSite cookies implementation
- **Rate Limiting**: Configurable per endpoint (5 signup/min, 10 signin/min)
- **Secure Headers**: Comprehensive security headers via Helmet
- **Password Security**: bcrypt hashing with salt rounds
- **JWT Security**: Secure token generation with refresh mechanism
- **Request Size Limits**: Protection against DoS attacks

## 🏗️ Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management
├── health/         # Health monitoring
├── common/         # Shared utilities
│   ├── constants/  # Application constants
│   ├── decorators/ # Custom decorators
│   ├── filters/    # Exception filters
│   ├── middleware/ # Custom middleware
│   └── utils/      # Utility functions
└── config/         # Configuration files
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev      # Start with file watching

# Production
npm run build          # Build for production
npm run start:prod     # Start production server

# Database
npm run db:start       # Start MongoDB container
npm run db:stop        # Stop MongoDB container

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier

# Health Checks
npm run health:check   # Test health endpoint
```

## 🚀 Production Deployment

### Docker Deployment

```bash
# Build image
docker build -t auth-api .

# Run with docker-compose
docker-compose up -d
```

### Environment Variables for Production

Ensure these are set securely:
- Generate strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Set `NODE_ENV=production`
- Configure secure database credentials
- Set appropriate `FRONTEND_URL`

## 🛡️ Security Considerations

1. **JWT Secrets**: Use cryptographically strong secrets (32+ characters)
2. **Database**: Use strong MongoDB credentials
3. **HTTPS**: Always use HTTPS in production
4. **Environment**: Never commit `.env` files
5. **Rate Limiting**: Adjust limits based on your needs
6. **Logging**: Monitor and rotate logs appropriately

## 📈 Performance Features

- **Connection Pooling**: MongoDB connection pooling
- **Request Compression**: Gzip compression for responses
- **Caching**: Response caching for health endpoints
- **Efficient Queries**: Optimized database queries

## 📄 License

MIT License - see LICENSE file for details.

## 🎯 Future Enhancements

- [ ] Role-based access control (RBAC)
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] User profile management
- [ ] API versioning
