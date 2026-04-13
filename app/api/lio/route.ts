import { NextRequest, NextResponse } from 'next/server'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

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
  context?: string
  streak?: number
  score?: number
  // ─── teacher mode fields ─────────────────────────────────────
  mode?: 'quick' | 'teach' | 'hint' | 'socratic'
  wrongAnswer?: string
  correctAnswer?: string
  questionText?: string
  attemptCount?: number
  lang?: 'ro' | 'en'
}

type Lang = 'ro' | 'en'

// ─── Age guidance ─────────────────────────────────────────────

function ageGuidance(age: number, lang: Lang): string {
  if (lang === 'en') {
    if (age <= 4) return 'Use VERY simple words (max 5-6 words per sentence). No abstract concepts. Speak like you talk to a 3-4 year old toddler.'
    if (age <= 6) return 'Simple, happy words. Short sentences. Lots of energy! You can use comparisons with familiar objects (apples, toys, fingers).'
    if (age <= 9) return 'Friendly and curious language. Can be slightly more complex. Occasionally add a funny analogy or a question that makes them think.'
    return 'You can be educational and curious. Real-life analogies. Treat them like a smart explorer.'
  }
  if (age <= 4) return 'Folosești cuvinte FOARTE simple (max 5-6 cuvinte per propoziție). Fără concepte abstracte. Ca și cum vorbești cu un copil mic de 3-4 ani.'
  if (age <= 6) return 'Cuvinte simple și vesele. Propoziții scurte. Multă energie! Poți folosi comparații cu obiecte familiare (mere, jucării, degete).'
  if (age <= 9) return 'Limbaj prietenos și curios. Poți fi puțin mai complex. Adaugă uneori o analogie amuzantă sau o întrebare care să îl facă să gândească.'
  return 'Poți fi educational și curios. Analogii cu viața reală. Îl tratezi ca pe un explorator inteligent.'
}

// ─── Quick prompt (15 words, cheerleader) ─────────────────────

function buildQuickPrompt(body: LioRequestBody): string {
  const { childName, age, world, event, context, streak, score, lang = 'ro' } = body

  const worldLabels: Record<string, Record<Lang, string>> = {
    letters:   { ro: 'Lumea Literelor (alfabetul românesc)', en: 'Letters World (English alphabet)' },
    numbers:   { ro: 'Lumea Cifrelor (matematică: numărare, adunare, scădere)', en: 'Numbers World (math: counting, addition, subtraction)' },
    adventure: { ro: 'Lumea Aventurii (geografie interactivă — țări și continente)', en: 'Adventure World (interactive geography — countries & continents)' },
    builder:   { ro: 'Lumea Constructorului (construcție creativă cu blocuri)', en: 'Builder World (creative block building)' },
    jump:      { ro: 'Lumea Saltului (joc platformer)', en: 'Jump World (platformer game)' },
  }

  const eventMap: Record<string, Record<Lang, string>> = {
    correct:       { ro: 'Copilul tocmai a răspuns corect.', en: 'The child just answered correctly.' },
    wrong:         { ro: 'Copilul a greșit. Fii blând, încurajator, nu descurajant.', en: 'The child got it wrong. Be gentle, encouraging, not discouraging.' },
    streak:        { ro: `Copilul are ${streak ?? 2} răspunsuri corecte la rând! Excelent!`, en: `The child has ${streak ?? 2} correct answers in a row! Excellent!` },
    level_up:      { ro: 'Copilul tocmai a trecut la nivelul următor!', en: 'The child just leveled up!' },
    session_start: { ro: `Copilul a început o sesiune nouă. Context: ${context ?? 'lume nouă'}.`, en: `The child started a new session. Context: ${context ?? 'new world'}.` },
    session_end:   { ro: `Copilul a terminat sesiunea. Scor: ${score ?? 0}. Context: ${context ?? ''}.`, en: `The child finished the session. Score: ${score ?? 0}. Context: ${context ?? ''}.` },
    room_unlock:   { ro: 'Copilul a deblocat o scenă nouă în Constructor.', en: 'The child unlocked a new scene in Builder.' },
    item_placed:   { ro: `Copilul a plasat blocuri. Context: ${context ?? ''}.`, en: `The child placed blocks. Context: ${context ?? ''}.` },
    coin_collected:{ ro: 'Copilul a colectat monede.', en: 'The child collected coins.' },
  }

  const outputLang = lang === 'en'
    ? 'Write ONLY in ENGLISH. Short, fun, max 12 words.'
    : 'Scrie DOAR în ROMÂNĂ. Scurt, vesel, MAX 12 cuvinte.'

  return `You are Lio, a friendly lion mascot in Playlio — an educational game for children.

Child: ${childName}, age: ${age}
World: ${worldLabels[world]?.[lang] ?? world}
Event: ${eventMap[event]?.[lang] ?? event}
${context ? `Extra context: ${context}` : ''}

${ageGuidance(age, lang)}

${outputLang}
- 1-2 emoji maximum
- Warm, encouraging, playful
- No quotes in output
- Write ONLY the message, nothing else`
}

// ─── Teach prompt (2-4 sentences, adaptive teacher) ───────────

function buildTeachPrompt(body: LioRequestBody): string {
  const { childName, age, world, wrongAnswer, correctAnswer, questionText, attemptCount, context, lang = 'ro' } = body

  const roles: Record<string, Record<Lang, string>> = {
    letters:   { ro: 'profesor de română, specialist în fonologie și recunoașterea literelor', en: 'Romanian/English language teacher, specialist in phonology and letter recognition' },
    numbers:   { ro: 'profesor de matematică pentru copii, cu experiență în pedagogie vizuală', en: 'children\'s math teacher with visual pedagogy expertise' },
    adventure: { ro: 'profesor de geografie și cultură mondială, pasionat de curiozități', en: 'geography and world culture teacher, passionate about curiosities' },
  }

  const role = roles[world]?.[lang] ?? (lang === 'en' ? 'educational teacher for children' : 'profesor educațional pentru copii')
  const attempts = attemptCount ?? 1

  const toneGuide = lang === 'en'
    ? attempts >= 3
      ? 'Your tone is EXTREMELY gentle and empathetic. Acknowledge that it\'s hard and everyone makes mistakes. Validate effort, not result.'
      : attempts >= 2
      ? 'Your tone is warm and explanatory. The child got it wrong again, so explain differently than the first time.'
      : 'Your tone is surprised-amused and curious. It\'s the first mistake, explain simply and quickly.'
    : attempts >= 3
    ? 'Tonul tău este EXTREM de blând și empatic. Recunoști că e greu și că toți greșim. Validezi efortul, nu rezultatul.'
    : attempts >= 2
    ? 'Tonul tău este cald și explicativ. Copilul a mai greșit o dată, deci ai nevoie să explici altfel față de prima dată.'
    : 'Tonul tău este surprins-amuzant și curios. E prima greșeală, explici simplu și rapid.'

  let worldSpecificGuide = ''

  if (world === 'letters') {
    worldSpecificGuide = lang === 'en' ? `
PEDAGOGICAL CONTEXT - LETTERS:
- The question was: "${questionText ?? context ?? 'a letter'}"
- The child chose: "${wrongAnswer ?? 'a wrong letter'}"
- The correct answer was: "${correctAnswer ?? 'the correct letter'}"

Your teaching strategy:
1. Acknowledge the chosen letter looks or sounds similar to the correct one (if applicable)
2. Explain the SOUND of the correct letter with a memorable analogy (e.g. "B sounds like BOOM! Like a balloon popping!")
3. Make the child mentally repeat the sound. Ask a simple rhetorical question ("Hear it? Ba-ll! What letter comes first?")
4. Be brief: max 3 sentences` : `
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
    worldSpecificGuide = lang === 'en' ? `
PEDAGOGICAL CONTEXT - MATH:
- The question was: "${questionText ?? context ?? 'a math problem'}"
- The child answered: "${wrongAnswer ?? 'a wrong answer'}"
- The correct answer was: "${correctAnswer ?? 'the correct answer'}"

Your teaching strategy:
1. Do NOT say directly "wrong". Say "Hmm, let's see together!"
2. Explain with concrete visual objects (apples, fingers, toys) — never abstract
3. If addition: "Put ${wrongAnswer} apples... now add more... count on your fingers!"
4. If subtraction: "We have [total], take away [subtracted]... how many are left?"
5. End with a simple rhetorical question to guide them to the answer themselves
6. Max 3 sentences, 1 emoji` : `
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
    worldSpecificGuide = lang === 'en' ? `
PEDAGOGICAL CONTEXT - GEOGRAPHY:
- The question was: "${questionText ?? context ?? 'a geography question'}"
- The child answered: "${wrongAnswer ?? 'a wrong answer'}"
- The correct answer was: "${correctAnswer ?? 'the correct answer'}"

Your teaching strategy:
1. Explain the correct answer with 1 memorable and easy-to-visualize fact
2. Create a mental association: link the answer to something the child already knows (animals, food, colors)
3. Add a surprising curiosity about the topic to keep them engaged
4. Max 3 sentences, 1-2 emoji` : `
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

  const outputInstruction = lang === 'en'
    ? `Write a gentle, educational teacher message (2-3 sentences, MAX 50 words total).
STRICT RULES:
- Write in ENGLISH
- NEVER say "wrong", "you got it wrong", "that's wrong" — say "let's see", "interesting", "almost!"
- Help the child THINK and reach the conclusion themselves
- 1-2 emoji total
- No quotes in output
- Write ONLY the educational message, nothing else`
    : `Scrie un mesaj de profesor blând și educativ (2-3 propoziții, MAX 50 de cuvinte total).
Reguli STRICTE:
- Scrie în ROMÂNĂ
- Nu spune niciodată "greșit", "ai greșit", "e greșit" — zi "să vedem", "interesant", "aproape!"
- Ajută copilul să GÂNDEASCĂ și să ajungă singur la concluzie
- 1-2 emoji total
- Fără ghilimele în output
- Scrie DOAR mesajul educativ, nimic altceva`

  return `You are Lio, a friendly ${role} in Playlio — an educational game for children.

Child: ${childName}, age: ${age}
${worldSpecificGuide}

${ageGuidance(age, lang)}
${toneGuide}

${outputInstruction}`
}

// ─── Hint prompt (indirect clue, doesn't give away answer) ────

function buildHintPrompt(body: LioRequestBody): string {
  const { childName, age, world, correctAnswer, questionText, context, lang = 'ro' } = body

  const worldHintContext: Record<string, Record<Lang, string>> = {
    letters: {
      ro: `Litera corectă este "${correctAnswer}". Dă un indiciu sonor (sunetul literei) fără să spui direct litera.`,
      en: `The correct letter is "${correctAnswer}". Give a sound clue (the letter's sound) without saying the letter directly.`,
    },
    numbers: {
      ro: `Răspunsul corect este ${correctAnswer}. Dă un indiciu vizual (numără pe degete, folosește obiecte) fără să spui cifra.`,
      en: `The correct answer is ${correctAnswer}. Give a visual clue (count on fingers, use objects) without saying the number.`,
    },
    adventure: {
      ro: `Răspunsul corect este "${correctAnswer}". Dă un indiciu geografic amuzant fără să îl spui direct.`,
      en: `The correct answer is "${correctAnswer}". Give a fun geographical clue without saying it directly.`,
    },
  }

  const teacherRole = lang === 'en'
    ? world === 'numbers' ? 'math teacher' : world === 'letters' ? 'language teacher' : 'geography teacher'
    : world === 'numbers' ? 'profesor de matematică' : world === 'letters' ? 'profesor de română' : 'profesor de geografie'

  const outputInstruction = lang === 'en'
    ? 'Give a subtle CLUE (1 sentence) to help the child guess without telling the answer. 1 emoji. No quotes. Write ONLY the clue.'
    : 'Dă un INDICIU subtil (1 propoziție) care să ajute copilul să ghicească fără să îi spui răspunsul. 1 emoji. Fără ghilimele. Scrie DOAR indiciul.'

  return `You are Lio from Playlio. You are a ${teacherRole}.

Child: ${childName}, ${age} years old
The question was: "${questionText ?? context ?? ''}"
${worldHintContext[world]?.[lang] ?? `The correct answer is "${correctAnswer}".`}

${ageGuidance(age, lang)}

${outputInstruction}`
}

// ─── Socratic prompt (makes child think, doesn't give answer) ─

function buildSocraticPrompt(body: LioRequestBody): string {
  const { childName, age, world, questionText, correctAnswer, context, lang = 'ro' } = body

  const teacherRole = lang === 'en'
    ? world === 'numbers' ? 'math teacher' : world === 'letters' ? 'language teacher' : 'geography teacher'
    : world === 'numbers' ? 'profesor de matematică' : world === 'letters' ? 'profesor de limbă română' : 'profesor de geografie'

  const situation = lang === 'en'
    ? `The child has gotten "${questionText ?? context ?? 'this question'}" wrong multiple times. The correct answer is "${correctAnswer}".`
    : `Copilul a greșit de mai multe ori la "${questionText ?? context ?? 'această întrebare'}". Răspunsul corect este "${correctAnswer}".`

  const examples = lang === 'en'
    ? `- "If you have 3 apples and take 2 more, count with me? 🍎"
- "How does this letter sound? Baaaaall! What letter do you think makes that sound?"
- "Paris... which country is the Eiffel Tower in? 🗼"`
    : `- "Dacă ai 3 mere și mai iei 2, numeri cu mine? 🍎"
- "Cum sună litera asta? Bagheeetă! Ce literă crezi că o face?"
- "Paris... oare în ce țară e Turnul Eiffel? 🗼"`

  const outputInstruction = lang === 'en'
    ? `Write ONE simple, playful question (not the answer!) to make ${childName} think and reach the answer themselves.
1 sentence, 1 emoji. No quotes. Write ONLY the question.`
    : `Scrie O ÎNTREBARE simplă și jucăușă (nu răspunsul!) care să îl facă pe ${childName} să gândească și să ajungă singur la răspuns.
1 propoziție, 1 emoji. Fără ghilimele. Scrie DOAR întrebarea.`

  return `You are Lio from Playlio, a ${teacherRole} who uses the Socratic method.

Child: ${childName}, ${age} years old
Situation: ${situation}

${ageGuidance(age, lang)}

Examples of style:
${examples}

${outputInstruction}`
}

// ─── Main POST handler ────────────────────────────────────────

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    const body = await req.json().catch(() => ({}) as LioRequestBody)
    return NextResponse.json({ message: fallbackMessage(undefined, body?.lang) })
  }

  let body: LioRequestBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Let\'s try again! 🦁' })
  }

  const mode = body.mode ?? 'quick'
  const lang: Lang = body.lang === 'en' ? 'en' : 'ro'

  let prompt: string
  let maxTokens: number
  let temperature: number

  switch (mode) {
    case 'teach':
      prompt      = buildTeachPrompt(body)
      maxTokens   = 300
      temperature = 0.7
      break
    case 'hint':
      prompt      = buildHintPrompt(body)
      maxTokens   = 150
      temperature = 0.8
      break
    case 'socratic':
      prompt      = buildSocraticPrompt(body)
      maxTokens   = 150
      temperature = 0.85
      break
    default:
      prompt      = buildQuickPrompt(body)
      maxTokens   = 150
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
          thinkingConfig: { thinkingBudget: 0 },
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
      return NextResponse.json({ message: fallbackMessage(mode, lang) })
    }

    const json = await res.json()
    const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''

    if (!text) {
      return NextResponse.json({ message: fallbackMessage(mode, lang) })
    }

    return NextResponse.json({ message: text })
  } catch {
    return NextResponse.json({ message: fallbackMessage(mode, lang) })
  }
}

function fallbackMessage(mode: string | undefined, lang: Lang | undefined): string {
  if (lang === 'en') {
    if (mode === 'teach')    return 'Let\'s think together! Read the question carefully again. 🦁'
    if (mode === 'hint')     return 'Think carefully... the answer is closer than you think! 💡'
    if (mode === 'socratic') return 'What do you think? Try again! 🤔'
    return 'Great job trying! Lio believes in you! 🌟'
  }
  if (mode === 'teach')    return 'Hai să gândim împreună! Citește întrebarea din nou cu atenție. 🦁'
  if (mode === 'hint')     return 'Gândește-te bine... răspunsul e mai aproape decât crezi! 💡'
  if (mode === 'socratic') return 'Ce crezi tu? Încearcă din nou! 🤔'
  return 'Bravo că încerci! Lio crede în tine! 🌟'
}
