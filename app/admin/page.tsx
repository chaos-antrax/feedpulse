import React from "react"
import LoginForm from "@/components/LoginForm"

const page = () => {
  return (
    <div className="grid xl:grid-cols-10">
      <div className="min-h-xl col-span-3 h-[96.66vh]">
        <div className="flex items-center justify-center xl:hidden">
          <div className="absolute top-14 flex h-28 w-28 items-center justify-center rounded-full bg-primary p-4 text-6xl text-white dark:bg-muted-foreground">
            FP
          </div>
        </div>
        <LoginForm />
      </div>
      <div className="col-span-7 hidden items-center p-10 pl-24 text-9xl font-semibold text-primary xl:flex dark:text-muted-foreground">
        FeedPulse <br />
        Admin Portal
      </div>
    </div>
  )
}

export default page
