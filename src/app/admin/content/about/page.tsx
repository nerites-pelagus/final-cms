"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { FaUpload, FaImage, FaTrashAlt } from "react-icons/fa";

export default function AboutUsPage() {
  const [form, setForm] = useState({
    company_name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    logo_url: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Vui lòng chọn ảnh nhỏ hơn 2MB!");
      return;
    }
    setLogoFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("company_name", form.company_name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("address", form.address);
    formData.append("description", form.description);

    if (logoFile) formData.append("logo_file", logoFile);

    const res = await fetch("/api/about", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Lưu thành công!");
      window.location.reload();
    } else {
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-[#006400]">Giới thiệu công ty</h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-800">Tên Công ty</label>
            <input
              type="text"
              placeholder="Tên công ty"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-800">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-800">Số điện thoại</label>
            <input
              type="text"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-800">Địa chỉ</label>
            <input
              type="text"
              placeholder="Địa chỉ"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-800">Mô tả</label>
          <textarea
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#006400] shadow-sm"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-800">
            Tải lên Logo
          </label>
          <div className="group relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:border-green-500 hover:bg-green-50 transition-all duration-300">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FaUpload className="text-3xl text-gray-400 mb-2 group-hover:text-green-600 transition" />
            <p className="text-gray-600 text-sm text-center">
              Kéo thả hoặc <span className="font-semibold text-green-600">chọn ảnh</span> từ thiết bị
            </p>
            <p className="text-xs text-gray-400 mt-1">Hỗ trợ ảnh ≤ 2MB</p>
          </div>

          {(previewUrl || form.logo_url) && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2 text-center">
                <FaImage className="inline-block mr-1" />
                Xem trước logo
              </p>
              <div className="relative group w-48 h-48 mx-auto flex items-center justify-center">
                <img
                  src={previewUrl || form.logo_url}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain border-2 border-dashed border-gray-200 rounded-xl p-2 bg-white shadow-sm"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-transform group-hover:scale-100 scale-75"
                    title="Xóa ảnh"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Xem trước trang "Giới thiệu"</h2>
        <div className="border-4 border-gray-200 rounded-2xl p-6 bg-white shadow-lg max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {(previewUrl || form.logo_url) && (
              <img
                src={previewUrl || form.logo_url}
                alt="Logo"
                className="w-24 h-24 object-contain rounded-lg border p-1 bg-white shadow-sm flex-shrink-0"
              />
            )}
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-[#006400]">
                {form.company_name || "Tên công ty"}
              </h3>
              <p className="text-gray-600 mt-1">{form.address || "Địa chỉ"}</p>
              <p className="text-gray-600 text-sm">
                {form.email || "Email"} – {form.phone || "Số điện thoại"}
              </p>
            </div>
          </div>
          <p className="text-gray-700 mt-4 pt-4 border-t border-gray-200">
            {form.description || "Mô tả công ty sẽ hiển thị ở đây."}
          </p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-6 py-3 bg-[#006400] text-white font-semibold rounded-lg shadow hover:bg-[#228B22] transition"
      >
        Lưu thông tin
      </button>
    </div>
  );
}
