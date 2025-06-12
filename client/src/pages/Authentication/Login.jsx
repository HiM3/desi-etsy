import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });

        // Redirect based on user role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'Artisian') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      } else {
        toast.error(res.data.message || "Login failed!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex justify-center items-center p-5 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px]"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-2xl shadow-xl w-full transition-all duration-300">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-2.5 text-3xl font-bold text-gray-800"
          >
            Welcome Back 👋
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8 text-sm text-gray-500"
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
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-[15px] transition-all duration-300 focus:outline-none focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400]/20 bg-white"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-[15px] transition-all duration-300 focus:outline-none focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400]/20 bg-white"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-right mb-6"
          >
            <Link to="/sendOTP" className="text-sm text-[#d35400] hover:text-[#b34700] transition-colors">
              Forgot Password?
            </Link>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#d35400] text-white text-base font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#b34700] hover:-translate-y-0.5 disabled:bg-[#d35400]/50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mt-6 text-sm text-gray-600"
          >
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#d35400] font-semibold hover:text-[#b34700] transition-colors">
              Sign Up
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
