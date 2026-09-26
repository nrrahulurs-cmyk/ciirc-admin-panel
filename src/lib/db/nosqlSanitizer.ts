/**
 * NoSQL Injection Protection Engine
 * Recursively inspects and sanitizes objects to prevent MongoDB operator injection ($gt, $ne, $where, $regex, etc.)
 */

export function sanitizeNoSqlPayload<T>(input: T): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeNoSqlPayload(item)) as unknown as T;
  }

  const cleanObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(input as Record<string, any>)) {
    // Strip or rename keys starting with $ or containing . (MongoDB operator injection vectors)
    if (key.startsWith("$") || key.includes(".")) {
      continue;
    }

    if (typeof value === "object" && value !== null) {
      cleanObj[key] = sanitizeNoSqlPayload(value);
    } else {
      cleanObj[key] = value;
    }
  }

  return cleanObj as T;
}

/**
 * Checks whether an object contains hazardous MongoDB query operators
 */
export function hasNoSqlInjectionRisk(input: any): boolean {
  if (!input || typeof input !== "object") return false;

  for (const [key, value] of Object.entries(input)) {
    if (key.startsWith("$") || key.includes(".")) {
      return true;
    }
    if (typeof value === "object" && value !== null) {
      if (hasNoSqlInjectionRisk(value)) return true;
    }
  }

  return false;
}
