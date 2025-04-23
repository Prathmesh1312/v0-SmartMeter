"use client"

import type { ReactNode } from "react"

interface CircleGaugeProps {
  value: number
  maxValue: number
  label: string
  unit: string
  color: string
  size?: number
  icon?: ReactNode
}

export function CircleGauge({ value, maxValue, label, unit, color, size = 100, icon }: CircleGaugeProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const radius = size / 2 - 10
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          {/* Foreground circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            {icon && icon}
            <span>{label}</span>
          </div>
          <div className="text-xl font-bold">{value.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">{unit}</div>
        </div>
      </div>
    </div>
  )
}
