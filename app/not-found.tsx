"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/")
    }, 5000)

    // Cleanup the timer on unmount
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex h-lvh w-full flex-col items-center justify-center gap-10 text-4xl font-bold">
      Where are you going?
      <span className="text-base">Redirecting...</span>
    </div>
  )
}
