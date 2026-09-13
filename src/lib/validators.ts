/**
 * Security and Input Validation Engine
 * Protects against XSS, script injection, and invalid payloads.
 */

export function sanitizeHtml(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "");
}

export function sanitizeString(raw: string): string {
  if (!raw) return "";
  return raw.replace(/[<>'"]/g, "").trim();
}

export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function isValidUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidISODate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateResearcherInput(data: any): ValidationResult {
  const errors: string[] = [];
  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.push("Researcher name is required and must be at least 2 characters.");
  }
  if (!data.email || !isValidEmail(data.email)) {
    errors.push("A valid institutional email address is required.");
  }
  if (!data.department || typeof data.department !== "string") {
    errors.push("Valid research department is required.");
  }
  return { valid: errors.length === 0, errors };
}

export function validateMOUInput(data: any): ValidationResult {
  const errors: string[] = [];
  if (!data.partnerId && !data.partnerName) {
    errors.push("Partner organization identification is required.");
  }
  if (!data.startDate || !isValidISODate(data.startDate)) {
    errors.push("Valid ISO start date (YYYY-MM-DD) is required.");
  }
  if (!data.endDate || !isValidISODate(data.endDate)) {
    errors.push("Valid ISO end date (YYYY-MM-DD) is required.");
  }
  return { valid: errors.length === 0, errors };
}
