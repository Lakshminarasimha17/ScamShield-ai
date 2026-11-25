export default function LoadingSpinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div
        className={`${sizes[size]} border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

