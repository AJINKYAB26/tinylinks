"use client";
import { useEffect, useState } from "react";
import { use } from "react";               // ← this is fine in JS (React 19+)
import { getLink } from "@/lib/api";
import { FiCopy } from "react-icons/fi";
import { useRouter } from "next/navigation"; // ← import router

export default function StatsPage({ params }) {
  // Unwrap the Promise – this works perfectly in JavaScript
  const { code } = use(params);
  const router = useRouter(); // ← init router

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchLink() {
      try {
        const data = await getLink(code);
        setLink(data);
      } catch (err) {
        setLink(null);
      } finally {
        setLoading(false);
      }
    }

    fetchLink();
  }, [code]);

  const ClientDate = ({ value }) => {
    const [date, setDate] = useState("");
    useEffect(() => {
      if (value) setDate(new Date(value).toLocaleString());
    }, [value]);
    return <>{date || "—"}</>;
  };
  
  const goToTarget = () => {
    // Go directly to Express, not Next.js
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE}/${code}`;
  };

  const goBack = () => {
    router.push("/"); // ← redirect to dashboard page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-10 text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-2">404 – Not Found</h1>
          <p className="text-gray-600">This short link does not exist.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-10 border border-gray-100">

        {/* Back Button */}
        <button
          onClick={goBack}
          className="mb-6 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8 tracking-tight">
          Link Insights
        </h1>

        {/* Stats Card */}
        <div className="space-y-6">
          {/* Short Code */}
          <div className="bg-gray-50 border rounded-xl p-5 hover:shadow-md transition">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              🔗 Short Code
            </p>
            <p className="text-2xl text-blue-600 font-bold font-mono mt-1">
              {link.code}
            </p>
          </div>

          {/* Target URL */}
          <div className="bg-gray-50 border rounded-xl p-5 hover:shadow-md transition">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              🌍 Destination URL
            </p>
            <a
              href={link.target}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-lg underline break-all mt-1 block hover:text-blue-800 transition"
            >
              {link.target}
            </a>
          </div>

          {/* Short URL */}
          <div className="bg-gray-50 border rounded-xl p-5 hover:shadow-md transition flex flex-col">
            <p className="text-sm text-gray-500 flex items-center gap-2">🔗 Short URL</p>
            <div className="flex items-center gap-2 mt-1">
              {(() => {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE; // backend URL
                const shortUrl = `${baseUrl}/${link.code}`;
                // const [copied, setCopied] = useState(false);

                const handleCopy = () => {
                  navigator.clipboard.writeText(shortUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                };

                return (
                  <>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-lg underline break-all font-mono hover:text-blue-800 transition"
                    >
                      {shortUrl}
                    </a>
                    <button
                      onClick={handleCopy}
                      className="text-gray-500 hover:text-gray-700 transition p-1 rounded"
                      title="Copy to clipboard"
                    >
                      <FiCopy size={18} />
                    </button>
                    {copied && (
                      <span className="text-green-600 ml-2 text-sm font-medium">
                        Copied!
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          </div>


          {/* Click Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="bg-white shadow-md border rounded-xl p-5 text-center hover:shadow-lg transition">
              <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                📊 Total Clicks
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {link.clicks}
              </p>
            </div>

            <div className="bg-white shadow-md border rounded-xl p-5 text-center hover:shadow-lg transition">
              <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                ⏱️ Last Click
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {/* {link.lastClickedAt
                ? new Date(link.lastClickedAt).toLocaleString()
                : "—"} */}
                {link.lastClickedAt ? <ClientDate value={link.lastClickedAt} /> : "—"}

              </p>
            </div>

            <div className="bg-white shadow-md border rounded-xl p-5 text-center hover:shadow-lg transition">
              <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
                📅 Created
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {/* {new Date(link.createdAt).toLocaleString()} */}
                <ClientDate value={link.createdAt} />
              </p>
            </div>

          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={goToTarget}
            disabled={redirecting}
            className={`
            px-10 py-4 rounded-xl font-semibold text-white 
            bg-blue-600 hover:bg-blue-700 shadow-lg
            hover:shadow-xl transition transform hover:-translate-y-1
            ${redirecting ? "opacity-50 cursor-not-allowed" : ""}
          `}
          >
            {redirecting ? "Redirecting..." : "Open Link"}
          </button>
        </div>

      </div>
    </div>
  );
}