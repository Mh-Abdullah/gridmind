import type React from "react"

const Ellipses = () => {
  const sharedClasses =
    "my-4 size-1 rounded-full bg-foreground outline outline-8 outline-background sm:my-6 md:my-8"

  return (
    <div className="absolute z-0 grid h-full w-full items-center gap-8 lg:grid-cols-2">
      <div className="absolute z-0 grid h-full w-full grid-cols-2 place-content-between">
        <div className={`${sharedClasses} -mx-[2.5px]`} />
        <div className={`${sharedClasses} -mx-[2px] place-self-end`} />
        <div className={`${sharedClasses} -mx-[2.5px]`} />
        <div className={`${sharedClasses} -mx-[2px] place-self-end`} />
      </div>
    </div>
  )
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="relative w-full rounded-lg border px-4 sm:px-6 md:px-8">
    <div className="absolute left-0 top-4 z-0 h-px w-full bg-border sm:top-6 md:top-8" />
    <div className="absolute bottom-4 left-0 z-0 h-px w-full bg-border sm:bottom-6 md:bottom-8" />
    <div className="relative w-full border-x">
      <Ellipses />
      <div className="relative z-20 mx-auto py-8">{children}</div>
    </div>
  </div>
)

export function Card_9({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <div className="w-full p-2">{children}</div>
    </Container>
  )
}
