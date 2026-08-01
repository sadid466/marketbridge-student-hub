"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-10">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Join the DIU Student Marketplace
        </p>

        {/* Student ID */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            DIU Student ID
          </label>

          <input
            type="text"
            placeholder="221-35-XXXX"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Full Name */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 font-medium">
            DIU Email
          </label>

          <input
            type="email"
            placeholder="example@diu.edu.bd"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition">
          Register
        </button>

        {/* Divider */}
        <div className="flex items-center my-7">
          <div className="flex-1 border-t"></div>
          <span className="mx-4 text-gray-400">OR</span>
          <div className="flex-1 border-t"></div>
        </div>

        {/* Google */}
        <button className="w-full border rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
          <FaGoogle className="text-red-500" />
          Continue with Google
        </button>

        {/* Login */}
        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}