import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          username: data.username,
          email: data.email,
          gender: data.gender,
          password: data.password,
          role: data.role
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        toast.success("Registration successful! Please verify your email.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        localStorage.setItem("email", data.email);
        localStorage.setItem("type", "signup");
        navigate('/verifyOTP');
      } else {
        toast.error(res.data.message || "Registration failed!", {
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
            Create Account ✨
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8 text-sm text-gray-500"
          >
            Join our community of artisans and customers
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4"
          >
            <input
              type="text"
              placeholder="Username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters"
                }
              })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-[15px] transition-all duration-300 focus:outline-none focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400]/20 bg-white"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-4"
          >
            <select
              {...register("gender", { required: "Please select your gender" })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-[15px] transition-all duration-300 focus:outline-none focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400]/20 bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-4"
          >
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === watch('password') || "Passwords do not match"
              })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-[15px] transition-all duration-300 focus:outline-none focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400]/20 bg-white"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-6"
          >
            <select
              {...register("role", { required: "Please select your role" })}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-[15px] transition-all duration-300 focus:outline-none focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400]/20 bg-white"
            >
              <option value="">Select Role</option>
              <option value="user">Customer</option>
              <option value="artisan">Artisan</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#d35400] text-white text-base font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#b34700] hover:-translate-y-0.5 disabled:bg-[#d35400]/50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center mt-6 text-sm text-gray-600"
          >
            Already have an account?{" "}
            <Link to="/login" className="text-[#d35400] font-semibold hover:text-[#b34700] transition-colors">
              Login
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
