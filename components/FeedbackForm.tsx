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

export default function FeedbackForm() {
  const [formState, setFormState] = useState<FormState>(initialState)

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: replace with real validation + API
    console.log("Form submitted:", formState)

    setTimeout(() => {
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <form
      onSubmit={handleSubmit}
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  )
}
