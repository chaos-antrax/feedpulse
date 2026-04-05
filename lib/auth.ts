const AUTH_COOKIE_NAME = "feedpulse_admin_token"

export function setAuthToken(token: string) {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=86400; samesite=lax`
  window.localStorage.setItem(AUTH_COOKIE_NAME, token)
}

export function getAuthToken() {
  if (typeof document === "undefined") {
    return ""
  }

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${AUTH_COOKIE_NAME}=`))

  if (cookie) {
    return decodeURIComponent(cookie.split("=")[1] ?? "")
  }

  return window.localStorage.getItem(AUTH_COOKIE_NAME) ?? ""
}

export function clearAuthToken() {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`
  window.localStorage.removeItem(AUTH_COOKIE_NAME)
}

export function getAuthCookieName() {
  return AUTH_COOKIE_NAME
}
