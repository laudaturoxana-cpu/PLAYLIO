import { WorldCard } from './WorldCard'

const WORLDS = [
  {
    icon: '📚',
    title: 'Lumea Literelor',
    badge: 'Alfabet',
    badgeBg: 'rgba(255,112,67,0.15)',
    badgeTextColor: '#BF360C',
    description: 'Joc fonetic adaptiv cu 20 de litere grupate în 3 serii de dificultate. Copilul asociază litera cu imaginea și sunetul, iar nivelul crește automat cu fiecare răspuns corect.',
    features: ['• 20 litere în 3 serii progresive', '• 5 niveluri de dificultate per literă', '• Adaptat pe vârstă: 3–10 ani'],
    bulletColor: '#E64A19',
    ctaLabel: 'Explorează literele →',
    ctaHref: '/play/learning',
    gradientStyle: 'linear-gradient(135deg, rgba(255,112,67,0.08) 0%, rgba(255,249,196,0.12) 100%)',
    accentColor: '#BF360C',
  },
  {
    icon: '🔢',
    title: 'Lumea Cifrelor',
    badge: 'Matematică',
    badgeBg: 'rgba(255,183,77,0.20)',
    badgeTextColor: '#E65100',
    description: 'Sesiuni de câte 10 întrebări cu 4 tipuri de exerciții: numărare, adunare, scădere și comparații. Dificultatea se adaptează automat în funcție de vârstă.',
    features: ['• Numărare, adunare, scădere, comparații', '• Sesiuni de 10 întrebări cu streak bonus', '• Monede duble la serii de răspunsuri corecte'],
    bulletColor: '#E65100',
    ctaLabel: 'Explorează cifrele →',
    ctaHref: '/play/learning/numbers',
    gradientStyle: 'linear-gradient(135deg, rgba(255,213,79,0.10) 0%, rgba(255,224,178,0.15) 100%)',
    accentColor: '#E65100',
  },
  {
    icon: '🗺️',
    title: 'Lumea Aventurii',
    badge: 'Geografie',
    badgeBg: 'rgba(102,187,106,0.18)',
    badgeTextColor: '#2E7D32',
    description: 'Explorează 31 de țări din 7 continente — Europa, Africa, Asia, America de Nord, America de Sud, Oceania și Antarctica. Descoperă capitale, animale, monumente și curiozități.',
    features: ['• 31 țări din 7 continente', '• Quiz-uri despre geografie, cultură și natură', '• Blocuri de construcție deblocate ca recompensă'],
    bulletColor: '#388E3C',
    ctaLabel: 'Explorează lumea →',
    ctaHref: '/play/adventure',
    gradientStyle: 'linear-gradient(135deg, rgba(102,187,106,0.08) 0%, rgba(178,223,219,0.12) 100%)',
    accentColor: '#2E7D32',
  },
  {
    icon: '🏗️',
    title: 'Lumea Constructorului',
    badge: 'Creativitate',
    badgeBg: 'rgba(79,195,247,0.18)',
    badgeTextColor: '#0277BD',
    description: 'Constructor Minecraft-like în moduri 2D și 3D. Plasează blocuri câștigate prin explorarea celorlalte lumi și construiește ce îți imaginezi — natură, structuri, decoruri.',
    features: ['• 55+ tipuri de blocuri', '• Moduri 2D și 3D', '• Blocuri noi deblocate din Lumea Aventurii'],
    bulletColor: '#0288D1',
    ctaLabel: 'Construiește →',
    ctaHref: '/play/builder',
    gradientStyle: 'linear-gradient(135deg, rgba(79,195,247,0.08) 0%, rgba(237,231,246,0.12) 100%)',
    accentColor: '#0277BD',
  },
  {
    icon: '🎮',
    title: 'Lumea Saltului',
    badge: 'Acțiune',
    badgeBg: 'rgba(206,147,216,0.20)',
    badgeTextColor: '#6A1B9A',
    description: 'Platformer colorat cu 3 lumi și 9 niveluri progresive — Lumea Vrăjitoarelor, Norii de Cristal și Galaxia Stelelor. Fiecare lume se termină cu un nivel boss epic.',
    features: ['• 3 lumi: Vrăjitoare, Cristal, Galaxie', '• 9 niveluri + 3 niveluri boss', '• 4 personaje deblocabile: Lio, Luna, Roxy, Max'],
    bulletColor: '#7B1FA2',
    ctaLabel: 'Joacă →',
    ctaHref: '/play/jump',
    gradientStyle: 'linear-gradient(135deg, rgba(206,147,216,0.10) 0%, rgba(232,234,246,0.12) 100%)',
    accentColor: '#6A1B9A',
  },
]

export function WorldsSection() {
  return (
    <section
      id="lumi"
      className="px-4"
      style={{ backgroundColor: '#F5F5F5', paddingTop: 'clamp(48px, 8vw, 80px)', paddingBottom: 'clamp(48px, 8vw, 80px)' }}
      aria-labelledby="worlds-heading"
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto', width: '100%' }}>
        <div className="text-center" style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
          <h2
            id="worlds-heading"
            className="font-fredoka font-semibold"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: '#212121', marginBottom: '12px' }}
          >
            Cele 5 Lumi Playlio
          </h2>
          <p
            className="font-nunito"
            style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#757575', maxWidth: '560px', lineHeight: 1.6, margin: '0 auto' }}
          >
            Fiecare lume are aventuri unice, recompense și lecții ascunse în joc
          </p>
        </div>

        {/* Top row: 2 cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: 'clamp(16px, 3vw, 24px)', marginBottom: 'clamp(16px, 3vw, 24px)' }}
        >
          {WORLDS.slice(0, 2).map((world) => (
            <WorldCard key={world.title} {...world} />
          ))}
        </div>

        {/* Bottom row: 3 cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ gap: 'clamp(16px, 3vw, 24px)' }}
        >
          {WORLDS.slice(2).map((world) => (
            <WorldCard key={world.title} {...world} />
          ))}
        </div>
      </div>
    </section>
  )
}
