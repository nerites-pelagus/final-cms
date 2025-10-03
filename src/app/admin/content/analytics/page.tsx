"use client";

import { useState } from "react";

export default function ContentManagement() {
  const [analyticsCode, setAnalyticsCode] = useState("");  

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b">
            Cấu hình Google Analytics
          </h1>
          
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
