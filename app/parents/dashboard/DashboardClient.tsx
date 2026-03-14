'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingModal } from '@/components/shared/OnboardingModal'
import type { Profile } from '@/types'

interface Props {
  parentProfile: Profile
  children: Profile[]
  showOnboarding: boolean
}

export function DashboardClient({ parentProfile, children, showOnboarding }: Props) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(showOnboarding)

  function handleOnboardingComplete() {
    setModalOpen(false)
    router.refresh()
  }

  return (
    <>
      {modalOpen && (
        <OnboardingModal
          parentId={parentProfile.id}
          onComplete={handleOnboardingComplete}
        />
      )}

      <div className="flex flex-col gap-8">
        {/* Welcome header */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-[var(--shadow-sm)] border border-black/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-fredoka text-3xl font-semibold text-[var(--dark)] mb-1">
                Bun venit,{' '}
                {parentProfile.full_name?.split(' ')[0] ?? 'Părinte'}! 👋
              </h1>
              <p className="font-nunito text-base text-[var(--gray)]">
                {children.length === 0
                  ? 'Creează profilul copilului pentru a începe.'
                  : `Ai ${children.length} ${children.length === 1 ? 'copil' : 'copii'} în Playlio.`}
              </p>
            </div>
            {children.length === 0 && (
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center rounded-full font-nunito font-bold text-base text-white px-6 py-3 min-h-[48px] transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: 'var(--coral)', boxShadow: 'var(--shadow-coral)' }}
              >
                + Adaugă profil copil
              </button>
            )}
          </div>
        </div>

        {/* Profiluri copii */}
        {children.length > 0 && (
          <div>
            <h2 className="font-fredoka text-2xl font-semibold text-[var(--dark)] mb-4">
              Profiluri copii
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="rounded-3xl bg-white p-6 shadow-[var(--shadow-sm)] border border-black/5 flex flex-col gap-4"
                >
                  {/* Avatar placeholder */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-fredoka text-2xl font-semibold text-white"
                    style={{ backgroundColor: 'var(--sky)' }}
                    aria-hidden="true"
                  >
                    {child.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="font-fredoka text-xl font-semibold text-[var(--dark)]">
                      {child.full_name}
                    </p>
                    <p className="font-nunito text-sm text-[var(--gray)]">
                      Nivel {child.level} · {child.coins} coins
                    </p>
                  </div>
                  <a
                    href={`/worlds?child=${child.id}`}
                    className="inline-flex items-center justify-center rounded-full font-nunito font-semibold text-sm text-white px-4 py-2.5 min-h-[40px] transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: 'var(--mint-dark)' }}
                  >
                    Joacă acum ca {child.full_name?.split(' ')[0]}
                  </a>
                </div>
              ))}

              {/* Card add child */}
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-3xl border-2 border-dashed border-black/15 p-6 flex flex-col items-center justify-center gap-3 text-[var(--gray)] hover:border-[var(--coral)] hover:text-[var(--coral)] transition-all duration-200 min-h-[180px]"
              >
                <span className="text-3xl" aria-hidden="true">+</span>
                <span className="font-nunito text-sm font-semibold">Adaugă copil</span>
              </button>
            </div>
          </div>
        )}

        {/* Placeholder Sprint 8 */}
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-[var(--shadow-sm)] border border-black/5">
          <h2 className="font-fredoka text-2xl font-semibold text-[var(--dark)] mb-2">
            Rapoarte săptămânale
          </h2>
          <p className="font-nunito text-base text-[var(--gray)]">
            Statisticile detaliate și rapoartele educaționale vor fi disponibile în curând.
          </p>
        </div>
      </div>
    </>
  )
}
