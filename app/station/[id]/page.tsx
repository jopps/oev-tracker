import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DepartureBoard from '@/components/DepartureBoard'
import { getStationboard } from '@/lib/api'
import type { Metadata } from 'next'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const id = decodeURIComponent(params.id)
  return {
    title: `${id} — ÖV Abfahrten`,
    description: `Echtzeit-Abfahrtszeiten für ${id}`,
  }
}

async function StationData({ stationId }: { stationId: string }) {
  let data
  try {
    data = await getStationboard(stationId, 25)
  } catch {
    return (
      <div className="border border-[#ef4444]/20 bg-[#130a0a] p-6 text-center">
        <p className="text-[#ef4444] font-mono text-sm mb-2">Haltestelle nicht gefunden oder API-Fehler</p>
        <p className="text-[#4a4440] font-mono text-xs">{stationId}</p>
      </div>
    )
  }
  return <DepartureBoard stationId={stationId} initialData={data} />
}

export default function StationPage({ params }: PageProps) {
  const stationId = decodeURIComponent(params.id)

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-4 sm:px-6 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#4a4440] hover:text-[#f5a623] transition-colors group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          <span className="font-mono text-xs tracking-widest uppercase hidden sm:block">Zurück</span>
        </Link>

        <div className="w-px h-4 bg-[#1e1e1e]" />

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-pulse" />
          <span
            className="text-[#f5a623] tracking-[0.2em] text-lg"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ÖV ABFAHRTEN
          </span>
        </div>
      </header>

      {/* Board */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        <Suspense fallback={<BoardSkeleton />}>
          <StationData stationId={stationId} />
        </Suspense>
      </div>
    </main>
  )
}

function BoardSkeleton() {
  return (
    <div className="border border-[#1e1e1e] animate-pulse">
      <div className="px-4 py-5 border-b border-[#161616]">
        <div className="h-10 w-64 bg-[#1a1a1a] rounded mb-2" />
        <div className="h-3 w-32 bg-[#141414] rounded" />
      </div>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="grid border-b border-[#161616] py-4 px-3 gap-3"
          style={{ gridTemplateColumns: '80px 1fr 80px' }}>
          <div className="h-6 w-14 bg-[#1a1a1a] rounded" />
          <div className="h-4 bg-[#161616] rounded w-3/4" />
          <div className="h-6 w-10 bg-[#1a1a1a] rounded ml-auto" />
        </div>
      ))}
    </div>
  )
}
