"use client"

import { useState, useEffect } from "react"

import { FieldGroup, Field, FieldLabel, FieldError } from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handlesubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const fields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "admin@feedpulse.io",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ]

  return (
    <form
      onSubmit={handlesubmit}
      className="flex min-h-full flex-col justify-center space-y-10 rounded-xl border-primary p-10 pt-52 shadow-2xl xl:rounded-none xl:border-r-10 xl:pt-0 dark:border-muted-foreground"
    >
      <FieldGroup>
        {fields.map((field) => (
          <Field key={field.id}>
            <FieldLabel htmlFor={field.id} className="text-2xl">
              {field.label}
            </FieldLabel>
            <Input
              className="h-10"
              id={field.id}
              type={field.type}
              value={field.id === "email" ? email : password}
              onChange={(event) => {
                if (field.id === "email") {
                  setEmail(event.target.value)
                } else {
                  setPassword(event.target.value)
                }
              }}
              placeholder={field.placeholder}
            />
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
        ))}
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="max-w-fit justify-start p-6 text-xl dark:bg-muted-foreground"
        disabled={submitting}
      >
        {submitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  )
}

export default LoginForm
