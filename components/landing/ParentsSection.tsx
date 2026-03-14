const BENEFIT_CARDS = [
  {
    icon: '🔒',
    iconBg: 'rgba(255,112,67,0.12)',
    title: 'Zero chat cu necunoscuți',
    text: 'Playlio nu are niciun sistem de chat sau comunicare între jucători. Copilul tău nu poate fi contactat de nimeni. Deloc.',
  },
  {
    icon: '📵',
    iconBg: 'rgba(79,195,247,0.12)',
    title: 'Fără reclame în niciun moment',
    text: 'Nici în versiunea gratuită nu există reclame. Nu pop-ups, nu bannere, nu video ads. Promisiunea noastră necondiționată.',
  },
  {
    icon: '🎓',
    iconBg: 'rgba(102,187,106,0.12)',
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
      className="px-4 py-20 md:py-28 bg-[var(--light)]"
      aria-labelledby="parents-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="parents-heading"
            className="font-fredoka text-4xl md:text-5xl font-semibold text-[var(--dark)] mb-4"
          >
            Conceput cu grijă pentru părinți
          </h2>
          <p className="font-nunito text-lg md:text-xl text-[var(--gray)] max-w-2xl mx-auto">
            Tu decizi. Tu controlezi. Copilul tău se bucură în siguranță deplină.
          </p>
        </div>

        {/* Benefit cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {BENEFIT_CARDS.map((card) => (
            <article
              key={card.title}
              className="flex gap-5 rounded-3xl bg-white p-6 shadow-[var(--shadow-sm)] border border-black/5 transition-all duration-250 hover:shadow-[var(--shadow-md)]"
            >
              <div
                className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl text-2xl"
                style={{ backgroundColor: card.iconBg }}
                aria-hidden="true"
              >
                {card.icon}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-fredoka text-xl font-semibold text-[var(--dark)]">
                  {card.title}
                </h3>
                <p className="font-nunito text-sm text-[var(--gray)] leading-relaxed">
                  {card.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Trust badges */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-12"
          role="list"
          aria-label="Garanții de siguranță"
        >
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              role="listitem"
              className="inline-flex items-center rounded-full px-4 py-2 font-nunito text-sm font-semibold bg-white shadow-[var(--shadow-sm)] border border-[var(--mint-light)] text-[var(--mint-dark)]"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-[var(--shadow-sm)] border border-black/5 text-center">
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-4" aria-label="5 stele din 5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-2xl" aria-hidden="true">⭐</span>
            ))}
          </div>
          <blockquote>
            <p className="font-nunito text-base md:text-lg text-[var(--dark)] italic leading-relaxed mb-6">
              &ldquo;Andrei cere mereu &lsquo;encore la jocul cu litere&rsquo;. Nu și-a dat seama niciodată că de fapt exersează pentru școală.&rdquo;
            </p>
            <footer className="flex items-center justify-center gap-3">
              {/* Avatar placeholder */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-fredoka font-semibold text-white text-sm"
                style={{ backgroundColor: 'var(--purple)' }}
                aria-hidden="true"
              >
                MC
              </div>
              <cite className="not-italic font-nunito font-semibold text-sm text-[var(--dark)]">
                Maria C., mamă, București
              </cite>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
