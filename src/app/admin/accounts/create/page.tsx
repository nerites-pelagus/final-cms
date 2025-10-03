"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAccount() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    if (res.ok) {
      router.push("/admin/accounts");
    } else {
      alert("Có lỗi xảy ra khi tạo tài khoản");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        ➕ Tạo tài khoản mới
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="user@cms.com"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Mật khẩu</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="••••••"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Vai trò</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => router.push("/admin/accounts")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:scale-105 transition"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
