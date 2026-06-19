"use client";
// src/components/AnalyticsChart.tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisitEntry {
  day: string;
  visits: number;
}

// Mock data – can later be replaced with real analytics
const mockVisitData: VisitEntry[] = [
  { day: 'Mon', visits: 42 },
  { day: 'Tue', visits: 58 },
  { day: 'Wed', visits: 51 },
  { day: 'Thu', visits: 73 },
  { day: 'Fri', visits: 88 },
  { day: 'Sat', visits: 95 },
  { day: 'Sun', visits: 81 },
];

/**
 * A lightweight responsive SVG line chart with accessible tooltip.
 * The chart is intentionally simple – no external charting library.
 */
export default function AnalyticsChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  // Scale calculations – memoised because data never changes
  const { points, viewBox } = useMemo(() => {
    const max = Math.max(...mockVisitData.map((d) => d.visits));
    const w = 100; // viewBox width (percentage based)
    const h = 60; // viewBox height
    const paddingTop = 5;
    const paddingBottom = 5;
    const chartHeight = h - paddingTop - paddingBottom;
    const stepX = w / (mockVisitData.length - 1);
    const pts = mockVisitData.map((d, i) => {
      const x = i * stepX;
      const y = paddingTop + chartHeight - (d.visits / max) * chartHeight;
      return { x, y };
    });
    return { points: pts, viewBox: `0 0 ${w} ${h}` };
  }, []);

  // Build SVG path string
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ');

  // Tooltip position & content derived from hovered index
  const vbWidth = Number(viewBox.split(' ')[2]);
  const vbHeight = Number(viewBox.split(' ')[3]);

  const tooltip = hovered !== null ? (
    <AnimatePresence>
      <motion.div
        key="tooltip"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute bg-white border border-zinc-200/70 rounded-md shadow-lg px-3 py-1 text-sm whitespace-nowrap"
        style={{
          left: `${Math.min(Math.max(points[hovered].x, 5), 95)}%`,
          bottom: `${100 - points[hovered].y}%`,
          transform: 'translate(-50%, -110%)',
        }}
      >
        <div className="font-medium text-zinc-900">{mockVisitData[hovered].day}</div>
        <div>{mockVisitData[hovered].visits} visits</div>
      </motion.div>
    </AnimatePresence>
  ) : null;

  return (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 rounded-[28px] border border-zinc-200/70 bg-white shadow-sm"
      >
      {/* SVG chart */}
      <svg viewBox={viewBox} className="w-full h-40" preserveAspectRatio="none" role="img" aria-label="Visit statistics for the last 7 days">
        {/* X‑axis baseline */}
        <line
          x1={0}
          y1={vbHeight * 0.95}
          x2={vbWidth}
          y2={vbHeight * 0.95}
          stroke="#e5e7eb"
          strokeWidth={0.5}
        />
        {/* The line representing visits */}
        <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth={2} />
        {/* Data points – keyboard & mouse accessible */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#8b5cf6"
            tabIndex={0}
            aria-label={`${mockVisitData[i].day}: ${mockVisitData[i].visits} visits`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            className="cursor-pointer outline-none hover:stroke-2 hover:stroke-white"
          />
        ))}
        {/* Day labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={vbHeight * 0.97}
            textAnchor="middle"
            fontSize={3}
            fill="#6b7280"
          >
            {mockVisitData[i].day}
          </text>
        ))}
      </svg>
      {/* Tooltip overlay */}
      {tooltip}
    </motion.div>
  );
}
