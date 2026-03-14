'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PHONETIC_LETTERS, SERIES_INFO, getLettersBySeries, type SeriesId } from '@/lib/learning/phonetics'
import { loadAllProgressOffline } from '@/lib/learning/offlineSync'
import type { ItemProgress } from '@/lib/learning/adaptiveEngine'

interface LearningMapProps {
  userId: string
  profileName: string
  masteredSet: string[]  // itemIds masterite din Supabase
}

export default function LearningMap({ userId, profileName, masteredSet }: LearningMapProps) {
  const [offlineProgress, setOfflineProgress] = useState<Map<string, ItemProgress>>(new Map())

  // Merge progres Supabase cu IndexedDB (offline > Supabase pentru datele noi)
  useEffect(() => {
    loadAllProgressOffline().then(rows => {
      const map = new Map<string, ItemProgress>()
      for (const r of rows) map.set(r.itemId, r)
      setOfflineProgress(map)
    })
  }, [])

  function isMastered(itemId: string): boolean {
    const offline = offlineProgress.get(itemId)
    if (offline?.mastered) return true
    return masteredSet.includes(itemId)
  }

  function getLevel(itemId: string): number {
    return offlineProgress.get(itemId)?.level ?? 1
  }

  const totalLetters = PHONETIC_LETTERS.length
  const totalMastered = PHONETIC_LETTERS.filter(l => isMastered(`letter_${l.letter}`)).length

  // Prima literă nemasterită per serie → cea activă
  function getSeriesStatus(series: SeriesId): 'locked' | 'active' | 'complete' {
    const letters = getLettersBySeries(series)
    const allMastered = letters.every(l => isMastered(`letter_${l.letter}`))
    if (allMastered) return 'complete'

    // Seriile se deblochează secvențial
    if (series === 1) return 'active'
    const prevSeries = (series - 1) as SeriesId
    const prevLetters = getLettersBySeries(prevSeries)
    const prevComplete = prevLetters.every(l => isMastered(`letter_${l.letter}`))
    return prevComplete ? 'active' : 'locked'
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/worlds"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-black/5 text-[var(--gray)] active:scale-95 transition-transform font-nunito text-lg"
          style={{ touchAction: 'manipulation' }}
          aria-label="Înapoi la lumi"
        >
          ←
        </Link>
        <div className="text-center">
          <h1 className="font-fredoka text-xl font-semibold text-[var(--coral-dark)]">
            📚 Lumea Literelor
          </h1>
          <p className="font-nunito text-xs text-[var(--gray)]">
            {totalMastered}/{totalLetters} litere stăpânite
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress global */}
      <div
        className="mb-6 h-3 rounded-full bg-[var(--gray-light,#f0f0f0)] overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round((totalMastered / totalLetters) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${totalMastered} din ${totalLetters} litere stăpânite`}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(totalMastered / totalLetters) * 100}%`,
            background: 'linear-gradient(90deg, var(--sky), var(--coral))',
          }}
        />
      </div>

      {/* Mesaj personalizat Lio */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm border border-black/5">
        <span className="text-3xl flex-shrink-0">📖</span>
        <p className="font-nunito text-sm text-[var(--dark)]">
          {totalMastered === 0
            ? `Bună, ${profileName}! Hai să învățăm literele împreună! 🌟`
            : totalMastered === totalLetters
            ? `${profileName}, ai stăpânit toate literele! Ești fantastic! 🏆`
            : `${profileName}, mai ai ${totalLetters - totalMastered} litere de stăpânit! Continuă! 💪`}
        </p>
      </div>

      {/* Serii de litere */}
      <div className="flex flex-col gap-4">
        {([1, 2, 3] as SeriesId[]).map(series => {
          const info = SERIES_INFO[series]
          const status = getSeriesStatus(series)
          const letters = getLettersBySeries(series)
          const seriesMastered = letters.filter(l => isMastered(`letter_${l.letter}`)).length

          return (
            <div
              key={series}
              className={`rounded-3xl border p-4 transition-all ${
                status === 'locked'
                  ? 'border-black/5 bg-white/50 opacity-60'
                  : 'bg-white border-black/5 shadow-sm'
              }`}
            >
              {/* Header serie */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{info.emoji}</span>
                  <div>
                    <p
                      className="font-fredoka text-base font-semibold"
                      style={{ color: status === 'locked' ? 'var(--gray)' : info.color }}
                    >
                      {info.title}
                    </p>
                    <p className="font-nunito text-xs text-[var(--gray)]">
                      {seriesMastered}/{letters.length} litere
                    </p>
                  </div>
                </div>
                {status === 'locked' && (
                  <span className="text-xl" aria-label="Blocat">🔒</span>
                )}
                {status === 'complete' && (
                  <span className="text-xl" aria-label="Completat">✅</span>
                )}
              </div>

              {/* Literele din serie */}
              <div className="flex flex-wrap gap-2 mb-3">
                {letters.map(letter => {
                  const mastered = isMastered(`letter_${letter.letter}`)
                  const lvl = getLevel(`letter_${letter.letter}`)
                  return (
                    <div
                      key={letter.letter}
                      className="flex flex-col items-center gap-0.5"
                      title={`${letter.letter} — ${letter.word}`}
                    >
                      <div
                        className="flex items-center justify-center rounded-xl font-fredoka text-lg font-semibold transition-all"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: mastered
                            ? `${letter.color}22`
                            : status === 'locked'
                            ? '#f0f0f0'
                            : `${letter.color}11`,
                          border: mastered
                            ? `2px solid ${letter.color}`
                            : `2px solid ${letter.color}44`,
                          color: mastered ? letter.color : 'var(--gray)',
                        }}
                      >
                        {mastered ? '⭐' : letter.letter}
                      </div>
                      {!mastered && status !== 'locked' && lvl > 1 && (
                        <span className="font-nunito text-[9px] text-[var(--gray)]">
                          Nv.{lvl}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* CTA */}
              {status !== 'locked' && (
                <Link
                  href={`/play/learning/letters?series=${series}`}
                  className="flex items-center justify-center gap-2 w-full rounded-2xl py-3 font-nunito text-base font-semibold text-white active:scale-95 transition-transform shadow-sm"
                  style={{
                    touchAction: 'manipulation',
                    background: status === 'complete'
                      ? 'linear-gradient(90deg, var(--mint-dark), var(--sky))'
                      : `linear-gradient(90deg, ${info.color}, ${info.color}cc)`,
                  }}
                  aria-label={`${status === 'complete' ? 'Repetă' : 'Începe'} ${info.title}`}
                >
                  <span>{status === 'complete' ? '🔄 Repetă' : '▶️ Joacă'}</span>
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Spațiu pentru bottom nav */}
      <div className="h-6" />
    </div>
  )
}
