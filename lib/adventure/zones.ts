// ============================================================
//  PLAYLIO — ADVENTURE WORLD v2  (Exploratorii Globului)
//  7 continente × N țări, mini-jocuri geografice adaptive,
//  AI Gemini integrat per țară, content pe 3 grupe de vârstă.
// ============================================================

// ─── Tipuri de mini-joc ─────────────────────────────────────────
export type MiniGameType =
  | 'flag_quiz'       // Care e steagul acestei țări? (2-4 opțiuni)
  | 'capital_quiz'    // Care e capitala? (2-4 opțiuni)
  | 'animal_match'    // Ce animal trăiește aici? (2-4 opțiuni)
  | 'landmark_quiz'   // Ce monument e acesta? (2-4 opțiuni)
  | 'fact_quiz'       // Întrebare de cultură generală (2-4 opțiuni)

export interface QuizOption {
  text: string
  isCorrect: boolean
}

export interface MiniGame {
  type: MiniGameType
  question: string
  options: QuizOption[]
  correctFeedback: string   // ce spune Lio la răspuns corect
  wrongFeedback: string     // ce spune Lio la răspuns greșit
  funFact: string           // fact amuzant după răspuns
}

// ─── Content adaptat vârstă ──────────────────────────────────────
export interface AgeContent {
  lioIntro: string   // ce spune Lio când intrăm în țară
  miniGames: MiniGame[]  // 1-3 mini-jocuri per grupă vârstă
}

// ─── Țară ────────────────────────────────────────────────────────
export interface Country {
  id: string
  continentId: string
  name: string          // română
  nameEn: string        // engleză (pentru AI)
  flag: string          // emoji steag
  capital: string       // capitala
  capitalEmoji: string  // emoji reprezentativ
  landmark: string      // monument celebru
  landmarkEmoji: string
  animal: string        // animal caracteristic
  animalEmoji: string
  color: string         // culoare pe hartă
  postcardEmoji: string // pentru albumul de colecție
  builderBlockUnlock?: string  // bloc deblocat la vizitare
  // Content pe grupe vârstă
  age3to5: AgeContent
  age6to8: AgeContent
  age9to12: AgeContent
}

// ─── Continent ───────────────────────────────────────────────────
export interface Continent {
  id: string
  name: string       // română
  nameEn: string
  emoji: string
  color: string
  bgGradient: string
  mapPosition: { x: number; y: number }  // % pe harta 2D
  requiredLevel: number
  countries: Country[]
}

// ─── Căutare rapidă ──────────────────────────────────────────────
// (Zone = alias pentru compatibilitate cu codul existent)
export type Zone = Country & {
  // câmpuri suplimentare pentru compatibilitate
  slug: string
  description: string
  totalStars: number
  items: { id: string; emoji: string; label: string; points: number }[]
  quests: ZoneQuest[]
  secret: ZoneSecret
}

export interface ZoneQuest {
  id: string
  title: string
  description: string
  requiredStars: number
  rewardCoins: number
  rewardEmoji: string
}

export interface ZoneSecret {
  id: string
  trigger: 'idle_10s' | 'tap_5x' | 'tap_object_sequence'
  description: string
  rewardEmoji: string
  rewardCoins: number
}

// ============================================================
//  DATE GEOGRAFICE
// ============================================================

export const CONTINENTS: Continent[] = [
  // ─── 1. EUROPA ─────────────────────────────────────────────
  {
    id: 'europe',
    name: 'Europa',
    nameEn: 'Europe',
    emoji: '🏰',
    color: '#1565C0',
    bgGradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    mapPosition: { x: 50, y: 28 },
    requiredLevel: 1,
    countries: [
      {
        id: 'romania',
        continentId: 'europe',
        name: 'România', nameEn: 'Romania',
        flag: '🇷🇴', capital: 'București', capitalEmoji: '🏛️',
        landmark: 'Castelul Bran', landmarkEmoji: '🏰',
        animal: 'Urs brun', animalEmoji: '🐻',
        color: '#1565C0',
        postcardEmoji: '🏰',
        builderBlockUnlock: 'cobblestone',
        age3to5: {
          lioIntro: 'Bună! Suntem în România, țara mea! 🇷🇴',
          miniGames: [
            {
              type: 'flag_quiz',
              question: 'Care este steagul României?',
              options: [
                { text: '🇷🇴 Albastru, Galben, Roșu', isCorrect: true },
                { text: '🇫🇷 Albastru, Alb, Roșu', isCorrect: false },
              ],
              correctFeedback: 'Bravo! Tricolorul României! 🎉',
              wrongFeedback: 'Aproape! Steagul României are albastru, galben și roșu!',
              funFact: 'România are munți, mare și deltă — trei lucruri minunate! 🏔️🌊',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Bine ai venit în România! Capitala e București. 🏛️',
          miniGames: [
            {
              type: 'capital_quiz',
              question: 'Care este capitala României?',
              options: [
                { text: 'București', isCorrect: true },
                { text: 'Cluj-Napoca', isCorrect: false },
                { text: 'Timișoara', isCorrect: false },
                { text: 'Brașov', isCorrect: false },
              ],
              correctFeedback: 'Corect! București este capitala României! 🌟',
              wrongFeedback: 'Nu chiar! Capitala României este București.',
              funFact: 'București e supranumit "Micul Paris" din cauza arhitecturii frumoase! 🗼',
            },
            {
              type: 'animal_match',
              question: 'Ce animal sălbatic celebru trăiește în pădurile României?',
              options: [
                { text: '🐻 Urs brun', isCorrect: true },
                { text: '🦁 Leu', isCorrect: false },
                { text: '🐼 Panda', isCorrect: false },
                { text: '🦘 Cangur', isCorrect: false },
              ],
              correctFeedback: 'Super! România are cei mai mulți urși bruni din Europa! 🐻',
              wrongFeedback: 'Nu! Urșii bruni sunt animalele simbolice ale României.',
              funFact: 'În Carpați trăiesc peste 6.000 de urși bruni! 🏔️',
            },
          ],
        },
        age9to12: {
          lioIntro: 'România — patria Dracula și a Carpații maiestuoși! 🏔️🧛',
          miniGames: [
            {
              type: 'landmark_quiz',
              question: 'Castelul Bran din România este asociat cu legenda lui…',
              options: [
                { text: 'Dracula / Vlad Țepeș', isCorrect: true },
                { text: 'Sherlock Holmes', isCorrect: false },
                { text: 'Robin Hood', isCorrect: false },
                { text: 'Merlin', isCorrect: false },
              ],
              correctFeedback: 'Excelent! Castelul Bran inspirat legenda lui Dracula! 🏰',
              wrongFeedback: 'Nu! Castelul Bran e legat de Vlad Țepeș, inspirația lui Dracula.',
              funFact: 'Vlad Țepeș a trăit în secolul XV și era cunoscut pentru duritatea sa! ⚔️',
            },
            {
              type: 'fact_quiz',
              question: 'Fluviul Dunărea se varsă în Marea Neagră prin…',
              options: [
                { text: 'Delta Dunării din România', isCorrect: true },
                { text: 'Golful Biscaya din Franța', isCorrect: false },
                { text: 'Marea Mediterană', isCorrect: false },
                { text: 'Marea Nordului', isCorrect: false },
              ],
              correctFeedback: 'Bravo! Delta Dunării e o bijuterie naturală! 🦢',
              wrongFeedback: 'Dunărea se varsă în Marea Neagră prin Delta Dunării din România!',
              funFact: 'Delta Dunării e una din cele mai mari delte din lume, cu 300 specii de păsări! 🐦',
            },
          ],
        },
      },
      {
        id: 'france',
        continentId: 'europe',
        name: 'Franța', nameEn: 'France',
        flag: '🇫🇷', capital: 'Paris', capitalEmoji: '🗼',
        landmark: 'Turnul Eiffel', landmarkEmoji: '🗼',
        animal: 'Cocoș galic', animalEmoji: '🐓',
        color: '#1565C0',
        postcardEmoji: '🗼',
        age3to5: {
          lioIntro: 'Bonjour! Suntem în Franța! 🇫🇷🗼',
          miniGames: [
            {
              type: 'landmark_quiz',
              question: 'Acest turn celebru e în Paris! Cum se numește?',
              options: [
                { text: '🗼 Turnul Eiffel', isCorrect: true },
                { text: '🏰 Castelul Bran', isCorrect: false },
              ],
              correctFeedback: 'Da! Turnul Eiffel din Paris! 🗼✨',
              wrongFeedback: 'E Turnul Eiffel din Paris, Franța!',
              funFact: 'Turnul Eiffel a fost construit în 1889 și are 300 de metri înălțime! 🗼',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Bienvenue en France! Paris e capitala modei și a dragostei! 🗼',
          miniGames: [
            {
              type: 'capital_quiz',
              question: 'Care e capitala Franței?',
              options: [
                { text: 'Paris', isCorrect: true },
                { text: 'Lyon', isCorrect: false },
                { text: 'Marseille', isCorrect: false },
                { text: 'Nice', isCorrect: false },
              ],
              correctFeedback: 'Paris! Capitala modei mondiale! 🗼',
              wrongFeedback: 'Capitala Franței este Paris!',
              funFact: 'Parisul e cel mai vizitat oraș din lume, cu 50 milioane de turiști pe an! ✈️',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Franța — patria revoluției, modei și gastronomiei mondiale! 🥐',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Franceza este limba oficială în câte țări din lume (aproximativ)?',
              options: [
                { text: '29 țări', isCorrect: true },
                { text: '5 țări', isCorrect: false },
                { text: '50 țări', isCorrect: false },
                { text: '12 țări', isCorrect: false },
              ],
              correctFeedback: 'Impresionant! Franceza e vorbită pe 5 continente! 🌍',
              wrongFeedback: 'Franceza e vorbită în 29 de țări — pe 5 continente!',
              funFact: 'Franța a dat lumii cinematograful — frații Lumière l-au inventat în 1895! 🎬',
            },
          ],
        },
      },
      {
        id: 'germany',
        continentId: 'europe',
        name: 'Germania', nameEn: 'Germany',
        flag: '🇩🇪', capital: 'Berlin', capitalEmoji: '🏛️',
        landmark: 'Castelul Neuschwanstein', landmarkEmoji: '🏰',
        animal: 'Vultur auriu', animalEmoji: '🦅',
        color: '#1565C0',
        postcardEmoji: '🍺',
        age3to5: {
          lioIntro: 'Hallo! Suntem în Germania! 🇩🇪',
          miniGames: [
            {
              type: 'flag_quiz',
              question: 'Care e steagul Germaniei?',
              options: [
                { text: '🇩🇪 Negru, Roșu, Galben', isCorrect: true },
                { text: '🇧🇪 Negru, Galben, Roșu (vertical)', isCorrect: false },
              ],
              correctFeedback: 'Super! Steagul Germaniei are dungi orizontale! 🎉',
              wrongFeedback: 'Steagul Germaniei are dungi orizontale: negru, roșu, galben!',
              funFact: 'Germania face cele mai bune mașini din lume — BMW, Mercedes, Volkswagen! 🚗',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Willkommen in Deutschland! Germania e în centrul Europei! 🏰',
          miniGames: [
            {
              type: 'capital_quiz',
              question: 'Care e capitala Germaniei?',
              options: [
                { text: 'Berlin', isCorrect: true },
                { text: 'München', isCorrect: false },
                { text: 'Hamburg', isCorrect: false },
                { text: 'Frankfurt', isCorrect: false },
              ],
              correctFeedback: 'Berlin! Unul din cele mai creative orașe din lume! 🎨',
              wrongFeedback: 'Capitala Germaniei este Berlin!',
              funFact: 'Berlinul a fost împărțit de un zid 28 de ani (1961-1989)! 🧱',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Germania — cea mai mare economie din Europa! 🚗⚙️',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Zidul Berlinului a căzut în ce an?',
              options: [
                { text: '1989', isCorrect: true },
                { text: '1975', isCorrect: false },
                { text: '2000', isCorrect: false },
                { text: '1961', isCorrect: false },
              ],
              correctFeedback: 'Corect! 9 noiembrie 1989 — o zi istorică pentru Europa! 🌍',
              wrongFeedback: 'Zidul Berlinului a căzut în 1989, reunificând Germania!',
              funFact: 'Germania are 1.500 de fabrici de bere și peste 300 tipuri de pâine! 🍞🍺',
            },
          ],
        },
      },
      {
        id: 'italy',
        continentId: 'europe',
        name: 'Italia', nameEn: 'Italy',
        flag: '🇮🇹', capital: 'Roma', capitalEmoji: '🏛️',
        landmark: 'Colosseum', landmarkEmoji: '🏛️',
        animal: 'Lup italic', animalEmoji: '🐺',
        color: '#1565C0',
        postcardEmoji: '🍕',
        builderBlockUnlock: 'white_stone',
        age3to5: {
          lioIntro: 'Ciao! Suntem în Italia, țara pizza-ei! 🍕🇮🇹',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Din ce țară vine pizza?',
              options: [
                { text: '🇮🇹 Italia', isCorrect: true },
                { text: '🇺🇸 America', isCorrect: false },
              ],
              correctFeedback: 'Sì! Pizza e inventată în Napoli, Italia! 🍕',
              wrongFeedback: 'Pizza a fost inventată în Napoli, Italia!',
              funFact: 'Italienii mănâncă 8 kg de paste pe persoană pe an! 🍝',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Benvenuto in Italia! Roma, Veneția, și pizza uimitoare! 🏛️🍕',
          miniGames: [
            {
              type: 'capital_quiz',
              question: 'Care e capitala Italiei?',
              options: [
                { text: 'Roma', isCorrect: true },
                { text: 'Milano', isCorrect: false },
                { text: 'Napoli', isCorrect: false },
                { text: 'Veneția', isCorrect: false },
              ],
              correctFeedback: 'Roma! "Orașul Etern" — 2.800 de ani de istorie! 🏛️',
              wrongFeedback: 'Capitala Italiei este Roma!',
              funFact: 'Veneția e construită pe 118 insule mici și nu are mașini — doar bărci! ⛵',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Italia — leagănul Renașterii și al gastronomiei mondiale! 🎨',
          miniGames: [
            {
              type: 'landmark_quiz',
              question: 'Colosseum din Roma a fost construit pentru…',
              options: [
                { text: 'Lupte de gladiatori', isCorrect: true },
                { text: 'Concerte muzicale', isCorrect: false },
                { text: 'Piață de comerț', isCorrect: false },
                { text: 'Templu religios', isCorrect: false },
              ],
              correctFeedback: 'Exact! Colosseum găzduia 80.000 de spectatori! ⚔️',
              wrongFeedback: 'Colosseum era arena unde luptau gladiatorii romani!',
              funFact: 'Leonardo da Vinci, Michelangelo și Galileo Galilei erau italieni! 🎨',
            },
          ],
        },
      },
    ],
  },

  // ─── 2. AFRICA ─────────────────────────────────────────────
  {
    id: 'africa',
    name: 'Africa',
    nameEn: 'Africa',
    emoji: '🦁',
    color: '#E65100',
    bgGradient: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%)',
    mapPosition: { x: 50, y: 52 },
    requiredLevel: 2,
    countries: [
      {
        id: 'egypt',
        continentId: 'africa',
        name: 'Egipt', nameEn: 'Egypt',
        flag: '🇪🇬', capital: 'Cairo', capitalEmoji: '🏙️',
        landmark: 'Piramidele din Giza', landmarkEmoji: '🏛️',
        animal: 'Cămilă', animalEmoji: '🐪',
        color: '#E65100',
        postcardEmoji: '🔱',
        builderBlockUnlock: 'sand',
        age3to5: {
          lioIntro: 'Marhaba! Suntem în Egipt, țara piramidelor! 🔱',
          miniGames: [
            {
              type: 'animal_match',
              question: 'Ce animal trăiește în deșertul Sahara din Africa?',
              options: [
                { text: '🐪 Cămilă', isCorrect: true },
                { text: '🐧 Pinguin', isCorrect: false },
              ],
              correctFeedback: 'Da! Cămila poate merge zile fără apă! 🐪',
              wrongFeedback: 'Cămila trăiește în deșert — are cocoașe cu grăsime!',
              funFact: 'Cămila poate bea 200 de litri de apă în 15 minute! 💧',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Ahlan! Egiptul antic a construit minuni ale lumii! 🔱',
          miniGames: [
            {
              type: 'landmark_quiz',
              question: 'Piramidele din Giza sunt construite de…',
              options: [
                { text: 'Faraonii egipteni antici', isCorrect: true },
                { text: 'Romanii antici', isCorrect: false },
                { text: 'Grecii antici', isCorrect: false },
                { text: 'Arabii medievali', isCorrect: false },
              ],
              correctFeedback: 'Bravo! Piramidele au 4.500 de ani! Incredibil! 🔱',
              wrongFeedback: 'Piramidele au fost construite de faraonii Egiptului antic!',
              funFact: 'Marea Piramidă a lui Keops a fost cea mai înaltă construcție din lume timp de 3.800 ani! 📏',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Egipt — civilizația care a inventat scrierea hieroglifică! 𓂀',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Fluviul Nil este cel mai lung fluviu din lume. De unde pornește?',
              options: [
                { text: 'Din Africa Centrală (Lacul Victoria)', isCorrect: true },
                { text: 'Din Sahara', isCorrect: false },
                { text: 'Din Munții Atlas', isCorrect: false },
                { text: 'Din Arabia Saudită', isCorrect: false },
              ],
              correctFeedback: 'Excelent! Nilul curge 6.650 km din Africa Centrală! 🌊',
              wrongFeedback: 'Nilul pornește din Lacul Victoria în Africa Centrală!',
              funFact: 'Cleopatra a trăit mai aproape de lansarea iPhone-ului decât de construirea piramidelor! ⏰',
            },
          ],
        },
      },
      {
        id: 'kenya',
        continentId: 'africa',
        name: 'Kenya', nameEn: 'Kenya',
        flag: '🇰🇪', capital: 'Nairobi', capitalEmoji: '🏙️',
        landmark: 'Savana Masai Mara', landmarkEmoji: '🌅',
        animal: 'Leu', animalEmoji: '🦁',
        color: '#E65100',
        postcardEmoji: '🦒',
        age3to5: {
          lioIntro: 'Jambo! Suntem în Kenya, unde trăiesc leii! 🦁',
          miniGames: [
            {
              type: 'animal_match',
              question: 'Care e cel mai înalt animal din lume care trăiește în Africa?',
              options: [
                { text: '🦒 Girafă', isCorrect: true },
                { text: '🐘 Elefant', isCorrect: false },
              ],
              correctFeedback: 'Da! Girafa e cel mai înalt animal — 5-6 metri! 🦒',
              wrongFeedback: 'Girafa e cel mai înalt animal din lume!',
              funFact: 'Girafa doarme doar 2 ore pe noapte! 😴',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Karibu! Kenya are unele din cele mai spectaculoase savanele! 🌅',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Marea Migrație din Kenya implică milioane de…',
              options: [
                { text: 'Gnu (wildebeest) și zebre', isCorrect: true },
                { text: 'Elefanți', isCorrect: false },
                { text: 'Flamingo', isCorrect: false },
                { text: 'Gorile', isCorrect: false },
              ],
              correctFeedback: 'Corect! 2 milioane de animale migrează anual! 🦓',
              wrongFeedback: 'Marea Migrație: 2 milioane de gnu și zebre traversează savana!',
              funFact: 'Kenya a câștigat mai multe medalii olimpice la alergare decât orice altă țară! 🏃',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Kenya — locul de origine al speciei Homo sapiens acum 300.000 ani! 🦴',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Africa adăpostește câte procente din speciile de mamifere din lume?',
              options: [
                { text: '25%', isCorrect: true },
                { text: '5%', isCorrect: false },
                { text: '50%', isCorrect: false },
                { text: '10%', isCorrect: false },
              ],
              correctFeedback: 'Uimitor! Africa e cel mai bogat continent în biodiversitate! 🌿',
              wrongFeedback: 'Africa are 25% din toate speciile de mamifere ale lumii!',
              funFact: 'Cel mai mic mamifer din lume, musarabia-pitică, trăiește în Africa! 🐀',
            },
          ],
        },
      },
      {
        id: 'south_africa',
        continentId: 'africa',
        name: 'Africa de Sud', nameEn: 'South Africa',
        flag: '🇿🇦', capital: 'Pretoria', capitalEmoji: '🏛️',
        landmark: 'Table Mountain', landmarkEmoji: '⛰️',
        animal: 'Pinguin african', animalEmoji: '🐧',
        color: '#E65100',
        postcardEmoji: '💎',
        age3to5: {
          lioIntro: 'Sanibona! Africa de Sud are… pinguini! Da, în Africa! 🐧',
          miniGames: [
            {
              type: 'animal_match',
              question: 'Ce animal surpriză trăiește pe plajele din Africa de Sud?',
              options: [
                { text: '🐧 Pinguin african', isCorrect: true },
                { text: '🐨 Koala', isCorrect: false },
              ],
              correctFeedback: 'Da! Pinguinii africani trăiesc pe plaja din Cape Town! 🐧',
              wrongFeedback: 'Africa de Sud are pinguini pe plaje! Surpriză!',
              funFact: 'Pinguinii africani merg la 25 km/h pe uscat! 🏃',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Hola! Africa de Sud e singura țară cu 3 capitale! 🏛️',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Africa de Sud este singura țară din lume cu câte capitale?',
              options: [
                { text: '3 capitale', isCorrect: true },
                { text: '1 capitală', isCorrect: false },
                { text: '2 capitale', isCorrect: false },
                { text: '4 capitale', isCorrect: false },
              ],
              correctFeedback: 'Exact! Pretoria, Cape Town și Bloemfontein! 🏛️',
              wrongFeedback: 'Africa de Sud are 3 capitale! Unic în lume!',
              funFact: 'Diamantul Hope (albastru, 45 carate) a fost găsit în Africa de Sud! 💎',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Africa de Sud — patria lui Nelson Mandela și a primei operații pe cord! ❤️',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Nelson Mandela a petrecut câți ani în închisoare înainte de a deveni președinte?',
              options: [
                { text: '27 ani', isCorrect: true },
                { text: '5 ani', isCorrect: false },
                { text: '15 ani', isCorrect: false },
                { text: '40 ani', isCorrect: false },
              ],
              correctFeedback: 'Incredibil! 27 ani în închisoare, apoi președinte! 👊',
              wrongFeedback: 'Mandela a stat 27 ani în închisoare și a luptat pentru drepturi egale!',
              funFact: 'Prima operație pe cord deschis reușită din lume a fost în Cape Town, 1967! 🫀',
            },
          ],
        },
      },
    ],
  },

  // ─── 3. ASIA ───────────────────────────────────────────────
  {
    id: 'asia',
    name: 'Asia',
    nameEn: 'Asia',
    emoji: '🐉',
    color: '#B71C1C',
    bgGradient: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)',
    mapPosition: { x: 70, y: 35 },
    requiredLevel: 3,
    countries: [
      {
        id: 'japan',
        continentId: 'asia',
        name: 'Japonia', nameEn: 'Japan',
        flag: '🇯🇵', capital: 'Tokyo', capitalEmoji: '🗼',
        landmark: 'Muntele Fuji', landmarkEmoji: '🗻',
        animal: 'Maimuță japoneză de zăpadă', animalEmoji: '🐒',
        color: '#B71C1C',
        postcardEmoji: '🌸',
        builderBlockUnlock: 'dragon_scale',
        age3to5: {
          lioIntro: 'Konnichiwa! Suntem în Japonia! 🇯🇵🌸',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Cireșii înfloresc în ce culoare în Japonia primăvara?',
              options: [
                { text: '🌸 Roz', isCorrect: true },
                { text: '🌻 Galben', isCorrect: false },
              ],
              correctFeedback: 'Da! Sakura — florile de cireș roz! Superb! 🌸',
              wrongFeedback: 'Florile de cireș (sakura) sunt roz — simbolul Japoniei!',
              funFact: 'Japonezii fac picnicuri sub cireși înfloriți în aprilie! 🍱',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Yokoso Nihon! Japonia e patria sushi, anime și roboților! 🤖',
          miniGames: [
            {
              type: 'capital_quiz',
              question: 'Care e capitala Japoniei?',
              options: [
                { text: 'Tokyo', isCorrect: true },
                { text: 'Kyoto', isCorrect: false },
                { text: 'Osaka', isCorrect: false },
                { text: 'Hiroshima', isCorrect: false },
              ],
              correctFeedback: 'Tokyo! Cel mai mare oraș din lume cu 38 milioane de oameni! 🌆',
              wrongFeedback: 'Capitala Japoniei este Tokyo!',
              funFact: 'Japonia are 6.852 de insule! Și trăiesc pe 430 dintre ele! 🏝️',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Japonia — where tradition meets future! Katana și robotică! ⚔️🤖',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Japonia are cel mai mic rata a criminalității din lume. Care e rata de soluționare a crimelor?',
              options: [
                { text: 'Peste 95%', isCorrect: true },
                { text: '50%', isCorrect: false },
                { text: '70%', isCorrect: false },
                { text: '30%', isCorrect: false },
              ],
              correctFeedback: 'Incredibil! Japonia e una din cele mai sigure țări! 🛡️',
              wrongFeedback: 'Japonia rezolvă peste 95% din crime — cifră uimitoare!',
              funFact: 'Japonia a inventat emoji-urile! Primul emoji: un simbol de inimă în 1999! 😀',
            },
          ],
        },
      },
      {
        id: 'china',
        continentId: 'asia',
        name: 'China', nameEn: 'China',
        flag: '🇨🇳', capital: 'Beijing', capitalEmoji: '🏮',
        landmark: 'Marele Zid Chinezesc', landmarkEmoji: '🏯',
        animal: 'Panda gigant', animalEmoji: '🐼',
        color: '#B71C1C',
        postcardEmoji: '🐼',
        builderBlockUnlock: 'dragon_scale',
        age3to5: {
          lioIntro: 'Nǐ hǎo! Suntem în China, unde trăiesc panda! 🐼🇨🇳',
          miniGames: [
            {
              type: 'animal_match',
              question: 'Ce animal adorabil trăiește în China și mănâncă bambus?',
              options: [
                { text: '🐼 Panda gigant', isCorrect: true },
                { text: '🦁 Leu', isCorrect: false },
              ],
              correctFeedback: 'Da! Panda gigant e simbolul Chinei! 🐼',
              wrongFeedback: 'Panda gigant trăiește în China și mănâncă 12 ore pe zi bambus!',
              funFact: 'Panda mănâncă bambus 12-16 ore pe zi! 🎋',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Huānyíng! Marele Zid Chinezesc are 21.000 km lungime! 🏯',
          miniGames: [
            {
              type: 'landmark_quiz',
              question: 'Marele Zid Chinezesc a fost construit pentru…',
              options: [
                { text: 'A apăra China de invazii', isCorrect: true },
                { text: 'Decorație arhitecturală', isCorrect: false },
                { text: 'Separarea provinciilor', isCorrect: false },
                { text: 'Conducte de apă', isCorrect: false },
              ],
              correctFeedback: 'Corect! Construit pe 2.000 de ani pentru apărare! 🛡️',
              wrongFeedback: 'Marele Zid a fost construit să apere China de invazii din nord!',
              funFact: 'Marele Zid NU se vede din spațiu — e o legendă urbană! 🚀',
            },
          ],
        },
        age9to12: {
          lioIntro: 'China — cea mai mare populație din lume și patria celor 4 mari invenții! 🧭',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Cele 4 mari invenții ale Chinei antice sunt: hârtia, tiparul, praful de pușcă și…',
              options: [
                { text: 'Busola', isCorrect: true },
                { text: 'Roata', isCorrect: false },
                { text: 'Telescopul', isCorrect: false },
                { text: 'Matematica', isCorrect: false },
              ],
              correctFeedback: 'Bravo! Busola chineză schimbat navigația mondială! 🧭',
              wrongFeedback: 'A patra mare invenție a Chinei este busola!',
              funFact: 'China e țara cu cel mai mare număr de utilizatori de internet — 1 miliard! 📱',
            },
          ],
        },
      },
      {
        id: 'india',
        continentId: 'asia',
        name: 'India', nameEn: 'India',
        flag: '🇮🇳', capital: 'New Delhi', capitalEmoji: '🕌',
        landmark: 'Taj Mahal', landmarkEmoji: '🕌',
        animal: 'Tigru bengalez', animalEmoji: '🐯',
        color: '#B71C1C',
        postcardEmoji: '🕌',
        age3to5: {
          lioIntro: 'Namaste! Suntem în India, cu mirodeniile colorate! 🌶️🇮🇳',
          miniGames: [
            {
              type: 'landmark_quiz',
              question: 'Taj Mahal din India este…',
              options: [
                { text: '🕌 Un palat alb de marmură', isCorrect: true },
                { text: '🏰 Un castel medieval', isCorrect: false },
              ],
              correctFeedback: 'Da! Taj Mahal e palatul alb construit din dragoste! 🕌',
              wrongFeedback: 'Taj Mahal e un mausoleu de marmură albă — construit din dragoste!',
              funFact: 'Taj Mahal a luat 22 de ani să fie construit de 20.000 de muncitori! 🏗️',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Namaste India! Cea mai mare democrație din lume! 🗳️',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'India are cea mai mare… din lume.',
              options: [
                { text: 'Industrie de cinema (Bollywood)', isCorrect: true },
                { text: 'Armată', isCorrect: false },
                { text: 'Flotă navală', isCorrect: false },
                { text: 'Producție de oțel', isCorrect: false },
              ],
              correctFeedback: 'Bollywood produce 1.000+ filme pe an! Mai mult decât Hollywood! 🎬',
              wrongFeedback: 'Bollywood din India produce mai multe filme decât orice altă industrie!',
              funFact: 'Yoga a apărut în India acum 5.000 de ani! 🧘',
            },
          ],
        },
        age9to12: {
          lioIntro: 'India — patria matematicii cu zero, yoga și sistemului numeric! 🔢',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Indienii antici au inventat sistemul de numere pe care îl folosim azi. Prin cine a ajuns în Europa?',
              options: [
                { text: 'Prin matematicienii arabi (cifre arabo-indiene)', isCorrect: true },
                { text: 'Prin navigatorii greci', isCorrect: false },
                { text: 'Prin Marco Polo', isCorrect: false },
                { text: 'Prin exploratorii portughezi', isCorrect: false },
              ],
              correctFeedback: 'Exact! De aceea le numim "cifre arabe" deși sunt indiene! 🔢',
              wrongFeedback: 'Numerele indiene au ajuns în Europa prin matematicienii arabi!',
              funFact: 'India nu a invadat nicio altă țară în ultimii 100.000 de ani de istorie! ☮️',
            },
          ],
        },
      },
    ],
  },

  // ─── 4. AMERICA DE NORD ─────────────────────────────────────
  {
    id: 'north_america',
    name: 'America de Nord',
    nameEn: 'North America',
    emoji: '🗽',
    color: '#1B5E20',
    bgGradient: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    mapPosition: { x: 22, y: 35 },
    requiredLevel: 2,
    countries: [
      {
        id: 'usa',
        continentId: 'north_america',
        name: 'Statele Unite', nameEn: 'USA',
        flag: '🇺🇸', capital: 'Washington D.C.', capitalEmoji: '🏛️',
        landmark: 'Statuia Libertății', landmarkEmoji: '🗽',
        animal: 'Vultur cu cap alb', animalEmoji: '🦅',
        color: '#1B5E20',
        postcardEmoji: '🗽',
        age3to5: {
          lioIntro: 'Hello! Suntem în America, țara Statuii Libertății! 🗽🇺🇸',
          miniGames: [
            {
              type: 'landmark_quiz',
              question: 'Această statuie uriașă verde din New York se numește…',
              options: [
                { text: '🗽 Statuia Libertății', isCorrect: true },
                { text: '🏛️ Casa Albă', isCorrect: false },
              ],
              correctFeedback: 'Da! Statuia Libertății! Un cadou de la Franța! 🗽',
              wrongFeedback: 'E Statuia Libertății — un cadou de la Franța în 1886!',
              funFact: 'Statuia Libertății are 93 de metri înălțime cu piedestal! 📏',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Welcome to the USA! 50 de state, o singură stea pentru fiecare! ⭐',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Câte state are Statele Unite ale Americii?',
              options: [
                { text: '50 state', isCorrect: true },
                { text: '48 state', isCorrect: false },
                { text: '52 state', isCorrect: false },
                { text: '45 state', isCorrect: false },
              ],
              correctFeedback: 'Corect! 50 de stele pe steag = 50 de state! ⭐',
              wrongFeedback: 'SUA are 50 de state — de aceea steagul are 50 de stele!',
              funFact: 'Cel mai mic stat e Rhode Island — mai mic decât județul București! 📍',
            },
          ],
        },
        age9to12: {
          lioIntro: 'USA — prima țară modernă fondată pe principii democratice în 1776! 🏛️',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Neil Armstrong a ajuns primul pe Lună în ce an?',
              options: [
                { text: '1969', isCorrect: true },
                { text: '1959', isCorrect: false },
                { text: '1975', isCorrect: false },
                { text: '1981', isCorrect: false },
              ],
              correctFeedback: 'One small step! 20 iulie 1969 — o zi istorică! 🌕',
              wrongFeedback: 'Neil Armstrong a pășit pe Lună pe 20 iulie 1969!',
              funFact: 'NASA a cheltuit mai mulți bani pe catering decât pe primele calculatoare! 🍔',
            },
          ],
        },
      },
      {
        id: 'canada',
        continentId: 'north_america',
        name: 'Canada', nameEn: 'Canada',
        flag: '🇨🇦', capital: 'Ottawa', capitalEmoji: '🍁',
        landmark: 'Cascadele Niagara', landmarkEmoji: '💦',
        animal: 'Castor', animalEmoji: '🦫',
        color: '#1B5E20',
        postcardEmoji: '🍁',
        age3to5: {
          lioIntro: 'Bonjour! Hi! Canada vorbește două limbi! 🍁🇨🇦',
          miniGames: [
            {
              type: 'flag_quiz',
              question: 'Ce simbol are pe steag Canada?',
              options: [
                { text: '🍁 O frunză de arțar', isCorrect: true },
                { text: '⭐ O stea', isCorrect: false },
              ],
              correctFeedback: 'Da! Frunza de arțar — simbolul Canadei! 🍁',
              wrongFeedback: 'Steagul Canadei are o frunză roșie de arțar în centru!',
              funFact: 'Canada produce 71% din siropul de arțar al lumii! 🍯',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Canada — cea mai mare țară din lume ca suprafață (după Rusia)! 🌎',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Canada are granița terestră cu…',
              options: [
                { text: 'Doar cu SUA', isCorrect: true },
                { text: 'SUA și Mexic', isCorrect: false },
                { text: 'SUA și Rusia', isCorrect: false },
                { text: 'SUA și Groenlanda', isCorrect: false },
              ],
              correctFeedback: 'Corect! Canada și SUA au cea mai lungă graniță din lume! 🗺️',
              wrongFeedback: 'Canada se învecinează pe uscat doar cu SUA!',
              funFact: 'Granița Canada-SUA are 8.891 km — cea mai lungă din lume neapărată militar! 🤝',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Canada — lider mondial în drepturile omului și multiculturalism! 🌍',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Canada a inventat ce sport popular iarna?',
              options: [
                { text: 'Hockey pe gheață', isCorrect: true },
                { text: 'Schiul', isCorrect: false },
                { text: 'Patinajul artistic', isCorrect: false },
                { text: 'Curling', isCorrect: false },
              ],
              correctFeedback: 'Da! Hockey a fost inventat în Canada în 1875! 🏒',
              wrongFeedback: 'Hockey pe gheață a fost inventat în Canada în 1875!',
              funFact: 'Canada are mai multe lacuri decât toate celelalte țări la un loc! 🏞️',
            },
          ],
        },
      },
      {
        id: 'mexico',
        continentId: 'north_america',
        name: 'Mexic', nameEn: 'Mexico',
        flag: '🇲🇽', capital: 'Mexico City', capitalEmoji: '🌮',
        landmark: 'Teotihuacan', landmarkEmoji: '🏛️',
        animal: 'Vultur mexican', animalEmoji: '🦅',
        color: '#1B5E20',
        postcardEmoji: '🌮',
        age3to5: {
          lioIntro: 'Hola! Suntem în Mexic, țara tacos! 🌮🇲🇽',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Ciocolata a fost inventată de locuitorii antici din…',
              options: [
                { text: '🇲🇽 Mexic (aztecii și mayașii)', isCorrect: true },
                { text: '🇨🇭 Elveția', isCorrect: false },
              ],
              correctFeedback: 'Da! Aztecii băueau ciocolată acum 3.000 ani! 🍫',
              wrongFeedback: 'Ciocolata a fost inventată de azteci și mayași în Mexic!',
              funFact: 'Aztecii foloseau boabele de cacao ca monedă! 🍫💰',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Bienvenidos! Mexicul a dat lumii ciocolata, tomatele și avocado! 🥑',
          miniGames: [
            {
              type: 'landmark_quiz',
              question: 'Piramidele din Teotihuacan au fost construite de…',
              options: [
                { text: 'Popoare precolumbiene (azteci/mayași)', isCorrect: true },
                { text: 'Spaniolii colonizatori', isCorrect: false },
                { text: 'Popoare din Africa', isCorrect: false },
                { text: 'Vikingii', isCorrect: false },
              ],
              correctFeedback: 'Corect! Piramidele mexicane sunt mai vechi decât sosirea spaniolilor! 🏛️',
              wrongFeedback: 'Piramidele mexicane au fost construite de civilizațiile precolumbiene!',
              funFact: 'Mexicul e în top 5 țări cu cea mai mare biodiversitate din lume! 🦎',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Mexic — where ancient meets modern! 68 limbi indigene vorbite azi! 🗣️',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Chilli-ul (ardeiul iute) a apărut în Mexic acum…',
              options: [
                { text: 'Acum 6.000 ani', isCorrect: true },
                { text: 'Acum 200 ani', isCorrect: false },
                { text: 'Acum 1.000 ani', isCorrect: false },
                { text: 'Acum 500 ani', isCorrect: false },
              ],
              correctFeedback: 'Impresionant! Ardeiul iute e cultivat de 6.000 ani! 🌶️',
              wrongFeedback: 'Ardeiul iute a fost cultivat în Mexic acum 6.000 de ani!',
              funFact: 'Mexicul City e construit pe un lac secat și se scufundă cu 9 cm pe an! 🏙️',
            },
          ],
        },
      },
    ],
  },

  // ─── 5. AMERICA DE SUD ──────────────────────────────────────
  {
    id: 'south_america',
    name: 'America de Sud',
    nameEn: 'South America',
    emoji: '🦜',
    color: '#1A237E',
    bgGradient: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)',
    mapPosition: { x: 28, y: 62 },
    requiredLevel: 3,
    countries: [
      {
        id: 'brazil',
        continentId: 'south_america',
        name: 'Brazilia', nameEn: 'Brazil',
        flag: '🇧🇷', capital: 'Brasilia', capitalEmoji: '🏙️',
        landmark: 'Cristos Redentor', landmarkEmoji: '⛪',
        animal: 'Ara (papagal colorat)', animalEmoji: '🦜',
        color: '#1A237E',
        postcardEmoji: '🎭',
        age3to5: {
          lioIntro: 'Olá! Brazilia e cea mai mare țară din America de Sud! 🦜🇧🇷',
          miniGames: [
            {
              type: 'animal_match',
              question: 'Ce animal colorat trăiește în pădurea amazoniană?',
              options: [
                { text: '🦜 Papagal Ara', isCorrect: true },
                { text: '🐧 Pinguin', isCorrect: false },
              ],
              correctFeedback: 'Da! Ara e cel mai colorat papagal din lume! 🦜',
              wrongFeedback: 'Papagalul Ara trăiește în pădurea amazoniană din Brazilia!',
              funFact: 'Unii papagali Ara pot trăi 60-80 ani! Mai mult decât oamenii! 🦜',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Bem-vindo ao Brasil! Carnavalul e cel mai mare festival din lume! 🎭',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Brazilia e singura țară din America de Sud în care se vorbește…',
              options: [
                { text: 'Portugheza', isCorrect: true },
                { text: 'Spaniola', isCorrect: false },
                { text: 'Franceza', isCorrect: false },
                { text: 'Engleza', isCorrect: false },
              ],
              correctFeedback: 'Corect! Brazilia vorbește portugheză datorită colonizării! 🗺️',
              wrongFeedback: 'Brazilia vorbește portugheză — restul Americii de Sud vorbește spaniolă!',
              funFact: 'Brazilia a câștigat Cupa Mondială la fotbal de 5 ori — record mondial! ⚽',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Brazilia — 60% din Pădurea Amazoniană, plămânul Pământului! 🌿',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Câte procente din oxigenul Pământului produce Pădurea Amazoniană?',
              options: [
                { text: '20%', isCorrect: true },
                { text: '5%', isCorrect: false },
                { text: '50%', isCorrect: false },
                { text: '10%', isCorrect: false },
              ],
              correctFeedback: 'Uimitor! 1 din 5 respirații pe care le facem vine din Amazon! 🌿',
              wrongFeedback: 'Amazonul produce 20% din oxigenul planetei — de aceea e "plămânul Pământului"!',
              funFact: 'Amazonul are 10% din toate speciile de animale ale Pământului! 🐍🦋🐊',
            },
          ],
        },
      },
      {
        id: 'peru',
        continentId: 'south_america',
        name: 'Peru', nameEn: 'Peru',
        flag: '🇵🇪', capital: 'Lima', capitalEmoji: '🏙️',
        landmark: 'Machu Picchu', landmarkEmoji: '🏔️',
        animal: 'Lama', animalEmoji: '🦙',
        color: '#1A237E',
        postcardEmoji: '🏔️',
        age3to5: {
          lioIntro: 'Hola desde Perú! Avem lame drăguțe! 🦙🇵🇪',
          miniGames: [
            {
              type: 'animal_match',
              question: 'Acest animal cu gât lung din America de Sud se numește…',
              options: [
                { text: '🦙 Lamă', isCorrect: true },
                { text: '🐫 Cămilă', isCorrect: false },
              ],
              correctFeedback: 'Da! Lama e rudă cu cămila și trăiește în Anzi! 🦙',
              wrongFeedback: 'E o lamă! Trăiește în munții Anzi din Peru!',
              funFact: 'Lama scuipă când e nervoasă! Distanța: până la 3 metri! 🦙💦',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Bienvenidos a Perú! Machu Picchu e a 8-a minune a lumii! 🏔️',
          miniGames: [
            {
              type: 'landmark_quiz',
              question: 'Machu Picchu a fost construit de…',
              options: [
                { text: 'Civilizația Inca', isCorrect: true },
                { text: 'Azteci', isCorrect: false },
                { text: 'Mayași', isCorrect: false },
                { text: 'Spanioli', isCorrect: false },
              ],
              correctFeedback: 'Corect! Incașii au construit Machu Picchu în sec XV! 🏔️',
              wrongFeedback: 'Machu Picchu a fost construit de Imperiul Inca în secolul XV!',
              funFact: 'Machu Picchu a fost construit fără roți, cai sau fier — incredibil! 🏗️',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Peru — leagănul civilizației Inca și al cartofului! 🥔',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Cartoful — azi mâncat de toată lumea — a apărut inițial în…',
              options: [
                { text: 'Peru (Munții Anzi)', isCorrect: true },
                { text: 'Irlanda', isCorrect: false },
                { text: 'Rusia', isCorrect: false },
                { text: 'Germania', isCorrect: false },
              ],
              correctFeedback: 'Exact! Incașii cultivau cartofii în Anzi de 8.000 ani! 🥔',
              wrongFeedback: 'Cartoful vine din Munții Anzi din Peru — introdus în Europa de spanioli!',
              funFact: 'Peru are 3.000 de tipuri de cartofi! Mai mult decât orice altă țară! 🥔',
            },
          ],
        },
      },
    ],
  },

  // ─── 6. AUSTRALIA & OCEANIA ─────────────────────────────────
  {
    id: 'oceania',
    name: 'Australia & Oceania',
    nameEn: 'Australia & Oceania',
    emoji: '🦘',
    color: '#4E342E',
    bgGradient: 'linear-gradient(135deg, #FBE9E7 0%, #FFCCBC 100%)',
    mapPosition: { x: 80, y: 65 },
    requiredLevel: 4,
    countries: [
      {
        id: 'australia',
        continentId: 'oceania',
        name: 'Australia', nameEn: 'Australia',
        flag: '🇦🇺', capital: 'Canberra', capitalEmoji: '🏛️',
        landmark: 'Opera House Sydney', landmarkEmoji: '🎭',
        animal: 'Cangur', animalEmoji: '🦘',
        color: '#4E342E',
        postcardEmoji: '🦘',
        builderBlockUnlock: 'cobblestone',
        age3to5: {
          lioIntro: 'G\'day! Suntem în Australia, unde trăiesc cangurii! 🦘🇦🇺',
          miniGames: [
            {
              type: 'animal_match',
              question: 'Ce animal sare și are pui în buzunărel trăiește în Australia?',
              options: [
                { text: '🦘 Cangur', isCorrect: true },
                { text: '🐻 Urs', isCorrect: false },
              ],
              correctFeedback: 'Da! Cangurul e animalul cel mai cunoscut din Australia! 🦘',
              wrongFeedback: 'Cangurul trăiește doar în Australia și poate sări 9 metri!',
              funFact: 'Cangurul nou-născut e cât o albina de mare! Crește în buzunarul mamei! 🦘',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Welcome to Oz! Australia e singurul continent care e și o singură țară! 🌏',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Australia e singura țară care ocupă un întreg…',
              options: [
                { text: 'Continent', isCorrect: true },
                { text: 'Insulă', isCorrect: false },
                { text: 'Emisferă', isCorrect: false },
                { text: 'Ocean', isCorrect: false },
              ],
              correctFeedback: 'Exact! Australia e continent și țară în același timp! 🌏',
              wrongFeedback: 'Australia e singurul stat care ocupă un continent întreg!',
              funFact: 'Australia are mai multe specii veninoase decât orice altă țară! 🐍🕷️',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Australia — continentul misterios descoperit de europeni în 1770! ⚓',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Marea Barieră de Corali din Australia este…',
              options: [
                { text: 'Cel mai mare organism viu din lume (văzut din spațiu)', isCorrect: true },
                { text: 'Cel mai adânc ocean din lume', isCorrect: false },
                { text: 'Cel mai lung fluviu din Australia', isCorrect: false },
                { text: 'Un lanț muntos submarin', isCorrect: false },
              ],
              correctFeedback: 'Incredibil! 2.300 km de corali vii — vizibil din spațiu! 🪸',
              wrongFeedback: 'Marea Barieră de Corali e cel mai mare organism viu din lume!',
              funFact: 'Australia e mai lată decât distanța de la Luna la Pământ? Nu! Dar e aproape! 🌏',
            },
          ],
        },
      },
    ],
  },

  // ─── 7. ANTARCTICA ─────────────────────────────────────────
  {
    id: 'antarctica',
    name: 'Antarctica',
    nameEn: 'Antarctica',
    emoji: '🐧',
    color: '#546E7A',
    bgGradient: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)',
    mapPosition: { x: 50, y: 90 },
    requiredLevel: 5,
    countries: [
      {
        id: 'antarctica_zone',
        continentId: 'antarctica',
        name: 'Antarctica', nameEn: 'Antarctica',
        flag: '🐧', capital: 'Nu are capitală', capitalEmoji: '❄️',
        landmark: 'Polul Sud', landmarkEmoji: '🧭',
        animal: 'Pinguin Imperial', animalEmoji: '🐧',
        color: '#546E7A',
        postcardEmoji: '🧊',
        builderBlockUnlock: 'ice',
        age3to5: {
          lioIntro: 'Brrr! Antarctica e cel mai rece loc de pe Pământ! 🐧❄️',
          miniGames: [
            {
              type: 'animal_match',
              question: 'Ce animăluț adorabil trăiește în Antarctica?',
              options: [
                { text: '🐧 Pinguin', isCorrect: true },
                { text: '🦁 Leu', isCorrect: false },
              ],
              correctFeedback: 'Da! Pinguinii trăiesc în Antarctica! Sunt cei mai curajosi! 🐧',
              wrongFeedback: 'Pinguinii trăiesc în Antarctica — cel mai rece loc de pe Pământ!',
              funFact: 'Pinguinii își propun partenerul dăruindu-i un pietricicică specială! 💎',
            },
          ],
        },
        age6to8: {
          lioIntro: 'Antarctica e singurul continent fără țări și fără populație permanentă! ❄️',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Antarctica conține câte procente din apa dulce a Pământului (ca gheață)?',
              options: [
                { text: '70%', isCorrect: true },
                { text: '10%', isCorrect: false },
                { text: '30%', isCorrect: false },
                { text: '50%', isCorrect: false },
              ],
              correctFeedback: '70%! Dacă se topește, nivelul oceanelor crește 60 metri! 🌊',
              wrongFeedback: 'Antarctica conține 70% din apa dulce a lumii sub formă de gheață!',
              funFact: 'Sub Antarctica se află lacul Vostok — înghețat de 15 milioane ani! 🏔️',
            },
          ],
        },
        age9to12: {
          lioIntro: 'Antarctica — laboratorul științific al planetei, guvernat de 12 țări! 🔬',
          miniGames: [
            {
              type: 'fact_quiz',
              question: 'Tratatul Antarctic (1959) interzice ce activitate în Antarctica?',
              options: [
                { text: 'Activități militare și minerit', isCorrect: true },
                { text: 'Cercetarea științifică', isCorrect: false },
                { text: 'Turismul', isCorrect: false },
                { text: 'Zborul de avioane', isCorrect: false },
              ],
              correctFeedback: 'Corect! Antarctica e protejată de război și exploatare! ☮️',
              wrongFeedback: 'Tratatul Antarctic interzice activitățile militare și mineritul!',
              funFact: 'În Antarctica a nins cu meteorit în 1969 — cel mai mare găsit pe Pământ! ☄️',
            },
          ],
        },
      },
    ],
  },
]

// ─── Utilitare ────────────────────────────────────────────────────

export const CONTINENT_MAP = new Map<string, Continent>(CONTINENTS.map(c => [c.id, c]))

export function getAllCountries(): Country[] {
  return CONTINENTS.flatMap(c => c.countries)
}

export const COUNTRY_MAP = new Map<string, Country>(
  getAllCountries().map(c => [c.id, c])
)

export function getCountryById(id: string): Country | undefined {
  return COUNTRY_MAP.get(id)
}

export function getContinentForCountry(countryId: string): Continent | undefined {
  return CONTINENTS.find(c => c.countries.some(co => co.id === countryId))
}

export function getAgeContent(country: Country, age: number): AgeContent {
  if (age <= 5) return country.age3to5
  if (age <= 8) return country.age6to8
  return country.age9to12
}

export function getMiniGamesForAge(country: Country, age: number): MiniGame[] {
  const content = getAgeContent(country, age)
  return content.miniGames
}

// Câte întrebări poate vedea un copil (pe vârstă)
export function getOptionsCount(age: number): number {
  if (age <= 5) return 2
  if (age <= 8) return 3
  return 4
}

// Near-miss pentru geografie
export function getGeoNearMissMessage(visitedCount: number, totalCount: number): string | null {
  const remaining = totalCount - visitedCount
  if (visitedCount === 0) return null
  if (remaining === 1) return `Mai ai O țară de explorat pe acest continent! 🌍`
  if (remaining === 2) return `Aproape! Doar ${remaining} țări rămase! 💪`
  if (visitedCount > 0 && visitedCount >= Math.floor(totalCount / 2)) {
    return `Mai mult de jumătate explorat! Continuă! ⭐`
  }
  return null
}

// ─── Compatibilitate cu codul vechi ──────────────────────────────
// Alias ZONES pentru a nu sparge importurile existente

export const ZONES = getAllCountries().map(country => ({
  ...country,
  slug: country.id,
  description: `Explorează ${country.name} și învață fapte fascinante! ${country.flag}`,
  totalStars: 3,
  items: country.age6to8.miniGames.map((mg, i) => ({
    id: `${country.id}_q${i}`,
    emoji: country.flag,
    label: mg.question.slice(0, 30),
    points: 1,
  })),
  quests: [
    {
      id: `quest_${country.id}_1`,
      title: `Exploreaza ${country.name}`,
      description: `Răspunde corect la o întrebare despre ${country.name}`,
      requiredStars: 1,
      rewardCoins: 10,
      rewardEmoji: country.flag,
    },
    {
      id: `quest_${country.id}_2`,
      title: `Expert în ${country.name}`,
      description: `Răspunde corect la toate întrebările`,
      requiredStars: 3,
      rewardCoins: 25,
      rewardEmoji: '🏆',
    },
  ],
  secret: {
    id: `secret_${country.id}`,
    trigger: 'idle_10s' as const,
    description: `O descoperire surpriză despre ${country.name}`,
    rewardEmoji: '🔍',
    rewardCoins: 15,
  },
})) satisfies Zone[]

export const ZONE_MAP = new Map<string, Zone>(ZONES.map(z => [z.slug, z]))

export function getZoneBySlug(slug: string): Zone | undefined {
  return ZONE_MAP.get(slug)
}

export function isZoneUnlocked(zone: Zone, playerLevel: number): boolean {
  const continent = getContinentForCountry(zone.id)
  if (!continent) return playerLevel >= 1
  return playerLevel >= continent.requiredLevel
}

export function getNearMissMessage(collectedStars: number, totalStars: number): string | null {
  const remaining = totalStars - collectedStars
  if (collectedStars === 0 || remaining <= 0) return null
  if (remaining === 1) return `Atât de aproape! Doar O stea rămâne! 🌟`
  if (collectedStars > 0 && collectedStars >= Math.floor(totalStars / 2)) {
    return `La jumătate! Continuă! ⭐`
  }
  return null
}
