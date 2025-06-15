import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SendOTP = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, data)
      if (res.data.success) {
        toast.success("OTP sent on the Email", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        })
        localStorage.setItem("type", "forgot-password");
        localStorage.setItem("email", data.email);
        navigate("/verifyOTP")
      }

    }
    catch (error) {
      toast.error(error.res?.data?.message || "Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    };
  }
  return (
    <div className="min-h-screen bg-[#fdf8f3] flex justify-center items-center p-4 sm:p-5 font-sans">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg w-full max-w-[420px] transition-all duration-300">
        <h2 className="text-center text-xl sm:text-2xl mb-2 text-gray-800">Reset Your Password 🔐</h2>
        <p className="text-center text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: true })}
          className="w-full px-3 sm:px-4 py-3 sm:py-3.5 my-2 sm:my-3 rounded-xl border border-gray-300 text-sm sm:text-[15px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#d35400] focus:border-transparent bg-white"
        />

        <button
          type="submit"
          className="w-full py-3 sm:py-3.5 bg-[#d35400] text-white text-sm sm:text-base rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#b34700] hover:-translate-y-0.5 shadow-md hover:shadow-lg"
        >
          Send One Time Password
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

export default SendOTP;
