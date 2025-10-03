"use client";

import { useEffect, useState } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function ContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📩 Danh sách yêu cầu liên hệ</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-[#006400] text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Họ tên</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Nội dung</th>
              <th className="px-4 py-2 text-left">Ngày gửi</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{c.id}</td>
                  <td className="px-4 py-2 font-medium">{c.name}</td>
                  <td className="px-4 py-2 text-blue-600">{c.email}</td>
                  <td className="px-4 py-2">{c.message}</td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Không có dữ liệu liên hệ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>  
    </div>
  );
}
