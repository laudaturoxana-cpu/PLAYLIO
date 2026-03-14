const BENEFIT_CARDS = [
  {
    icon: '🔒',
    iconBg: 'rgba(79,195,247,0.15)',
    title: 'Zero chat cu necunoscuți',
    text: 'Playlio nu are niciun sistem de chat sau comunicare între jucători. Copilul tău nu poate fi contactat de nimeni. Deloc.',
  },
  {
    icon: '📵',
    iconBg: 'rgba(102,187,106,0.15)',
    title: 'Fără reclame în niciun moment',
    text: 'Nici în versiunea gratuită nu există reclame. Nu pop-ups, nu bannere, nu video ads. Promisiunea noastră necondiționată.',
  },
  {
    icon: '🎓',
    iconBg: 'rgba(255,213,79,0.15)',
    title: 'Educație reală, joc real',
    text: 'Litere, cifre, logică și creativitate predate invizibil prin gameplay. Copilul tău avansează la școală fără să știe că "face teme".',
  },
  {
    icon: '🛡️',
    iconBg: 'rgba(206,147,216,0.15)',
    title: 'GDPR & date 100% protejate',
    text: 'Conform cu legislația europeană. Datele copilului nu sunt vândute, nu sunt partajate, nu sunt folosite pentru publicitate.',
  },
]

const TRUST_BADGES = [
  '✓ Adecvat 3–10 ani',
  '✓ Fără violență',
  '✓ Control parental complet',
  '✓ Conținut pozitiv',
  '✓ COPPA compliant',
]

export function ParentsSection() {
  return (
    <section
      id="parinti"
      className="px-4"
      style={{ backgroundColor: '#F5F5F5', paddingTop: 'clamp(48px, 8vw, 80px)', paddingBottom: 'clamp(48px, 8vw, 80px)' }}
      aria-labelledby="parents-heading"
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto', width: '100%' }}>
        {/* Heading */}
        <div className="text-center" style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
          <h2
            id="parents-heading"
            className="font-fredoka font-semibold"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: '#212121', marginBottom: '12px' }}
          >
            Conceput cu grijă pentru părinți
          </h2>
          <p
            className="font-nunito"
            style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#757575', maxWidth: '560px', lineHeight: 1.6, margin: '0 auto' }}
          >
            Tu decizi. Tu controlezi. Copilul tău se bucură în siguranță deplină.
          </p>
        </div>

        {/* Benefit cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: 'clamp(14px, 2.5vw, 20px)', marginBottom: 'clamp(32px, 5vw, 48px)' }}
        >
          {BENEFIT_CARDS.map((card) => (
            <article
              key={card.title}
              className="flex gap-4"
              style={{
                background: '#FAFAFA',
                border: '1.5px solid rgba(0,0,0,0.07)',
                borderRadius: '20px',
                padding: 'clamp(16px, 3vw, 24px)',
                alignItems: 'flex-start',
              }}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: '52px',
                  height: '52px',
                  minWidth: '52px',
                  borderRadius: '14px',
                  backgroundColor: card.iconBg,
                  fontSize: '24px',
                }}
                aria-hidden="true"
              >
                {card.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3
                  className="font-fredoka font-semibold"
                  style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#212121', marginBottom: '4px' }}
                >
                  {card.title}
                </h3>
                <p
                  className="font-nunito"
                  style={{ fontSize: 'clamp(13px, 1.8vw, 14px)', color: '#757575', lineHeight: 1.6 }}
                >
                  {card.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap justify-center"
          style={{ gap: '10px', marginBottom: 'clamp(32px, 5vw, 48px)' }}
          role="list"
          aria-label="Garanții de siguranță"
        >
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              role="listitem"
              className="inline-flex items-center font-nunito font-semibold"
              style={{
                background: 'white',
                border: '1.5px solid #A5D6A7',
                borderRadius: '9999px',
                padding: '8px 16px',
                fontSize: 'clamp(12px, 1.8vw, 14px)',
                color: '#388E3C',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Testimonial */}
        <div
          className="text-center"
          style={{
            background: 'white',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '20px',
            padding: 'clamp(20px, 4vw, 32px)',
            maxWidth: '600px',
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex justify-center gap-1" style={{ marginBottom: '16px' }} aria-label="5 stele din 5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} aria-hidden="true" style={{ color: '#FFD54F', fontSize: '20px' }}>★</span>
            ))}
          </div>
          <blockquote>
            <p
              className="font-nunito italic"
              style={{ fontSize: 'clamp(14px, 2.5vw, 17px)', color: '#212121', lineHeight: 1.7, marginBottom: '20px' }}
            >
              &ldquo;Andrei cere mereu &lsquo;encore la jocul cu litere&rsquo;. Nu și-a dat seama niciodată că de fapt exersează pentru școală.&rdquo;
            </p>
            <footer className="flex items-center justify-center gap-3">
              <div
                className="flex items-center justify-center font-fredoka font-semibold text-white"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#CE93D8',
                  fontSize: '13px',
                }}
                aria-hidden="true"
              >
                MC
              </div>
              <cite className="not-italic font-nunito font-semibold" style={{ fontSize: '14px', color: '#212121' }}>
                Maria C., mamă, București
              </cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
