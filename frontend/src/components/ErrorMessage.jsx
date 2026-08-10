export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div
      id="error-message"
      className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400"
    >
      {message}
    </div>
  );
}
