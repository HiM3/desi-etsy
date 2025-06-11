import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(180);
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef([]);
  const email = localStorage.getItem("email");
  const type = localStorage.getItem("type");
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/login");
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.every((char) => /^\d?$/.test(char))) {
      const newOtp = [...otp];
      pastedData.forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-signup-otp`,
        {
          email,
          otp: otpString,
          type
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        toast.success("Email verified successfully!");

        if (type === "forgot-password") {
          // localStorage.setItem("otp", otpString);
          navigate("/forgot-password");
          localStorage.removeItem("type");
        } else if (type === "signup") {
          localStorage.removeItem("email");
          localStorage.removeItem("type");
          navigate("/login");
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("type");
          navigate("/");
        }
      } else {
        toast.error(res.data.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error.res?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (timer > 0) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-otp`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        toast.success("OTP resent successfully!");
        setOtp(["", "", "", "", "", ""]);
        setTimer(180);
      } else {
        toast.error(res.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = () => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex justify-center items-center p-5 font-sans">
      <form className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-[420px] text-center transition-all duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">OTP Verification</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter the 6-digit OTP sent to <span className="font-semibold">{email || "your email"}</span>
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className="w-12 h-14 text-xl text-center rounded-xl border border-gray-300 focus:border-[#d35400] focus:ring-2 focus:ring-[#d35400] outline-none transition-all duration-200 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={verifyOTP}
          disabled={isLoading || otp.join("").length !== 6}
          className="w-full py-3.5 bg-[#d35400] text-white text-base font-medium rounded-xl cursor-pointer transition-all duration-300 hover:bg-[#b34700] hover:-translate-y-0.5 shadow-md hover:shadow-lg focus:ring-2 focus:ring-[#d35400] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-6 text-sm text-gray-600">
          Didn't get the code?
          <button
            type="button"
            onClick={resendOTP}
            disabled={timer > 0 || isLoading}
            className={`ml-1 font-semibold ${timer > 0 || isLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#d35400] hover:text-[#b34700] cursor-pointer"
              }`}
          >
            Resend
          </button>
          {timer > 0 && (
            <span className="ml-1 text-gray-500">({formatTime()} remaining)</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default VerifyOTP;
