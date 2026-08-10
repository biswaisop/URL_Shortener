import { useEffect, useState } from 'react'

function ResultCard({ result }) {
  const [copyState, setCopyState] = useState('idle')

  useEffect(() => {
    if (copyState !== 'copied') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState('idle')
    }, 1600)

    return () => window.clearTimeout(timeoutId)
  }, [copyState])

  async function handleCopy() {
    if (!result) {
      return
    }

    try {
      await navigator.clipboard.writeText(result.short_url)
      setCopyState('copied')
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState('idle'), 1600)
    }
  }

  if (!result) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-500">
        Your generated link will appear here after a successful request.
      </div>
    )
  }

  return (
    <section className="rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Short link ready</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-50">Copy or open the result</h3>
        </div>
        <p className="rounded-full border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-200">
          {result.short_code}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Short URL</p>
          <a
            href={result.short_url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 block break-all font-mono text-sm text-slate-100 underline decoration-slate-700 underline-offset-4 transition-colors hover:text-white"
          >
            {result.short_url}
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Original URL</p>
            <p className="mt-2 break-all text-sm text-slate-300">{result.original_url}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Response</p>
            <p className="mt-2 text-sm text-slate-300">
              The backend stores the mapping and resolves it with a 307 redirect.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-white"
          >
            {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy link'}
          </button>
          <a
            href={result.short_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:text-white"
          >
            Open short URL
          </a>
        </div>
      </div>
    </section>
  )
}

export default ResultCard