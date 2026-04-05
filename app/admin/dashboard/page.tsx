"use client"
import React, { useEffect, useState, useTransition } from "react"
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
import FeedbackItemCard from "@/components/FeedbackItemCard"

import {
  deleteFeedback,
  fetchFeedbackList,
  fetchFeedbackSummary,
  updateFeedbackStatus,
} from "@/lib/api"

import { FeedbackListResponse, FeedbackSummaryResponse } from "@/lib/types"
import { useRouter } from "next/navigation"
import { clearAuthToken } from "@/lib/auth"

const page = () => {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [status, setStatus] = useState("All")
  const [sort, setSort] = useState("date_desc")
  const [page, setPage] = useState(1)
  const [listData, setListData] = useState<FeedbackListResponse | null>(null)
  const [summary, setSummary] = useState<FeedbackSummaryResponse | null>(null)
  const [stats, setStats] = useState({
    totalFeedback: 0,
    openItems: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState("")
  const [deletingId, setDeletingId] = useState("")

  const [isLoading, startLoading] = useTransition()

  async function refreshStats() {
    const [summaryResponse, totalResponse, newResponse, inReviewResponse] =
      await Promise.all([
        fetchFeedbackSummary(),
        fetchFeedbackList({ page: 1 }),
        fetchFeedbackList({ page: 1, status: "New" }),
        fetchFeedbackList({ page: 1, status: "In Review" }),
      ])

    setSummary(summaryResponse)
    setStats({
      totalFeedback: totalResponse.pagination.total,
      openItems:
        newResponse.pagination.total + inReviewResponse.pagination.total,
    })
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchInput)
      setPage(1)
    }, 250)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    startLoading(async () => {
      try {
        setError("")

        const [
          listResponse,
          summaryResponse,
          totalResponse,
          newResponse,
          inReviewResponse,
        ] = await Promise.all([
          fetchFeedbackList({
            category,
            status,
            page,
            sort,
            search: debouncedSearch,
          }),
          fetchFeedbackSummary(),
          fetchFeedbackList({ page: 1 }),
          fetchFeedbackList({ page: 1, status: "New" }),
          fetchFeedbackList({ page: 1, status: "In Review" }),
        ])

        setListData(listResponse)
        console.log("listResponse", listResponse)
        setSummary(summaryResponse)
        setStats({
          totalFeedback: totalResponse.pagination.total,
          openItems:
            newResponse.pagination.total + inReviewResponse.pagination.total,
        })
        console.log("stats", stats)
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load dashboard data."
        )
      }
    })
  }, [category, debouncedSearch, page, sort, status])

  async function handleStatusChange(id: string, nextStatus: string) {
    try {
      setUpdatingId(id)
      console.log("New status update:", nextStatus)
      const updated = await updateFeedbackStatus(id, nextStatus)

      setListData((current) =>
        current
          ? {
              ...current,
              items: current.items.map((item) =>
                item.id === id ? updated : item
              ),
            }
          : current
      )

      await refreshStats()
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Status update failed."
      )
    } finally {
      setUpdatingId("")
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id)
      await deleteFeedback(id)

      setListData((current) =>
        current
          ? {
              ...current,
              items: current.items.filter((item) => item.id !== id),
              pagination: {
                ...current.pagination,
                total: Math.max(0, current.pagination.total - 1),
              },
            }
          : current
      )

      await refreshStats()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed."
      )
    } finally {
      setDeletingId("")
    }
  }

  function handleLogout() {
    clearAuthToken()
    router.replace("/")
  }

  const calc_stats = [
    { title: "Total Feedback", value: stats.totalFeedback },
    { title: "Open Items", value: stats.openItems },
    {
      title: "Average Priority Score",
      value: summary?.averagePriority
        ? summary.averagePriority.toFixed(2)
        : "N/A",
    },
    { title: "Most Common Tag", value: summary?.mostCommonTag ?? "None yet" },
  ]

  const filters = [
    {
      title: "Category",
      options: ["All", "Bug", "Feature Request", "Improvement", "Other"],
      setter: setCategory,
      value: category, // Add this
    },
    {
      title: "Status",
      options: ["All", "New", "In Review", "Resolved"],
      setter: setStatus,
      value: status, // Add this
    },
  ]

  const sortOptions = {
    title: "Sort Options",
    options: [
      { label: "Newest First", value: "date_desc" },
      { label: "Oldest First", value: "date_asc" },
      { label: "High Priority", value: "priority_desc" },
      { label: "Low Priority", value: "priority_asc" },
      { label: "Sentiment", value: "sentiment" },
    ],
    setter: setSort,
  }

  return (
    <div className="xl:p-4">
      {/* Header Row */}
      <div className="relative p-4 shadow-md dark:border-muted-foreground/40 dark:shadow-2xl">
        <div className="flex w-full items-end justify-end">
          <Button onClick={handleLogout} className="top-4 right-4 xl:absolute">
            Log Out
          </Button>
        </div>
        <h1 className="mt-6 text-4xl font-medium xl:mt-0"> Admin Dashboard</h1>
        <p className="mt-4 text-xl xl:mt-2">
          Review, prioritize, and resolve incoming product feedback.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {calc_stats.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
      {/* Search and filters */}
      <div className="mt-6 grid gap-4 p-4 xl:grid-cols-12">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="col-span-6 border border-primary/30 dark:border-muted-foreground/30"
          placeholder="Search through titles or AI summary"
        />
        {filters.map((filter, index) => (
          <Select
            key={index}
            value={filter.value}
            onValueChange={(value) => {
              filter.setter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="col-span-2 w-full border border-primary/30 dark:border-muted-foreground/30">
              <SelectValue placeholder={filter.title} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <Select
          value={sort}
          onValueChange={(value) => {
            sortOptions.setter(value)
            setPage(1)
          }}
        >
          <SelectTrigger className="col-span-2 w-full border border-primary/30 dark:border-muted-foreground/30">
            <SelectValue placeholder={sortOptions.title} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.options.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="mx-4 border border-destructive px-4 py-3 text-sm text-destructive dark:border-destructive/30">
          {error}
        </div>
      ) : null}

      {!isLoading && listData && listData.items.length === 0 ? (
        <div className="mx-4 border border-dashed border-primary/40 px-6 py-12 text-center dark:border-muted-foreground/40">
          <p className="text-lg font-medium">
            No feedback matches the current filters.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try widening the search, switching status, or clearing category
            filters.
          </p>
        </div>
      ) : null}

      {/* Feedback List */}
      {listData?.items.length ? (
        <div className="space-y-2 p-4">
          {listData.items.map((item) => (
            <FeedbackItemCard
              key={item.id}
              {...item}
              onDelete={() => handleDelete(item.id)}
              onStatusChange={(newStatus) =>
                handleStatusChange(item.id, newStatus)
              }
            />
          ))}
        </div>
      ) : null}

      {/* Pagination Controls */}
      {listData ? (
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border/60 pt-5">
          <p className="text-sm text-muted-foreground">
            Page {listData.pagination.page} of {listData.pagination.totalPages}
          </p>
          <div className="flex gap-3">
            <Button
              disabled={listData.pagination.page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              disabled={
                listData.pagination.page >= listData.pagination.totalPages
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(listData.pagination.totalPages, current + 1)
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default page
