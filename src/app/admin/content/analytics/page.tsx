"use client";

import { useEffect, useState } from "react";

export default function ContentManagement() {
  const [analyticsCode, setAnalyticsCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsCode = async () => {
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error("Server fetch failed");
        const data = await res.json();
        setAnalyticsCode(data.analyticsCode);
      } catch (error) {
        console.error("Failed to fetch analytics code:", error);
        alert("Không thể tải mã Google Analytics.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalyticsCode();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analyticsCode }),
      });
      if (!res.ok) throw new Error("Server save failed");
      alert("Lưu thành công!");
    } catch (error) {
      console.error("Failed to save analytics code:", error);
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
              Cấu hình Google Analytics
            </h1>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Lưu thay đổi
            </button>
          </div>
          
          <div className="mb-8">
            <label htmlFor="analyticsCode" className="block text-sm font-medium text-gray-700 mb-2">
              Google Analytics (GA4 Measurement ID hoặc Script):
            </label>
            <textarea
              id="analyticsCode"
              value={analyticsCode}
              onChange={(e) => setAnalyticsCode(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm p-3 h-48 font-mono text-sm focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="G-XXXXXXXXXX hoặc <script>...</script>"
            />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Xem trước mã đã nhập</h2>
          <div className="bg-gray-900 text-green-400 text-sm p-4 rounded-lg overflow-x-auto">
            <pre>
              <code>{analyticsCode || "// Mã của bạn sẽ hiển thị ở đây..."}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}