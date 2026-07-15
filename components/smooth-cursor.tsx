"use client"

import { useEffect, useRef } from "react"

const INTERACTIVE_SELECTOR = "a, button, input, select, textarea, [role='button'], [data-cursor='interactive']"

export function SmoothCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ring = ringRef.current
    const glow = glowRef.current

    if (!ring || !glow) return

    const finePointer = window.matchMedia("(pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let enabled = finePointer.matches && !reducedMotion.matches
    let frameId = 0
    let lastTime = performance.now()
    let targetX = -100
    let targetY = -100
    let ringX = targetX
    let ringY = targetY
    let glowX = targetX
    let glowY = targetY

    const setVisibility = (visible: boolean) => {
      ring.dataset.visible = visible ? "true" : "false"
      glow.dataset.visible = visible ? "true" : "false"
    }

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time

      const ringEase = 1 - Math.exp(-18 * delta)
      const glowEase = 1 - Math.exp(-8 * delta)

      ringX += (targetX - ringX) * ringEase
      ringY += (targetY - ringY) * ringEase
      glowX += (targetX - glowX) * glowEase
      glowY += (targetY - glowY) * glowEase

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`

      const isSettled =
        Math.abs(targetX - ringX) < 0.05 &&
        Math.abs(targetY - ringY) < 0.05 &&
        Math.abs(targetX - glowX) < 0.05 &&
        Math.abs(targetY - glowY) < 0.05

      if (isSettled) {
        ringX = targetX
        ringY = targetY
        glowX = targetX
        glowY = targetY
        frameId = 0
        return
      }

      frameId = window.requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (frameId) return
      lastTime = performance.now()
      frameId = window.requestAnimationFrame(animate)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!enabled || event.pointerType === "touch") return

      const isFirstMove = targetX === -100
      targetX = event.clientX
      targetY = event.clientY

      if (isFirstMove) {
        ringX = targetX
        ringY = targetY
        glowX = targetX
        glowY = targetY
      }

      const target = event.target instanceof Element ? event.target : null
      ring.dataset.interactive = target?.closest(INTERACTIVE_SELECTOR) ? "true" : "false"
      setVisibility(true)
      startAnimation()
    }

    const handlePointerDown = () => {
      if (enabled) ring.dataset.pressed = "true"
    }

    const handlePointerUp = () => {
      ring.dataset.pressed = "false"
    }

    const handlePointerLeave = () => setVisibility(false)

    const handlePreferenceChange = () => {
      enabled = finePointer.matches && !reducedMotion.matches
      if (!enabled) {
        setVisibility(false)
        window.cancelAnimationFrame(frameId)
        frameId = 0
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerdown", handlePointerDown, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    document.documentElement.addEventListener("pointerleave", handlePointerLeave)
    finePointer.addEventListener("change", handlePreferenceChange)
    reducedMotion.addEventListener("change", handlePreferenceChange)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("pointerup", handlePointerUp)
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave)
      finePointer.removeEventListener("change", handlePreferenceChange)
      reducedMotion.removeEventListener("change", handlePreferenceChange)
    }
  }, [])

  return (
    <div aria-hidden="true" className="smooth-cursor-layer">
      <div ref={glowRef} className="smooth-cursor-glow" data-visible="false" />
      <div
        ref={ringRef}
        className="smooth-cursor-ring"
        data-interactive="false"
        data-pressed="false"
        data-visible="false"
      />
    </div>
  )
}
