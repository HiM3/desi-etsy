import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../context/AuthContext';

import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
const HomePage = lazy(() => import('./components/HomePage'));
const Product = lazy(() => import('./pages/Product'));
const SingleProduct = lazy(() => import('./pages/SingleProduct'));
const Login = lazy(() => import('./pages/Authentication/Login'));
const Signup = lazy(() => import('./pages/Authentication/Signup'));
const SendOTP = lazy(() => import('./pages/Authentication/SendOTP'));
const VerifyOTP = lazy(() => import('./pages/Authentication/VerifyOTP'));
const ForgotPassword = lazy(() => import('./pages/Authentication/ForgotPassword'));
const ChangePassword = lazy(() => import('./pages/Authentication/ChangePassword'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const ArtisanDashboard = lazy(() => import('./pages/Artisian/Dashboard'));
const CreateProduct = lazy(() => import('./pages/Artisian/CreateProduct'));
const ViewProduct = lazy(() => import('./pages/Artisian/ViewProduct'));
const AdminDashboard = lazy(() => import('./Admin/Dashboard'));
const About = lazy(() => import('./components/About'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'))
const Orders = lazy(() => import('./pages/Artisian/Orders'))
const Myorders = lazy(() => import('./pages/Myorders'))
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <ErrorBoundary>
          <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <Chatbot />
            <main className="flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product" element={<Product />} />
                  <Route path="/product/:id" element={<SingleProduct />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/sendOTP" element={<SendOTP />} />
                  <Route path="/verifyOTP" element={<VerifyOTP />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/about" element={<About />} />

                  <Route element={<PrivateRoute />}>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/my-orders" element={<Myorders />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/change-password" element={<ChangePassword />} />

                    <Route path="/dashboard" element={<ArtisanDashboard />} />
                    <Route path="/add-product" element={<CreateProduct />} />
                    <Route path="/add-product/:id" element={<CreateProduct />} />
                    <Route path="/view-artisan-products" element={<ViewProduct />} />
                    <Route path="/orders" element={<Orders />} />

                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>

                  <Route path="*" element={
                    <div className="flex items-center justify-center min-h-[60vh]">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                        <p className="text-gray-600 mb-4">Page not found</p>
                        <Link
                          to="/"
                          className="inline-block bg-[#d35400] text-white px-6 py-3 rounded-full hover:bg-[#b34700] transition-colors duration-300"
                        >
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
    </AuthProvider>
  );
}

export default App;