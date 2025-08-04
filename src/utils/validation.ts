export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateMessageRequest(body: any): ValidationResult {
  if (!body) {
    return { isValid: false, error: "Request body is required" }
  }

  if (!body.message || typeof body.message !== "string") {
    return { isValid: false, error: "Message is required and must be a string" }
  }

  if (body.message.trim().length === 0) {
    return { isValid: false, error: "Message cannot be empty" }
  }

  if (body.message.length > 10000) {
    return { isValid: false, error: "Message is too long (max 10000 characters)" }
  }

  if (!body.session_id || typeof body.session_id !== "string") {
    return { isValid: false, error: "Session ID is required and must be a string" }
  }

  if (body.session_id.trim().length === 0) {
    return { isValid: false, error: "Session ID cannot be empty" }
  }

  return { isValid: true }
}
