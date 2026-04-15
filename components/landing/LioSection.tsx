function LioSVG({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="44" r="30" fill="#F9A825" />
      <circle cx="40" cy="44" r="24" fill="#FFD54F" />
      <circle cx="18" cy="24" r="7" fill="#F9A825" />
      <circle cx="62" cy="24" r="7" fill="#F9A825" />
      <circle cx="18" cy="24" r="4" fill="#FFCA28" />
      <circle cx="62" cy="24" r="4" fill="#FFCA28" />
      <circle cx="40" cy="46" r="18" fill="#FFD54F" />
      <circle cx="33" cy="42" r="4" fill="#212121" />
      <circle cx="47" cy="42" r="4" fill="#212121" />
      <circle cx="34.2" cy="40.8" r="1.5" fill="white" />
      <circle cx="48.2" cy="40.8" r="1.5" fill="white" />
      <ellipse cx="40" cy="49" rx="3" ry="2" fill="#E65100" />
      <path d="M 33 54 Q 40 61 47 54" stroke="#212121" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="22" y1="50" x2="34" y2="51" stroke="#212121" strokeWidth="1" opacity="0.4" />
      <line x1="22" y1="54" x2="34" y2="53" stroke="#212121" strokeWidth="1" opacity="0.4" />
      <line x1="46" y1="51" x2="58" y2="50" stroke="#212121" strokeWidth="1" opacity="0.4" />
      <line x1="46" y1="53" x2="58" y2="54" stroke="#212121" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

const LIO_ROLES = [
  {
    icon: '🎓',
    title: 'Profesor de litere',
    text: 'Explică sunetele literelor cu analogii vizuale ("B sună ca BUUUM! Ca balonul!") și escaladează pedagogia în funcție de câte greșeli face copilul.',
    color: '#1565C0',
    bg: 'rgba(21,101,192,0.07)',
  },
  {
    icon: '🔢',
    title: 'Profesor de matematică',
    text: 'Folosește mere, degete și obiecte concrete ca să explice adunările și scăderile. Nu spune niciodată "greșit" — ghidează copilul spre răspuns.',
    color: '#2E7D32',
    bg: 'rgba(46,125,50,0.07)',
  },
  {
    icon: '🌍',
    title: 'Profesor de geografie',
    text: 'Creează asocieri memorabile pentru țări, capitale și animale. Adaugă curiozități surprinzătoare care țin copilul angajat și curios.',
    color: '#6A1B9A',
    bg: 'rgba(106,27,154,0.07)',
  },
  {
    icon: '🧠',
    title: 'Psiholog adaptat pe vârstă',
    text: 'Tonul și vocabularul se adaptează automat vârstei — de la 3 ani la 10 ani. Cu cât mai multe greșeli, cu atât mai blând și mai empatic devine Lio.',
    color: '#E65100',
    bg: 'rgba(230,81,0,0.07)',
  },
]

const PEDAGOGY_STEPS = [
  { step: '1', label: 'Prima greșeală', desc: 'Lio încurajează scurt — max 12 cuvinte, cald și amuzant', color: '#FF7043' },
  { step: '2', label: 'A doua greșeală', desc: 'Indiciu indirect — Lio dă un clue fără să spună răspunsul', color: '#FFB300' },
  { step: '3', label: 'A treia greșeală', desc: 'Metodă socratică — o întrebare care îl face pe copil să gândească', color: '#7B1FA2' },
  { step: '4+', label: 'Persistență', desc: 'Explicație completă — Lio devine profesor și explică pas cu pas', color: '#1565C0' },
]

export function LioSection() {
  return (
    <section
      id="lio"
      className="px-4"
      style={{ paddingTop: 'clamp(48px, 8vw, 80px)', paddingBottom: 'clamp(48px, 8vw, 80px)' }}
      aria-labelledby="lio-heading"
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto', width: '100%' }}>

        {/* Heading */}
        <div className="text-center" style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
          <div className="flex justify-center" style={{ marginBottom: '16px' }}>
            <div style={{ animation: 'bounce-soft 2s ease-in-out infinite' }}>
              <LioSVG size={72} />
            </div>
          </div>
          <div
            className="inline-flex items-center gap-2 rounded-full font-nunito font-semibold px-4 py-2"
            style={{ background: 'rgba(255,112,67,0.10)', border: '1.5px solid rgba(255,112,67,0.25)', color: '#E64A19', fontSize: '13px', marginBottom: '16px' }}
          >
            ✨ Powered by Gemini AI
          </div>
          <h2
            id="lio-heading"
            className="font-fredoka font-semibold"
            style={{ fontSize: 'clamp(28px, 5vw, 48px)', color: '#212121', marginBottom: '12px' }}
          >
            Lio — profesorul tău AI personal
          </h2>
          <p
            className="font-nunito"
            style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#757575', maxWidth: '600px', lineHeight: 1.6, margin: '0 auto' }}
          >
            Lio nu e o simplă mascotă. Este un profesor AI care personalizează fiecare lecție,
            înțelege unde greșește copilul și adaptează explicațiile în timp real.
          </p>
        </div>

        {/* 4 roluri */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2"
          style={{ gap: 'clamp(14px, 2.5vw, 20px)', marginBottom: 'clamp(32px, 5vw, 48px)' }}
        >
          {LIO_ROLES.map((role) => (
            <div
              key={role.title}
              className="flex gap-4"
              style={{
                background: role.bg,
                border: `1.5px solid ${role.color}22`,
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
                  backgroundColor: `${role.color}18`,
                  fontSize: '24px',
                }}
                aria-hidden="true"
              >
                {role.icon}
              </div>
              <div>
                <h3
                  className="font-fredoka font-semibold"
                  style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: role.color, marginBottom: '6px' }}
                >
                  {role.title}
                </h3>
                <p
                  className="font-nunito"
                  style={{ fontSize: 'clamp(13px, 1.8vw, 14px)', color: '#757575', lineHeight: 1.6 }}
                >
                  {role.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pedagogie în 4 pași */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255,112,67,0.04) 0%, rgba(79,195,247,0.06) 100%)',
            border: '1.5px solid rgba(0,0,0,0.07)',
            borderRadius: '24px',
            padding: 'clamp(24px, 4vw, 40px)',
          }}
        >
          <h3
            className="font-fredoka font-semibold text-center"
            style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: '#212121', marginBottom: 'clamp(20px, 3vw, 32px)' }}
          >
            Cum reacționează Lio când copilul greșește
          </h3>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            style={{ gap: 'clamp(12px, 2vw, 16px)' }}
          >
            {PEDAGOGY_STEPS.map((s) => (
              <div
                key={s.step}
                className="flex flex-col items-center text-center"
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '20px 16px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  className="font-fredoka font-semibold flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: s.color,
                    color: 'white',
                    fontSize: '18px',
                    marginBottom: '12px',
                    flexShrink: 0,
                  }}
                >
                  {s.step}
                </div>
                <p
                  className="font-fredoka font-semibold"
                  style={{ fontSize: '14px', color: s.color, marginBottom: '6px' }}
                >
                  {s.label}
                </p>
                <p
                  className="font-nunito"
                  style={{ fontSize: '12px', color: '#757575', lineHeight: 1.5 }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <p
            className="font-nunito text-center"
            style={{ fontSize: '13px', color: '#9E9E9E', marginTop: '20px' }}
          >
            Lio vorbește în <strong style={{ color: '#757575' }}>română</strong> sau <strong style={{ color: '#757575' }}>engleză</strong> în funcție de limba aleasă la crearea contului.
          </p>
        </div>
      </div>
    </section>
  )
}
