import { useState } from "react";

export default function ResultCard({ data }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(data.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API may fail in insecure contexts */
    }
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-850 p-5">
      <div className="flex items-center justify-between gap-3">
        <a
          id="short-url-link"
          href={data.short_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-zinc-100 underline underline-offset-4 decoration-zinc-600 hover:decoration-zinc-400 transition-colors truncate"
        >
          {data.short_url}
        </a>
        <button
          id="copy-btn"
          onClick={handleCopy}
          className="shrink-0 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="mt-3 text-xs text-zinc-500 truncate">
        {data.original_url}
      </p>
    </div>
  );
}
