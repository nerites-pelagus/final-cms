"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditAccount() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/accounts");
      const data = await res.json();
      const user = data.find((u: any) => u.id === id);
      if (user) {
        setEmail(user.email);
        setRole(user.role);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/accounts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email, role }),
    });
    if (res.ok) {
      router.push("/admin/accounts");
    } else {
      alert("Sửa thất bại");
    }
  };

  if (loading) return <p className="p-6">Đang tải...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        ✏️ Sửa tài khoản
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
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Vai trò
          </label>
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
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:scale-105 transition"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}
