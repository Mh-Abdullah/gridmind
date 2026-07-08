"use client"

import { type ChartConfig, ChartContainer } from "@/components/evilcharts/ui/chart"
import { AnimatePresence, motion } from "motion/react"
import { Bar, BarChart, XAxis } from "recharts"

type UsageMonospaceBarChartProps = {
  rows: Array<{ label: string; value: number; helper?: string }>
  empty: string
}

const chartConfig = {
  usage: {
    label: "Usage",
    colors: {
      light: ["#f59e0b"],
      dark: ["#fbbf24"],
    },
  },
} satisfies ChartConfig

function formatCompact(value: number) {
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function UsageMonospaceBarChart({ rows, empty }: UsageMonospaceBarChartProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[22px] border border-dashed border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
        {empty}
      </div>
    )
  }

  const chartData = rows.map((row) => ({
    label: row.label,
    usage: row.value,
    helper: row.helper,
  }))
  const total = rows.reduce((sum, row) => sum + row.value, 0)
  const topRow = rows.reduce((top, row) => (row.value > top.value ? row : top), rows[0])

  return (
    <div className="flex min-h-[360px] flex-col rounded-[24px] bg-background/70 p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex flex-row">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-muted-foreground">{"[#] Total usage"}</span>
            <span className="font-mono text-3xl text-primary">
              <span className="tracking-tighter">{formatCompact(total)}</span>
            </span>
          </div>
          <hr className="mx-4 h-full border-l border-dashed" />
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-muted-foreground">{"[^] Top usage"}</span>
            <span className="font-mono text-3xl text-primary">
              <span className="tracking-tighter">{formatCompact(topRow.value)}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-end gap-1">
          <span className="font-mono text-[10px] text-muted-foreground">
            {"// X-AXIS: "}
            <span className="text-primary">RECENT RUNS</span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {"// Y-AXIS: "}
            <span className="text-primary">CREDITS</span>
          </span>
        </div>
      </div>
      <hr className="my-4 border-t border-dashed" />
      <ChartContainer className="min-h-[250px] [aspect-ratio:auto]" config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => String(value).slice(0, 5)}
          />
          {Object.keys(chartConfig).map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key}-0)`}
              shape={BarShape}
              activeBar={BarShape}
            />
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  )
}

interface BarProps {
  index?: number
  value?: number | [number, number]
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
  isActive?: boolean
}

const COLLAPSED_SCALE = 0.18

const BarShape = (props: BarProps) => {
  const { fill, x, y, width, height, index, value, isActive } = props

  const xPos = Number(x || 0)
  const yPos = Number(y || 0)
  const realWidth = Number(width || 0)
  const realHeight = Number(height || 0)
  const centerX = xPos + realWidth / 2
  const centerY = yPos + realHeight / 2

  return (
    <>
      <rect
        x={xPos}
        y={yPos}
        width={realWidth}
        height={realHeight}
        fill="transparent"
        stroke="none"
        pointerEvents="all"
      />

      <AnimatePresence>
        <motion.rect
          key={`bar-${index}`}
          x={xPos}
          y={yPos}
          width={realWidth}
          height={realHeight}
          fill={fill}
          rx={8}
          initial={{ scaleX: isActive ? COLLAPSED_SCALE : 1 }}
          animate={{ scaleX: isActive ? 1 : COLLAPSED_SCALE }}
          exit={{ scaleX: COLLAPSED_SCALE }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          style={{
            transformOrigin: `${centerX}px ${centerY}px`,
            transformBox: "fill-box",
          }}
        />
      </AnimatePresence>
      {isActive && (
        <AnimatePresence>
          <motion.text
            className="font-mono"
            key={`text-${index}`}
            initial={{ opacity: 0, y: -10, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
            transition={{ duration: 0.2 }}
            x={centerX}
            y={yPos - 5}
            textAnchor="middle"
            fill={fill}
            style={{ pointerEvents: "none" }}
          >
            {value}
          </motion.text>
        </AnimatePresence>
      )}
    </>
  )
}
