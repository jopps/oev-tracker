'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { searchStations, type Station } from '@/lib/api'

export default function StationSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Station[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()
  const router = useRouter()

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
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
    debounceRef.current = setTimeout(() => search(query), 280)
    return () => clearTimeout(debounceRef.current)
  }, [query, search])

  const selectStation = (station: Station) => {
    const id = encodeURIComponent(station.id)
    router.push(`/station/${id}`)
    setOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectStation(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b6456]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveIndex(-1) }}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Haltestelle suchen..."
          className="search-input w-full bg-[#111111] border border-[#1e1e1e] text-[#e8e0c8] placeholder-[#4a4440]
            pl-12 pr-12 py-4 text-base font-mono tracking-wide
            transition-all duration-200 rounded-none
            focus:border-[#f5a623] focus:bg-[#141414]"
          style={{ fontFamily: 'var(--font-mono)' }}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Loading / Clear */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-[#f5a623] border-t-transparent rounded-full animate-spin" />
          ) : query ? (
            <button
              onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus() }}
              className="text-[#4a4440] hover:text-[#f5a623] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Dropdown results */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 border border-[#1e1e1e] border-t-0 bg-[#0d0d0d] shadow-2xl overflow-hidden animate-slide-in">
          {results.map((station, i) => (
            <button
              key={station.id}
              onMouseDown={() => selectStation(station)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors duration-100
                border-b border-[#161616] last:border-0
                ${i === activeIndex ? 'bg-[#1a1a1a] text-[#f5a623]' : 'text-[#c8c0a8] hover:bg-[#161616] hover:text-[#e8e0c8]'}`}
            >
              {/* Station icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={i === activeIndex ? 'text-[#f5a623]' : 'text-[#4a4440]'}>
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span className="font-mono text-sm tracking-wide">{station.name}</span>
              {i === activeIndex && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="ml-auto text-[#f5a623]">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
