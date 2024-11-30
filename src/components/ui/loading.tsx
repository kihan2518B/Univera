import React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  className?: string
}

export function Loading({ size = 24, className, ...props }: LoadingProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className="animate-spin" size={size} />
    </div>
  )
}

export function TableLoader() {
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <Loading size={32} />
    </div>
  )
}

export function OverlayLoader() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <Loading size={32} />
      </div>
    </div>
  )
}
