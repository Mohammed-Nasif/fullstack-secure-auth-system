import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Home from './pages/Home';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthRedirect from './components/auth/AuthRedirect';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Redirect authenticated users to home */}
        <Route 
          path="/signup" 
          element={
            <AuthRedirect redirectTo="/home">
              <Signup />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/signin" 
          element={
            <AuthRedirect redirectTo="/home">
              <Signin />
            </AuthRedirect>
          } 
        />
        
        {/* Protected Route - Only for authenticated users */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute 
              redirectTo="/signin"
              loadingMessage="Loading your dashboard..."
              showUserInfo={import.meta.env.DEV}
            >
              <Home />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
