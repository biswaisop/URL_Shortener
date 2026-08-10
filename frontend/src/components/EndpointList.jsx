const ROUTES = [
  {
    method: 'GET',
    path: '/api/v1/health',
    description: 'Readiness probe for the API and database connection.',
  },
  {
    method: 'POST',
    path: '/api/v1/shorten',
    description: 'Accepts { url } and returns the generated short code and resolved URL.',
  },
  {
    method: 'GET',
    path: '/:short_code',
    description: 'Redirects to the original URL and increments the click counter.',
  },
]

function EndpointList({ apiBaseUrl }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">API surface</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-50">Straightforward contract</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The frontend stays close to the backend contract so the UI is easy to maintain and easy
          to replace if the API grows later.
        </p>
        <p className="mt-4 font-mono text-sm text-slate-300">Base URL: {apiBaseUrl}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {ROUTES.map((route) => (
          <article key={route.path} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{route.method}</p>
            <p className="mt-2 font-mono text-sm text-slate-50">{route.path}</p>
            <p className="mt-3 text-sm leading-6 text-slate-400">{route.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EndpointList