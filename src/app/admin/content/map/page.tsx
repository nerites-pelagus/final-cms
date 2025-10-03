"use client";

import { useState } from "react";

export default function ContentManagement() {

    const [embedCode, setEmbedCode] = useState(
    `<iframe src="https://www.google.com/maps/embed?pb=!1m18!..." width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
  );

    return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b">
            Cấu hình Google Map
          </h1>
          
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
          
          <div className="aspect-w-16 aspect-h-9 border rounded-lg overflow-hidden bg-gray-100" dangerouslySetInnerHTML={{ __html: embedCode }} />
        </div>
      </div>
    </div>
  );
}