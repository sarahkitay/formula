'use client'

import * as React from 'react'
import type { FloorSectionId } from '@/lib/coach/floor-layout'
import { cn } from '@/lib/utils'

export type FloorFieldStatus = 'available' | 'occupied' | 'checkin'

function fieldFill(status: FloorFieldStatus): string {
  switch (status) {
    case 'available':
      return 'rgba(0, 87, 0, 0.12)'
    case 'occupied':
      return 'rgba(185, 28, 28, 0.18)'
    case 'checkin':
      return 'rgba(202, 138, 4, 0.22)'
  }
}

function fieldStroke(status: FloorFieldStatus, selected: boolean): string {
  if (selected) return '#005700'
  switch (status) {
    case 'available':
      return 'rgba(0, 87, 0, 0.45)'
    case 'occupied':
      return 'rgba(185, 28, 28, 0.55)'
    case 'checkin':
      return 'rgba(180, 83, 9, 0.7)'
  }
}

function statusLabel(status: FloorFieldStatus): string {
  if (status === 'checkin') return 'Staff present'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export interface CoachFloorSvgMapProps {
  fieldStatus: Record<FloorSectionId, FloorFieldStatus>
  selectedId: FloorSectionId | null
  onSelectField: (id: FloorSectionId) => void
  /** Highlight coach assignment (execution map) */
  assignedSectionId?: FloorSectionId | null
  className?: string
}

export function CoachFloorSvgMap({
  fieldStatus,
  selectedId,
  onSelectField,
  assignedSectionId = null,
  className,
}: CoachFloorSvgMapProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-depth-val)]', className)}>
      <svg viewBox="0 0 1200 800" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg" aria-label="Training floor map">
        <rect x="50" y="50" width="1100" height="700" className="fill-muted/30" stroke="rgb(26 26 26 / 0.12)" strokeWidth={1} rx={10} />

        <rect x="50" y="600" width="200" height="150" className="fill-muted/50" stroke="rgb(26 26 26 / 0.1)" strokeWidth={1} rx={5} />
        <text x={150} y={675} className="fill-text-muted text-[12px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
          LOBBY / RECEPTION
        </text>

        <rect x="650" y="600" width="250" height="150" className="fill-muted/50" stroke="rgb(26 26 26 / 0.1)" strokeWidth={1} rx={5} />
        <text x={775} y={675} className="fill-text-muted text-[12px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
          LOUNGE
        </text>

        <rect x="900" y="600" width="250" height="150" className="fill-muted/50" stroke="rgb(26 26 26 / 0.1)" strokeWidth={1} rx={5} />
        <text x={1025} y={675} className="fill-text-muted text-[12px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
          EQUIPMENT
        </text>

        <FieldA
          status={fieldStatus.A}
          selected={selectedId === 'A'}
          onSelect={() => onSelectField('A')}
        />
        <FieldB
          status={fieldStatus.B}
          selected={selectedId === 'B'}
          onSelect={() => onSelectField('B')}
          isAssigned={assignedSectionId === 'B'}
        />
        <FieldC
          status={fieldStatus.C}
          selected={selectedId === 'C'}
          onSelect={() => onSelectField('C')}
        />
        <FieldD
          status={fieldStatus.D}
          selected={selectedId === 'D'}
          onSelect={() => onSelectField('D')}
        />
        <FieldE
          status={fieldStatus.E}
          selected={selectedId === 'E'}
          onSelect={() => onSelectField('E')}
        />
        <FieldF
          status={fieldStatus.F}
          selected={selectedId === 'F'}
          onSelect={() => onSelectField('F')}
        />
        <FieldG
          status={fieldStatus.G}
          selected={selectedId === 'G'}
          onSelect={() => onSelectField('G')}
        />

        <text x={160} y={550} className="fill-text-muted text-[10px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
          LOCKER ROOMS
        </text>
        <text x={550} y={650} className="fill-text-muted text-[10px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
          CAFETERIA
        </text>
      </svg>

      <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 font-mono text-[10px] text-text-secondary">
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-sm border border-border" style={{ background: fieldFill('available') }} />
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-sm border border-border" style={{ background: fieldFill('occupied') }} />
          Occupied (session in use)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-sm border border-border" style={{ background: fieldFill('checkin') }} />
          You / staff checked in
        </span>
      </div>
    </div>
  )
}

function FieldA({
  status,
  selected,
  onSelect,
}: {
  status: FloorFieldStatus
  selected: boolean
  onSelect: () => void
}) {
  const strokeW = selected ? 4 : 2
  return (
    <g
      id="field-a"
      role="button"
      tabIndex={0}
      className="outline-none focus-visible:ring-2 focus-visible:ring-[#005700]"
      onClick={onSelect}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <rect
        x={280}
        y={200}
        width={280}
        height={380}
        rx={5}
        fill={fieldFill(status)}
        stroke={fieldStroke(status, selected)}
        strokeWidth={strokeW}
        className="transition-all duration-200 hover:brightness-95"
      />
      <rect x={280} y={200} width={280} height={380} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1} style={{ pointerEvents: 'none' }} />
      <line x1={420} y1={200} x2={420} y2={580} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <circle cx={420} cy={390} r={40} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <rect x={280} y={250} width={60} height={120} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <rect x={500} y={250} width={60} height={120} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <text x={420} y={395} className="fill-foreground text-[14px] font-bold" textAnchor="middle" style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgb(0 0 0 / 0.25)' }}>
        FIELD A
      </text>
      <text x={420} y={415} className="fill-foreground/90 text-[11px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        {statusLabel(status)}
      </text>
    </g>
  )
}

function FieldB({
  status,
  selected,
  onSelect,
  isAssigned,
}: {
  status: FloorFieldStatus
  selected: boolean
  onSelect: () => void
  isAssigned?: boolean
}) {
  const strokeW = selected ? 4 : 2
  return (
    <g id="field-b" role="button" tabIndex={0} onClick={onSelect} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}>
      {isAssigned && (
        <rect
          x={574}
          y={194}
          width={192}
          height={392}
          rx={8}
          fill="none"
          stroke="#f4fe00"
          strokeWidth={2}
          strokeDasharray="6 4"
          opacity={0.95}
          style={{ pointerEvents: 'none' }}
        />
      )}
      <rect
        x={580}
        y={200}
        width={180}
        height={380}
        rx={5}
        fill={fieldFill(status)}
        stroke={fieldStroke(status, selected)}
        strokeWidth={strokeW}
        className="transition-all duration-200 hover:brightness-95"
      />
      <line x1={580} y1={295} x2={760} y2={295} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <line x1={580} y1={390} x2={760} y2={390} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <line x1={580} y1={485} x2={760} y2={485} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <line x1={670} y1={200} x2={670} y2={580} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <text x={670} y={395} className="fill-foreground text-[14px] font-bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        FIELD B
      </text>
      <text x={670} y={415} className="fill-foreground/90 text-[11px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        {statusLabel(status)}
      </text>
      {isAssigned && (
        <text x={670} y={438} className="fill-[#f4fe00] text-[10px] font-bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
          YOUR ASSIGNMENT
        </text>
      )}
    </g>
  )
}

function FieldC({
  status,
  selected,
  onSelect,
}: {
  status: FloorFieldStatus
  selected: boolean
  onSelect: () => void
}) {
  const strokeW = selected ? 4 : 2
  return (
    <g id="field-c" role="button" tabIndex={0} onClick={onSelect} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}>
      <rect
        x={780}
        y={200}
        width={200}
        height={380}
        rx={5}
        fill={fieldFill(status)}
        stroke={fieldStroke(status, selected)}
        strokeWidth={strokeW}
        className="transition-all duration-200 hover:brightness-95"
      />
      <line x1={880} y1={200} x2={880} y2={580} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <circle cx={880} cy={390} r={35} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <rect x={780} y={260} width={50} height={100} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <rect x={930} y={260} width={50} height={100} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <text x={880} y={395} className="fill-foreground text-[14px] font-bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        FIELD C
      </text>
      <text x={880} y={415} className="fill-foreground/90 text-[11px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        {statusLabel(status)}
      </text>
    </g>
  )
}

function FieldD({
  status,
  selected,
  onSelect,
}: {
  status: FloorFieldStatus
  selected: boolean
  onSelect: () => void
}) {
  const strokeW = selected ? 4 : 2
  return (
    <g id="field-d" role="button" tabIndex={0} onClick={onSelect} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}>
      <rect
        x={280}
        y={70}
        width={400}
        height={110}
        rx={5}
        fill={fieldFill(status)}
        stroke={fieldStroke(status, selected)}
        strokeWidth={strokeW}
        className="transition-all duration-200 hover:brightness-95"
      />
      <line x1={380} y1={70} x2={380} y2={180} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <line x1={480} y1={70} x2={480} y2={180} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <line x1={580} y1={70} x2={580} y2={180} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <text x={480} y={130} className="fill-foreground text-[14px] font-bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        FIELD D
      </text>
      <text x={480} y={150} className="fill-foreground/90 text-[11px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        {statusLabel(status)}
      </text>
    </g>
  )
}

function FieldE({
  status,
  selected,
  onSelect,
}: {
  status: FloorFieldStatus
  selected: boolean
  onSelect: () => void
}) {
  const strokeW = selected ? 4 : 2
  return (
    <g id="field-e" role="button" tabIndex={0} onClick={onSelect} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}>
      <rect
        x={900}
        y={450}
        width={200}
        height={130}
        rx={5}
        fill={fieldFill(status)}
        stroke={fieldStroke(status, selected)}
        strokeWidth={strokeW}
        className="transition-all duration-200 hover:brightness-95"
      />
      <line x1={1000} y1={450} x2={1000} y2={580} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <line x1={900} y1={515} x2={1100} y2={515} stroke="rgba(255,255,255,0.35)" strokeWidth={2} style={{ pointerEvents: 'none' }} />
      <text x={1000} y={520} className="fill-foreground text-[14px] font-bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        FIELD E
      </text>
      <text x={1000} y={540} className="fill-foreground/90 text-[11px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        {statusLabel(status)}
      </text>
    </g>
  )
}

function FieldF({
  status,
  selected,
  onSelect,
}: {
  status: FloorFieldStatus
  selected: boolean
  onSelect: () => void
}) {
  const strokeW = selected ? 4 : 2
  return (
    <g id="field-f" role="button" tabIndex={0} onClick={onSelect} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}>
      <rect
        x={70}
        y={200}
        width={180}
        height={180}
        rx={5}
        fill={fieldFill(status)}
        stroke={fieldStroke(status, selected)}
        strokeWidth={strokeW}
        className="transition-all duration-200 hover:brightness-95"
      />
      <line x1={130} y1={200} x2={130} y2={380} stroke="rgba(255,255,255,0.25)" strokeWidth={1} style={{ pointerEvents: 'none' }} />
      <line x1={190} y1={200} x2={190} y2={380} stroke="rgba(255,255,255,0.25)" strokeWidth={1} style={{ pointerEvents: 'none' }} />
      <line x1={70} y1={260} x2={250} y2={260} stroke="rgba(255,255,255,0.25)" strokeWidth={1} style={{ pointerEvents: 'none' }} />
      <line x1={70} y1={320} x2={250} y2={320} stroke="rgba(255,255,255,0.25)" strokeWidth={1} style={{ pointerEvents: 'none' }} />
      <text x={160} y={295} className="fill-foreground text-[14px] font-bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        FIELD F
      </text>
      <text x={160} y={315} className="fill-foreground/90 text-[11px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        {statusLabel(status)}
      </text>
    </g>
  )
}

function FieldG({
  status,
  selected,
  onSelect,
}: {
  status: FloorFieldStatus
  selected: boolean
  onSelect: () => void
}) {
  const strokeW = selected ? 4 : 2
  return (
    <g id="field-g" role="button" tabIndex={0} onClick={onSelect} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}>
      <rect
        x={70}
        y={400}
        width={180}
        height={180}
        rx={5}
        fill={fieldFill(status)}
        stroke={fieldStroke(status, selected)}
        strokeWidth={strokeW}
        className="transition-all duration-200 hover:brightness-95"
      />
      <text x={160} y={495} className="fill-foreground text-[14px] font-bold" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        FIELD G
      </text>
      <text x={160} y={515} className="fill-foreground/90 text-[11px]" textAnchor="middle" style={{ pointerEvents: 'none' }}>
        {statusLabel(status)}
      </text>
    </g>
  )
}
