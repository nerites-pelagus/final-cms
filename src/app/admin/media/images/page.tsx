"use client";

import { useState, useEffect } from "react";

interface MediaItem {
  id: number;
  url: string;
  type: string;
}

export default function MediaManagement() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [zoomedImg, setZoomedImg] = useState<string | null>(null); 

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const res = await fetch("/api/media?type=image");
    const data = await res.json();
    setImages(data);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    await fetch("/api/media", { method: "POST", body: formData });
    setFile(null);
    setPreview(null);
    fetchImages();
  }

  async function handleDelete(id: number) {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    fetchImages();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Quản trị Images
      </h1>

      <form
        onSubmit={handleUpload}
        className="mb-8 bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg 
                     file:border-0 file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
        >
          Upload
        </button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group rounded-xl overflow-hidden shadow-lg bg-white cursor-pointer"
            onClick={() => setZoomedImg(img.url)} 
          >
            <img
              src={img.url}
              alt="uploaded"
              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(img.id);
                }}
                className="bg-red-600 text-white text-sm px-3 py-1 rounded-lg shadow hover:bg-red-700 transition"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Popup xem ảnh lớn */}
      {zoomedImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomedImg(null)} // click nền để đóng
        >
          <div className="relative max-w-4xl w-full p-4">
            <img
              src={zoomedImg}
              alt="zoomed"
              className="w-full h-auto rounded-xl shadow-2xl transition-transform duration-300 scale-100 hover:scale-105"
            />
            <button
              onClick={() => setZoomedImg(null)}
              className="absolute top-4 right-6 text-white text-2xl font-bold hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Preview ảnh sắp upload */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-xl max-w-3xl w-full">
            <img
              src={preview}
              alt="Preview"
              className="max-h-[80vh] w-full object-contain rounded"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
