import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-white flex justify-center items-center p-5 font-sans">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-xl shadow-lg w-full max-w-[420px] transition-all duration-300">
        <h2 className="text-center mb-2.5 text-2xl text-gray-800">Welcome Back 👋</h2>
        <p className="text-center mb-6 text-sm text-gray-500">Login to continue shopping</p>

        <div className="mb-3">
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
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] transition-colors duration-200 focus:outline-none focus:border-teal-600 bg-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-3">
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
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] transition-colors duration-200 focus:outline-none focus:border-teal-600 bg-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="text-right mb-4">
          <a href="/sendOTP" className="text-sm text-teal-700 hover:text-teal-800 transition-colors">
            Forgot Password?
          </a>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-teal-700 text-white text-base rounded-lg cursor-pointer mt-2.5 transition-colors duration-300 hover:bg-teal-800 disabled:bg-teal-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-teal-700 font-semibold hover:text-teal-800 transition-colors">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
