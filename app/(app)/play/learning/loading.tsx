export default function LearningLoading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--white)' }}>
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 rounded-xl bg-black/08 animate-pulse" />
          <div className="h-6 w-32 rounded-full bg-black/08 animate-pulse" />
          <div className="w-10 h-10 rounded-xl bg-black/08 animate-pulse" />
        </div>

        {/* Progress bar */}
        <div className="h-3 w-full rounded-full bg-black/06 mb-8 animate-pulse" />

        {/* Letter display skeleton */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-24 h-24 rounded-3xl bg-black/08 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-black/06 animate-pulse" />
        </div>

        {/* Choice buttons */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded-3xl bg-black/06 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
