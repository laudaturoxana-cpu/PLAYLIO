import { WorldCard } from './WorldCard'

const WORLDS = [
  {
    icon: '🗺️',
    title: 'Adventure World',
    badge: 'Explore',
    badgeBg: 'rgba(102,187,106,0.18)',
    badgeTextColor: '#2E7D32',
    description: 'Explore 5 magical zones, collect treasures and complete missions with Lio your guide.',
    features: ['• 5 zones to explore', '• 50+ missions', '• Friendly characters'],
    bulletColor: '#388E3C',
    ctaLabel: 'Explore →',
    ctaHref: '/play/adventure',
    gradientStyle: 'linear-gradient(135deg, rgba(102,187,106,0.08) 0%, rgba(255,249,196,0.15) 100%)',
    accentColor: '#2E7D32',
  },
  {
    icon: '🏗️',
    title: 'Builder World',
    badge: 'Creativity',
    badgeBg: 'rgba(79,195,247,0.18)',
    badgeTextColor: '#0277BD',
    description: 'Build and decorate your own house. Choose furniture, colors and objects earned in the game.',
    features: ['• 6 rooms to decorate', '• 100+ objects', '• Your unique home'],
    bulletColor: '#0288D1',
    ctaLabel: 'Build →',
    ctaHref: '/play/builder',
    gradientStyle: 'linear-gradient(135deg, rgba(79,195,247,0.08) 0%, rgba(237,231,246,0.12) 100%)',
    accentColor: '#0277BD',
  },
  {
    icon: '📚',
    title: 'Learning World',
    badge: 'Education',
    badgeBg: 'rgba(255,112,67,0.15)',
    badgeTextColor: '#BF360C',
    description: '6 mini-games that teach letters, numbers, colors, shapes and logic — without kids even noticing they\'re learning.',
    features: ['• Letters & numbers', '• Logical thinking', '• Age-appropriate'],
    bulletColor: '#E64A19',
    ctaLabel: 'Learn →',
    ctaHref: '/play/learning',
    gradientStyle: 'linear-gradient(135deg, rgba(255,112,67,0.08) 0%, rgba(232,245,233,0.12) 100%)',
    accentColor: '#BF360C',
  },
  {
    icon: '🎮',
    title: 'Jump World',
    badge: 'Fun',
    badgeBg: 'rgba(255,213,79,0.22)',
    badgeTextColor: '#F57F17',
    description: 'Colorful platformer with progressive levels. Jump, dodge obstacles, collect stars and break records.',
    features: ['• 3 difficulty levels', '• 15 levels', '• Boss levels'],
    bulletColor: '#F57F17',
    ctaLabel: 'Play →',
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
            The 4 Playlio Worlds
          </h2>
          <p
            className="font-nunito"
            style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#757575', maxWidth: '560px', lineHeight: 1.6, margin: '0 auto' }}
          >
            Each world has unique adventures, rewards and lessons hidden in the gameplay
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
