'use client'

import type { ZoneQuest } from '@/lib/adventure/zones'

interface QuestTrackerProps {
  quests: ZoneQuest[]
  collectedStars: number
  completedQuestIds: string[]
}

export default function QuestTracker({
  quests,
  collectedStars,
  completedQuestIds,
}: QuestTrackerProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-nunito text-xs font-semibold text-[var(--gray)] uppercase tracking-wide">
        Quests
      </p>
      {quests.map(quest => {
        const done = completedQuestIds.includes(quest.id)
        const active = !done && collectedStars >= quest.requiredStars
        const progress = Math.min(collectedStars, quest.requiredStars)
        const pct = (progress / quest.requiredStars) * 100

        return (
          <div
            key={quest.id}
            className={`rounded-2xl border p-3 transition-all ${
              done
                ? 'bg-[var(--mint-dark,#388E3C)]/10 border-[var(--mint-dark)]/30'
                : active
                ? 'bg-[var(--sun)]/10 border-[var(--sun)]/30'
                : 'bg-white border-black/5'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0">{quest.rewardEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-nunito text-sm font-semibold text-[var(--dark)] truncate">
                  {quest.title}
                </p>
                <p className="font-nunito text-xs text-[var(--gray)]">
                  {quest.description}
                </p>
                {/* Progress bar */}
                {!done && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          background: active
                            ? 'var(--sun)'
                            : 'var(--mint-dark)',
                        }}
                      />
                    </div>
                    <span className="font-nunito text-[10px] text-[var(--gray)] flex-shrink-0">
                      {progress}/{quest.requiredStars} ⭐
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1">
                {done ? (
                  <span className="text-base">✅</span>
                ) : (
                  <div className="flex items-center gap-0.5">
                    <span className="text-xs">🪙</span>
                    <span className="font-fredoka text-sm font-semibold text-[var(--sun-dark)]">
                      {quest.rewardCoins}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
