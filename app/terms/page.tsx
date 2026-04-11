import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--light)' }}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 font-nunito text-sm font-semibold mb-6 hover:underline"
          style={{ color: 'var(--gray)' }}
        >
          ← Înapoi la înregistrare
        </Link>

        <h1 className="font-fredoka text-3xl font-semibold mb-2" style={{ color: 'var(--dark)' }}>
          Termeni și Condiții
        </h1>
        <p className="font-nunito text-sm mb-8" style={{ color: 'var(--gray)' }}>
          Ultima actualizare: Aprilie 2026
        </p>

        <div className="flex flex-col gap-6 font-nunito text-sm leading-relaxed" style={{ color: '#424242' }}>
          <section>
            <h2 className="font-fredoka text-xl font-semibold mb-2" style={{ color: 'var(--dark)' }}>
              1. Serviciul Playlio
            </h2>
            <p>
              Playlio este o platformă educativă pentru copii cu vârste între 3 și 10 ani. Contul este
              creat de un părinte sau tutore legal (persoana responsabilă), care are cel puțin 18 ani.
              Copilul folosește aplicația sub supravegherea parentală.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka text-xl font-semibold mb-2" style={{ color: 'var(--dark)' }}>
              2. Datele copilului
            </h2>
            <p>
              Stocăm doar prenumele copilului și vârsta, pentru a personaliza experiența educativă.
              Nu colectăm date de identificare sensibile ale copilului. Datele nu sunt vândute sau
              partajate cu terți în scop comercial.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka text-xl font-semibold mb-2" style={{ color: 'var(--dark)' }}>
              3. Contul părintelui
            </h2>
            <p>
              Ești responsabil pentru securitatea parolei contului tău. Notifică-ne imediat dacă
              suspectezi acces neautorizat. Poți șterge contul oricând din secțiunea de setări.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka text-xl font-semibold mb-2" style={{ color: 'var(--dark)' }}>
              4. Conținut educativ
            </h2>
            <p>
              Tot conținutul din Playlio este creat pentru uz educativ și este adecvat vârstei.
              Nu conținem publicitate. Monedele virtuale din joc nu au valoare monetară reală
              și nu pot fi schimbate sau transferate.
            </p>
          </section>

          <section>
            <h2 className="font-fredoka text-xl font-semibold mb-2" style={{ color: 'var(--dark)' }}>
              5. Contact
            </h2>
            <p>
              Pentru orice întrebare legată de termeni sau date personale, ne poți contacta la{' '}
              <span className="font-semibold">contact@playlio.app</span>.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full font-nunito font-bold text-base text-white px-8 py-4 transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--coral)' }}
          >
            Am înțeles — Înapoi la înregistrare
          </Link>
        </div>
      </div>
    </div>
  )
}
