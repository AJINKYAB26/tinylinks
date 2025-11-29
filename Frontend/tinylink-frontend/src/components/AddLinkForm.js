"use client";

import { useState } from "react";
import { createLink } from "@/lib/api";

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
         setTimeout(() => setMsg(""), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={submit}
        className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 space-y-5 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Create Short Link</h2>
          <p className="text-gray-500">Generate beautiful, trackable short URLs</p>
        </div>

        {/* Target URL */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Target URL
          </label>
          <input
            type="url"
            className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none transition"
            placeholder="https://example.com"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />
        </div>

        {/* Custom Code */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Custom Code (optional)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 outline-none transition"
            placeholder="ex: mylink123"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition active:scale-95 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Link"}
        </button>
      </form>
      {/* Toast Notification */}
      {msg && (
        <div
          className={`absolute top-0 right-0 mt-2 mr-2 px-4 py-2 rounded-lg shadow-lg text-white font-medium transition ${
            msg.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {msg.text}
    </div>
  )}
 </div>
  );
}