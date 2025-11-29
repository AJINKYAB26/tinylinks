const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

// export async function getAllLinks() {
//   const res = await fetch(`${BASE}/api/links`, { cache: "no-store" });
//   return res.json();
// }
export async function getAllLinks() {
  try {
    const res = await fetch(`${BASE}/api/links`, { cache: "no-store" });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];  // 🔥 Prevent crashes
  }
}


export async function createLink(data) {
  const res = await fetch(`${BASE}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteLink(code) {
  return fetch(`${BASE}/api/links/${code}`, { method: "DELETE" });
}

export async function getLink(code) {
  const res = await fetch(`${BASE}/api/links/${code}`, { cache: "no-store" });
  if (res.status === 404) return null;
  return res.json();
}
