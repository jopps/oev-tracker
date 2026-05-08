'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Station } from './api'

export interface FavoriteStation {
  id: string
  name: string
  addedAt: number
}

const STORAGE_KEY = 'oev-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteStation[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setFavorites(JSON.parse(stored))
    } catch {}
  }, [])

  const save = useCallback((favs: FavoriteStation[]) => {
    setFavorites(favs)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
    } catch {}
  }, [])

  const addFavorite = useCallback((station: Station) => {
    setFavorites(prev => {
      if (prev.find(f => f.id === station.id)) return prev
      const next = [{ id: station.id, name: station.name, addedAt: Date.now() }, ...prev]
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== id)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id)
  }, [favorites])

  return { favorites, addFavorite, removeFavorite, isFavorite }
}
