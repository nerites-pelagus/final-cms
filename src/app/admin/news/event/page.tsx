"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Post {
  id: string;
  title: string;
  publishedAt: string;
  isVisible: boolean;
}

export default function EventNewsManagement() {
  const [posts, setPosts] = useState<Post[]>([]);

  async function loadPosts() {
    const res = await fetch("/api/news?category=event");
    const data = await res.json();
    setPosts(data);
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
                Quản lý Tin tức Sự kiện
              </h1>
              <Link
                href="/admin/news/event/create"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#006400] hover:bg-[#228B22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                + Thêm tin mới
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Hành động</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{p.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(p.publishedAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.isVisible ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Hiển thị</span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Ẩn</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <Link href={`/admin/news/event/edit/${p.id}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center"><FaEdit className="mr-1" /> Sửa</Link>
                        <button className="text-red-600 hover:text-red-800 inline-flex items-center"><FaTrash className="mr-1" /> Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}