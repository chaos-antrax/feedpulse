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
import { stat } from "node:fs"
import FeedbackItem from "@/components/FeedbackItem"

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

  const feedbackItems = [
    {
      id: 1,
      title: "Add dark mode support",
      category: "Feature Request",
      ai_sentiment: "Positive",
      ai_summary:
        "Users are requesting a dark mode option for better usability at night.",
      ai_priority: 4.5,
      date: "2024-06-01",
      status: "New",
      ai_tags: ["UI", "UX", "Dark Mode"],
    },
    {
      id: 2,
      title: "Improve page load speed",
      category: "Improvement",
      ai_sentiment: "Negative",
      ai_summary:
        "Users report slow loading times, especially on mobile devices.",
      ai_priority: 4.8,
      date: "2024-06-02",
      status: "In Progress",
      ai_tags: ["Performance", "Mobile"],
    },
    {
      id: 3,
      title: "Fix login error on Safari",
      category: "Bug",
      ai_sentiment: "Negative",
      ai_summary:
        "Safari users are unable to log in due to a session handling issue.",
      ai_priority: 5.0,
      date: "2024-06-03",
      status: "New",
      ai_tags: ["Bug", "Safari", "Auth"],
    },
    {
      id: 4,
      title: "Add export to CSV feature",
      category: "Feature Request",
      ai_sentiment: "Positive",
      ai_summary:
        "Users want to export their data into CSV for reporting purposes.",
      ai_priority: 4.2,
      date: "2024-06-04",
      status: "Planned",
      ai_tags: ["Data", "Export"],
    },
    {
      id: 5,
      title: "Improve dashboard layout",
      category: "Improvement",
      ai_sentiment: "Neutral",
      ai_summary: "Users suggest reorganizing widgets for better readability.",
      ai_priority: 3.9,
      date: "2024-06-05",
      status: "In Progress",
      ai_tags: ["UI", "Dashboard"],
    },
    {
      id: 6,
      title: "Notifications not working",
      category: "Bug",
      ai_sentiment: "Negative",
      ai_summary: "Push notifications are not being delivered to some users.",
      ai_priority: 4.7,
      date: "2024-06-06",
      status: "New",
      ai_tags: ["Notifications", "Bug"],
    },
    {
      id: 7,
      title: "Add multi-language support",
      category: "Feature Request",
      ai_sentiment: "Positive",
      ai_summary:
        "Users request support for multiple languages to improve accessibility.",
      ai_priority: 4.6,
      date: "2024-06-07",
      status: "Planned",
      ai_tags: ["i18n", "Accessibility"],
    },
    {
      id: 8,
      title: "Search function is inaccurate",
      category: "Bug",
      ai_sentiment: "Negative",
      ai_summary:
        "Search results are often irrelevant or missing expected items.",
      ai_priority: 4.4,
      date: "2024-06-08",
      status: "In Progress",
      ai_tags: ["Search", "Bug"],
    },
    {
      id: 9,
      title: "Allow profile picture upload",
      category: "Feature Request",
      ai_sentiment: "Positive",
      ai_summary:
        "Users want the ability to upload and customize their profile pictures.",
      ai_priority: 3.8,
      date: "2024-06-09",
      status: "New",
      ai_tags: ["Profile", "UX"],
    },
    {
      id: 10,
      title: "Reduce form validation errors",
      category: "Improvement",
      ai_sentiment: "Neutral",
      ai_summary:
        "Users encounter frequent validation errors when submitting forms.",
      ai_priority: 4.1,
      date: "2024-06-10",
      status: "In Progress",
      ai_tags: ["Forms", "Validation"],
    },
  ]

  return (
    <div className="xl:p-4">
      {/* Header Row */}
      <div className="relative p-4 shadow-md dark:border-muted-foreground/40 dark:shadow-2xl">
        <div className="flex w-full items-end justify-end">
          <Button className="top-4 right-4 xl:absolute">Log Out</Button>
        </div>
        <h1 className="mt-6 text-4xl font-medium xl:mt-0"> Admin Dashboard</h1>
        <p className="mt-4 text-xl xl:mt-2">
          Review, prioritize, and resolve incoming product feedback.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
      {/* Search and filters */}
      <div className="mt-6 grid gap-4 p-4 xl:grid-cols-12">
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
      <div className="space-y-2 p-4">
        {feedbackItems.map((item, index) => (
          <FeedbackItem key={index} {...item} />
        ))}
      </div>
    </div>
  )
}

export default page
