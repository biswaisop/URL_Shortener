import { useState } from "react";
import Header from "./components/Header";
import ShortenForm from "./components/ShortenForm";
import ResultCard from "./components/ResultCard";
import ErrorMessage from "./components/ErrorMessage";

export default function App() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  function handleResult(data) {
    setResults((prev) => [data, ...prev]);
  }

  return (
    <div className="mx-auto min-h-screen max-w-xl px-4 pb-20 font-sans">
      <Header />

      <main className="space-y-4">
        <ShortenForm onResult={handleResult} onError={setError} />
        <ErrorMessage message={error} />

        {results.length > 0 && (
          <section className="space-y-3 pt-2">
            {results.map((r, i) => (
              <ResultCard key={`${r.short_code}-${i}`} data={r} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
