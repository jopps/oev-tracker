'use client'

import { useState, useEffect } from 'react'
import LineBadge from './LineBadge'
import { type Departure, getMinutesUntilDeparture, formatDepartureTime } from '@/lib/api'

interface DepartureRowProps {
  departure: Departure
  index: number
}

export default function DepartureRow({ departure, index }: DepartureRowProps) {
  const [minutes, setMinutes] = useState<number | null>(getMinutesUntilDeparture(departure))

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(getMinutesUntilDeparture(departure))
    }, 10000)
    return () => clearInterval(interval)
  }, [departure])

  const isUrgent = minutes !== null && minutes <= 2
  const isGone = minutes !== null && minutes < 0
  const isNow = minutes === 0

  if (isGone) return null

  const displayTime = formatDepartureTime(departure)
  const delay = departure.stop.delay

  return (
    <div
      className={`departure-row grid items-center border-b border-[#161616]
        transition-colors duration-300
        ${isUrgent ? 'bg-[#130a00]' : 'bg-transparent hover:bg-[#111111]'}
        ${isUrgent ? 'urgent-glow' : ''}`}
      style={{
        gridTemplateColumns: '80px 1fr auto auto',
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* Line badge */}
      <div className="px-3 py-3.5 flex items-center">
        <LineBadge category={departure.category} number={departure.number} />
      </div>

      {/* Destination */}
      <div className="px-2 py-3.5 overflow-hidden">
        <span
          className="text-sm text-[#e8e0c8] tracking-wide truncate block"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {departure.to}
        </span>
        {delay && delay > 0 ? (
          <span className="text-xs text-red-400 mt-0.5">+{delay} min Verspätung</span>
        ) : null}
      </div>

      {/* Scheduled time */}
      <div className="px-3 py-3.5 text-right hidden sm:block">
        <span
          className="text-sm text-[#6b6456] tabular-nums"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {displayTime}
        </span>
        {departure.stop.platform && (
          <div className="text-xs text-[#4a4440] mt-0.5">Gl. {departure.stop.platform}</div>
        )}
      </div>

      {/* Countdown */}
      <div className="px-4 py-3.5 text-right min-w-[80px]">
        {isNow ? (
          <span
            className="text-sm font-bold animate-blink"
            style={{ color: '#ef4444', fontFamily: 'var(--font-mono)' }}
          >
            JETZT
          </span>
        ) : isUrgent ? (
          <span
            className="text-lg font-bold"
            style={{ color: '#ef4444', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
          >
            {minutes}&apos;
          </span>
        ) : minutes !== null ? (
          <span
            className="text-lg"
            style={{
              color: minutes <= 5 ? '#f5a623' : '#e8e0c8',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em',
            }}
          >
            {minutes}&apos;
          </span>
        ) : (
          <span className="text-[#4a4440] font-mono text-sm">--</span>
        )}
      </div>
    </div>
  )
}
