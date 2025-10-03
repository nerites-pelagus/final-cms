"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

export default function AccountList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    const res = await fetch("/api/accounts");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const handleDelete = async (id: number, role: string) => {
    if (role === "Admin") {
      alert("Không thể xóa tài khoản Admin!");
      return;
    }
    if (!confirm("Bạn có chắc muốn xóa tài khoản này?")) return;

    const res = await fetch("/api/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
    } else {
      alert("Xóa thất bại");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          👤 Quản trị tài khoản
        </h1>
        <Link
          href="/admin/accounts/create"
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow hover:scale-105 transition"
        >
          + Tạo tài khoản
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm uppercase tracking-wider">
              <th className="p-3 text-center w-[60px]">ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Vai trò</th>
              <th className="p-3 text-center">Ngày tạo</th>
              <th className="p-3 text-center w-[180px]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr
                key={u.id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition`}
              >
                <td className="p-3 text-center">{u.id}</td>
                <td className="p-3">{u.email}</td>
                <td>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      u.role === "Admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-center text-sm text-gray-600">
                  {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3 flex justify-center space-x-2">
                  <Link
                    href={`/admin/accounts/${u.id}/edit`}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(u.id, u.role)}
                    disabled={u.role === "Admin"} // ✅ nếu là Admin thì disable
                    className={`px-3 py-1 text-sm rounded-lg shadow transition ${
                      u.role === "Admin"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Không có tài khoản nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
