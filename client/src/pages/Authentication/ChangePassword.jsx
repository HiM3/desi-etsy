import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const newPassword = watch("new_password");

  const onSubmit = async (data) => {
    if (data.new_password !== data.confirmpassword) {
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
        `${import.meta.env.VITE_API_URL}/auth/change-password`,
        {
          current_password: data.current_password,
          new_password: data.new_password,
          confirmpassword: data.confirmpassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (res.data.success) {
        toast.success("Password changed successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        navigate('/login');
      } else {
        toast.error(res.data.message || "Password change failed!", {
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
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-[420px] transition-all duration-300">
        <h2 className="text-center mb-2.5 text-2xl text-gray-800">Change Password</h2>
        <p className="text-center mb-6 text-sm text-gray-500">Enter your new password</p>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Current Password"
            {...register("current_password", {
              required: "Current password is required"
            })}
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] transition-colors duration-200 focus:outline-none focus:border-teal-600 bg-white"
          />
          {errors.current_password && (
            <p className="text-red-500 text-sm mt-1">{errors.current_password.message}</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="New Password"
            {...register("new_password", {
              required: "New password is required"
            })}
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] transition-colors duration-200 focus:outline-none focus:border-teal-600 bg-white"
          />
          {errors.new_password && (
            <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Confirm New Password"
            {...register("confirmpassword", {
              required: "Please confirm your password",
              validate: value => value === newPassword || "Passwords do not match"
            })}
            className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-[15px] transition-colors duration-200 focus:outline-none focus:border-teal-600 bg-white"
          />
          {errors.confirmpassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmpassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-[#d35400] text-white text-base rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#b34700] hover:-translate-y-0.5 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Changing Password..." : "Change Password"}
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-[#d35400] font-semibold hover:text-[#b34700] transition-colors">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default ChangePassword; 