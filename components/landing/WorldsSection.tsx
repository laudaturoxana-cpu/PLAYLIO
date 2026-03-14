import { WorldCard } from './WorldCard'

const WORLDS = [
  {
    icon: '🗺️',
    title: 'Adventure World',
    badge: 'Explorare',
    badgeColor: 'var(--mint-dark)',
    description:
      'Explorează 5 zone magice, colectează comori și completează misiuni cu Lio ghidul tău.',
    features: ['• 5 zone de explorat', '• 50+ misiuni', '• Personaje prietenoase'],
    ctaLabel: 'Explorează →',
    ctaHref: '/play/adventure',
    gradient: 'bg-[linear-gradient(135deg,rgba(102,187,106,0.08)_0%,rgba(255,249,196,0.15)_100%)]',
    accentColor: 'var(--mint-dark)',
  },
  {
    icon: '🏗️',
    title: 'Builder World',
    badge: 'Creativitate',
    badgeColor: 'var(--sky-dark)',
    description:
      'Construiește și decorează propria casă. Alege mobilă, culori și obiecte câștigate în joc.',
    features: ['• 6 camere de decorat', '• 100+ obiecte', '• Casa ta unică'],
    ctaLabel: 'Construiește →',
    ctaHref: '/play/builder',
    gradient: 'bg-[linear-gradient(135deg,rgba(79,195,247,0.08)_0%,rgba(206,147,216,0.12)_100%)]',
    accentColor: 'var(--sky-dark)',
  },
  {
    icon: '📚',
    title: 'Learning World',
    badge: 'Educație',
    badgeColor: 'var(--coral-dark)',
    description:
      '6 mini-jocuri care predau litere, cifre, culori, forme și logică — fără ca cei mici să simtă că învață.',
    features: ['• Litere & cifre', '• Gândire logică', '• Adaptat vârstei'],
    ctaLabel: 'Învață →',
    ctaHref: '/play/learning',
    gradient: 'bg-[linear-gradient(135deg,rgba(255,112,67,0.08)_0%,rgba(102,187,106,0.10)_100%)]',
    accentColor: 'var(--coral-dark)',
  },
  {
    icon: '🎮',
    title: 'Jump World',
    badge: 'Distracție',
    badgeColor: '#F57F17',
    description:
      'Platformer colorat cu nivele progresive. Sari, evită obstacole, colectează stele și bate recorduri.',
    features: ['• 3 dificultăți', '• 15 nivele', '• Boss levels'],
    ctaLabel: 'Joacă →',
    ctaHref: '/play/jump',
    gradient: 'bg-[linear-gradient(135deg,rgba(255,213,79,0.10)_0%,rgba(255,249,196,0.20)_100%)]',
    accentColor: '#F57F17',
  },
]

export function WorldsSection() {
  return (
    <section
      id="lumi"
      className="px-4 py-20 md:py-28 bg-[var(--light)]"
      aria-labelledby="worlds-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="worlds-heading"
            className="font-fredoka text-4xl md:text-5xl font-semibold text-[var(--dark)] mb-4"
          >
            Cele 4 Lumi Playlio
          </h2>
          <p className="font-nunito text-lg md:text-xl text-[var(--gray)] max-w-2xl mx-auto">
            Fiecare lume are aventuri unice, recompense și lecții ascunse în joc
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WORLDS.map((world) => (
            <WorldCard key={world.title} {...world} />
          ))}
        </div>
      </div>
    </section>
  )
}
