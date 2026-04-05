export function sanitizeString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
