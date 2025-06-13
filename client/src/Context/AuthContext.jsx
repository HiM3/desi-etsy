// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Separate hook definition
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [cartCount, setCartCount] = useState(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  });

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(totalItems);
    // Dispatch event for real-time updates
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    updateCartCount();
    // Dispatch event for login
    window.dispatchEvent(new Event('userLoggedIn'));
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    setUser(null);
    setCartCount(0);
    // Dispatch event for logout
    window.dispatchEvent(new Event('userLoggedOut'));
  };

  // Listen for storage changes and cart updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
        updateCartCount();
      } else if (e.key === 'cart') {
        updateCartCount();
      }
    };

    const handleCartUpdate = () => {
      updateCartCount();
    };

    const handleUserLogin = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        updateCartCount();
      }
    };

    const handleUserLogout = () => {
      setUser(null);
      setCartCount(0);
    };

    // Initial check
    updateCartCount();

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('userLoggedIn', handleUserLogin);
    window.addEventListener('userLoggedOut', handleUserLogout);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('userLoggedIn', handleUserLogin);
      window.removeEventListener('userLoggedOut', handleUserLogout);
    };
  }, []);

  const value = {
    user,
    cartCount,
    login,
    logout,
    updateCartCount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth };
