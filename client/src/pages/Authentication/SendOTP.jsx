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
      // Call your backend API to send the reset email
    };
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-white flex justify-center items-center p-5 font-sans">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-xl shadow-lg w-full max-w-[420px]">
        <h2 className="text-center text-2xl mb-2.5 text-gray-800">Reset Your Password 🔐</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: true })}
          className="w-full px-4 py-3.5 my-3 rounded-lg border border-gray-300 text-[15px] transition-colors duration-200 focus:outline-none focus:border-teal-600 bg-white"
        />

        <button 
          type="submit" 
          className="w-full py-3.5 bg-teal-700 text-white text-base rounded-lg cursor-pointer transition-colors duration-300 hover:bg-teal-800"
        >
          Send One Time Password
        </button>

        <p className="text-center mt-6 text-sm text-gray-600">
          Remember your password?{" "}
          <a href="/login" className="text-teal-700 font-semibold hover:text-teal-800 transition-colors">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SendOTP;
