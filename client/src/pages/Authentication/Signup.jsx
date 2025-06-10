import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          username: data.username,
          email: data.email,
          password: data.password,
          gender: data.gender,
          role: data.role
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (res.data.success) {
        toast.success("Account created! Please verify your email with the OTP sent.", {
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white flex justify-center items-center p-5 font-sans">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-xl shadow-lg w-full max-w-[450px]">
        <h2 className="text-2xl text-center mb-6 text-gray-800">Create Your Account</h2>

        <div className="mb-3">
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
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] outline-none focus:border-teal-600 transition-colors bg-white"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email Address"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] outline-none focus:border-teal-600 transition-colors bg-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-3">
          <select
            {...register("gender", { required: "Please select your gender" })}
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] outline-none focus:border-teal-600 transition-colors bg-white"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
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
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] outline-none focus:border-teal-600 transition-colors bg-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", { 
              required: "Please confirm your password",
              validate: value => value === password || "Passwords do not match"
            })}
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] outline-none focus:border-teal-600 transition-colors bg-white"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="mb-3">
          <select
            {...register("role", { required: "Please select your role" })}
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] outline-none focus:border-teal-600 transition-colors bg-white"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="Artisian">Artisian</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-teal-700 text-white text-base rounded-lg cursor-pointer mt-5 hover:bg-teal-800 transition-colors disabled:bg-teal-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-teal-700 font-bold no-underline hover:text-teal-800">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
