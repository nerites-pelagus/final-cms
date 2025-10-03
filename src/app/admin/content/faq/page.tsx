"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function ContentManagement()  {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    { question: "Làm sao để đặt vé?", answer: "Bạn có thể đặt vé trực tuyến qua website hoặc ứng dụng di động." },
    { question: "Có hỗ trợ hoàn vé không?", answer: "Có, bạn được hoàn vé trước 24h khởi hành." }
  ]);

  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [customCSS, setCustomCSS] = useState(
    `details { background: #f9fafb; padding: 10px; border-radius: 6px; }
summary { cursor: pointer; font-weight: bold; }
summary:hover { color: #2563eb; }
p { margin-top: 8px; }`
  );

  const addFAQ = () => {
    if (!newQ || !newA) return;
    setFaqs([...faqs, { question: newQ, answer: newA }]);
    setNewQ("");
    setNewA("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">FAQ – Câu hỏi thường gặp</h1>

      {/* Form nhập FAQ mới */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Câu hỏi"
          value={newQ}
          onChange={(e) => setNewQ(e.target.value)}
          className="border p-2 mr-2 rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Câu trả lời"
          value={newA}
          onChange={(e) => setNewA(e.target.value)}
          className="border p-2 mr-2 rounded w-1/2"
        />
        <button onClick={addFAQ} className="bg-[#006400] text-white px-4 py-2 rounded">
          Thêm
        </button>
      </div>

      {/* Custom CSS */}
      <label className="block font-semibold mb-2">Tuỳ chỉnh CSS cho FAQ:</label>
      <textarea
        value={customCSS}
        onChange={(e) => setCustomCSS(e.target.value)}
        className="w-full border rounded p-2 h-40 font-mono text-sm"
      />

      {/* Preview */}
      <h2 className="text-lg font-bold mt-6 mb-2">Xem trước FAQ:</h2>
      <div className="space-y-2">
        <style>{customCSS}</style>
        {faqs.map((faq, idx) => (
          <details key={idx} className="faq-item">
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
