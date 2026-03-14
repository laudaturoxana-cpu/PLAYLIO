export default function JumpLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: 'var(--white)' }}>
      <div className="w-full max-w-sm px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 rounded-xl bg-black/08 animate-pulse" />
          <div className="h-6 w-28 rounded-full bg-black/08 animate-pulse" />
          <div className="w-10" />
        </div>

        {/* Level cards */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl bg-white border border-black/05 p-5 mb-3"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl bg-black/08 animate-pulse" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-28 rounded-full bg-black/08 animate-pulse" />
                <div className="h-3 w-20 rounded-full bg-black/06 animate-pulse" />
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="w-5 h-5 rounded-full bg-black/06 animate-pulse" />
                ))}
              </div>
            </div>
            <div className="h-10 rounded-2xl bg-black/06 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
