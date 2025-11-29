"use client"; // ✅ first line

import { useState, useEffect } from "react";
import AddLinkForm from "@/components/AddLinkForm";
import LinksTable from "@/components/LinksTable";
import { getAllLinks } from "@/lib/api";

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      const data = await getAllLinks();
      setLinks(data);
      setLoading(false);
    }
    fetchLinks();
  }, []);

  const handleCreate = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <AddLinkForm onCreate={handleCreate} />
      <LinksTable links={links} />
    </div>
  );
}
