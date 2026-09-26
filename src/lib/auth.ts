import { Role } from "./rbac";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  exp: number; // Unix timestamp in seconds
}

export interface SessionVerificationResult {
  valid: boolean;
  user?: SessionUser;
  error?: "EXPIRED" | "INVALID_SIGNATURE" | "MALFORMED" | "NO_TOKEN";
}

// Secret used for institutional HMAC session tokens
const SESSION_SECRET = process.env.SESSION_SECRET || "ciirc-os-production-session-secret-key-2026-v2";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours institutional session

// Pure JavaScript Edge-safe SHA-256 implementation
function sha256Bytes(ascii: string): Uint8Array {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i = 0, j = 0;
  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;
  const isComposite: Record<number, number> = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80";
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const s0 = ((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3);
      const s1 = ((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10);
      w[i] = (i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
      const s0h = ((hash[0] >>> 2) | (hash[0] << 30)) ^ ((hash[0] >>> 13) | (hash[0] << 19)) ^ ((hash[0] >>> 22) | (hash[0] << 10));
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const t2 = (s0h + maj) | 0;
      const s1h = ((hash[4] >>> 6) | (hash[4] << 26)) ^ ((hash[4] >>> 11) | (hash[4] << 21)) ^ ((hash[4] >>> 25) | (hash[4] << 7));
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const t1 = (hash[7] + s1h + ch + k[i] + w[i]) | 0;
      hash = [(t1 + t2) | 0].concat(hash);
      hash[4] = (hash[4] + t1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }

  const u8 = new Uint8Array(32);
  for (i = 0; i < 8; i++) {
    u8[i * 4] = (hash[i] >>> 24) & 0xff;
    u8[i * 4 + 1] = (hash[i] >>> 16) & 0xff;
    u8[i * 4 + 2] = (hash[i] >>> 8) & 0xff;
    u8[i * 4 + 3] = hash[i] & 0xff;
  }
  return u8;
}

// Pure JS HMAC-SHA256 Edge-Safe implementation
function hmacSha256Base64Url(key: string, message: string): string {
  const blockSize = 64;
  const keyBytes = new Uint8Array(blockSize);
  if (key.length > blockSize) {
    const hashedKey = sha256Bytes(key);
    keyBytes.set(hashedKey);
  } else {
    for (let i = 0; i < key.length; i++) keyBytes[i] = key.charCodeAt(i);
  }

  const oPad = new Uint8Array(blockSize);
  const iPad = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    oPad[i] = keyBytes[i] ^ 0x5c;
    iPad[i] = keyBytes[i] ^ 0x36;
  }

  let inner = "";
  for (let i = 0; i < blockSize; i++) inner += String.fromCharCode(iPad[i]);
  inner += message;
  const innerHash = sha256Bytes(inner);

  let outer = "";
  for (let i = 0; i < blockSize; i++) outer += String.fromCharCode(oPad[i]);
  for (let i = 0; i < innerHash.length; i++) outer += String.fromCharCode(innerHash[i]);
  const finalHash = sha256Bytes(outer);

  let binary = "";
  for (let i = 0; i < finalHash.length; i++) binary += String.fromCharCode(finalHash[i]);

  const b64 = typeof btoa !== "undefined"
    ? btoa(binary)
    : Buffer.from(binary, "binary").toString("base64");

  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function stringToBase64Url(str: string): string {
  const b64 = typeof btoa !== "undefined"
    ? btoa(unescape(encodeURIComponent(str)))
    : Buffer.from(str).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToString(b64url: string): string {
  let base64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  if (typeof atob !== "undefined") {
    return decodeURIComponent(escape(atob(base64)));
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

/**
 * Creates a signed institutional session token (Edge-safe synchronous)
 */
export function signSessionToken(user: Omit<SessionUser, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const sessionUser: SessionUser = { ...user, exp };
  const payloadBase64 = stringToBase64Url(JSON.stringify(sessionUser));
  const signature = hmacSha256Base64Url(SESSION_SECRET, payloadBase64);
  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies and decodes a signed institutional session token
 */
export function verifySessionToken(token: string): SessionVerificationResult {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "NO_TOKEN" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "MALFORMED" };
  }

  const [payloadBase64, signature] = parts;
  const expectedSignature = hmacSha256Base64Url(SESSION_SECRET, payloadBase64);

  // Constant-time check comparison
  if (signature.length !== expectedSignature.length) {
    return { valid: false, error: "INVALID_SIGNATURE" };
  }

  let mismatch = 0;
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  if (mismatch !== 0) {
    return { valid: false, error: "INVALID_SIGNATURE" };
  }

  try {
    const jsonStr = base64UrlToString(payloadBase64);
    const user: SessionUser = JSON.parse(jsonStr);

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (user.exp && nowSeconds > user.exp) {
      return { valid: false, error: "EXPIRED" };
    }

    return { valid: true, user };
  } catch {
    return { valid: false, error: "MALFORMED" };
  }
}

/**
 * Extracts and verifies session token from HTTP Request headers or cookies
 */
export function getSessionFromRequest(request: {
  headers: { get(name: string): string | null };
  cookies?: { get(name: string): { value?: string } | undefined };
}): SessionVerificationResult {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    return verifySessionToken(token);
  }

  // 2. Check Cookie ciirc_session
  const cookieToken = request.cookies?.get("ciirc_session")?.value;
  if (cookieToken) {
    return verifySessionToken(cookieToken);
  }

  return { valid: false, error: "NO_TOKEN" };
}
