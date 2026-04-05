"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ApiRequestError, submitFeedback } from "@/lib/api"

const categories = ["Bug", "Feature Request", "Improvement", "Other"]

interface FormState {
  title: string
  description: string
  category: string
  submitterName: string
  submitterEmail: string
}

interface FormErrors {
  title?: string
  description?: string
  submitterEmail?: string
}

const initialState: FormState = {
  title: "",
  description: "",
  category: "Bug",
  submitterName: "",
  submitterEmail: "",
}

type SubmitState = "idle" | "submitting" | "success" | "error"

export default function FeedbackForm() {
  const [formState, setFormState] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>("idle")
  const [message, setMessage] = useState("")

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  function validateForm(values: FormState) {
    const nextErrors: FormErrors = {}

    if (!values.title.trim()) {
      nextErrors.title = "A short title helps the team understand the issue."
    }

    if (!values.description.trim()) {
      nextErrors.description =
        "Please describe the feedback in a little more detail."
    } else if (values.description.trim().length < 20) {
      nextErrors.description = "Description must be at least 20 characters."
    }

    if (
      values.submitterEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.submitterEmail.trim())
    ) {
      nextErrors.submitterEmail = "Enter a valid email address."
    }

    return nextErrors
  }

  async function handleSubmit() {
    const nextErrors = validateForm(formState)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState("error")
      setMessage("Please check the highlighted fields and try again.")
      return
    }

    try {
      setSubmitState("submitting")
      setMessage("")

      await submitFeedback({
        title: formState.title,
        description: formState.description,
        category: formState.category,
        submitterName: formState.submitterName || undefined,
        submitterEmail: formState.submitterEmail || undefined,
      })

      setFormState(initialState)
      setErrors({})
      setSubmitState("success")
      setMessage("Thanks. Your feedback has been sent to the FeedPulse team.")

      setTimeout(() => {
        setSubmitState("idle")
        setMessage("")
      }, 10000)
    } catch (error) {
      setSubmitState("error")

      if (error instanceof ApiRequestError && error.status === 429) {
        setMessage(
          "You have reached the limit of 5 feedback submissions. Please try again later."
        )
        return
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting."
      )
    }
  }

  return (
    <form
      action={handleSubmit}
      className="grid max-w-md gap-6 bg-white/60 p-4 xl:mt-4 xl:min-w-md dark:bg-transparent"
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input
            value={formState.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Example: Search results are difficult to trust"
          />
          {errors.title && <FieldError>{errors.title}</FieldError>}
        </Field>

        <Field>
          <div className="flex items-end justify-between">
            <FieldLabel>Description</FieldLabel>
            <FieldDescription className="text-right">
              {formState.description.length} / 20 minimum
            </FieldDescription>
          </div>
          <Textarea
            rows={6}
            value={formState.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Tell us what happened..."
          />
          {errors.description && <FieldError>{errors.description}</FieldError>}
        </Field>

        <Field>
          <FieldLabel>Category</FieldLabel>
          <Select
            value={formState.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>

            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            value={formState.submitterName}
            onChange={(e) => handleChange("submitterName", e.target.value)}
            placeholder="Optional"
          />
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            value={formState.submitterEmail}
            onChange={(e) => handleChange("submitterEmail", e.target.value)}
            placeholder="Optional"
          />
          {errors.submitterEmail && (
            <FieldError>{errors.submitterEmail}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={submitState === "submitting"}>
        {submitState === "submitting" && "Submitting..."}
        {submitState === "success" && "Submitted ✓"}
        {submitState === "error" && "Retry Submission"}
        {submitState === "idle" && "Submit Feedback"}
      </Button>
      {message ? (
        <div
          className={`border px-3 py-2 text-sm ${
            submitState === "success"
              ? "border-green-300 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200"
              : "border-destructive text-xs text-destructive lg:text-sm dark:border-destructive/30"
          }`}
        >
          {message}
        </div>
      ) : null}
    </form>
  )
}
