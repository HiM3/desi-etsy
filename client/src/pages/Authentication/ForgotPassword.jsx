import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const password = watch("password");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      navigate("/login");
    }
  }, [email, navigate]);

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
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          email,
          new_password: data.password,
          confirmpassword: data.confirmPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        toast.success("Password reset successfully! Please login with your new password.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        localStorage.removeItem("email");
        navigate('/login');
      } else {
        toast.error(res.data.message || "Failed to reset password!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(error.res?.data?.message || "Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-12 xs:pt-16 sm:pt-20 bg-[#fdf8f3] px-2 xs:px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg w-full max-w-[420px] transition-all duration-300">
        <h2 className="text-center mb-2 text-xl sm:text-2xl text-gray-800">Reset Your Password</h2>
        <p className="text-center mb-4 sm:mb-6 text-xs sm:text-sm text-gray-500">Enter your new password below</p>

        <div className="mb-3">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters"
                }
              })}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 text-sm sm:text-[15px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-3">
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
              })}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-gray-300 text-sm sm:text-[15px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-xs sm:text-sm"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 sm:py-3.5 bg-[#d35400] text-white text-sm sm:text-base rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#b34700] hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </button>

        <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-[#d35400] font-semibold hover:text-[#b34700] transition-colors">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;