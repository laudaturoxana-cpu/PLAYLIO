import Link from 'next/link'

interface ChildProfile {
  id: string
  full_name: string | null
  level: number
  coins: number
  xp: number
}

interface ChildCardProps {
  child: ChildProfile
  masteredLetters: number
  totalLetters: number
  minutesThisWeek: number
}

export default function ChildCard({ child, masteredLetters, totalLetters, minutesThisWeek }: ChildCardProps) {
  const name = child.full_name ?? 'Child'
  const levelProgress = (child.xp % 100)  // xp progress toward next level (simplified)

  return (
    <div className="rounded-3xl bg-white border border-black/5 shadow-sm overflow-hidden">
      {/* Colored header */}
      <div
        className="px-5 py-4"
        style={{ background: 'linear-gradient(135deg, rgba(79,195,247,0.12) 0%, rgba(255,112,67,0.08) 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl text-2xl"
              style={{ background: 'rgba(79,195,247,0.15)', border: '2px solid rgba(79,195,247,0.3)' }}
            >
              🦁
            </div>
            <div>
              <h3 className="font-fredoka text-lg font-semibold text-[var(--dark)]">{name}</h3>
              <p className="font-inter text-xs text-[var(--gray)]">Level {child.level} · {child.coins} 🪙</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Link
              href={`/parents/report/${child.id}`}
              className="rounded-full bg-[var(--sky)] px-3 py-1.5 font-inter text-xs font-semibold text-white active:scale-95 transition-transform text-center"
              style={{ touchAction: 'manipulation' }}
            >
              📊 Report
            </Link>
            <Link
              href={`/parents/settings/${child.id}`}
              className="rounded-full border border-black/10 px-3 py-1.5 font-inter text-xs font-semibold text-[var(--gray)] active:scale-95 transition-transform text-center"
              style={{ touchAction: 'manipulation' }}
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>

        {/* XP progress */}
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="font-inter text-[10px] text-[var(--gray)]">XP to level {child.level + 1}</span>
            <span className="font-inter text-[10px] text-[var(--gray)]">{child.xp % 100}/100</span>
          </div>
          <div className="h-2 rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${levelProgress}%`,
                background: 'linear-gradient(90deg, var(--sky), var(--mint-dark))',
              }}
            />
          </div>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 divide-x divide-black/5 px-0">
        <div className="flex flex-col items-center gap-0.5 py-3">
          <span className="text-xl">📚</span>
          <span className="font-fredoka text-base font-semibold text-[var(--sky-dark)]">
            {masteredLetters}/{totalLetters}
          </span>
          <span className="font-inter text-[10px] text-[var(--gray)]">letters</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 py-3">
          <span className="text-xl">⏱️</span>
          <span className="font-fredoka text-base font-semibold text-[var(--mint-dark)]">
            {minutesThisWeek}m
          </span>
          <span className="font-inter text-[10px] text-[var(--gray)]">this week</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 py-3">
          <span className="text-xl">🎮</span>
          <span className="font-fredoka text-base font-semibold text-[var(--coral)]">
            Lv. {child.level}
          </span>
          <span className="font-inter text-[10px] text-[var(--gray)]">current level</span>
        </div>
      </div>

      {/* Quick play link */}
      <div className="px-4 pb-4">
        <Link
          href="/worlds"
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-2.5 font-inter text-sm font-semibold text-white active:scale-95 transition-transform"
          style={{
            touchAction: 'manipulation',
            background: 'linear-gradient(90deg, var(--coral), var(--coral-dark))',
          }}
        >
          🎮 Play now
        </Link>
      </div>
    </div>
  )
}
