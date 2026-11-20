import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * Server-only validation guard
 */
if (typeof window !== "undefined") {
  throw new Error("SMTP configuration module must never be imported in browser environments.");
}

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  requireTLS: boolean;
  tlsRejectUnauthorized: boolean;
  auth: {
    user: string;
    pass: string;
  };
  fromEmail: string;
  fromName: string;
  // Configurable throughput and timeouts
  maxConnections: number;
  maxMessages: number;
  rateLimit: number;
  rateDelta: number;
  connectionTimeout: number;
  greetingTimeout: number;
  socketTimeout: number;
  sendTimeoutMs: number;
}

export interface SmtpConfigValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedConfig?: {
    host: string;
    port: number;
    secure: boolean;
    requireTLS: boolean;
    tlsRejectUnauthorized: boolean;
    user: string;
    fromEmail: string;
    fromName: string;
    maxConnections: number;
    maxMessages: number;
    rateLimit: number;
    rateDelta: number;
    connectionTimeout: number;
    greetingTimeout: number;
    socketTimeout: number;
    sendTimeoutMs: number;
  };
}

/**
 * Parses integer with min/max clamping and fallback
 */
function parseClampedInt(
  val: string | undefined,
  defaultVal: number,
  min: number,
  max: number
): number {
  if (!val) return defaultVal;
  const parsed = parseInt(val.trim(), 10);
  if (isNaN(parsed)) return defaultVal;
  return Math.max(min, Math.min(max, parsed));
}

/**
 * Extracts email and name from strings like "Athena Institute <secretariat@aipp-praxis.org>"
 */
function parseAddressString(addressStr?: string): { email?: string; name?: string } {
  if (!addressStr || typeof addressStr !== "string") return {};
  const trimmed = addressStr.trim();
  const match = trimmed.match(/^(?:"?([^"]*)"?\s)?<?([^>\s]+)>?$/);
  if (match) {
    return {
      name: match[1]?.trim() || undefined,
      email: match[2]?.trim().toLowerCase(),
    };
  }
  return { email: trimmed.toLowerCase() };
}

/**
 * Returns the centralized SMTP configuration parsed from environment variables.
 * Resolves standard names as well as legacy/fallback aliases with secure defaults.
 */
export function getSmtpConfig(): SmtpConfig {
  const host = (process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST || "").trim();

  const rawPort = process.env.SMTP_PORT || process.env.EMAIL_SERVER_PORT;
  const parsedPort = rawPort ? parseInt(String(rawPort).trim(), 10) : NaN;

  const rawSecure = process.env.SMTP_SECURE;
  const isPort465 = parsedPort === 465;

  // Port 465 is always direct TLS (secure = true)
  // Port 587 is always STARTTLS (secure = false, requireTLS = true)
  let secure = false;
  let requireTLS = true;

  if (isPort465) {
    secure = true;
    requireTLS = true;
  } else if (parsedPort === 587) {
    secure = false;
    requireTLS = true;
  } else if (rawSecure !== undefined) {
    secure = rawSecure === "true" || rawSecure === "1";
    requireTLS = true;
  }

  const port = !isNaN(parsedPort) && parsedPort > 0 ? parsedPort : (secure ? 465 : 587);

  // Certificate verification (reject unauthorized certificates by default)
  const isProduction = process.env.NODE_ENV === "production";
  const allowInsecureTls =
    !isProduction && process.env.SMTP_IGNORE_TLS_ERRORS === "true";
  const tlsRejectUnauthorized = !allowInsecureTls;

  const user = (
    process.env.SMTP_USER ||
    process.env.EMAIL_SERVER_USER ||
    ""
  ).trim();

  const pass = (
    process.env.SMTP_PASSWORD ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_SERVER_PASSWORD ||
    ""
  ).trim();

  // Parse sender coordinates
  const fromLegacy = parseAddressString(process.env.SMTP_FROM);
  const fromEmail = (
    process.env.SMTP_FROM_EMAIL ||
    process.env.EMAIL_FROM ||
    fromLegacy.email ||
    ""
  ).trim().toLowerCase();

  const fromName = (
    process.env.SMTP_FROM_NAME ||
    fromLegacy.name ||
    "Athena Institute for Political Praxis"
  ).trim();

  // Throughput and Timeout Configurations
  const maxConnections = parseClampedInt(process.env.SMTP_MAX_CONNECTIONS, 3, 1, 10);
  const maxMessages = parseClampedInt(process.env.SMTP_MAX_MESSAGES, 100, 1, 1000);
  const rateLimit = parseClampedInt(process.env.SMTP_RATE_LIMIT, 5, 1, 50);
  const rateDelta = parseClampedInt(process.env.SMTP_RATE_DELTA_MS, 1000, 250, 60000);
  const connectionTimeout = parseClampedInt(process.env.SMTP_CONNECTION_TIMEOUT_MS, 10000, 1000, 60000);
  const greetingTimeout = parseClampedInt(process.env.SMTP_GREETING_TIMEOUT_MS, 10000, 1000, 60000);
  const socketTimeout = parseClampedInt(process.env.SMTP_SOCKET_TIMEOUT_MS, 15000, 2000, 60000);
  const sendTimeoutMs = parseClampedInt(process.env.SMTP_SEND_TIMEOUT_MS, 15000, 2000, 60000);

  return {
    host,
    port,
    secure,
    requireTLS,
    tlsRejectUnauthorized,
    auth: {
      user,
      pass,
    },
    fromEmail,
    fromName,
    maxConnections,
    maxMessages,
    rateLimit,
    rateDelta,
    connectionTimeout,
    greetingTimeout,
    socketTimeout,
    sendTimeoutMs,
  };
}

/**
 * Validates the SMTP configuration against strict transport encryption and security rules.
 */
export function validateSmtpConfig(config: SmtpConfig = getSmtpConfig()): SmtpConfigValidationResult {
  const errors: string[] = [];
  const isProduction = process.env.NODE_ENV === "production";

  // 1. Host validation
  if (!config.host) {
    errors.push("SMTP_HOST is required but missing or empty.");
  } else if (/\s/.test(config.host)) {
    errors.push("SMTP_HOST contains invalid whitespace characters.");
  }

  // 2. Port validation
  if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
    errors.push(`SMTP_PORT is invalid (${config.port}). Must be between 1 and 65535.`);
  }

  // 3. Port & Transport Encryption Enforcement
  if (config.port === 465) {
    if (!config.secure) {
      errors.push("Port 465 requires direct TLS (SMTP_SECURE=true). Insecure port 465 configuration rejected.");
    }
  } else if (config.port === 587) {
    if (config.secure) {
      errors.push("Port 587 requires STARTTLS (SMTP_SECURE=false with requireTLS=true), not direct TLS.");
    }
    if (!config.requireTLS) {
      errors.push("Port 587 must mandate STARTTLS (requireTLS=true). Insecure plaintext fallback rejected.");
    }
  } else {
    // Custom ports
    if (!config.secure && !config.requireTLS) {
      if (isProduction) {
        errors.push(`Custom port ${config.port} without TLS (secure=false, requireTLS=false) is forbidden in production.`);
      } else if (process.env.SMTP_ALLOW_INSECURE !== "true") {
        errors.push(`Custom port ${config.port} requires encryption (direct TLS or requireTLS=true). To allow in local development, set SMTP_ALLOW_INSECURE=true.`);
      }
    }
  }

  // 4. Certificate Verification Guard
  if (!config.tlsRejectUnauthorized) {
    if (isProduction) {
      errors.push("Disabling TLS certificate verification (rejectUnauthorized=false) is strictly forbidden in production.");
    }
  }

  // 5. Credentials validation
  if (!config.auth.user) {
    errors.push("SMTP_USER is required for authenticated SMTP transmission.");
  } else if (/[\r\n]/.test(config.auth.user)) {
    errors.push("SMTP_USER contains forbidden newline characters.");
  }

  if (!config.auth.pass) {
    errors.push("SMTP_PASSWORD is required for authenticated SMTP transmission.");
  }

  // 6. Sender Address validation & Header Injection Protection
  if (!config.fromEmail) {
    errors.push("SMTP_FROM_EMAIL is required for outbound envelope sender.");
  } else if (/[\r\n]/.test(config.fromEmail)) {
    errors.push("SMTP_FROM_EMAIL contains forbidden newline characters (header injection risk).");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.fromEmail)) {
    errors.push(`SMTP_FROM_EMAIL "${config.fromEmail}" is not a valid email address.`);
  }

  if (/[\r\n]/.test(config.fromName)) {
    errors.push("SMTP_FROM_NAME contains forbidden newline characters.");
  }

  // 7. Timeout Configuration Validation
  if (config.sendTimeoutMs < 2000 || config.sendTimeoutMs > 60000) {
    errors.push(`SMTP_SEND_TIMEOUT_MS must be between 2000ms and 60000ms (received ${config.sendTimeoutMs}ms).`);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    sanitizedConfig: {
      host: config.host,
      port: config.port,
      secure: config.secure,
      requireTLS: config.requireTLS,
      tlsRejectUnauthorized: config.tlsRejectUnauthorized,
      user: config.auth.user,
      fromEmail: config.fromEmail,
      fromName: config.fromName,
      maxConnections: config.maxConnections,
      maxMessages: config.maxMessages,
      rateLimit: config.rateLimit,
      rateDelta: config.rateDelta,
      connectionTimeout: config.connectionTimeout,
      greetingTimeout: config.greetingTimeout,
      socketTimeout: config.socketTimeout,
      sendTimeoutMs: config.sendTimeoutMs,
    },
  };
}

let cachedTransporter: Transporter | null = null;

/**
 * Creates or retrieves a Nodemailer Transporter instance with validated encryption and connection pooling.
 * Allows injection of a custom transport for testing / mocking.
 */
export function createSmtpTransport(
  options: {
    config?: SmtpConfig;
    customTransport?: Transporter;
    recreate?: boolean;
  } = {}
): Transporter {
  if (options.customTransport) {
    return options.customTransport;
  }

  if (cachedTransporter && !options.recreate && !options.config) {
    return cachedTransporter;
  }

  const config = options.config || getSmtpConfig();
  const validation = validateSmtpConfig(config);
  if (!validation.valid) {
    throw new Error(`Invalid SMTP configuration: ${validation.errors.join("; ")}`);
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
    tls: {
      rejectUnauthorized: config.tlsRejectUnauthorized,
      minVersion: "TLSv1.2",
    },
    pool: true,
    maxConnections: config.maxConnections,
    maxMessages: config.maxMessages,
    rateDelta: config.rateDelta,
    rateLimit: config.rateLimit,
    connectionTimeout: config.connectionTimeout,
    greetingTimeout: config.greetingTimeout,
    socketTimeout: config.socketTimeout,
  });

  if (!options.config) {
    cachedTransporter = transporter;
  }

  return transporter;
}

/**
 * Resets cached transporter (used in test suites)
 */
export function resetCachedTransport(): void {
  cachedTransporter = null;
}
