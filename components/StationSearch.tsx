'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { searchStations, getNearbyStations, type Station } from '@/lib/api'

type GeoState = 'idle' | 'loading' | 'error'

function formatDistance(meters: number | null): string | null {
  if (meters === null) return null
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export default function StationSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Station[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [geoState, setGeoState] = useState<GeoState>('idle')
  const [isNearby, setIsNearby] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const router = useRouter()

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }
    setIsNearby(false)
    setLoading(true)
    try {
      const stations = await searchStations(q)
      setResults(stations.slice(0, 8))
      setOpen(stations.length > 0)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!isNearby) debounceRef.current = setTimeout(() => search(query), 280)
    return () => clearTimeout(debounceRef.current)
  }, [query, search, isNearby])

  const selectStation = (station: Station) => {
    router.push(`/station/${encodeURIComponent(station.id)}`)
    setOpen(false); setQuery(''); setIsNearby(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); selectStation(results[activeIndex]) }
    else if (e.key === 'Escape') { setOpen(false); setIsNearby(false) }
  }

  const handleNearby = () => {
    if (!navigator.geolocation) { setGeoState('error'); return }
    setGeoState('loading'); setOpen(false)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const stations = await getNearbyStations(coords.latitude, coords.longitude)
          setResults(stations.slice(0, 8))
          setIsNearby(true); setOpen(true); setQuery(''); setGeoState('idle')
          inputRef.current?.focus()
        } catch {
          setGeoState('error'); setTimeout(() => setGeoState('idle'), 3000)
        }
      },
      () => { setGeoState('error'); setTimeout(() => setGeoState('idle'), 3000) },
      { timeout: 8000, maximumAge: 60000 }
    )
  }

  const isSearchLoading = loading || geoState === 'loading'

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6456] pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveIndex(-1); setIsNearby(false) }}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={isNearby ? 'Stationen in der Nähe...' : 'Haltestelle suchen...'}
          className="search-input w-full bg-[#111111] border border-[#1e1e1e] text-[#e8e0c8] placeholder-[#4a4440]
            pl-12 pr-24 py-4 text-base font-mono tracking-wide rounded-none
            transition-all duration-200 focus:border-[#f5a623] focus:bg-[#141414]"
          style={{ fontFamily: 'var(--font-mono)' }}
          autoComplete="off" spellCheck={false}
        />

        {/* Right controls */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {isSearchLoading ? (
            <div className="w-4 h-4 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
          ) : query ? (
            <button
              onClick={() => { setQuery(''); setResults([]); setOpen(false); setIsNearby(false); inputRef.current?.focus() }}
              className="p-1 text-[#4a4440] hover:text-[#f5a623] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          ) : null}

          <div className="w-px h-5 bg-[#1e1e1e]" />

          {/* Location button */}
          <button
            onClick={handleNearby}
            title="Stationen in der Nähe anzeigen"
            className={`p-1.5 transition-all duration-200
              ${geoState === 'error' ? 'text-[#ef4444]' : isNearby ? 'text-[#f5a623]' : 'text-[#4a4440] hover:text-[#f5a623]'}
              ${geoState === 'loading' ? 'animate-pulse' : ''}`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              <circle cx="12" cy="12" r="8"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 border border-[#1e1e1e] border-t-0 bg-[#0d0d0d] shadow-2xl overflow-hidden animate-slide-in">
          {isNearby && (
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1e1e1e] bg-[#0a0a0a]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                <circle cx="12" cy="12" r="8"/>
              </svg>
              <span className="text-[#f5a623] text-[10px] font-mono tracking-widest uppercase">
                Stationen in der Nähe
              </span>
            </div>
          )}

          {results.map((station, i) => (
            <button
              key={station.id}
              onMouseDown={() => selectStation(station)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-100
                border-b border-[#161616] last:border-0
                ${i === activeIndex ? 'bg-[#1a1a1a] text-[#f5a623]' : 'text-[#c8c0a8] hover:bg-[#161616] hover:text-[#e8e0c8]'}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`flex-shrink-0 ${i === activeIndex ? 'text-[#f5a623]' : 'text-[#4a4440]'}`}>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>

              <span className="font-mono text-sm tracking-wide flex-1 text-left">{station.name}</span>

              {isNearby && station.distance !== null && (
                <span className={`text-[10px] font-mono tabular-nums flex-shrink-0
                  ${i === activeIndex ? 'text-[#f5a623]' : 'text-[#4a4440]'}`}>
                  {formatDistance(station.distance)}
                </span>
              )}

              {i === activeIndex && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="flex-shrink-0 text-[#f5a623]">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {geoState === 'error' && (
        <div className="absolute top-full left-0 right-0 mt-1 px-4 py-3 bg-[#130a0a] border border-[#ef4444]/30
          text-[#ef4444] text-xs font-mono animate-slide-in z-50">
          Standort konnte nicht ermittelt werden — bitte Berechtigung prüfen.
        </div>
      )}
    </div>
  )
}
