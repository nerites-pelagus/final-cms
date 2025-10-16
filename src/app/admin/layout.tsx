"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaNewspaper,
  FaUsers,
  FaPhone,
  FaImages,
  FaGlobe,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // click ra ngoài để đóng sidebar khi ở mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !collapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [collapsed]);

  const isActive = (path: string) => pathname === path;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/auth/login";
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Nút mở sidebar khi thu gọn */}
      {collapsed && (
        <div
          onClick={() => setCollapsed(false)}
          className="absolute top-4 left-4 z-50 cursor-pointer flex items-center justify-center bg-green-700 hover:bg-green-600 w-12 h-12 rounded-full shadow-lg transition"
        >
          <img src="/favicon.ico" alt="Logo" className="w-6 h-6" />
        </div>
      )}

      {/* SIDEBAR */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static h-full bg-gradient-to-b from-green-800 to-green-700 text-white flex flex-col shadow-xl transition-all duration-500 ease-in-out z-40 ${
          collapsed
            ? "-translate-x-full w-72 md:w-72"
            : "translate-x-0 w-72 md:w-72"
        }`}
      >
        <div
          className="p-4 flex items-center space-x-2 border-b border-white/20 cursor-pointer"
          onClick={() => setCollapsed(true)}
        >
          <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
          <h1 className="text-lg font-bold tracking-wide">QUẢN TRỊ</h1>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent ">
          <ul className="space-y-1">
            {/* === QUẢN TRỊ NỘI DUNG === */}
            <li>
              <div
                onClick={() => toggleMenu("content")}
                className={`p-2 rounded flex items-center justify-between cursor-pointer transition ${
                  openMenu === "content"
                    ? "bg-green-900/50"
                    : "hover:bg-white hover:text-[#006400]"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaGlobe />
                  <span>Quản trị nội dung</span>
                </div>
                <FaChevronDown
                  className={`transition-transform ${
                    openMenu === "content" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openMenu === "content" && (
                <ul className="ml-6 mt-1 space-y-1 text-sm animate-fadeIn">
                  {[
                    ["about", "Về chúng tôi"],
                    ["vision", "Tầm nhìn – Sứ mệnh"],
                    ["infrastructure", "Cơ sở hạ tầng"],
                    ["faq", "Câu hỏi thường gặp"],
                    ["directions", "Hướng dẫn đường đi"],
                    ["social", "Liên kết MXH"],
                    ["map", "Google Map"],
                    ["analytics", "Google Analytics"],
                  ].map(([path, label]) => {
                    const fullPath = `/admin/content/${path}`;
                    return (
                      <li key={path}>
                        <Link
                          href={fullPath}
                          className={`block p-1 rounded transition ${
                            isActive(fullPath)
                              ? "bg-white text-[#006400]"
                              : "hover:bg-white hover:text-[#006400]"
                          }`}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            {/* === QUẢN TRỊ TIN TỨC === */}
            <li>
              <div
                onClick={() => toggleMenu("news")}
                className={`p-2 rounded flex items-center justify-between cursor-pointer transition ${
                  openMenu === "news"
                    ? "bg-green-900/50"
                    : "hover:bg-white hover:text-[#006400]"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaNewspaper />
                  <span>Quản trị tin tức</span>
                </div>
                <FaChevronDown
                  className={`transition-transform ${
                    openMenu === "news" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openMenu === "news" && (
                <ul className="ml-6 mt-1 space-y-1 text-sm animate-fadeIn">
                  {[
                    ["transport", "Tin vận tải"],
                    ["promotion", "Tin khuyến mãi"],
                    ["event", "Sự kiện nổi bật"],
                    ["traffic", "Tin giao thông"],
                    ["authority", "Tin cơ quan quản lý"],
                  ].map(([path, label]) => {
                    const fullPath = `/admin/news/${path}`;
                    return (
                      <li key={path}>
                        <Link
                          href={fullPath}
                          className={`block p-1 rounded transition ${
                            isActive(fullPath)
                              ? "bg-white text-[#006400]"
                              : "hover:bg-white hover:text-[#006400]"
                          }`}
                        >
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            {/* === QUẢN TRỊ TÀI KHOẢN === */}
            <li>
              <Link
                href="/admin/accounts"
                className={`p-2 rounded flex items-center space-x-2 transition ${
                  isActive("/admin/accounts")
                    ? "bg-white text-[#006400]"
                    : "hover:bg-white hover:text-[#006400]"
                }`}
              >
                <FaUsers />
                <span>Quản trị tài khoản</span>
              </Link>
            </li>

            {/* === QUẢN TRỊ LIÊN HỆ === */}
            <li>
              <div
                onClick={() => toggleMenu("contact")}
                className={`p-2 rounded flex items-center justify-between cursor-pointer transition ${
                  openMenu === "contact"
                    ? "bg-green-900/50"
                    : "hover:bg-white hover:text-[#006400]"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaPhone />
                  <span>Quản trị liên hệ</span>
                </div>
                <FaChevronDown
                  className={`transition-transform ${
                    openMenu === "contact" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openMenu === "contact" && (
                <ul className="ml-6 mt-1 space-y-1 text-sm animate-fadeIn">
                  <li>
                    <Link
                      href="/admin/contacts"
                      className={`block p-1 rounded transition ${
                        isActive("/admin/contacts")
                          ? "bg-white text-[#006400]"
                          : "hover:bg-white hover:text-[#006400]"
                      }`}
                    >
                      Danh sách liên hệ
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* === QUẢN TRỊ HÌNH ẢNH & VIDEO === */}
            <li>
              <div
                onClick={() => toggleMenu("media")}
                className={`p-2 rounded flex items-center justify-between cursor-pointer transition ${
                  openMenu === "media"
                    ? "bg-green-900/50"
                    : "hover:bg-white hover:text-[#006400]"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaImages />
                  <span>Quản trị hình ảnh & video</span>
                </div>
                <FaChevronDown
                  className={`transition-transform ${
                    openMenu === "media" ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openMenu === "media" && (
                <ul className="ml-6 mt-1 space-y-1 text-sm animate-fadeIn">
                  <li>
                    <Link
                      href="/admin/media/images"
                      className={`block p-1 rounded transition ${
                        isActive("/admin/media/images")
                          ? "bg-white text-[#006400]"
                          : "hover:bg-white hover:text-[#006400]"
                      }`}
                    >
                      Hình ảnh
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/media/videos"
                      className={`block p-1 rounded transition ${
                        isActive("/admin/media/videos")
                          ? "bg-white text-[#006400]"
                          : "hover:bg-white hover:text-[#006400]"
                      }`}
                    >
                      Video
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-white/20 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full text-green-700 bg-white hover:bg-green-600 hover:text-white hover:border-white py-2 px-3 rounded transition font-semibold border border-green-700"
          >
            <FaSignOutAlt className="mr-2" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-y-auto bg-white">{children}</main>
    </div>
  );
}

/* Animation fade-in */
const style = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`;
if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.innerHTML = style;
  document.head.appendChild(s);
}
