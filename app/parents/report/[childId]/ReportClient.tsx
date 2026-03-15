'use client'

import Link from 'next/link'
import type { WeeklyReport } from '@/lib/parents/weeklyReport'
import StatCard from '@/components/parents/StatCard'

interface ReportClientProps {
  report: WeeklyReport
}

export default function ReportClient({ report }: ReportClientProps) {
  const weekStartDate = new Date(report.weekStart)
  const weekEndDate = new Date(report.weekEnd)
  const dateRange = `${weekStartDate.getDate()}.${weekStartDate.getMonth() + 1} — ${weekEndDate.getDate()}.${weekEndDate.getMonth() + 1}.${weekEndDate.getFullYear()}`

  const topPercent = 100 - report.percentileRank
  const levelLabel = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'][
    Math.min(4, report.averageAdaptiveLevel - 1)
  ]

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, rgba(79,195,247,0.04) 0%, rgba(255,213,79,0.04) 100%)',
        backgroundColor: 'var(--white)',
      }}
    >
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/parents/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform text-lg"
            style={{ touchAction: 'manipulation' }}
            aria-label="Back"
          >
            ←
          </Link>
          <div className="text-center">
            <h1 className="font-fredoka text-xl font-semibold text-[var(--sky-dark)]">
              📊 Weekly Report
            </h1>
            <p className="font-inter text-xs text-[var(--gray)]">{dateRange}</p>
          </div>
          <div className="w-10" />
        </div>

        {/* Intro */}
        <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl text-2xl"
              style={{ background: 'rgba(79,195,247,0.12)', border: '2px solid rgba(79,195,247,0.25)' }}
            >
              🦁
            </div>
            <div>
              <p className="font-fredoka text-lg font-semibold text-[var(--dark)]">
                {report.childName}
              </p>
              <p className="font-inter text-xs text-[var(--gray)]">
                Adaptive level: <strong>{levelLabel}</strong>
              </p>
            </div>
          </div>

          {/* Summary text — exact format from spec */}
          <div className="rounded-2xl bg-[var(--sky)]/06 border border-[var(--sky)]/15 p-4">
            <p className="font-inter text-sm text-[var(--dark)] leading-relaxed">
              <strong>{report.childName}</strong> played{' '}
              <strong>{report.minutesThisWeek} minutes</strong>
              {report.minutesDelta !== 0 && (
                <span style={{ color: report.minutesDelta > 0 ? 'var(--mint-dark)' : 'var(--coral)' }}>
                  {' '}({report.minutesDelta > 0 ? '↑' : '↓'} {Math.abs(report.minutesDelta)} min vs last week)
                </span>
              )}
              .
            </p>
            {report.newlyMasteredLetters.length > 0 && (
              <p className="font-inter text-sm text-[var(--dark)] mt-2">
                Mastered <strong>{report.newlyMasteredLetters.length} new letters</strong>:{' '}
                <span className="font-semibold text-[var(--mint-dark)]">
                  {report.newlyMasteredLetters.join(', ')}
                </span>
                .
              </p>
            )}
            {report.difficultLetters.length > 0 && (
              <p className="font-inter text-sm text-[var(--dark)] mt-2">
                Having difficulty with:{' '}
                {report.difficultLetters.map((l, i) => (
                  <span key={l}>
                    <strong>letter {l}</strong>
                    {report.difficultLetterNotes[l] && (
                      <span className="text-[var(--gray)]"> ({report.difficultLetterNotes[l]})</span>
                    )}
                    {i < report.difficultLetters.length - 1 ? ', ' : ''}
                  </span>
                ))}.
              </p>
            )}
            <p className="font-inter text-sm text-[var(--gray)] mt-2">
              Performance: <strong className="text-[var(--coral)]">top {topPercent}%</strong>{' '}
              among {report.childAge}-year-olds in Playlio.
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            emoji="⏱️"
            label="Minutes played"
            value={`${report.minutesThisWeek}m`}
            delta={report.minutesDelta}
            color="var(--sky-dark)"
          />
          <StatCard
            emoji="📚"
            label="Total letters mastered"
            value={`${report.totalMasteredLetters.length}/14`}
            color="var(--mint-dark)"
          />
          <StatCard
            emoji="⭐"
            label="Adventure stars"
            value={report.adventureStarsThisWeek}
            color="var(--sun-dark)"
            small
          />
          <StatCard
            emoji="🎮"
            label="Jump games"
            value={report.jumpGamesThisWeek}
            color="var(--coral)"
            small
          />
        </div>

        {/* Mastered letters */}
        {report.totalMasteredLetters.length > 0 && (
          <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-4 mb-4">
            <p className="font-inter text-xs font-semibold text-[var(--dark)] mb-3">
              📚 Letters mastered ({report.totalMasteredLetters.length}/14)
            </p>
            <div className="flex flex-wrap gap-2">
              {['S','A','T','P','I','N','E','R','O','D','C','M','L','B'].map(letter => {
                const mastered = report.totalMasteredLetters.includes(letter)
                const isNew = report.newlyMasteredLetters.includes(letter)
                return (
                  <div
                    key={letter}
                    className="flex items-center justify-center rounded-xl font-fredoka text-lg font-semibold"
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: mastered ? 'rgba(56,142,60,0.12)' : 'rgba(0,0,0,0.04)',
                      border: isNew
                        ? '2px solid var(--mint-dark)'
                        : mastered
                        ? '2px solid rgba(56,142,60,0.4)'
                        : '2px solid rgba(0,0,0,0.08)',
                      color: mastered ? 'var(--mint-dark)' : 'var(--gray)',
                      boxShadow: isNew ? '0 0 0 3px rgba(56,142,60,0.15)' : 'none',
                    }}
                    title={isNew ? 'Mastered this week!' : mastered ? 'Mastered' : 'Not mastered yet'}
                  >
                    {mastered ? '⭐' : letter}
                  </div>
                )
              })}
            </div>
            {report.newlyMasteredLetters.length > 0 && (
              <p className="font-inter text-xs text-[var(--mint-dark)] mt-2">
                ✨ Green border = mastered this week
              </p>
            )}
          </div>
        )}

        {/* Difficult letters */}
        {report.difficultLetters.length > 0 && (
          <div className="rounded-3xl bg-[var(--sun)]/08 border border-[var(--sun)]/25 p-4 mb-4">
            <p className="font-inter text-xs font-semibold text-[var(--sun-dark)] mb-2">
              ⚠️ Difficult letters
            </p>
            <div className="flex flex-col gap-2">
              {report.difficultLetters.map(letter => (
                <div key={letter} className="flex items-start gap-2">
                  <div
                    className="flex items-center justify-center rounded-xl font-fredoka text-lg font-semibold flex-shrink-0"
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'rgba(255,193,7,0.15)',
                      border: '2px solid rgba(255,193,7,0.4)',
                      color: 'var(--sun-dark)',
                    }}
                  >
                    {letter}
                  </div>
                  <p className="font-inter text-xs text-[var(--dark)] leading-relaxed pt-1">
                    {report.difficultLetterNotes[letter]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="rounded-3xl bg-white border border-black/5 shadow-sm p-4 mb-4">
          <p className="font-inter text-xs font-semibold text-[var(--dark)] mb-3">
            💡 Home recommendations
          </p>
          <div className="flex flex-col gap-2">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-base flex-shrink-0 mt-0.5">
                  {i === 0 ? '📌' : i === 1 ? '🎯' : '✅'}
                </span>
                <p className="font-inter text-sm text-[var(--dark)] leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Percentile */}
        <div
          className="rounded-3xl p-5 text-center mb-6"
          style={{ background: 'linear-gradient(135deg, var(--sky), var(--purple))' }}
        >
          <p className="font-inter text-sm font-semibold text-white/80 mb-1">Comparative performance</p>
          <p className="font-fredoka text-4xl font-semibold text-white">
            Top {topPercent}%
          </p>
          <p className="font-inter text-xs text-white/70 mt-1">
            among {report.childAge}-year-olds in Playlio
          </p>
        </div>

        <Link
          href="/parents/dashboard"
          className="flex items-center justify-center gap-2 w-full rounded-full border-2 border-[rgba(0,0,0,0.08)] py-3 font-inter text-base font-semibold text-[var(--gray)] active:scale-95 transition-transform"
          style={{ touchAction: 'manipulation' }}
        >
          ← Back to dashboard
        </Link>

        <p className="font-inter text-xs text-[var(--gray)] text-center mt-6">
          © 2026 Playlio · Auto-generated report
        </p>
      </div>
    </div>
  )
}
