import { getCategoryColor } from '@/lib/api'

interface LineBadgeProps {
  category: string
  number: string
}

export default function LineBadge({ category, number }: LineBadgeProps) {
  const color = getCategoryColor(category)
  const label = category?.toUpperCase() === 'B' || category?.toUpperCase() === 'NFB'
    ? number
    : category?.toUpperCase() === 'T' || category?.toUpperCase() === 'NFT'
    ? number
    : `${category} ${number}`.trim()

  return (
    <span
      className="inline-flex items-center justify-center min-w-[48px] h-7 px-2 text-xs font-bold tracking-widest text-black"
      style={{
        backgroundColor: color,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {label}
    </span>
  )
}
