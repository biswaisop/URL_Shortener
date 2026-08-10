function ShortenForm({ value, onChange, onSubmit, isLoading, error }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_28px_120px_-64px_rgba(0,0,0,0.95)]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Shorten URL</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-50">Create a short link</h3>
        </div>
        <p className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-400">
          POST JSON body: url
        </p>
      </div>

      <label className="mt-5 block text-sm font-medium text-slate-300" htmlFor="long-url">
        Destination URL
      </label>
      <input
        id="long-url"
        name="long-url"
        type="url"
        inputMode="url"
        autoComplete="off"
        spellCheck="false"
        placeholder="https://example.com/articles/this-is-a-long-link"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
      />

      <p className="mt-3 text-sm text-slate-500">
        The backend accepts any valid URL and returns <span className="font-mono text-slate-300">short_code</span>,{' '}
        <span className="font-mono text-slate-300">short_url</span>, and{' '}
        <span className="font-mono text-slate-300">original_url</span>.
      </p>

      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-900/60 bg-rose-950/50 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-300"
      >
        {isLoading ? 'Shortening...' : 'Generate short link'}
      </button>
    </form>
  )
}

export default ShortenForm