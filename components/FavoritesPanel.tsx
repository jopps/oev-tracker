'use client'

import Link from 'next/link'
import { useFavorites } from '@/lib/favorites'

export default function FavoritesPanel() {
  const { favorites, removeFavorite } = useFavorites()

  if (favorites.length === 0) return null

  return (
    <div className="w-full max-w-xl mx-auto mt-8 animate-fade-up">
      <div className="flex items-center gap-2 mb-3">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#f5a623]">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span className="text-[#4a4440] text-xs font-mono tracking-widest uppercase">Favoriten</span>
      </div>

      <div className="border border-[#1e1e1e] divide-y divide-[#161616]">
        {favorites.map(fav => (
          <div key={fav.id} className="flex items-center group">
            <Link
              href={`/station/${encodeURIComponent(fav.id)}`}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 hover:bg-[#111111] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span className="text-[#c8c0a8] font-mono text-sm tracking-wide group-hover:text-[#e8e0c8] transition-colors">
                {fav.name}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="ml-auto text-[#2a2a2a] group-hover:text-[#f5a623] transition-colors">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
            <button
              onClick={() => removeFavorite(fav.id)}
              className="px-4 py-3.5 text-[#2a2a2a] hover:text-[#ef4444] transition-colors opacity-0 group-hover:opacity-100"
              title="Entfernen"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
