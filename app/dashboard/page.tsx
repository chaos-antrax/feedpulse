import Header from "@/components/Header"
import { title } from "node:process"
import React from "react"
import StatCard from "@/components/StatCard"
import { Button } from "@/components/ui/button"

const page = () => {
  const stats = [
    { title: "Total Feedback", value: 120 },
    { title: "Open Items", value: 45 },
    { title: "Average Priority Score", value: "3.25" },
    { title: "Most Common Tag", value: "ChatGPT" },
  ]
  return (
    <div className="p-4">
      <div className="relative p-4 shadow-md dark:border-muted-foreground/40 dark:shadow-2xl">
        <Button className="absolute top-4 right-4">Log Out</Button>
        <h1 className="text-4xl font-medium"> Admin Dashboard</h1>
        <p className="text-xl">
          Review, prioritize, and resolve incoming product feedback.
        </p>
        <div className="mt-10 grid grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default page
