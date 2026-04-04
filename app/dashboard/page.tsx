import Header from "@/components/Header"
import { title } from "node:process"
import React from "react"
import StatCard from "@/components/StatCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const page = () => {
  const stats = [
    { title: "Total Feedback", value: 120 },
    { title: "Open Items", value: 45 },
    { title: "Average Priority Score", value: "3.25" },
    { title: "Most Common Tag", value: "ChatGPT" },
  ]

  const filters = [
    {
      title: "Category",
      options: ["All", "Bug", "Feature Request", "Improvement", "Other"],
    },
    {
      title: "Status",
      options: ["All", "New", "In Review", "Resolved"],
    },
    {
      title: "Date",
      options: [
        "Newest First",
        "Oldest First",
        "High Priority",
        "Low Priority",
        "Sentiment",
      ],
    },
  ]

  return (
    <div className="p-4">
      {/* Header Row */}
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
      {/* Search and filters */}
      <div className="mt-6 grid grid-cols-12 gap-4 p-4">
        <Input
          className="col-span-6 border border-primary/30 dark:border-muted-foreground/30"
          placeholder="Search through titles or AI summary"
        />
        {filters.map((filter, index) => (
          <Select key={index}>
            <SelectTrigger className="col-span-2 w-full border border-primary/30 dark:border-muted-foreground/30">
              <SelectValue placeholder={filter.title} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
      {/* Feedback List */}
    </div>
  )
}

export default page
