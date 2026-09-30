"use client";

import { useState } from "react";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  function addFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const images = Array.from(selectedFiles).filter((file) =>
      file.type.startsWith("image/")
    );

    setFiles((current) => [...current, ...images]);
    setMessage("");
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  async function uploadFiles() {
    if (!files.length) return;

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage("Your photos are safely sent ♡");
      setFiles([]);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7f3] text-[#403832]">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#f3dce5]/60 blur-3xl" />
        <div className="absolute -right-32 top-[35%] h-96 w-96 rounded-full bg-[#e5def5]/60 blur-3xl" />
        <div className="absolute bottom-0 left-[35%] h-72 w-72 rounded-full bg-[#f6e7d3]/60 blur-3xl" />
      </div>

      {/* Navigation */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#403832] text-lg text-white shadow-sm">
            ♡
          </div>

          <div>
            <div className="font-serif text-xl tracking-tight">
              little<span className="text-[#bd7894]">drop</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#9a8d86]">
              send something sweet
            </div>
          </div>
        </div>

        <div className="rounded-full border border-[#e6ddd7] bg-white/70 px-4 py-2 text-xs text-[#8e817a] backdrop-blur">
          private little corner ✦
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1fr_0.9fr] lg:pt-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ead7df] bg-[#fff8fb] px-4 py-2 text-xs font-medium text-[#a36d84]">
            <span className="h-2 w-2 rounded-full bg-[#d796ad]" />
            made just for you
          </div>

          <h1 className="max-w-xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            A tiny place to
            <span className="block italic text-[#bd7894]">
              drop your photos.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#756963] sm:text-lg">
            No accounts. No complicated stuff. Just choose your favorite
            pictures and send them over. ♡
          </p>

          {/* Upload box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            className={`mt-9 rounded-[28px] border-2 border-dashed p-5 transition-all sm:p-6 ${
              dragging
                ? "border-[#bd7894] bg-[#fff2f7] scale-[1.01]"
                : "border-[#dfd2cc] bg-white/70"
            }`}
          >
            <div className="rounded-[22px] bg-[#fcf8f5] p-7 text-center sm:p-9">
              <div className="mx-auto flex h-16 w-16 rotate-[-4deg] items-center justify-center rounded-[20px] bg-[#f0dce5] text-3xl shadow-sm">
                📷
              </div>

              <h2 className="mt-5 font-serif text-2xl">
                Pick some photos
              </h2>

              <p className="mt-2 text-sm text-[#958982]">
                or drag & drop them right here
              </p>

              <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#403832] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#403832]/10 transition hover:-translate-y-0.5 hover:bg-[#514740]">
                <span>＋</span>
                Choose photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </label>

              <p className="mt-4 text-[11px] text-[#aaa09a]">
                JPG, PNG, WEBP · multiple photos welcome
              </p>
            </div>
          </div>

          {/* Selected images */}
          {files.length > 0 && (
            <div className="mt-5 rounded-2xl border border-[#e7ddd7] bg-white/80 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {files.length} photo{files.length > 1 ? "s" : ""} selected
                </span>

                <button
                  onClick={() => setFiles([])}
                  className="text-xs text-[#a48f87] hover:text-[#bd7894]"
                >
                  clear all
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-[#f2ece8]"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />

                    <button
                      onClick={() => removeFile(index)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={uploadFiles}
                disabled={uploading}
                className="mt-4 w-full rounded-full bg-[#bd7894] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#bd7894]/20 transition hover:-translate-y-0.5 hover:bg-[#aa6682] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? "Sending your photos..." : "Send photos ♡"}
              </button>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="mt-5 rounded-2xl border border-[#eadce2] bg-[#fff8fb] px-5 py-4 text-center text-sm text-[#8d6475]">
              {message}
            </div>
          )}
        </div>

        {/* Hero illustration */}
        <div className="relative hidden min-h-[560px] items-center justify-center lg:flex">
          {/* Large organic shape */}
          <div className="absolute h-[440px] w-[390px] rotate-[-5deg] rounded-[48%_52%_45%_55%/45%_42%_58%_55%] bg-[#f1dfe5]" />

          {/* Decorative circle */}
          <div className="absolute right-5 top-20 h-28 w-28 rounded-full border border-[#cfa9b7]" />
          <div className="absolute right-12 top-27 h-14 w-14 rounded-full bg-[#ead7df]" />

          {/* Floating photo card */}
          <div className="absolute left-12 top-24 z-20 w-40 rotate-[-9deg] rounded-[18px] bg-white p-3 shadow-xl">
            <div className="flex aspect-[4/5] items-center justify-center rounded-[12px] bg-[#e9dce9] text-5xl">
              🌸
            </div>
            <div className="mt-3 flex justify-between px-1 text-[10px] text-[#998b85]">
              <span>favorite</span>
              <span>♡</span>
            </div>
          </div>

          {/* Main camera */}
          <div className="relative z-10 flex h-72 w-80 rotate-[3deg] items-center justify-center rounded-[42px] border-[3px] border-[#403832] bg-[#f9f4ef] shadow-2xl">
            <div className="absolute -top-7 left-12 h-10 w-24 rounded-t-[14px] border-[3px] border-b-0 border-[#403832] bg-[#f9f4ef]" />

            <div className="flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-[#403832] bg-[#ead7df] shadow-inner">
              <div className="h-20 w-20 rounded-full border-[5px] border-[#75615e] bg-[#bd7894]" />
            </div>

            <div className="absolute right-8 top-8 h-5 w-5 rounded-full bg-[#d796ad]" />
          </div>

          {/* Small image card */}
          <div className="absolute bottom-28 right-3 z-20 w-36 rotate-[8deg] rounded-[18px] bg-white p-3 shadow-xl">
            <div className="flex aspect-square items-center justify-center rounded-[12px] bg-[#e5def5] text-4xl">
              ✨
            </div>
            <div className="mt-2 text-center text-[10px] text-[#998b85]">
              little memories
            </div>
          </div>

          {/* Flowers / doodles */}
          <div className="absolute bottom-20 left-16 rotate-[-12deg] text-4xl">
            🌷
          </div>

          <div className="absolute right-14 top-12 text-2xl">✦</div>
          <div className="absolute bottom-12 right-32 text-xl">♡</div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-[#decbd3] bg-white/60 px-5 py-2 text-xs text-[#9d8b91] backdrop-blur">
            your photos, safe & sound
          </div>
        </div>
      </section>

      {/* Bottom note */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col items-center justify-between gap-4 rounded-[24px] border border-[#e8ded8] bg-white/50 px-6 py-5 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-serif text-lg">No account needed ♡</p>
            <p className="mt-1 text-xs text-[#988b84]">
              Just pick your photos and send them. That's it.
            </p>
          </div>

          <div className="flex gap-2 text-xs text-[#9b8e87]">
            <span className="rounded-full bg-[#f3e5eb] px-3 py-1.5">
              private
            </span>
            <span className="rounded-full bg-[#eee8f7] px-3 py-1.5">
              simple
            </span>
            <span className="rounded-full bg-[#f7eadb] px-3 py-1.5">
              cute
            </span>
          </div>
        </div>
      </section>

      <footer className="pb-8 text-center text-xs text-[#aaa09a]">
        made with a little love ♡
      </footer>
    </main>
  );
}
