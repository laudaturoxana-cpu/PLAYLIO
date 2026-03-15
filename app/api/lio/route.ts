import { NextRequest, NextResponse } from 'next/server'

// Gemini 1.5 Flash — fast, free tier (1500 req/day)
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
  context?: string  // extra info: e.g. "answered 5 + 3", "placed a Pink Bed"
  streak?: number
  score?: number
}

function buildPrompt(body: LioRequestBody): string {
  const { childName, age, world, event, context, streak, score } = body

  const worldLabels: Record<string, string> = {
    letters: 'Letters World (learning the alphabet)',
    numbers: 'Numbers World (math: counting, addition, subtraction)',
    adventure: 'Adventure World (exploring zones and collecting stars)',
    builder: 'Building World (decorating rooms in a house)',
    jump: 'Jump World (platformer game collecting coins)',
  }

  const ageGuidance =
    age <= 4
      ? 'Use very simple words (max 6-7 words per sentence). No complex concepts.'
      : age <= 6
      ? 'Use simple, fun words. Short sentences. Lots of energy!'
      : 'Use friendly, encouraging language. Can be slightly more complex.'

  const eventContext: Record<string, string> = {
    correct: 'The child just answered correctly.',
    wrong: 'The child just answered incorrectly. Be gentle and encouraging, never discouraging.',
    streak: `The child is on a ${streak ?? 2}x streak! They're doing amazing!`,
    level_up: 'The child just leveled up or mastered something!',
    session_start: 'The child just started playing.',
    session_end: `The child finished a session with a score of ${score ?? 0}.`,
    room_unlock: 'The child just unlocked a new room in the Builder World.',
    item_placed: 'The child just placed a furniture item in their room.',
    coin_collected: 'The child just collected coins.',
  }

  return `You are Lio, a friendly lion mascot in Playlio — an educational game for children aged 3-10.

Child: ${childName}, age ${age}
World: ${worldLabels[world]}
Event: ${eventContext[event]}
${context ? `Extra context: ${context}` : ''}

${ageGuidance}

Write ONE short, enthusiastic message (max 15 words) from Lio to ${childName}.
- Use 1-2 emojis maximum
- Be warm, encouraging, and playful
- Never use complex words for young children
- No quotation marks in the output
- Output ONLY the message, nothing else`
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ message: 'Great job! Keep going! 🌟' })
  }

  let body: LioRequestBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'You\'re doing amazing! 🦁' })
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(body) }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 60,
          topP: 0.95,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_LOW_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_LOW_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        ],
      }),
      signal: AbortSignal.timeout(4000),
    })

    if (!res.ok) {
      return NextResponse.json({ message: 'Keep it up, superstar! ⭐' })
    }

    const json = await res.json()
    const text: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''

    if (!text) {
      return NextResponse.json({ message: 'You\'re doing great! 🦁' })
    }

    return NextResponse.json({ message: text })
  } catch {
    // Timeout or network error — return a fallback silently
    return NextResponse.json({ message: 'Amazing work! 🌟' })
  }
}
