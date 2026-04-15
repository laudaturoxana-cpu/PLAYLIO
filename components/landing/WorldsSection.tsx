import { WorldCard } from './WorldCard'

const WORLDS = [
  {
    icon: '🗺️',
    title: 'Lumea Aventurii',
    badge: 'Geografie',
    badgeBg: 'rgba(102,187,106,0.18)',
    badgeTextColor: '#2E7D32',
    description: 'Explorează 31 de țări din 7 continente — Europa, Africa, Asia, America, Oceania și Antarctica. Descoperă capitale, animale, monumente și curiozități fascinante.',
    features: ['• 31 țări din 7 continente', '• Quiz-uri despre geografie, cultură și natură', '• Stele, monede și blocuri de construcție deblocate'],
    bulletColor: '#388E3C',
    ctaLabel: 'Explorează →',
    ctaHref: '/play/adventure',
    gradientStyle: 'linear-gradient(135deg, rgba(102,187,106,0.08) 0%, rgba(255,249,196,0.15) 100%)',
    accentColor: '#2E7D32',
  },
  {
    icon: '🏗️',
    title: 'Lumea Constructorului',
    badge: 'Creativitate',
    badgeBg: 'rgba(79,195,247,0.18)',
    badgeTextColor: '#0277BD',
    description: 'Constructor Minecraft-like în 2D și 3D. Plasează blocuri câștigate în joc și construiește ce îți imaginezi — cu 55+ tipuri de blocuri: natură, apă, materiale, structuri și decoruri.',
    features: ['• 55+ tipuri de blocuri', '• Moduri 2D și 3D', '• Blocuri noi deblocate prin explorarea lumilor'],
    bulletColor: '#0288D1',
    ctaLabel: 'Construiește →',
    ctaHref: '/play/builder',
    gradientStyle: 'linear-gradient(135deg, rgba(79,195,247,0.08) 0%, rgba(237,231,246,0.12) 100%)',
    accentColor: '#0277BD',
  },
  {
    icon: '📚',
    title: 'Lumea Învățării',
    badge: 'Educație',
    badgeBg: 'rgba(255,112,67,0.15)',
    badgeTextColor: '#BF360C',
    description: 'Două mini-jocuri adaptive: Litere (20 litere ale alfabetului cu imagini și sunete) și Cifre (numărare, adunare, scădere, comparații). Nivelul de dificultate crește automat cu fiecare răspuns corect.',
    features: ['• 20 litere cu 5 niveluri de dificultate', '• Matematică: numărare, adunare, scădere', '• Adaptat automat pe vârstă (3–10 ani)'],
    bulletColor: '#E64A19',
    ctaLabel: 'Învață →',
    ctaHref: '/play/learning',
    gradientStyle: 'linear-gradient(135deg, rgba(255,112,67,0.08) 0%, rgba(232,245,233,0.12) 100%)',
    accentColor: '#BF360C',
  },
  {
    icon: '🎮',
    title: 'Lumea Saltului',
    badge: 'Acțiune',
    badgeBg: 'rgba(255,213,79,0.22)',
    badgeTextColor: '#F57F17',
    description: 'Platformer colorat cu 3 lumi și 12 niveluri progresive, fiecare cu un nivel boss. Sari peste obstacole, colectează stele și cucerește recorduri.',
    features: ['• 3 lumi cu 4 niveluri fiecare', '• Niveluri boss la finalul fiecărei lumi', '• Dificultate progresivă'],
    bulletColor: '#F57F17',
    ctaLabel: 'Joacă →',
    ctaHref: '/play/jump',
    gradientStyle: 'linear-gradient(135deg, rgba(255,213,79,0.10) 0%, rgba(232,234,246,0.12) 100%)',
    accentColor: '#F57F17',
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
            Cele 4 Lumi Playlio
          </h2>
          <p
            className="font-nunito"
            style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#757575', maxWidth: '560px', lineHeight: 1.6, margin: '0 auto' }}
          >
            Fiecare lume are aventuri unice, recompense și lecții ascunse în joc
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: 'clamp(16px, 3vw, 24px)' }}
        >
          {WORLDS.map((world) => (
            <WorldCard key={world.title} {...world} />
          ))}
        </div>
      </div>
    </section>
  )
}
