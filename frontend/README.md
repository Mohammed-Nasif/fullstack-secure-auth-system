# Authentication UI - Frontend

React-based authentication interface with TypeScript.

## 📋 Requirements Fulfilled

✅ **React Framework**: Modern React 19 with TypeScript.
✅ **Sign Up Page**: Email validation, name (3+ chars), password complexity.
✅ **Sign In Page**: Email and password authentication.
✅ **Application Page**: Welcome message with logout functionality.
✅ **TypeScript**: Full type safety throughout the application.
✅ **Form Validation**: Comprehensive client-side validation Using React Hook Form.
✅ **Responsive Design**: Clean, modern UI with Material-UI.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Backend API running on http://localhost:3000

### Setup & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at http://localhost:3001

## 📱 Application Pages

### 1. Sign Up Page (`/signup`)
**Form Fields with Validation:**
- **Email**: Valid email format validation.
- **Name**: Minimum 3 characters required.
- **Password**: Complex password requirements:
  - Minimum 8 characters.
  - At least one letter.
  - At least one number.
  - At least one special character.

### 2. Sign In Page (`/signin`)
**Form Fields:**
- **Email**: User email address.
- **Password**: User password.

### 3. Application Page (`/home`) - Protected Route
**Features:**
- Welcome message: "Welcome to the application".
- User profile information display.
- Logout button to end session.
- Automatic redirect to signin if not authenticated.

## 🎨 UI Components & Features

### Form Components
- **FormInput**: Reusable input component with validation display.
- **SubmitButton**: Loading states and form submission handling.
- **LoadingSpinner**: Consistent loading indicator.

### Authentication Flow
- **ProtectedRoute**: Route guard for authenticated pages.
- **AuthRedirect**: Automatic navigation based on auth state.
- **useAuth**: Custom hook for authentication state management.
- **useAuthForm**: Custom hook for form handling with validation.

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript.
- **Routing**: React Router v7 for navigation.
- **UI Library**: Material-UI (MUI) for components.
- **Form Handling**: React Hook Form for validation.
- **HTTP Client**: Axios for API communication.
- **Build Tool**: Vite for fast development and building.
- **Styling**: Material-UI system with theme support.

## 📊 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AuthRedirect.tsx     # Auto redirect based on auth
│   ├── LoadingSpinner.tsx   # Loading indicator
│   ├── ProtectedRoute.tsx   # Route protection
│   └── forms/               # Form-specific components
│       ├── FormInput.tsx       # Input with validation
│       └── SubmitButton.tsx    # Submit button with loading
├── hooks/               # Custom React hooks
│   ├── useAuth.ts          # Authentication state management
│   ├── useAuthForm.ts      # Form handling with validation
│   ├── useAuthGuard.ts     # Route protection logic
│   └── useProfile.ts       # User profile management
├── pages/               # Application pages
│   ├── Home.tsx            # Protected dashboard page
│   ├── Signin.tsx          # Sign in form
│   └── Signup.tsx          # Sign up form
├── services/            # API communication
│   └── authApi.ts          # Authentication API calls
├── types/               # TypeScript definitions
│   └── auth.types.ts       # Authentication type definitions
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🔐 Form Validation Rules

### Sign Up Validation
```typescript
// Email validation
email: {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address'
  }
}

// Name validation  
name: {
  required: 'Name is required',
  minLength: {
    value: 3,
    message: 'Name must be at least 3 characters'
  }
}

// Password validation
password: {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters'
  },
  pattern: {
    value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must contain letter, number, and special character'
  }
}
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Preview production build

# Code Quality
npm run lint         # ESLint code checking
npm run lint:fix     # Fix ESLint issues automatically
```

## 🌐 API Integration

The frontend communicates with the backend through axios-based services:

```typescript
// Authentication API endpoints
POST /auth/signup    - User registration
POST /auth/signin    - User authentication
GET  /auth/profile   - Get user profile (protected)
POST /auth/logout    - User logout (protected)
```

## 🔄 Authentication Flow

1. **Sign Up**: User registration with form validation
2. **Sign In**: User authentication with credential verification
3. **Token Storage**: JWT tokens stored securely
4. **Route Protection**: Automatic redirect for protected routes
5. **Logout**: Clear tokens and redirect to sign in

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Material Design**: Following Google's Material Design principles
- **Consistent Theme**: Unified color scheme and typography
- **Accessibility**: ARIA labels and keyboard navigation support

## ⚙️ Environment Configuration

Create `.env` file if you need to customize API endpoint:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 🧪 Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type checking and IntelliSense
- **ESLint**: Code quality and consistency checking
- **Form Validation**: Real-time validation feedback
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback for async operations

---

**Built with modern React patterns and best practices for user experience.**