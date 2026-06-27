import Image from "next/image"

import { cn } from "@/lib/utils"

type BrandAssetProps = {
  className?: string
  priority?: boolean
}

export function BrandLogo({ className, priority = false }: BrandAssetProps) {
  return (
    <Image
      src="/gridsmind.png"
      alt="GridsMind"
      width={1802}
      height={358}
      priority={priority}
      className={cn("h-8 w-auto object-contain", className)}
    />
  )
}

export function BrandIcon({ className, priority = false }: BrandAssetProps) {
  return (
    <Image
      src="/gridmind icon.png"
      alt="GridsMind icon"
      width={459}
      height={410}
      priority={priority}
      className={cn("h-8 w-8 rounded-[0.9rem] object-cover", className)}
    />
  )
}
