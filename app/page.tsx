import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Kbd } from "@/components/ui/kbd"

import Header from "@/components/Header"
import FeedbackForm from "@/components/FeedbackForm"

export default function Page() {
  return (
    <div>
      <Header />
      <div className="mt-4 flex flex-col p-4 xl:px-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-medium">Customer Feedback Platform</h1>
          <p className="text-md xl:text-lg">
            Tell us about your experience with our product by filling out the
            form below.
          </p>
          <p className="text-md max-w-4xl xl:text-lg">
            Your name and email are optional, but they help us follow up with
            you if we have any questions about your feedback. We appreciate your
            input and look forward to hearing from you!
          </p>
        </div>
        <div className="mt-6">
          <FeedbackForm />
        </div>
        <div className="mt-4 flex w-full items-center justify-center font-mono text-xs text-muted-foreground">
          (Press <Kbd>d</Kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
