import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Authentication/Login';
import Signup from './pages/Authentication/Signup';
import PrivateRoute from './components/PrivateRoute';
import SendOTP from './pages/Authentication/SendOTP';
import VerifyOTP from './pages/Authentication/VerifyOTP';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/sendOTP" element={<SendOTP />} />
          <Route path="/verifyOTP" element={<VerifyOTP />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<div>Profile Page</div>} />
          </Route>

          {/* Artisan Routes */}
          <Route element={<PrivateRoute requireArtisan />}>
            <Route path="/dashboard" element={<div>Artisan Dashboard</div>} />
          </Route>

          {/* Admin Routes */}
          <Route element={<PrivateRoute requireAdmin />}>
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Route>

          {/* Home Route */}
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;