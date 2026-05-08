'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import DepartureRow from './DepartureRow'
import { getStationboard, type Departure, type Station } from '@/lib/api'
import { useFavorites } from '@/lib/favorites'

const REFRESH_INTERVAL = 30000

interface DepartureBoardProps {
  stationId: string
  initialData?: { station: Station; stationboard: Departure[] }
}

export default function DepartureBoard({ stationId, initialData }: DepartureBoardProps) {
  const [data, setData] = useState(initialData)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [refreshCountdown, setRefreshCountdown] = useState(REFRESH_INTERVAL / 1000)
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const refresh = useCallback(async () => {
    try {
      const fresh = await getStationboard(stationId)
      startTransition(() => {
        setData(fresh)
        setLastRefresh(new Date())
        setRefreshCountdown(REFRESH_INTERVAL / 1000)
        setError(null)
      })
    } catch {
      setError('Verbindung unterbrochen — erneuter Versuch...')
    }
  }, [stationId])

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [refresh])

  // Countdown ticker
  useEffect(() => {
    const tick = setInterval(() => {
      setRefreshCountdown(c => c <= 1 ? REFRESH_INTERVAL / 1000 : c - 1)
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const station = data?.station
  const departures = data?.stationboard ?? []
  const isFav = station ? isFavorite(station.id) : false

  const toggleFavorite = () => {
    if (!station) return
    if (isFav) removeFavorite(station.id)
    else addFavorite(station)
  }

  return (
    <div className="w-full">
      {/* Station header */}
      <div className="border border-[#1e1e1e] bg-[#0d0d0d] mb-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#161616]">
          <div className="flex items-center gap-3">
            {/* Signal dots */}
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse-slow" />
              <div className="w-2 h-2 rounded-full bg-[#f5a623] opacity-60" />
              <div className="w-2 h-2 rounded-full bg-[#ef4444] opacity-40" />
            </div>
            <span className="text-[#4a4440] text-xs font-mono tracking-widest uppercase">
              Live
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Refresh countdown */}
            <div className="text-[#4a4440] text-xs font-mono">
              Aktualisierung in {refreshCountdown}s
            </div>

            {/* Manual refresh */}
            <button
              onClick={refresh}
              className={`text-[#4a4440] hover:text-[#f5a623] transition-colors ${isPending ? 'animate-spin' : ''}`}
              title="Jetzt aktualisieren"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
            </button>

            {/* Favorite toggle */}
            {station && (
              <button
                onClick={toggleFavorite}
                className={`transition-colors ${isFav ? 'text-[#f5a623]' : 'text-[#4a4440] hover:text-[#f5a623]'}`}
                title={isFav ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill={isFav ? 'currentColor' : 'none'}
                  stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Station name */}
        <div className="px-4 py-5">
          <h1
            className="text-4xl md:text-5xl text-[#e8e0c8] tracking-wider leading-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {station?.name ?? '...'}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#4a4440] font-mono">
            <span>{lastRefresh.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            {isFav && (
              <>
                <span>·</span>
                <span className="text-[#f5a623]">★ Favorit</span>
              </>
            )}
          </div>
        </div>

        {/* Column headers */}
        <div
          className="grid text-[10px] font-mono tracking-widest uppercase text-[#4a4440] border-t border-[#161616] bg-[#090909]"
          style={{ gridTemplateColumns: '80px 1fr auto auto' }}
        >
          <div className="px-3 py-2">Linie</div>
          <div className="px-2 py-2">Richtung</div>
          <div className="px-3 py-2 text-right hidden sm:block">Abfahrt</div>
          <div className="px-4 py-2 text-right">In</div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="border-l-2 border-[#ef4444] bg-[#130a0a] px-4 py-3 text-sm text-[#ef4444] font-mono">
          {error}
        </div>
      )}

      {/* Departures */}
      <div className="border border-t-0 border-[#1e1e1e]">
        {departures.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-[#4a4440] font-mono text-sm">Keine Abfahrten verfügbar</div>
          </div>
        ) : (
          departures.map((dep, i) => (
            <DepartureRow key={`${dep.name}-${dep.stop.departure}-${i}`} departure={dep} index={i} />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 px-1 flex items-center justify-between text-[10px] text-[#2a2a2a] font-mono">
        <span>Daten: transport.opendata.ch</span>
        <span>© ÖV Abfahrten CH</span>
      </div>
    </div>
  )
}
