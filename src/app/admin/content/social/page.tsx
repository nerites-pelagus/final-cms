"use client";

import { useEffect, useState } from "react";
import { FaFacebook, FaFacebookMessenger, FaYoutube, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const socialPlatforms = [
  { name: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'text-blue-600', placeholder: 'https://facebook.com/yourpage' },
  { name: 'messenger', label: 'Messenger', icon: FaFacebookMessenger, color: 'text-blue-500', placeholder: 'https://m.me/yourpage' },
  { name: 'zalo', label: 'Zalo', icon: SiZalo, color: 'text-cyan-600', placeholder: 'https://zalo.me/123456789' },
  { name: 'youtube', label: 'YouTube', icon: FaYoutube, color: 'text-red-600', placeholder: 'https://youtube.com/@yourchannel' },
  { name: 'tiktok', label: 'TikTok', icon: FaTiktok, color: 'text-black', placeholder: 'https://tiktok.com/@yourprofile' },
];

type SocialLinks = {
  [key: string]: string;
};

export default function SocialLinksManagement() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch('/api/social-links');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSocialLinks(data);
      } catch (error) {
        console.error("Error fetching social links:", error);
        alert("Không thể tải dữ liệu mạng xã hội!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Lưu thông tin thành công!");
    } catch (error) {
      console.error("Error saving social links:", error);
      alert("Đã có lỗi xảy ra khi lưu!");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Cấu hình Mạng xã hội
            </h1>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Lưu thay đổi
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mb-8">
            {socialPlatforms.map((platform) => (
              <div key={platform.name}>
                <label htmlFor={platform.name} className="block text-sm font-medium text-gray-700 mb-2">
                  {platform.label}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <platform.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="url"
                    name={platform.name}
                    id={platform.name}
                    value={socialLinks[platform.name] || ''} // Dùng || '' để tránh lỗi undefined
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm pl-10 p-3 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder={platform.placeholder}
                  />
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Xem trước</h2>
          <div className="flex items-center space-x-6 text-4xl p-4 border rounded-lg bg-gray-50">
            {socialPlatforms.map((platform) => (
              socialLinks[platform.name] && (
                <a key={platform.name} href={socialLinks[platform.name]} target="_blank" rel="noopener noreferrer" title={platform.label} className={`${platform.color} hover:opacity-75 transition-opacity`}>
                  <platform.icon />
                </a>
              )
            ))}
             {Object.values(socialLinks).every(link => !link) && (
                <p className="text-sm text-gray-500">Chưa có liên kết nào được cấu hình.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}