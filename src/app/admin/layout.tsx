"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaNewspaper,
  FaUsers,
  FaPhone,
  FaImages,
  FaGlobe,
  FaSignOutAlt,
} from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  }

  return (
    <div className="flex h-screen bg-gray-100">
      
      <aside className="w-72 bg-[#006400] text-white flex flex-col shadow-md">
        <div className="p-4 flex items-center space-x-2 border-b border-white/30">
          <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
          <h1 className="text-lg font-bold tracking-wide">QUẢN TRỊ</h1>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            <li>
              <div
                onClick={() => toggleMenu("content")}
                className="p-2 hover:bg-[#228B22] rounded flex items-center space-x-2 cursor-pointer transition"
              >
                <FaGlobe /> <span>Quản trị nội dung</span>
              </div>
              {openMenu === "content" && (
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>
                    <Link
                      href="/admin/content/about"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Về chúng tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/content/vision"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Tầm nhìn – Sứ mệnh
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/content/infrastructure"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Cơ sở hạ tầng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/content/faq"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Câu hỏi thường gặp
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/content/directions"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Hướng dẫn đường đi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/content/social"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Liên kết MXH
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/content/map"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Google Map
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/content/analytics"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Google Analytics
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <div
                onClick={() => toggleMenu("news")}
                className="p-2 hover:bg-[#228B22] rounded flex items-center space-x-2 cursor-pointer transition"
              >
                <FaNewspaper /> <span>Quản trị tin tức</span>
              </div>
              {openMenu === "news" && (
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>
                    <Link
                      href="/admin/news/transport"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Tin vận tải
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/news/promotion"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Tin khuyến mãi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/news/event"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Sự kiện nổi bật
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/news/traffic"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Tin giao thông
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/news/authority"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Tin cơ quan quản lý
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/admin/accounts"
                className="p-2 hover:bg-[#228B22] rounded flex items-center space-x-2 transition"
              >
                <FaUsers /> <span>Quản trị tài khoản</span>
              </Link>
            </li>

            <li>
              <div
                onClick={() => toggleMenu("contact")}
                className="p-2 hover:bg-[#228B22] rounded flex items-center space-x-2 cursor-pointer transition"
              >
                <FaPhone /> <span>Quản trị liên hệ</span>
              </div>
              {openMenu === "contact" && (
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>
                    <Link
                      href="/admin/contacts"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Danh sách liên hệ
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <div
                onClick={() => toggleMenu("media")}
                className="p-2 hover:bg-[#228B22] rounded flex items-center space-x-2 cursor-pointer transition"
              >
                <FaImages /> <span>Quản trị hình ảnh & video</span>
              </div>
              {openMenu === "media" && (
                <ul className="ml-6 mt-1 space-y-1 text-sm">
                  <li>
                    <Link
                      href="/admin/media/images"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Hình ảnh
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/media/videos"
                      className="block p-1 hover:bg-[#228B22] rounded"
                    >
                      Video
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-white/30 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-[150px] text-[#006400] bg-white hover:bg-[#228B22] py-2 px-3 rounded transition font-semibold border border-[#006400]"
          >
            <FaSignOutAlt className="mr-2" /> Đăng xuất
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto bg-white">{children}</main>
    </div>
  );
}
