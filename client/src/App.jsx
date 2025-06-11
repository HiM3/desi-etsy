import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Lazy load components for better performance
const Login = lazy(() => import('./pages/Authentication/Login'));
const Signup = lazy(() => import('./pages/Authentication/Signup'));
const SendOTP = lazy(() => import('./pages/Authentication/SendOTP'));
const VerifyOTP = lazy(() => import('./pages/Authentication/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/Authentication/ForgotPassword'));
const ChangePassword = lazy(() => import('./pages/Authentication/ChangePassword'));
const Dashboard = lazy(() => import('./Admin/Dashboard'));
const Product = lazy(() => import('./pages/Product'));
const HomePage = lazy(() => import('./components/HomePage'));

function App() {
  return (
    <Router>
      <ToastContainer />
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/sendOTP" element={<SendOTP />} />
                <Route path="/verifyOTP" element={<VerifyOTP />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  {/* User Routes */}
                  <Route path="/product" element={<Product />} />
                  <Route path="/change-password" element={<ChangePassword />} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<Dashboard />} />
                </Route>
                {/* 404 Route */}
                <Route path="*" element={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                      <p className="text-gray-600 mb-4">Page not found</p>
                      <Link to="/" className="text-[#d35400] hover:underline">
                        Return to Home
                      </Link>
                    </div>
                  </div>
                } />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;