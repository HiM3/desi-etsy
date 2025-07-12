import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaCog, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

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

  useEffect(() => {
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [updateCartCount]);

  useEffect(() => {
    const handleUserLogin = () => {
      window.location.reload();
    };

    const handleUserLogout = () => {
      setUser(null);
      setCartCount(0);
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
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-[#ffefdb]/80 backdrop-blur-sm'} drop-shadow-md`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="text-xl sm:text-2xl font-bold text-[#d35400] focus:outline-none focus:ring-2 focus:ring-[#d35400] rounded">
              DesiEtsy
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
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
            {user?.role !== 'artisan' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/product"
                  className="text-gray-700 hover:text-[#d35400] font-medium transition-colors duration-300"
                >
                  Products
                </Link>
              </motion.div>
            )}

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

            {user?.role === 'admin' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-[#d35400] font-medium transition-colors duration-300"
                >
                  Admin Dashboard
                </Link>
              </motion.div>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                {user?.role === 'user' && (
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
                )}

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

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                      >
                        {user?.role === 'user' && (
                          <Link
                            to="/my-orders"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#d35400] transition-colors duration-300"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <div className="flex items-center space-x-2">
                              <FaUser className="h-4 w-4" />
                              <span>My orders</span>
                            </div>
                          </Link>
                        )}

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

          <motion.button
            type="button"
            className="md:hidden text-gray-700 hover:text-[#d35400] p-2 rounded-md hover:bg-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d35400]"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-white z-50 md:hidden"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <Link to="/" className="text-2xl font-bold text-[#d35400]" onClick={() => setIsMobileMenuOpen(false)}>
                  DesiEtsy
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-700 hover:text-[#d35400] p-2"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col space-y-4">
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-[#d35400] font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-700 hover:text-[#d35400] font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  {user?.role !== 'artisan' && (
                    <Link
                      to="/product"
                      className="text-gray-700 hover:text-[#d35400] font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Products
                    </Link>
                  )}
                  {user?.role === 'artisan' && (
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-[#d35400] font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Artisan Dashboard
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-[#d35400] font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-4 border-t">
                {user ? (
                  <div className="flex flex-col space-y-4">
                    {user?.role === 'user' && (
                      <Link
                        to="/cart"
                        className="flex items-center space-x-2 text-gray-700 hover:text-[#d35400] py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaShoppingCart className="h-5 w-5" />
                        <span>Cart ({cartCount})</span>
                      </Link>
                    )}
                    <Link
                      to="/my-orders"
                      className="flex items-center space-x-2 text-gray-700 hover:text-[#d35400] py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaUser className="h-5 w-5" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/change-password"
                      className="flex items-center space-x-2 text-gray-700 hover:text-[#d35400] py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaCog className="h-5 w-5" />
                      <span>Change Password</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-[#d35400] py-2 w-full text-left"
                    >
                      <FaSignOutAlt className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-[#d35400] font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-[#d35400] text-white hover:bg-[#b34700] px-4 py-2 rounded-full font-medium text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;