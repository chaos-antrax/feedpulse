"use client"

import React from "react"
import { Badge } from "./ui/badge"
import { Trash } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Button } from "./ui/button"

interface FeedbackItemProps {
  id: number
  title: string
  category: string
  ai_sentiment: string
  ai_summary: string
  ai_priority: number
  date: string
  status: string
  ai_tags: string[]
}

const FeedbackItem = (props: FeedbackItemProps) => {
  return (
    <div className="relative space-y-4 bg-white p-4 dark:bg-muted-foreground/10">
      <div className="grid items-center justify-center space-y-4 xl:grid-cols-12">
        <div className="col-span-5">
          <div className="flex items-center gap-4">
            <span className="font-extrabold">{props.category}</span>
            <Badge>{props.ai_sentiment}</Badge>
          </div>
          <h1 className="mt-4 mb-2 text-2xl font-medium">{props.title}</h1>
          <span>{props.ai_summary}</span>
        </div>
        <div className="col-span-2 space-y-2 xl:space-y-6 xl:text-center">
          <h2 className="tracking-widest dark:text-muted-foreground">
            PRIORITY
          </h2>
          <span className="text-2xl">{props.ai_priority}</span>
        </div>
        <div className="col-span-2 space-y-2 xl:space-y-6 xl:text-center">
          <h2 className="tracking-widest dark:text-muted-foreground">
            DATE SUBMITTED
          </h2>
          <span className="text-2xl">{props.date}</span>
        </div>
        <div className="col-span-2 flex flex-col space-y-2 xl:items-center xl:space-y-6 xl:text-center">
          <h2 className="tracking-widest dark:text-muted-foreground">STATUS</h2>
          <Select>
            <SelectTrigger className="w-36 border border-primary/30 dark:border-muted-foreground/30">
              <SelectValue placeholder={props.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="absolute top-4 right-4 col-span-2 flex items-center justify-center">
          <Button>
            <Trash className="cursor-pointer" />
          </Button>
        </div>
      </div>
      <div>
        {props.ai_tags.map((tag, index) => (
          <Badge key={index} className="mr-2" variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default FeedbackItem
