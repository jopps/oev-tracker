import StationSearch from '@/components/StationSearch'
import FavoritesPanel from '@/components/FavoritesPanel'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse" />
          <span
            className="text-xl text-[#f5a623] tracking-[0.2em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ÖV ABFAHRTEN
          </span>
        </div>
        <span className="text-[#2a2a2a] text-xs font-mono hidden sm:block">Schweiz</span>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
        {/* Title block */}
        <div className="text-center mb-12">
          <h1
            className="text-6xl md:text-8xl text-[#e8e0c8] tracking-widest leading-none mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ABFAHRTEN
          </h1>
          <p className="text-[#4a4440] font-mono text-sm tracking-widest">
            Alle ÖV-Haltestellen der Schweiz · Echtzeit
          </p>
        </div>

        {/* Decorative grid lines */}
        <div className="relative w-full max-w-xl mb-8">
          <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1e1e1e] to-transparent" />
          <StationSearch />
          <div className="absolute -bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1e1e1e] to-transparent" />
        </div>

        {/* Hint */}
        <p className="text-[#2a2a2a] text-xs font-mono mt-8 tracking-wider">
          z.B. Zürich HB · Bern · Basel SBB · Lausanne
        </p>

        {/* Favorites */}
        <FavoritesPanel />
      </div>

      {/* Footer */}
      <footer className="border-t border-[#161616] px-6 py-4 flex items-center justify-between">
        <span className="text-[#2a2a2a] text-xs font-mono">Daten: transport.opendata.ch</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          <span className="text-[#2a2a2a] text-xs font-mono">Live</span>
        </div>
      </footer>
    </main>
  )
}
