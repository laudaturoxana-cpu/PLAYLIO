'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingModal } from '@/components/shared/OnboardingModal'
import ChildCard from '@/components/parents/ChildCard'

interface ChildProfile {
  id: string
  full_name: string | null
  level: number
  coins: number
  xp: number
}

interface ParentProfile {
  id: string
  full_name: string | null
  role: 'child' | 'parent'
  coins: number
  level: number
  xp: number
}

interface Props {
  parentProfile: ParentProfile
  children: ChildProfile[]
  childStats: Record<string, { masteredLetters: number; minutesThisWeek: number }>
  totalLetters: number
  showOnboarding: boolean
}

export function DashboardClient({ parentProfile, children, childStats, totalLetters, showOnboarding }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(showOnboarding)

  function handleOnboardingComplete() {
    setModalOpen(false)
    router.refresh()
  }

  const parentName = parentProfile.full_name?.split(' ')[0] ?? 'Parent'
  const totalMinutesThisWeek = Object.values(childStats).reduce((s, c) => s + c.minutesThisWeek, 0)
  const totalMasteredLetters = Object.values(childStats).reduce((s, c) => s + c.masteredLetters, 0)

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, rgba(79,195,247,0.04) 0%, rgba(255,213,79,0.04) 100%)',
        backgroundColor: 'var(--white)',
      }}
    >
      {modalOpen && (
        <OnboardingModal
          parentId={parentProfile.id}
          onComplete={handleOnboardingComplete}
        />
      )}

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-inter text-sm text-[var(--gray)]">Welcome,</p>
            <h1 className="font-fredoka text-2xl font-semibold text-[var(--dark)]">
              {parentName} 👋
            </h1>
          </div>
          <a
            href="/auth/signout"
            className="font-inter text-xs text-[var(--gray)] underline"
            style={{ touchAction: 'manipulation' }}
          >
            Sign out
          </a>
        </div>

        {/* Overview stats — shown only if children exist */}
        {children.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">⏱️</span>
                <span className="font-inter text-xs text-[var(--gray)]">Minutes played this week</span>
              </div>
              <p className="font-fredoka text-3xl font-semibold text-[var(--sky-dark)]">
                {totalMinutesThisWeek}m
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-black/5 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📚</span>
                <span className="font-inter text-xs text-[var(--gray)]">Letters mastered</span>
              </div>
              <p className="font-fredoka text-3xl font-semibold text-[var(--coral)]">
                {totalMasteredLetters}/{totalLetters * children.length}
              </p>
            </div>
          </div>
        )}

        {/* Children */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-inter text-sm font-semibold text-[var(--dark)]">
            Your children ({children.length})
          </h2>
          <button
            onClick={() => setModalOpen(true)}
            className="font-inter text-xs text-[var(--sky)] underline"
            style={{ touchAction: 'manipulation' }}
          >
            + Add child
          </button>
        </div>

        {children.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl bg-white border border-black/5 shadow-sm p-8 text-center">
            <span className="text-5xl">👶</span>
            <div>
              <p className="font-inter text-base font-semibold text-[var(--dark)]">
                No children added yet
              </p>
              <p className="font-inter text-sm text-[var(--gray)] mt-1">
                Add your first child to start the adventure!
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-full bg-[var(--coral)] px-6 py-3 font-inter text-base font-semibold text-white shadow-md active:scale-95 transition-transform"
              style={{ touchAction: 'manipulation' }}
            >
              Add child 🎉
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {children.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                masteredLetters={childStats[child.id]?.masteredLetters ?? 0}
                totalLetters={totalLetters}
                minutesThisWeek={childStats[child.id]?.minutesThisWeek ?? 0}
              />
            ))}
          </div>
        )}

        {/* Tip for parents */}
        <div className="mt-6 rounded-2xl bg-[var(--sky)]/08 border border-[var(--sky)]/20 p-4">
          <p className="font-inter text-xs font-semibold text-[var(--sky-dark)] mb-1">💡 Tip</p>
          <p className="font-inter text-sm text-[var(--dark)]">
            {children.length === 0
              ? 'Playlio is designed for ages 3-10. Short sessions of 10-15 min/day give the best results!'
              : totalMinutesThisWeek < 10
              ? 'Low activity this week. Play together with your child — it\'s more motivating! 🎮'
              : 'Great! Daily consistency of 10-15 minutes makes a real difference in literacy.'}
          </p>
        </div>

        <p className="font-inter text-xs text-[var(--gray)] text-center mt-8">
          © 2026 Playlio · Safe for kids
        </p>
      </div>
    </div>
  )
}
