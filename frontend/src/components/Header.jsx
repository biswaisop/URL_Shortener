export default function Header() {
  return (
    <header className="pt-20 pb-10 text-center">
      <div className="flex items-center justify-center gap-3 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-400"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
          Shortener
        </h1>
      </div>
      <p className="text-sm text-zinc-500">
        Paste a long URL and get a short link instantly.
      </p>
    </header>
  );
}
