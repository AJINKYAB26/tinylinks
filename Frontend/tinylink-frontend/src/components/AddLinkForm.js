"use client";

import { useState } from "react";
import { createLink } from "@/lib/api";
import { Link2, Loader2 } from "lucide-react";

export default function AddLinkForm({ onCreate }) {
  const [target, setTarget] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const res = await createLink({ target, code });
    if (res.error) {
      setMsg({ type: "error", text: res.error });
    } else {
      setMsg({ type: "success", text: "Created Successfully!" });
      setTarget("");
      setCode("");
      if (onCreate) onCreate(res.data);
      setTimeout(() => {
        setMsg("");
        // window.location.href = window.location.href; // Soft reload
      }, 2000);
    }

    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col">

      {/* ---------- HEADER ---------- */}
      <header className="w-full py-5 bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
            <Link2 size={26} />
            TinyLink
          </h1>
          <p className="text-gray-600 hidden sm:block">Smart URL Shortener</p>
        </div>
      </header>

      {/* ---------- FORM SECTION ---------- */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <form
            onSubmit={submit}
            className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-8 space-y-6 mx-auto max-w-2xl"
          >
            {/* Title */}
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Create Short Link
              </h2>
              <p className="text-gray-500">
                Generate beautiful, trackable short URLs instantly
              </p>
            </div>

            {/* Target URL */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Target URL
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
            </div>

            {/* Custom Code */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Custom Code (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. mylink123"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Link"}
            </button>
          </form>

          {/* Toast Message */}
          {msg && (
            <div
              className={`mt-4 px-4 py-3 rounded-lg max-w-2xl mx-auto text-center shadow-md text-white ${msg.type === "success" ? "bg-green-600" : "bg-red-500"
                }`}
            >
              {msg.text}
            </div>
          )}
        </div>
      </main>

      {/* ---------- FOOTER ---------- */}
      {/* <footer className="w-full py-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} TinyLink — Built with ❤️ by Ajinkya
      </footer> */}
    </div>
  );
}