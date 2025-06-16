import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Login Response:', res.data);

      if (res.data.success) {
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));


        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });

        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
          login(user);

        } else if (user.role === 'Artisian') {
          navigate('/dashboard', { replace: true });
          login(user);

        } else {
          navigate('/', { replace: true });
          login(user);

        }
      } else {
        console.error('Login failed:', res.data);
        toast.error(res.data.message || "Login failed!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex justify-center items-center p-4 sm:p-5 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px]"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
          className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full transition-all duration-300"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-2 text-2xl sm:text-3xl font-bold text-gray-800"
          >
            Welcome Back 👋
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-6 sm:mb-8 text-xs sm:text-sm text-gray-500"
          >
            Login to continue shopping
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4"
          >
            <input
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 text-sm sm:text-[15px] transition-all duration-300 focus:outline-none focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400]/20 bg-white"
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-4"
          >
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-gray-200 text-sm sm:text-[15px] transition-all duration-300 focus:outline-none focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400]/20 bg-white"
            />
            {errors.password && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-right mb-4 sm:mb-6"
          >
            <NavLink to="/sendOTP" className="text-xs sm:text-sm text-[#d35400] hover:text-[#b34700] transition-colors">
              Forgot Password?
            </NavLink>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-3.5 bg-[#d35400] text-white text-sm sm:text-base font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#b34700] hover:-translate-y-0.5 disabled:bg-[#d35400]/50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600"
          >
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-[#d35400] font-semibold hover:text-[#b34700] transition-colors">
              Sign Up
            </NavLink>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
