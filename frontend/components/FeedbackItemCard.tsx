"use client"

import { Badge } from "./ui/badge"
import { LucideStars, Stars, Trash } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Button } from "./ui/button"
import Image from "next/image"

interface FeedbackItemCardProps {
  id?: string
  title: string
  category: string
  ai_sentiment?: string | null
  ai_summary?: string | null
  ai_priority?: number | null
  createdAt: string
  status: string
  ai_tags?: string[] | null
  onDelete?: () => void
  onStatusChange?: (newStatus: string) => void
  onReanalyze?: () => void
  isDeleting?: boolean
  isReanalyzing?: boolean
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

const FeedbackItemCard = (props: FeedbackItemCardProps) => {
  const handleStatusChange = (newStatus: string) => {
    props.onStatusChange?.(newStatus)
  }

  const handleDeleteClick = () => {
    if (confirm("Are you sure you want to delete this item?")) {
      props.onDelete?.()
    }
  }

  const handleReanalyzeClick = () => {
    props.onReanalyze?.()
  }

  return (
    <div className="relative space-y-4 bg-white p-4 dark:bg-muted-foreground/10">
      <div className="grid items-center justify-center space-y-4 xl:grid-cols-12">
        <div className="col-span-5">
          <div className="flex items-center gap-4">
            <span className="font-extrabold">{props.category}</span>
            {props.ai_sentiment && <Badge>{props.ai_sentiment}</Badge>}
          </div>
          <h1 className="mt-4 mb-2 text-2xl font-medium">{props.title}</h1>
          <span>{props.ai_summary ?? "N/A"}</span>
        </div>
        <div className="items-between col-span-6 flex w-full grid-cols-4 justify-between lg:space-x-20 xl:col-span-4 xl:grid xl:space-x-0 xl:text-center">
          <div className="col-span-2 space-y-2 xl:space-y-6 xl:text-center">
            <h2 className="tracking-widest dark:text-muted-foreground">
              PRIORITY
            </h2>
            <span className="text-2xl">{props.ai_priority ?? "N/A"}</span>
          </div>
          <div className="col-span-2 space-y-2 xl:space-y-6 xl:text-center">
            <h2 className="tracking-widest dark:text-muted-foreground">
              DATE SUBMITTED
            </h2>
            <span className="text-2xl">{formatDate(props.createdAt)}</span>
          </div>
        </div>
        <div className="col-span-2 flex flex-col space-y-2 xl:items-center xl:space-y-6 xl:text-center">
          <h2 className="tracking-widest dark:text-muted-foreground">STATUS</h2>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-36 border border-primary/30 dark:border-muted-foreground/30">
              <SelectValue placeholder={props.status} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="absolute top-4 right-4 col-span-2 flex flex-row-reverse items-center gap-2 lg:flex-col">
          <Button
            className="border border-primary/30 bg-white dark:border-muted-foreground/30 dark:bg-transparent"
            onClick={handleDeleteClick}
            disabled={props.isDeleting || props.isReanalyzing}
          >
            <Trash className="cursor-pointer text-primary dark:text-muted-foreground" />
          </Button>
          <Button
            className="border border-primary/30 bg-white dark:border-muted-foreground/30 dark:bg-transparent"
            onClick={handleReanalyzeClick}
            disabled={props.isDeleting || props.isReanalyzing}
          >
            <Image
              src="/images/gemini.svg"
              width="14"
              height="14"
              alt="G"
              className="h-4 w-4"
            />
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {props.ai_tags?.map((tag, index) => (
          <Badge key={index} className="mr-2" variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default FeedbackItemCard
