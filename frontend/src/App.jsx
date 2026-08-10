import { useEffect, useState } from 'react'

import { API_BASE_URL, healthCheck, shortenUrl } from './lib/api'
import EndpointList from './components/EndpointList'
import ResultCard from './components/ResultCard'
import ShortenForm from './components/ShortenForm'

function App() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [health, setHealth] = useState({ status: 'checking', label: 'Checking API' })

  const exampleUrls = [
    'https://fastapi.tiangolo.com/',
    'https://developer.mozilla.org/en-US/',
    'https://react.dev/learn',
  ]

  useEffect(() => {
    let active = true

    async function checkApi() {
      try {
        await healthCheck()
        if (active) {
          setHealth({ status: 'online', label: 'API online' })
        }
      } catch {
        if (active) {
          setHealth({ status: 'offline', label: 'API unreachable' })
        }
      }
    }

    checkApi()

    return () => {
      active = false
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedUrl = url.trim()
    if (!trimmedUrl) {
      setError('Enter a valid URL to shorten.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await shortenUrl(trimmedUrl)
      setResult(data)
    } catch (requestError) {
      setResult(null)
      setError(requestError instanceof Error ? requestError.message : 'Shortening failed.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleExampleSelect(exampleUrl) {
    setUrl(exampleUrl)
    setError('')
  }

  return (
    <div className="min-h-screen text-center">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              URL shortener
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Clean links. Minimal surface area.
            </h1>
          </div>

          <div className="rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
            <span className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${health.status === 'online' ? 'bg-emerald-400' : health.status === 'offline' ? 'bg-rose-400' : 'bg-amber-400'}`} />
            {health.label}
          </div>
        </header>

        <main className="grid flex-1 gap-8 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:py-10">
          <section className="space-y-6">
            <div className="max-w-2xl space-y-5">
              <p className="inline-flex rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                API-ready frontend
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
                A focused UI for short links, not a showcase app.
              </h2>
              <p className="max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
                This interface is built around the actual backend contract: one POST endpoint to
                create a short code, one redirect route to resolve it, and one health check for
                readiness.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.95)]">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">POST</p>
                <p className="mt-2 font-mono text-sm text-slate-100">/api/v1/shorten</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.95)]">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">GET</p>
                <p className="mt-2 font-mono text-sm text-slate-100">/api/v1/health</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.95)]">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Redirect</p>
                <p className="mt-2 font-mono text-sm text-slate-100">/:short_code</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/75 p-6 shadow-[0_28px_120px_-64px_rgba(0,0,0,0.95)]">
              <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Backend</p>
                  <p className="mt-1 text-sm text-slate-300">Connected to {API_BASE_URL}</p>
                </div>
                <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
                  307 redirect flow
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {exampleUrls.map((exampleUrl) => (
                  <button
                    key={exampleUrl}
                    type="button"
                    onClick={() => handleExampleSelect(exampleUrl)}
                    className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-left text-sm text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <span className="block text-xs uppercase tracking-[0.22em] text-slate-500">
                      Example URL
                    </span>
                    <span className="mt-2 block break-all font-mono text-sm text-slate-100">
                      {exampleUrl}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6 lg:pt-3">
            <ShortenForm
              value={url}
              onChange={setUrl}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />

            <ResultCard result={result} />
          </section>
        </main>

        <footer className="border-t border-slate-800 py-6">
          <EndpointList apiBaseUrl={API_BASE_URL} />
        </footer>
      </div>
    </div>
  )
}

export default App
