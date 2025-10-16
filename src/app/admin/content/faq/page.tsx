"use client";

import { useEffect, useState } from "react";

interface FAQItem {
  id?: number;
  question: string;
  answer: string;
}

export default function ContentManagement() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [customCSS, setCustomCSS] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); 

  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/faq");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setFaqs(data.faqs);
      setCustomCSS(data.customCSS);
    } catch (error) {
      console.error("Could not fetch data", error);
      alert("Không thể tải dữ liệu FAQ!"); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addFAQ = () => {
    if (!newQ.trim() || !newA.trim()) { 
      alert("Câu hỏi và câu trả lời không được để trống.");
      return;
    }
    const tempId = Date.now() + Math.random();
    setFaqs([...faqs, { id: tempId, question: newQ.trim(), answer: newA.trim() }]);
    setNewQ("");
    setNewA("");
  };
  
  const removeFAQ = (idToRemove: number) => {
    setFaqs(faqs.filter((faq) => faq.id !== idToRemove));
  };
  
  const handleSave = async () => {
    setIsSaving(true); 
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          faqs: faqs.map(({ id, ...rest }) => rest), 
          customCSS 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Server responded with an error");
      }

      alert("Lưu thành công!");
      await fetchData();
    } catch (error) {
      console.error("Failed to save data", error); 
      if (error instanceof Error) {
        alert(`Đã có lỗi xảy ra khi lưu: ${error.message}`);
      } else {
        alert(`Đã có lỗi xảy ra khi lưu: ${String(error)}`);
      }
    } finally {
      setIsSaving(false); 
    }
  };
  
  if (isLoading) {
    return <div className="p-6">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#006400]">Quản lý FAQ</h1>
        <button
          onClick={handleSave}
          className="bg-[#006400] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#228B22] transition-colors"
          disabled={isSaving}
        >
          Lưu tất cả thay đổi
        </button>
      </div>

      <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3 text-[#006400]" >Thêm FAQ mới</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Câu hỏi"
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
            className="border p-2 rounded flex-grow"
          />
          <input
            type="text"
            placeholder="Câu trả lời"
            value={newA}
            onChange={(e) => setNewA(e.target.value)}
            className="border p-2 rounded flex-grow"
          />
          <button onClick={addFAQ} className="bg-[#006400] text-white px-4 py-2 rounded shrink-0 hover:bg-[#228B22] transition-colors">
            Thêm
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-lg">Tuỳ chỉnh CSS cho FAQ:</label>
        <textarea
          value={customCSS}
          onChange={(e) => setCustomCSS(e.target.value)}
          className="w-full border rounded p-3 h-40 font-mono text-sm shadow-sm"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mt-6 mb-4">Danh sách & Xem trước:</h2>
        <div className="space-y-3">
          <style>{customCSS}</style>
          {faqs.map((faq, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <details className="faq-item flex-grow">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
              <button
                onClick={() => removeFAQ(idx)}
                className="text-red-500 hover:text-red-700 font-bold text-xl px-2 py-1"
                title="Xóa FAQ"
              >
                &times;
              </button>
            </div>
          ))}
          {faqs.length === 0 && <p className="text-gray-500">Chưa có FAQ nào.</p>}
        </div>
      </div>
    </div>
  );
}