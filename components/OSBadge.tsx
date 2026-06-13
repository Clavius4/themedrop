import { OS } from '@/types'
import { OS_INFO } from '@/lib/themes'
import { cn } from '@/lib/utils'

interface OSBadgeProps {
  os: OS
  size?: 'sm' | 'md'
  className?: string
}

export default function OSBadge({ os, size = 'sm', className }: OSBadgeProps) {
  const info = OS_INFO[os]
  if (!info) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
      style={{ background: info.bg, color: info.color, border: `1px solid ${info.color}30` }}
    >
      <span>{info.icon}</span>
      {info.label}
    </span>
  )
}
