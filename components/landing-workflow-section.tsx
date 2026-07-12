"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Sparkles, UploadCloud, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Import your sheet",
    description: "Drop CSV or Excel on the landing page or open the dashboard. Column headers map automatically.",
    icon: UploadCloud,
    accent: "from-foreground/10 via-foreground/5 to-transparent",
  },
  {
    step: "02",
    title: "Run AI agents",
    description: "Analyze spreadsheet data, generate summaries, classify information, organize structured content, and automate repetitive tasks with AI.",
    icon: Sparkles,
    accent: "from-foreground/14 via-foreground/6 to-transparent",
  },
  {
    step: "03",
    title: "Ship clean data",
    description: "Export organized data, continue working with AI-assisted workflows, or refine your spreadsheet through chat-based instructions.",
    icon: Zap,
    accent: "from-foreground/10 via-foreground/5 to-transparent",
  },
] as const

function useInView(threshold = 0.18) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

function WorkflowMiniVisual({ variant, active }: { variant: number; active: boolean }) {
  if (variant === 0) {
    return (
      <div className="relative mt-6 h-24 overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-3">
        <div className="mb-2 flex gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-foreground/15" />
          <span className="h-1.5 w-12 rounded-full bg-foreground/10" />
          <span className="h-1.5 w-6 rounded-full bg-foreground/10" />
        </div>
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className={cn(
              "mb-1.5 flex gap-2 rounded-md border border-border/50 bg-background/80 px-2 py-1.5",
              active ? `workflow-row-in workflow-row-in-delay-${row + 1}` : "opacity-100"
            )}
          >
            <span className="h-2 w-2 rounded-sm bg-foreground/20" />
            <span className="h-2 flex-1 rounded-sm bg-foreground/10" />
            <span className="h-2 w-8 rounded-sm bg-foreground/15" />
          </div>
        ))}
        <div
          className={cn(
            "absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-lg bg-foreground px-2.5 py-1.5 text-[10px] font-medium text-background",
            active ? "workflow-slide-up" : "opacity-100"
          )}
        >
          <UploadCloud className="h-3 w-3" />
          File mapped
        </div>
      </div>
    )
  }

  if (variant === 1) {
    return (
      <div className="relative mt-6 h-24 overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-3">
        <div className="grid grid-cols-3 gap-2">
          {["Analyze", "Classify", "Organize"].map((label, index) => (
            <div
              key={label}
              className={cn(
                "rounded-lg border border-border/60 bg-background/80 px-2 py-2 text-center",
                active ? `workflow-agent-pulse workflow-agent-pulse-delay-${index + 1}` : "opacity-100"
              )}
            >
              <Sparkles className="mx-auto h-3 w-3 text-foreground/70" />
              <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className={cn("mt-3 h-1.5 overflow-hidden rounded-full bg-border/70", active && "workflow-progress-track")}>
          <div className={cn("h-full w-1/3 rounded-full bg-foreground", active && "workflow-progress-fill")} />
        </div>
      </div>
    )
  }

  return (
    <div className="relative mt-6 h-24 overflow-hidden rounded-xl border border-border/60 bg-muted/30 p-3">
      <div className="space-y-2">
        {["Rows organized", "Summary ready", "Export ready"].map((label, index) => (
          <div
            key={label}
            className={cn(
              "flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-2.5 py-1.5",
              active ? `workflow-check-in workflow-check-in-delay-${index + 1}` : "opacity-100"
            )}
          >
            <span className="text-[10px] text-muted-foreground">{label}</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] text-background">
              ✓
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WorkflowStepCard({
  step,
  index,
  inView,
  active,
  onPointerEnter,
  onPointerLeave,
}: {
  step: (typeof WORKFLOW_STEPS)[number]
  index: number
  inView: boolean
  active: boolean
  onPointerEnter: () => void
  onPointerLeave: () => void
}) {
  const Icon = step.icon

  return (
    <article
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-background/90 p-6 shadow-sm backdrop-blur transition-[transform,box-shadow,border-color] duration-500 ease-out",
        inView ? "workflow-card-reveal" : "translate-y-10 opacity-0",
        inView && `workflow-card-reveal-delay-${index + 1}`,
        active
          ? "z-10 -translate-y-2 scale-[1.02] border-foreground/25 shadow-[0_28px_70px_-34px_color-mix(in_oklab,var(--foreground)_35%,transparent)]"
          : "border-border/80 hover:-translate-y-1 hover:border-foreground/15 hover:shadow-lg"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
          step.accent,
          active && "opacity-100"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
        )}
      />

      <div className="relative mb-5 flex items-center justify-between">
        <div
          className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500",
            active
              ? "border-foreground/20 bg-foreground text-background shadow-lg shadow-foreground/15"
              : "border-border bg-muted/50 text-foreground group-hover:border-foreground/15 group-hover:bg-muted"
          )}
        >
          <Icon className={cn("h-5 w-5 transition-transform duration-500", active && "workflow-icon-pop")} />
          {active && <span className="workflow-icon-ring absolute inset-0 rounded-2xl border border-foreground/20" />}
        </div>
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.22em] transition-colors duration-300",
            active ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {step.step}
        </span>
      </div>

      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
        <WorkflowMiniVisual variant={index} active={active} />
      </div>

      <div
        className={cn(
          "relative mt-auto flex items-center gap-2 pt-4 text-xs font-medium uppercase tracking-[0.16em] transition-all duration-500",
          active ? "translate-x-0 text-foreground opacity-100" : "translate-x-[-4px] text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        )}
      >
        Step {step.step}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </article>
  )
}

export function LandingWorkflowSection() {
  const { ref, inView } = useInView()
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!inView) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % WORKFLOW_STEPS.length)
    }, 3200)

    return () => window.clearInterval(interval)
  }, [inView])

  const highlightedIndex = hoverIndex ?? activeIndex

  return (
    <section id="workflow" className="relative overflow-hidden border-y border-border/70 bg-muted/15 px-4 py-20 sm:px-6 md:py-28">
      <div className="workflow-orb workflow-orb-left pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-foreground/[0.04] blur-3xl" />
      <div className="workflow-orb workflow-orb-right pointer-events-none absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-foreground/[0.05] blur-3xl" />

      <div ref={ref} className="relative mx-auto max-w-6xl">
        <div
          className={cn(
            "mx-auto max-w-3xl text-center transition-all duration-700",
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Workflow
          </span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Three steps from messy spreadsheets to structured rows
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-[18%] right-[18%] top-[4.75rem] hidden h-px md:block">
            <div className="relative h-full overflow-hidden rounded-full bg-border/80">
              <div className={cn("workflow-pipeline-base h-full w-full", inView && "workflow-pipeline-animate")} />
              <div className={cn("workflow-pipeline-dot absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-foreground", inView && "workflow-pipeline-dot-move")} />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:gap-10">
            {WORKFLOW_STEPS.map((step, index) => (
              <WorkflowStepCard
                key={step.step}
                step={step}
                index={index}
                inView={inView}
                active={highlightedIndex === index}
                onPointerEnter={() => setHoverIndex(index)}
                onPointerLeave={() => setHoverIndex(null)}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {WORKFLOW_STEPS.map((step, index) => (
              <button
                key={step.step}
                type="button"
                aria-label={`Highlight step ${step.step}`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  highlightedIndex === index ? "w-8 bg-foreground" : "w-2 bg-foreground/20 hover:bg-foreground/40"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
