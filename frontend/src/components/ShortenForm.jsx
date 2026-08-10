import { useState } from "react";

const API_BASE = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000";

export default function ShortenForm({ onResult, onError }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    onError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || `Request failed (${res.status})`);
      }

      const data = await res.json();
      onResult(data);
      setUrl("");
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        id="url-input"
        type="url"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/very-long-url..."
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-850 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-zinc-500"
      />
      <button
        id="shorten-btn"
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "..." : "Shorten"}
      </button>
    </form>
  );
}
