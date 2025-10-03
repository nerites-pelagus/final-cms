"use client";

import { useEffect, useState } from "react";

export default function AboutUsPage() {
  const [form, setForm] = useState({
    company_name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    logo_url: "",
  });

  useEffect(() => {
    fetch("/api/about")
      .then(async (res) => {
        if (!res.ok) return {};
        try {
          return await res.json();
        } catch {
          return {};
        }
      })
      .then((data) => {
        if (data) setForm(data);
      });
  }, []);

  const handleSubmit = async () => {
    const res = await fetch("/api/about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Lưu thành công!");
    } else {
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#006400]">
        Giới thiệu công ty
      </h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Tên công ty"
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
        />
        <input
          type="text"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
        />
        <textarea
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg col-span-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={form.logo_url}
          onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
          className="border border-gray-300 p-3 rounded-lg col-span-2 focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
        />
      </div>

      {/* Preview */}
      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-700">
        Xem trước
      </h2>
      <div className="border rounded-lg p-6 bg-gray-50 shadow-md">
        <h3 className="text-xl font-bold text-[#006400]">
          {form.company_name || "Tên công ty"}
        </h3>
        <p className="text-gray-700 mt-2">
          {form.description || "Mô tả công ty sẽ hiển thị ở đây."}
        </p>
        <p className="text-gray-600 mt-1">{form.address || "Địa chỉ"}</p>
        <p className="text-gray-600">
          {form.email || "Email"} – {form.phone || "Số điện thoại"}
        </p>
        {form.logo_url && (
          <img
            src={form.logo_url}
            alt="Logo"
            className="h-20 mt-4 rounded shadow"
          />
        )}
      </div>

      {/* Save button */}
      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-[#006400] text-white font-semibold rounded-lg shadow hover:bg-[#228B22] transition"
      >
        Lưu thông tin
      </button>
    </div>
  );
}
