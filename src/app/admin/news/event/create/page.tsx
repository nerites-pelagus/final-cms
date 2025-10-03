"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditEventNews() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const res = await fetch(`/api/news/${id}`);
          if (!res.ok) throw new Error("Failed to fetch post");
          const data = await res.json();
          setTitle(data.title);
          setDescription(data.description);
          setContent(data.content);
          setIsVisible(data.isVisible);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    await fetch(`/api/news/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, content, isVisible }),
    });
    setIsSubmitting(false);
    router.push("/admin/news/event");
  }

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b">
              Chỉnh sửa tin tức sự kiện
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                <input type="text" id="title" placeholder="Nhập tiêu đề bài viết" className="w-full border-gray-300 rounded-lg shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
                <textarea id="description" placeholder="Mô tả ngắn gọn về nội dung bài viết" className="w-full border-gray-300 rounded-lg shadow-sm p-3 h-24 focus:ring-blue-500 focus:border-blue-500 transition" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                <textarea id="content" placeholder="Soạn thảo nội dung chi tiết tại đây" className="w-full border-gray-300 rounded-lg shadow-sm p-3 h-48 focus:ring-blue-500 focus:border-blue-500 transition" value={content} onChange={(e) => setContent(e.target.value)} />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input id="isVisible" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isVisible" className="font-medium text-gray-700">Hiển thị bài viết</label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">Hủy</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition">
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}