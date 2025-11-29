"use client";

import { useState, useMemo, useEffect } from "react";
import { deleteLink } from "@/lib/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import {
    Search,
    Link as LinkIcon,
    MousePointer2,
    Clock,
    Trash2,
} from "lucide-react";

export default function LinksTable({ links: initialLinks }) {
    const router = useRouter();
    const [localLinks, setlocalLinks] = useState(initialLinks || []); // keep local state
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 6;

    // Filter links by search
    // const filteredLinks = useMemo(() => {
    //     const s = search.toLowerCase();
    //     return localLinks.filter(
    //         (row) =>
    //             row.code.toLowerCase().includes(s) ||
    //             row.target.toLowerCase().includes(s)
    //     );
    // }, [search, localLinks]);
 // SAFE data handling
const safeLinks = Array.isArray(localLinks)
  ? localLinks.filter((x) => x && typeof x.code === "string")
  : [];

// Filtering
const filteredLinks = useMemo(() => {
  const s = search.toLowerCase();

  return safeLinks.filter((row) => {
    const code = row.code.toLowerCase();
    const target = row.target.toLowerCase();
    return code.includes(s) || target.includes(s);
  });
}, [safeLinks, search]);

// Pagination
const paginated = filteredLinks.slice((page - 1) * limit, page * limit);




    // Pagination
    const totalPages = Math.ceil(filteredLinks.length / limit);
    // const paginated = filteredLinks.slice((page - 1) * limit, page * limit);

    const remove = async (code) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to delete this link. This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await deleteLink(code);
                setlocalLinks((prev) => prev.filter((l) => l.code !== code));

                Swal.fire({
                    title: "Deleted!",
                    text: "Your link has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (err) {
                console.error(err);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete link.",
                    icon: "error",
                });
            }
        }
    };
    useEffect(() => {
    setlocalLinks(initialLinks);
}, [initialLinks]);


    return (
        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 mt-6 space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Your Short Links</h2>

                {/* Search Bar */}
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search links..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-gray-700 bg-gray-100 border-b">
                            <th className="p-4 text-sm font-semibold whitespace-nowrap text-left">
                                Code
                            </th>
                            <th className="p-4 text-sm font-semibold whitespace-nowrap text-left">
                                Target
                            </th>
                            <th className="p-4 text-sm font-semibold whitespace-nowrap text-left">
                                Clicks
                            </th>
                            <th className="p-4 text-sm font-semibold whitespace-nowrap text-left">
                                Last Clicked
                            </th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>


                    <tbody>
                        {paginated.map((row) => (
                            <tr
                                key={row.code}
                                className="border-b hover:bg-gray-50 transition text-gray-800"
                            >
                                {/* CODE
                                <td className="p-4">
                                    <a
                                        href={`/code/${row.code}`}
                                        target="_blank"
                                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition"
                                    >
                                        {row.code}
                                    </a>
                                </td> */}
                                {/* CODE */}
                                <td className="p-4 flex items-center gap-2">
                                    <a
                                        href={`/code/${row.code}`}
                                        target="_blank"
                                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition flex items-center gap-2"
                                    >
                                        <MousePointer2 size={16} className="text-indigo-700" />
                                        {row.code}
                                    </a>
                                </td>
                                {/* TARGET */}
                                <td className="p-4 max-w-sm truncate">{row.target}</td>

                                {/* CLICKS */}
                                <td className="p-4 font-bold">{row.clicks}</td>

                                {/* LAST CLICKED */}
                                <td className="p-4 text-gray-600">
                                    {row.lastClickedAt
                                        ? new Date(row.lastClickedAt).toLocaleString()
                                        : "—"}
                                </td>

                                {/* DELETE */}
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => remove(row.code)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* No results message */}
                {paginated.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No results found.</div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                    Showing{" "}
                    <span className="font-semibold">
                        {paginated.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">
                        {filteredLinks.length}
                    </span>{" "}
                    links
                </p>

                <div className="flex items-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className={`px-3 py-1.5 rounded-lg border ${page === 1
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1.5 rounded-lg border ${page === i + 1
                                ? "bg-indigo-600 text-white"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className={`px-3 py-1.5 rounded-lg border ${page === totalPages || totalPages === 0
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-gray-100"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm pt-4 border-t">
                © {new Date().getFullYear()} TinyLink — Your Smart URL Shortener
            </div>
        </div>
    );
}
