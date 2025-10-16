"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Post {
  id: string;
  title: string;
  publishedAt: string;
  description: string;
  content: string;
  language: string;
  isVisible: boolean;
}

export default function TransportNewsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadPosts() {
    const res = await fetch("/api/news?category=transport");
    const data = await res.json();
    setPosts(data);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/news?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Đã xóa thành công ");
      } else {
        const err = await res.json();
        alert("Xóa thất bại: " + (err.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Đã xảy ra lỗi khi xóa bài viết!");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                Quản lý Tin Phương Tiện
              </h1>
              <Link
                href="/admin/news/transport/create"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#006400] hover:bg-[#228B22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                + Thêm tin mới
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ngày đăng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nội dung
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ngôn ngữ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => setSelectedPost(p)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {p.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(p.publishedAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {p.description || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {p.content || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {p.language || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.isVisible ? (
                          <span className="px-2 inline-flex text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                            Hiển thị
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs font-semibold leading-5 rounded-full bg-gray-100 text-gray-800">
                            Ẩn
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <Link
                          href={`/admin/news/transport/edit/${p.id}`}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaEdit className="mr-1" /> Sửa
                        </Link>
                        <button
                          className="text-red-600 hover:text-red-800 inline-flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p.id); 
                          }}
                        >
                          <FaTrash className="mr-1" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {posts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Không có bài viết nào.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
            <p className="text-gray-500 mb-2">
              Ngày đăng:{" "}
              {new Date(selectedPost.publishedAt).toLocaleDateString("vi-VN")}
            </p>
            <p className="mb-4">
              <strong>Mô tả:</strong> {selectedPost.description || "—"}
            </p>
            <p className="mb-4 whitespace-pre-wrap">
              <strong>Nội dung:</strong> {selectedPost.content || "—"}
            </p>
            <p className="mb-4">
              <strong>Ngôn ngữ:</strong> {selectedPost.language || "—"}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              {selectedPost.isVisible ? "Hiển thị" : "Ẩn"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
