import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCog, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, cartCount, logout, updateCartCount, setUser, setCartCount } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      updateCartCount(); // Update cart count when cart is modified
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [updateCartCount]);

  // Listen for user login/logout
  useEffect(() => {
    const handleUserLogin = () => {
      // Force a re-render when user logs in
      window.location.reload();
    };

    const handleUserLogout = () => {
      // Force a re-render when user logs out
      window.location.reload();
    };

    window.addEventListener('userLoggedIn', handleUserLogin);
    window.addEventListener('userLoggedOut', handleUserLogout);
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
      window.removeEventListener('userLoggedOut', handleUserLogout);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
    // Dispatch logout event
    window.dispatchEvent(new Event('userLoggedOut'));
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-[#ffefdb]/80 backdrop-blur-sm'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="text-2xl font-bold text-[#d35400]">
              DesiEtsy
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className="text-gray-700 hover:text-[#d35400] font-medium transition-colors duration-300"
              >
                Home
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/about"
                className="text-gray-700 hover:text-[#d35400] font-medium transition-colors duration-300"
              >
                About
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/product"
                className="text-gray-700 hover:text-[#d35400] font-medium transition-colors duration-300"
              >
                Products
              </Link>
            </motion.div>

            {user?.role === 'artisan' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-[#d35400] font-medium transition-colors duration-300"
                >
                  Artisan Dashboard
                </Link>
              </motion.div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    to="/cart"
                    className="text-gray-700 hover:text-[#d35400] p-2 rounded-full hover:bg-white/30 transition-all duration-300 relative inline-flex items-center justify-center"
                  >
                    <FaShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#FF6B6B] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleProfile}
                    className="flex items-center space-x-2 text-gray-700 hover:text-[#d35400] p-2 rounded-full hover:bg-white/30 transition-all duration-300"
                  >
                    <FaUserCircle className="h-6 w-6" />
                    <span className="hidden md:inline">Hi, {user.username?.split(' ')[0]}</span>
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#d35400] transition-colors duration-300"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <FaUser className="h-4 w-4" />
                            <span>Profile</span>
                          </div>
                        </Link>
                        <Link
                          to="/change-password"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#d35400] transition-colors duration-300"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <div className="flex items-center space-x-2">
                            <FaCog className="h-4 w-4" />
                            <span>Change Password</span>
                          </div>
                        </Link>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#d35400] transition-colors duration-300"
                        >
                          <div className="flex items-center space-x-2">
                            <FaSignOutAlt className="h-4 w-4" />
                            <span>Logout</span>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-[#d35400] font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="bg-[#d35400] text-white hover:bg-[#b34700] px-4 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            className="md:hidden text-gray-700 hover:text-[#d35400] p-2 rounded-md hover:bg-white/30 transition-all duration-300"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d35400] hover:bg-white/30 transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </motion.div>
              {user && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/product"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d35400] hover:bg-white/30 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                </motion.div>
              )}
              {!user && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d35400] hover:bg-white/30 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Artisan Dashboard
                  </Link>
                </motion.div>
              )}
              {user && (
                <>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/cart"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d35400] hover:bg-white/30 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Cart
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d35400] hover:bg-white/30 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Link
                      to="/change-password"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d35400] hover:bg-white/30 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Change Password
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#d35400] hover:bg-white/30 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar; 