export default function WorldsLoading() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%',
          padding: 'clamp(16px, 4vw, 48px) clamp(16px, 4vw, 32px)',
        }}
      >
        {/* HUD skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl animate-pulse" style={{ width: 48, height: 48, backgroundColor: 'rgba(0,0,0,0.08)' }} />
            <div className="flex flex-col gap-2">
              <div className="rounded-full animate-pulse" style={{ width: 40, height: 10, backgroundColor: 'rgba(0,0,0,0.06)' }} />
              <div className="rounded-full animate-pulse" style={{ width: 80, height: 8, backgroundColor: 'rgba(0,0,0,0.06)' }} />
            </div>
          </div>
          <div className="rounded-full animate-pulse" style={{ width: 90, height: 36, backgroundColor: 'rgba(255,213,79,0.2)' }} />
        </div>

        {/* Greeting skeleton */}
        <div className="mb-8 flex flex-col gap-2">
          <div className="rounded-full animate-pulse" style={{ width: 240, height: 36, backgroundColor: 'rgba(0,0,0,0.07)' }} />
          <div className="rounded-full animate-pulse" style={{ width: 180, height: 18, backgroundColor: 'rgba(0,0,0,0.05)' }} />
        </div>

        {/* World cards skeleton */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 mb-8"
          style={{ gap: 'clamp(12px, 2vw, 24px)' }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-3xl"
              style={{
                padding: 'clamp(16px, 2.5vw, 28px)',
                gap: 16,
                backgroundColor: 'rgba(0,0,0,0.03)',
                border: '1.5px solid rgba(0,0,0,0.05)',
              }}
            >
              <div className="rounded-2xl animate-pulse" style={{ width: 56, height: 56, backgroundColor: 'rgba(0,0,0,0.08)' }} />
              <div className="flex flex-col gap-2">
                <div className="rounded-full animate-pulse" style={{ width: '70%', height: 16, backgroundColor: 'rgba(0,0,0,0.07)' }} />
                <div className="rounded-full animate-pulse" style={{ width: '50%', height: 12, backgroundColor: 'rgba(0,0,0,0.05)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Tip skeleton */}
        <div
          className="rounded-3xl"
          style={{
            padding: 'clamp(14px, 2vw, 24px)',
            backgroundColor: 'rgba(79,195,247,0.05)',
            border: '1.5px solid rgba(79,195,247,0.1)',
          }}
        >
          <div className="flex items-start gap-3">
            <div className="rounded-full animate-pulse flex-shrink-0" style={{ width: 24, height: 24, backgroundColor: 'rgba(0,0,0,0.08)' }} />
            <div className="flex flex-col gap-2 flex-1">
              <div className="rounded-full animate-pulse" style={{ width: 60, height: 12, backgroundColor: 'rgba(0,0,0,0.07)' }} />
              <div className="rounded-full animate-pulse" style={{ width: '80%', height: 14, backgroundColor: 'rgba(0,0,0,0.05)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
