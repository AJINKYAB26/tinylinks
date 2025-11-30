"use client"; // ✅ first line

import { useState, useEffect } from "react";
import AddLinkForm from "@/components/AddLinkForm";
import LinksTable from "@/components/LinksTable";
import { getAllLinks } from "@/lib/api";

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCreate = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AddLinkForm onCreate={handleCreate} />

      <div className="mt-10">
        <LinksTable />
        {/* <LinksTable links={links} onDelete={handleDelete} reload={loadLinks}  /> */}
      </div>
    </div>
  );
}
