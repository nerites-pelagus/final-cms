"use client";

import { useEffect, useState } from "react";

export default function ContentManagement() {
  const [embedCode, setEmbedCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMapCode = async () => {
      try {
        const res = await fetch('/api/google-map');
        const data = await res.json();
        setEmbedCode(data.embedCode);
      } catch (error) {
        console.error("Failed to fetch map code:", error);
        alert("Không thể tải mã nhúng Google Map.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMapCode();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/google-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embedCode }),
      });
      if (!res.ok) throw new Error("Server error");
      alert("Lưu thành công!");
    } catch (error) {
      console.error("Failed to save map code:", error);
      alert("Đã có lỗi xảy ra khi lưu.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải cấu hình...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Cấu hình Google Map
            </h1>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Lưu thay đổi
            </button>
          </div>
          
          <div className="mb-8">
            <label htmlFor="embedCode" className="block text-sm font-medium text-gray-700 mb-2">
              Dán mã nhúng (Embed Code) từ Google Map:
            </label>
            <textarea
              id="embedCode"
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 h-40 font-mono text-sm focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="<iframe src=... ></iframe>"
            />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Xem trước</h2>
          <div
            className="aspect-w-16 aspect-h-9 border rounded-lg overflow-hidden bg-gray-100"
            dangerouslySetInnerHTML={{ __html: embedCode }}
          />
        </div>
      </div>
    </div>
  );
}