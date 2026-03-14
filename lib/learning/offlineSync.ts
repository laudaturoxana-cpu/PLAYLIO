'use client'

import type { ItemProgress } from './adaptiveEngine'

const DB_NAME = 'playlio_learning'
const DB_VERSION = 1
const STORE_PROGRESS = 'item_progress'
const STORE_PENDING = 'pending_sync'

// ─── IndexedDB helpers ────────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        db.createObjectStore(STORE_PROGRESS, { keyPath: 'itemId' })
      }
      if (!db.objectStoreNames.contains(STORE_PENDING)) {
        db.createObjectStore(STORE_PENDING, { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx<T>(
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode)
    const store = transaction.objectStore(storeName)
    const req = fn(store)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function saveProgressOffline(progress: ItemProgress): Promise<void> {
  try {
    const db = await openDB()
    await tx(db, STORE_PROGRESS, 'readwrite', (store) =>
      store.put(progress)
    )
  } catch {
    // Offline save eșuat silențios — continuă jocul
  }
}

export async function loadProgressOffline(itemId: string): Promise<ItemProgress | null> {
  try {
    const db = await openDB()
    const result = await tx<ItemProgress | undefined>(db, STORE_PROGRESS, 'readonly', (store) =>
      store.get(itemId)
    )
    return result ?? null
  } catch {
    return null
  }
}

export async function loadAllProgressOffline(): Promise<ItemProgress[]> {
  try {
    const db = await openDB()
    return await tx<ItemProgress[]>(db, STORE_PROGRESS, 'readonly', (store) =>
      store.getAll()
    )
  } catch {
    return []
  }
}

interface PendingRecord {
  userId: string
  itemId: string
  gameType: string
  wasCorrect: boolean
  timestamp: number
}

export async function queueForSync(record: PendingRecord): Promise<void> {
  try {
    const db = await openDB()
    await tx(db, STORE_PENDING, 'readwrite', (store) =>
      store.add(record)
    )
  } catch {
    // silențios
  }
}

export async function syncPendingToSupabase(userId: string): Promise<void> {
  if (!navigator.onLine) return

  try {
    const db = await openDB()
    const pending = await tx<(PendingRecord & { id: number })[]>(
      db, STORE_PENDING, 'readonly', (store) => store.getAll()
    )

    if (pending.length === 0) return

    // Import dinamic pentru a nu bloca bundle-ul inițial
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    for (const record of pending) {
      try {
        await supabase.rpc('record_learning', {
          p_user_id: userId,
          p_game_type: record.gameType,
          p_item_id: record.itemId,
          p_correct: record.wasCorrect,
        })

        // Șterge din pending după sync reușit
        await tx(db, STORE_PENDING, 'readwrite', (store) =>
          store.delete(record.id)
        )
      } catch {
        // Dacă un record eșuează, continuă cu restul
      }
    }
  } catch {
    // Sync eșuat silențios — se va reîncerca la următoarea conexiune
  }
}

// Auto-sync când revine conexiunea
export function setupOnlineSync(userId: string): () => void {
  const handler = () => syncPendingToSupabase(userId)
  window.addEventListener('online', handler)
  return () => window.removeEventListener('online', handler)
}
