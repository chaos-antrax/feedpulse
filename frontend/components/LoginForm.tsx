"use client"

import { useState, useEffect } from "react"

import { getAuthToken, setAuthToken } from "@/lib/auth"
import { loginAdmin } from "@/lib/api"

import { FieldGroup, Field, FieldLabel, FieldError } from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const LoginForm = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (getAuthToken()) {
      router.replace("/admin/dashboard")
    }
  }, [router])

  async function handlesubmit() {
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Enter the admin email and password to continue.")
      return
    }

    try {
      setSubmitting(true)
      const response = await loginAdmin({ email, password })
      setAuthToken(response.token)
      router.replace("/admin/dashboard")
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Login failed."
      )
    } finally {
      setSubmitting(false)
    }
  }

  const fields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "email@domain.com",
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
      action={handlesubmit}
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
        className="max-w-fit justify-start p-6 text-xl"
        disabled={submitting}
      >
        {submitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  )
}

export default LoginForm
