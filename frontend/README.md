# Secure Auth System - Frontend

## Overview
React-based authentication interface with TypeScript, featuring user registration, login, and protected dashboard.

## Features
- User registration with validation
- Secure login system
- Protected dashboard
- Responsive design with Tailwind CSS
- Type-safe development with TypeScript

## Prerequisites
- Node.js (v18+)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Environment Setup
```bash
# Create .env file
echo "VITE_API_BASE_URL=http://localhost:3000" > .env
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
npm run preview
```

## Project Structure
```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── types/          # TypeScript definitions
└── App.tsx         # Main application
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Form Validations
- **Email**: Valid email format
- **Name**: Minimum 3 characters
- **Password**: 8+ chars, letter, number, special character
