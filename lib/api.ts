const BASE_URL = 'https://transport.opendata.ch/v1'

export interface Station {
  id: string
  name: string
  score: number | null
  coordinate: {
    type: string
    x: number | null
    y: number | null
  }
  distance: number | null
}

export interface Departure {
  stop: {
    station: Station
    arrival: string | null
    departure: string | null
    delay: number | null
    platform: string | null
    prognosis: {
      platform: string | null
      arrival: string | null
      departure: string | null
      capacity1st: number | null
      capacity2nd: number | null
    }
  }
  name: string
  category: string
  subcategory: string | null
  categoryCode: number
  number: string
  operator: string
  to: string
  passList: unknown[]
  capacity1st: number | null
  capacity2nd: number | null
}

export interface StationboardResponse {
  station: Station
  stationboard: Departure[]
}

export async function searchStations(query: string): Promise<Station[]> {
  if (!query || query.length < 2) return []
  const res = await fetch(
    `${BASE_URL}/locations?query=${encodeURIComponent(query)}&type=station`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) throw new Error('Stationssuche fehlgeschlagen')
  const data = await res.json()
  return data.stations?.filter((s: Station) => s.name) ?? []
}

export async function getStationboard(stationId: string, limit = 20): Promise<StationboardResponse> {
  const res = await fetch(
    `${BASE_URL}/stationboard?id=${encodeURIComponent(stationId)}&limit=${limit}&fields[]=stationboard/stop/departure&fields[]=stationboard/stop/delay&fields[]=stationboard/stop/platform&fields[]=stationboard/stop/prognosis&fields[]=stationboard/name&fields[]=stationboard/category&fields[]=stationboard/number&fields[]=stationboard/operator&fields[]=stationboard/to&fields[]=station`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) throw new Error('Abfahrtsplan konnte nicht geladen werden')
  return res.json()
}

export function getMinutesUntilDeparture(departure: Departure): number | null {
  const depTime = departure.stop.prognosis?.departure ?? departure.stop.departure
  if (!depTime) return null
  const diff = new Date(depTime).getTime() - Date.now()
  return Math.round(diff / 60000)
}

export function getCategoryColor(category: string): string {
  const cat = category?.toUpperCase()
  if (cat === 'T' || cat === 'TRAM') return '#f5a623'
  if (cat === 'B' || cat === 'BUS') return '#22c55e'
  if (cat === 'IR' || cat === 'IC' || cat === 'ICE' || cat === 'EC') return '#ef4444'
  if (cat === 'S' || cat === 'SN') return '#3b82f6'
  if (cat === 'RE' || cat === 'R') return '#8b5cf6'
  if (cat === 'NFB' || cat === 'NFT') return '#f59e0b'
  return '#6b7280'
}

export function formatDepartureTime(departure: Departure): string {
  const depTime = departure.stop.prognosis?.departure ?? departure.stop.departure
  if (!depTime) return '--:--'
  return new Date(depTime).toLocaleTimeString('de-CH', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export async function getNearbyStations(lat: number, lon: number): Promise<Station[]> {
  const res = await fetch(
    `${BASE_URL}/locations?x=${lon}&y=${lat}&type=station`,
    { next: { revalidate: 0 } }
  )
  if (!res.ok) throw new Error('Standortsuche fehlgeschlagen')
  const data = await res.json()
  return data.stations?.filter((s: Station) => s.name) ?? []
}
