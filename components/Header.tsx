import React from "react"
import { Button } from "./ui/button"
import Link from "next/link"

const Header = () => {
  return (
    <div className="flex max-h-fit w-full items-center justify-between px-6 py-4 shadow-2xl">
      <span className="text-md tracking-widest xl:text-xl">FEEDPULSE</span>
      <Link href="/admin">
        <Button className="xl:flex xl:px-8 xl:py-6 xl:text-base">Admin</Button>
      </Link>
    </div>
  )
}

export default Header
