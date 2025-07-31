# 🔐 API Documentation

## Base URL
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Authentication Flow

### 1. **User Registration**
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123!"
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 2. **User Login**
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Logged in successfully",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 3. **Get User Profile** (Protected)
```http
GET /auth/profile
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### 4. **Refresh Token**
```http
POST /auth/refresh-token
Cookie: refresh_token=<refresh_token>
```

### 5. **Logout** (Protected)
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

## Health Monitoring

### Basic Health Check
```http
GET /health
```

### Security Overview
```http
GET /health/security
```

### Database Status
```http
GET /health/database
```

### Detailed System Info
```http
GET /health/detailed
```

## Error Responses

All error responses follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Authentication

The API uses JWT tokens with HTTP-only cookies:
- **Access Token**: Short-lived (1 hour) for API access
- **Refresh Token**: Long-lived (7 days) for token renewal

## Rate Limiting

- **Global**: 100 requests/minute
- **Signup**: 5 requests/minute
- **Signin**: 10 requests/minute

## Security Features

- ✅ Input validation and sanitization
- ✅ XSS protection
- ✅ CSRF protection via SameSite cookies
- ✅ Rate limiting
- ✅ Secure headers (Helmet)
- ✅ Request size limits
- ✅ Password hashing (bcrypt)