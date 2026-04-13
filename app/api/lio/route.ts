import { NextRequest, NextResponse } from 'next/server'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export interface LioRequestBody {
  childName: string
  age: number
  world: 'letters' | 'numbers' | 'adventure' | 'builder' | 'jump'
  event:
    | 'correct'
    | 'wrong'
    | 'streak'
    | 'level_up'
    | 'session_start'
    | 'session_end'
    | 'room_unlock'
    | 'item_placed'
    | 'coin_collected'
  // ─── context ───────────────────────────────────────────────
  context?: string
  streak?: number
  score?: number
  // ─── teacher mode fields ────────────────────────────────────
  mode?: 'quick' | 'teach' | 'hint' | 'socratic'
  wrongAnswer?: string      // what the child chose
  correctAnswer?: string    // what was correct
  questionText?: string     // the full question / equation
  attemptCount?: number     // how many times they've tried this item
  lang?: 'ro' | 'en'
}

// ─── Age guidance ────────────────────────────────────────────

function ageGuidance(age: number): string {
  if (age <= 4) return 'Folosești cuvinte FOARTE simple (max 5-6 cuvinte per propoziție). Fără concepte abstracte. Ca și cum vorbești cu un copil mic de 3-4 ani.'
  if (age <= 6) return 'Cuvinte simple și vesele. Propoziții scurte. Multă energie! Poți folosi comparații cu obiecte familiare (mere, jucării, degete).'
  if (age <= 9) return 'Limbaj prietenos și curios. Poți fi puțin mai complex. Adaugă uneori o analogie amuzantă sau o întrebare care să îl facă să gândească.'
  return 'Poți fi educational și curios. Analogii cu viața reală. Îl tratezi ca pe un explorator inteligent.'
}

// ─── Quick prompt (15 words, cheerleader) ────────────────────

function buildQuickPrompt(body: LioRequestBody): string {
  const { childName, age, world, event, context, streak, score } = body

  const worldLabels: Record<string, string> = {
    letters:   'Lumea Literelor (alfabetul românesc)',
    numbers:   'Lumea Cifrelor (matematică: numărare, adunare, scădere)',
    adventure: 'Lumea Aventurii (geografie interactivă — țări și continente)',
    builder:   'Lumea Constructorului (construcție creativă cu blocuri)',
    jump:      'Lumea Saltului (joc platformer)',
  }

  const eventMap: Record<string, string> = {
    correct:       'Copilul tocmai a răspuns corect.',
    wrong:         'Copilul a greșit. Fii blând, încurajator, nu descurajant.',
    streak:        `Copilul are ${streak ?? 2} răspunsuri corecte la rând! Excelent!`,
    level_up:      'Copilul tocmai a trecut la nivelul următor!',
    session_start: `Copilul a început o sesiune nouă. Context: ${context ?? 'lume nouă'}.`,
    session_end:   `Copilul a terminat sesiunea. Scor: ${score ?? 0}. Context: ${context ?? ''}.`,
    room_unlock:   'Copilul a deblocat o scenă nouă în Constructor.',
    item_placed:   `Copilul a plasat blocuri. Context: ${context ?? ''}.`,
    coin_collected:'Copilul a colectat monede.',
  }

  return `Ești Lio, un leu mascotă prietenos în Playlio — un joc educațional pentru copii.

Copil: ${childName}, vârsta: ${age} ani
Lumea: ${worldLabels[world] ?? world}
Eveniment: ${eventMap[event] ?? event}
${context ? `Context extra: ${context}` : ''}

${ageGuidance(age)}

Scrie UN mesaj scurt și entuziast (MAX 12 cuvinte) de la Lio către ${childName}.
- 1-2 emoji maximum
- Cald, încurajator, jucăuș
- Fără ghilimele în output
- Scrie DOAR mesajul, nimic altceva`
}

// ─── Teach prompt (2-4 sentences, adaptive teacher) ──────────

function buildTeachPrompt(body: LioRequestBody): string {
  const { childName, age, world, wrongAnswer, correctAnswer, questionText, attemptCount, context } = body

  const roles: Record<string, string> = {
    letters:   'profesor de română, specialist în fonologie și recunoașterea literelor',
    numbers:   'profesor de matematică pentru copii, cu experiență în pedagogie vizuală',
    adventure: 'profesor de geografie și cultură mondială, pasionat de curiozități',
  }

  const role = roles[world] ?? 'profesor educațional pentru copii'
  const attempts = attemptCount ?? 1

  // Tone shifts based on attempt count — more patient/encouraging with more failures
  const toneGuide = attempts >= 3
    ? 'Tonul tău este EXTREM de blând și empatic. Recunoști că e greu și că toți greșim. Validezi efortul, nu rezultatul.'
    : attempts >= 2
    ? 'Tonul tău este cald și explicativ. Copilul a mai greșit o dată, deci ai nevoie să explici altfel față de prima dată.'
    : 'Tonul tău este surprins-amuzant și curios. E prima greșeală, explici simplu și rapid.'

  let worldSpecificGuide = ''

  if (world === 'letters') {
    worldSpecificGuide = `
CONTEXT PEDAGOGIC - LITERE:
- Întrebarea era: "${questionText ?? context ?? 'o literă'}"
- Copilul a ales: "${wrongAnswer ?? 'o literă greșită'}"
- Răspunsul corect era: "${correctAnswer ?? 'litera corectă'}"

Strategia ta de predare:
1. Recunoaște că litera aleasă se aseamănă vizual sau sonor cu cea corectă (dacă e cazul)
2. Explică SUNETUL literei corecte cu o analogie memorabilă (ex: "B sună ca BUUUUM! Ca balonul când pocnește!")
3. Fă copilul să repete mental sunetul. Pune o întrebare retorică simplă ("Auzi? Ba-lon! Ce literă vine prima?")
4. Fii scurt: max 3 propoziții`
  } else if (world === 'numbers') {
    worldSpecificGuide = `
CONTEXT PEDAGOGIC - MATEMATICĂ:
- Întrebarea era: "${questionText ?? context ?? 'o problemă matematică'}"
- Copilul a răspuns: "${wrongAnswer ?? 'un răspuns greșit'}"
- Răspunsul corect era: "${correctAnswer ?? 'răspunsul corect'}"

Strategia ta de predare:
1. NU spune direct "greșit". Spune "Hmm, să vedem împreună!"
2. Explică cu obiecte concrete și vizuale (mere, degete, jucării) — niciodată abstract
3. Dacă e adunare: "Pune ${wrongAnswer} mere... acum mai adaugă... numără-le pe degete!"
4. Dacă e scădere: "Avem [total], luăm [scăzut]... câte rămân?"
5. La final: o întrebare retorică simplă care să îl facă să ajungă singur la răspuns
6. Max 3 propoziții, 1 emoji`
  } else if (world === 'adventure') {
    worldSpecificGuide = `
CONTEXT PEDAGOGIC - GEOGRAFIE:
- Întrebarea era: "${questionText ?? context ?? 'o întrebare de geografie'}"
- Copilul a răspuns: "${wrongAnswer ?? 'un răspuns greșit'}"
- Răspunsul corect era: "${correctAnswer ?? 'răspunsul corect'}"

Strategia ta de predare:
1. Explică răspunsul corect cu 1 fapt memorabil și ușor de vizualizat
2. Creează o asociere mentală: leagă răspunsul de ceva ce copilul știe deja (animale, mâncare, culori)
3. Adaugă o curiozitate surprinzătoare legată de subiect care să îl țină angajat
4. Max 3 propoziții, 1-2 emoji`
  }

  return `Ești Lio, un ${role} prietenos în Playlio — joc educațional pentru copii.

Copil: ${childName}, vârsta: ${age} ani
${worldSpecificGuide}

${ageGuidance(age)}
${toneGuide}

Scrie un mesaj de profesor blând și educativ (2-3 propoziții, MAX 50 de cuvinte total).
Reguli STRICTE:
- Scrie în ROMÂNĂ
- Nu spune niciodată "greșit", "ai greșit", "e greșit" — zi "să vedem", "interesant", "aproape!"
- Ajută copilul să GÂNDEASCĂ și să ajungă singur la concluzie
- 1-2 emoji total
- Fără ghilimele în output
- Scrie DOAR mesajul educativ, nimic altceva`
}

// ─── Hint prompt (indirect clue, doesn't give away answer) ───

function buildHintPrompt(body: LioRequestBody): string {
  const { childName, age, world, correctAnswer, questionText, context } = body

  const worldHintContext: Record<string, string> = {
    letters:   `Litera corectă este "${correctAnswer}". Dă un indiciu sonor (sunetul literei) fără să spui direct litera.`,
    numbers:   `Răspunsul corect este ${correctAnswer}. Dă un indiciu vizual (numără pe degete, folosește obiecte) fără să spui cifra.`,
    adventure: `Răspunsul corect este "${correctAnswer}". Dă un indiciu geografic amuzant fără să îl spui direct.`,
  }

  return `Ești Lio din Playlio. Ești ${world === 'numbers' ? 'profesor de matematică' : world === 'letters' ? 'profesor de română' : 'profesor de geografie'}.

Copil: ${childName}, ${age} ani
Întrebarea era: "${questionText ?? context ?? ''}"
${worldHintContext[world] ?? `Răspunsul corect este "${correctAnswer}".`}

${ageGuidance(age)}

Dă un INDICIU subtil (1 propoziție) care să ajute copilul să ghicească fără să îi spui răspunsul.
1 emoji. Fără ghilimele. Scrie DOAR indiciul.`
}

// ─── Socratic prompt (makes child think, doesn't give answer) ─

function buildSocraticPrompt(body: LioRequestBody): string {
  const { childName, age, world, questionText, correctAnswer, context } = body

  return `Ești Lio din Playlio, un ${world === 'numbers' ? 'profesor de matematică' : world === 'letters' ? 'profesor de limbă română' : 'profesor de geografie'} care folosește metoda socratică.

Copil: ${childName}, ${age} ani
Situație: copilul a greșit de mai multe ori la "${questionText ?? context ?? 'această întrebare'}".
Răspunsul corect este "${correctAnswer}".

${ageGuidance(age)}

Scrie O ÎNTREBARE simplă și jucăușă (nu răspunsul!) care să îl facă pe ${childName} să gândească și să ajungă singur la răspuns.
Exemple de stil:
- "Dacă ai 3 mere și mai iei 2, numeri cu mine? 🍎"
- "Cum sună litera asta? Bagheeetă! Ce literă crezi că o face?"
- "Paris... oare în ce țară e Turnul Eiffel? 🗼"

1 propoziție, 1 emoji. Fără ghilimele. Scrie DOAR întrebarea.`
}

// ─── Main POST handler ────────────────────────────────────────

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ message: fallbackMessage(undefined) })
  }

  let body: LioRequestBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Hai să o luăm de la capăt! 🦁' })
  }

  const mode = body.mode ?? 'quick'

  let prompt: string
  let maxTokens: number
  let temperature: number

  switch (mode) {
    case 'teach':
      prompt      = buildTeachPrompt(body)
      maxTokens   = 120
      temperature = 0.7
      break
    case 'hint':
      prompt      = buildHintPrompt(body)
      maxTokens   = 60
      temperature = 0.8
      break
    case 'socratic':
      prompt      = buildSocraticPrompt(body)
      maxTokens   = 60
      temperature = 0.85
      break
    default:
      prompt      = buildQuickPrompt(body)
      maxTokens   = 50
      temperature = 0.9
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          topP: 0.95,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_LOW_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_LOW_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        ],
      }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined,
    })

    if (!res.ok) {
      return NextResponse.json({ message: fallbackMessage(mode) })
    }

    const json = await res.json()
    const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''

    if (!text) {
      return NextResponse.json({ message: fallbackMessage(mode) })
    }

    return NextResponse.json({ message: text })
  } catch {
    return NextResponse.json({ message: fallbackMessage(mode) })
  }
}

function fallbackMessage(mode: string | undefined): string {
  if (mode === 'teach') return 'Hai să gândim împreună! Citește întrebarea din nou cu atenție. 🦁'
  if (mode === 'hint')  return 'Gândește-te bine... răspunsul e mai aproape decât crezi! 💡'
  if (mode === 'socratic') return 'Ce crezi tu? Încearcă din nou! 🤔'
  return 'Bravo că încerci! Lio crede în tine! 🌟'
}
