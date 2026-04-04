import React from "react"

interface StatCardProps {
  title: string
  value: string | number
}

const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="space-y-6 bg-white p-4 shadow dark:bg-muted-foreground/10">
      <h2 className="tracking-widest dark:text-muted-foreground">
        {title.toUpperCase()}
      </h2>
      <span className="text-3xl dark:text-white">{value}</span>
    </div>
  )
}

export default StatCard
