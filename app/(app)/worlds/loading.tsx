export default function WorldsLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Header skeleton */}
      <div className="text-center mb-8 flex flex-col items-center gap-3">
        <div className="h-4 w-24 rounded-full bg-black/08 animate-pulse" />
        <div className="h-10 w-48 rounded-full bg-black/08 animate-pulse" />
        <div className="h-3 w-36 rounded-full bg-black/06 animate-pulse" />
      </div>

      {/* World cards skeleton */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 rounded-3xl p-6 bg-white border border-black/05"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
          >
            <div className="w-10 h-10 rounded-2xl bg-black/08 animate-pulse" />
            <div className="h-4 w-16 rounded-full bg-black/06 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
