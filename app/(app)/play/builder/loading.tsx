export default function BuilderLoading() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--white)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-black/05">
        <div className="w-10 h-10 rounded-xl bg-black/08 animate-pulse" />
        <div className="h-6 w-24 rounded-full bg-black/08 animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="w-16 h-7 rounded-full bg-black/06 animate-pulse" />
        </div>
      </div>

      {/* Room canvas skeleton */}
      <div className="flex-1 mx-4 mt-4 rounded-3xl bg-black/04 animate-pulse" style={{ minHeight: '280px' }} />

      {/* Item drawer skeleton */}
      <div className="mx-4 mb-4 mt-3 rounded-3xl bg-white border border-black/05 p-4"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 flex-1 rounded-xl bg-black/06 animate-pulse" />
          ))}
        </div>
        {/* Item grid */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-black/06 animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
