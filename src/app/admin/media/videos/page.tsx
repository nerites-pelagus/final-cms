"use client";

import { useState, useEffect, useRef } from "react";

interface MediaItem {
  id: number;
  url: string;
  type: string;
}

export default function MediaManagement() {
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoomedVid, setZoomedVid] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []);

  async function fetchVideos() {
    try {
      const res = await fetch("/api/media?type=video");
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error(error);
      alert("Lỗi: Không thể tải danh sách video.");
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "video");

    try {
      const res = await fetch("/api/media", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");

      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchVideos();
    } catch (error) {
      console.error(error);
      alert("Lỗi: Không thể tải video lên.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa video này?")) return;

    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion failed");
      await fetchVideos();
    } catch (error) {
      console.error(error);
      alert("Lỗi: Không thể xóa video.");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Quản trị Videos</h1>

      <form
        onSubmit={handleUpload}
        className="mb-8 bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg 
                     file:border-0 file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isUploading || !file}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
        >
          {isUploading ? "Đang tải lên..." : "Upload"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="relative group rounded-xl overflow-hidden shadow-lg bg-white"
            onClick={() => setZoomedVid(vid.url)}
          >
            <video
              src={vid.url}
              className="w-full h-40 object-cover cursor-pointer"
              controls={false}
              onClick={() => setPreview(vid.url)}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={() => handleDelete(vid.id)}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded-lg shadow hover:bg-red-700 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {zoomedVid && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomedVid(null)}
        >
          <div
            className="relative max-w-4xl w-full p-4"
            onClick={(e) => e.stopPropagation()} // tránh đóng khi click vào video
          >
            <video
              src={zoomedVid}
              controls
              autoPlay
              className="w-full h-auto rounded-xl shadow-2xl transition-transform duration-300 scale-100 hover:scale-105"
            />
            <button
              onClick={() => setZoomedVid(null)}
              className="absolute top-4 right-6 text-white text-2xl font-bold hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white p-4 rounded-lg shadow-xl max-w-4xl w-full">
            <video
              src={preview}
              controls
              autoPlay
              className="max-h-[80vh] w-full object-contain rounded"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-2 -right-2 bg-red-600 text-white w-8 h-8 rounded-full shadow-lg hover:bg-red-700 transition flex items-center justify-center"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
