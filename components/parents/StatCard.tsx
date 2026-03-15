interface StatCardProps {
  emoji: string
  label: string
  value: string | number
  delta?: number       // pozitiv = verde, negativ = roșu
  deltaLabel?: string  // ex: "față de săpt. trecută"
  color?: string
  small?: boolean
}

export default function StatCard({
  emoji,
  label,
  value,
  delta,
  deltaLabel = 'vs last week',
  color = 'var(--sky)',
  small = false,
}: StatCardProps) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-2xl bg-white border border-black/5 shadow-sm ${small ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-center gap-2">
        <span className={small ? 'text-lg' : 'text-2xl'}>{emoji}</span>
        <span className="font-inter text-xs text-[var(--gray)] leading-tight">{label}</span>
      </div>
      <p
        className={`font-fredoka font-semibold leading-tight ${small ? 'text-xl' : 'text-3xl'}`}
        style={{ color }}
      >
        {value}
      </p>
      {delta !== undefined && (
        <p className="font-inter text-xs" style={{ color: delta >= 0 ? 'var(--mint-dark)' : 'var(--coral)' }}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)} min {deltaLabel}
        </p>
      )}
    </div>
  )
}
