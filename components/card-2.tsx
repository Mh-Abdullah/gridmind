"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type GlowOrientation = "horizontal" | "vertical"

function GlowLine({
  className,
  orientation,
  offsetStyle,
}: {
  className?: string
  orientation: GlowOrientation
  offsetStyle: React.CSSProperties
}) {
  const glowClass =
    orientation === "horizontal"
      ? "h-full w-40 -translate-x-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(56,189,248,0.18)_18%,rgba(56,189,248,0.98)_50%,rgba(56,189,248,0.18)_82%,transparent_100%)]"
      : "h-40 w-full -translate-y-1/2 bg-[linear-gradient(180deg,transparent_0%,rgba(56,189,248,0.18)_18%,rgba(56,189,248,0.98)_50%,rgba(56,189,248,0.18)_82%,transparent_100%)]"

  return (
    <div className={cn("absolute z-10 overflow-hidden rounded-full", className)}>
      <div className="absolute inset-0 rounded-full bg-border/90 shadow-[0_0_0_1px_hsl(var(--border)/0.9)]" />
      <div className="absolute inset-0 opacity-100">
        <div className={cn("absolute", glowClass)} style={offsetStyle} />
      </div>
    </div>
  )
}

function Lines({
  topStyle,
  bottomStyle,
  leftStyle,
  rightStyle,
}: {
  topStyle: React.CSSProperties
  bottomStyle: React.CSSProperties
  leftStyle: React.CSSProperties
  rightStyle: React.CSSProperties
}) {
  return (
    <>
      <GlowLine orientation="horizontal" offsetStyle={topStyle} className="top-2 left-0 h-[2px] w-full sm:top-4 md:top-6" />
      <GlowLine
        orientation="horizontal"
        offsetStyle={bottomStyle}
        className="bottom-2 left-0 h-[2px] w-full sm:bottom-4 md:bottom-6"
      />
      <GlowLine orientation="vertical" offsetStyle={rightStyle} className="inset-y-0 right-2 h-full w-[2px] sm:right-4 md:right-6" />
      <GlowLine orientation="vertical" offsetStyle={leftStyle} className="inset-y-0 left-2 h-full w-[2px] sm:left-4 md:left-6" />
    </>
  )
}

export function Card_2({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const scrollStopTimer = useRef<number | null>(null)
  const [scrollState, setScrollState] = useState({
    top: 0,
    bottom: 100,
    left: 100,
    right: 0,
    scale: 1.02,
  })

  useEffect(() => {
    const updateState = () => {
      const element = wrapperRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      const isVisible = rect.bottom > 0 && rect.top < viewportHeight
      const distancePastTop = Math.max(-rect.top, 0)
      const travelProgress = Math.min(distancePastTop / 160, 1)
      const componentCenter = rect.top + rect.height / 2
      const viewportCenter = viewportHeight / 2
      const centerOffset = Math.min(Math.abs(componentCenter - viewportCenter) / viewportHeight, 1)
      const compactWidth = viewportWidth < 1024

      setScrollState((prev) => ({
        top: 4 + travelProgress * 92,
        bottom: 96 - travelProgress * 92,
        left: 96 - travelProgress * 92,
        right: 4 + travelProgress * 92,
        scale: isVisible ? (compactWidth ? 1 : 1.018 - centerOffset * 0.02) : prev.scale,
      }))
    }

    const handleScroll = () => {
      if (scrollStopTimer.current) window.clearTimeout(scrollStopTimer.current)

      requestAnimationFrame(() => {
        updateState()
        setScrollState((prev) => ({ ...prev, scale: window.innerWidth < 1024 ? 1 : 0.992 }))
      })

      scrollStopTimer.current = window.setTimeout(() => {
        updateState()
      }, 140)
    }

    updateState()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateState)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateState)
      if (scrollStopTimer.current) window.clearTimeout(scrollStopTimer.current)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="relative transition-transform duration-300 ease-out"
      style={{ transform: `scale(${scrollState.scale})` }}
    >
      <Lines
        topStyle={{ left: `${scrollState.top}%`, top: "50%" }}
        bottomStyle={{ left: `${scrollState.bottom}%`, top: "50%" }}
        leftStyle={{ top: `${scrollState.left}%`, left: "50%" }}
        rightStyle={{ top: `${scrollState.right}%`, left: "50%" }}
      />
      <Card className="w-full border-none bg-transparent p-4 shadow-none sm:p-6 lg:p-8">{children}</Card>
    </div>
  )
}
