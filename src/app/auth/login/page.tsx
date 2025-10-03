"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      window.location.href = "/admin";
    } else {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          CMS
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          type="submit"
          className="bg-[#006400] hover:bg-[#228B22] text-white w-full py-3 rounded-lg font-semibold shadow-md transition"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
