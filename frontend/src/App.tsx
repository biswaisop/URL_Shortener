import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  checkHealth,
  shortenUrl,
  type HistoryItem,
  type ShortenResponse,
  API_BASE,
  HISTORY_KEY,
} from './lib/api'
import { BackendContract } from './components/BackendContract'
import { HistoryList } from './components/HistoryList'
import { HeroHeader } from './components/HeroHeader'
import { LatestResult } from './components/LatestResult'
import { ShortenForm } from './components/ShortenForm'

function App() {
  const [inputUrl, setInputUrl] = useState('')
  const [result, setResult] = useState<ShortenResponse | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const savedHistory = window.localStorage.getItem(HISTORY_KEY)

    if (!savedHistory) {
      return []
    }

    try {
      return JSON.parse(savedHistory) as HistoryItem[]
    } catch {
      window.localStorage.removeItem(HISTORY_KEY)
      return []
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [message, setMessage] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    void checkHealth(controller.signal)
      .then((isOnline) => setStatus(isOnline ? 'online' : 'offline'))
      .catch(() => setStatus('offline'))

    return () => controller.abort()
  }, [])

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedUrl = inputUrl.trim()

    if (!trimmedUrl) {
      setMessage('Enter a URL to shorten.')
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const data = await shortenUrl(trimmedUrl)
      const entry: HistoryItem = {
        ...data,
        createdAt: new Date().toISOString(),
      }

      setResult(data)
      setInputUrl('')
      setHistory((currentHistory) => [entry, ...currentHistory.filter((item) => item.short_code !== data.short_code)].slice(0, 5))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function copyShortUrl(shortUrl: string, shortCode: string) {
    await window.navigator.clipboard.writeText(shortUrl)
    setCopiedCode(shortCode)
    window.setTimeout(() => {
      setCopiedCode((currentCode) => (currentCode === shortCode ? null : currentCode))
    }, 1400)
  }

  function clearHistory() {
    setHistory([])
    window.localStorage.removeItem(HISTORY_KEY)
  }

  return (
    <main className="app-shell">
      <HeroHeader apiBase={API_BASE} status={status} />

      <section className="grid-layout">
        <div className="space-y-6">
          <ShortenForm
            inputUrl={inputUrl}
            isSubmitting={isSubmitting}
            message={message}
            onSubmit={handleSubmit}
            onInputChange={setInputUrl}
          />

          <LatestResult
            result={result}
            copiedCode={copiedCode}
            onCopy={(shortUrl, shortCode) => void copyShortUrl(shortUrl, shortCode)}
          />
        </div>

        <div className="space-y-6">
          <BackendContract apiBase={API_BASE} />
          <HistoryList history={history} onClear={clearHistory} onCopy={copyShortUrl} copiedCode={copiedCode} />
        </div>
      </section>
    </main>
  )
}

export default App
