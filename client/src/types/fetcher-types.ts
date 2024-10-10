export type Options = {
  headers?: HTTPHeaders;
  body?: Record<string, unknown> | string | FormData | undefined;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | (string & {});
  credentials?: "omit" | "same-origin" | "include";
  baseUrl?: string;
  signal?: AbortSignal;
};

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Credit: https://github.com/elysiajs/elysia/blob/main/src/types.ts
export type HTTPHeaders = Record<string, string> & {
  // Authentication
  "www-authenticate"?: string;
  authorization?: string;
  "proxy-authenticate"?: string;
  "proxy-authorization"?: string;

  // Caching
  age?: string;
  "cache-control"?: string;
  "clear-site-data"?: string;
  expires?: string;
  "no-vary-search"?: string;
  pragma?: string;

  // Conditionals
  "last-modified"?: string;
  etag?: string;
  "if-match"?: string;
  "if-none-match"?: string;
  "if-modified-since"?: string;
  "if-unmodified-since"?: string;
  vary?: string;

  // Connection management
  connection?: string;
  "keep-alive"?: string;

  // Content negotiation
  accept?: string;
  "accept-encoding"?: string;
  "accept-language"?: string;

  // Controls
  expect?: string;
  "max-forwards"?: string;

  // Cokies
  cookie?: string;
  "set-cookie"?: string | string[];

  // CORS
  "access-control-allow-origin"?: string;
  "access-control-allow-credentials"?: string;
  "access-control-allow-headers"?: string;
  "access-control-allow-methods"?: string;
  "access-control-expose-headers"?: string;
  "access-control-max-age"?: string;
  "access-control-request-headers"?: string;
  "access-control-request-method"?: string;
  origin?: string;
  "timing-allow-origin"?: string;

  // Downloads
  "content-disposition"?: string;

  // Message body information
  "content-length"?: string;
  "content-type"?: BaseMime | (string & {});
  "content-encoding"?: string;
  "content-language"?: string;
  "content-location"?: string;

  // Proxies
  forwarded?: string;
  via?: string;

  // Redirects
  location?: string;
  refresh?: string;

  // Request context
  // from?: string
  // host?: string
  // referer?: string
  // 'user-agent'?: string

  // Response context
  allow?: string;
  server?: "Elysia" | (string & {});

  // Range requests
  "accept-ranges"?: string;
  range?: string;
  "if-range"?: string;
  "content-range"?: string;

  // Security
  "content-security-policy"?: string;
  "content-security-policy-report-only"?: string;
  "cross-origin-embedder-policy"?: string;
  "cross-origin-opener-policy"?: string;
  "cross-origin-resource-policy"?: string;
  "expect-ct"?: string;
  "permission-policy"?: string;
  "strict-transport-security"?: string;
  "upgrade-insecure-requests"?: string;
  "x-content-type-options"?: string;
  "x-frame-options"?: string;
  "x-xss-protection"?: string;

  // Server-sent events
  "last-event-id"?: string;
  "ping-from"?: string;
  "ping-to"?: string;
  "report-to"?: string;

  // Transfer coding
  te?: string;
  trailer?: string;
  "transfer-encoding"?: string;

  // Other
  "alt-svg"?: string;
  "alt-used"?: string;
  date?: string;
  dnt?: string;
  "early-data"?: string;
  "large-allocation"?: string;
  link?: string;
  "retry-after"?: string;
  "service-worker-allowed"?: string;
  "source-map"?: string;
  upgrade?: string;

  // Non-standard
  "x-dns-prefetch-control"?: string;
  "x-forwarded-for"?: string;
  "x-forwarded-host"?: string;
  "x-forwarded-proto"?: string;
  "x-powered-by"?: "Elysia" | (string & {});
  "x-request-id"?: string;
  "x-requested-with"?: string;
  "x-robots-tag"?: string;
  "x-ua-compatible"?: string;
};

export type BaseMime =
  | "audio/aac"
  | "video/x-msvideo"
  | "image/avif"
  | "video/av1"
  | "application/octet-stream"
  | "image/bmp"
  | "text/css"
  | "text/csv"
  | "application/vnd.ms-fontobject"
  | "application/epub+zip"
  | "image/gif"
  | "application/gzip"
  | "text/html"
  | "image/x-icon"
  | "text/calendar"
  | "image/jpeg"
  | "text/javascript"
  | "application/json"
  | "application/ld+json"
  | "audio/x-midi"
  | "audio/mpeg"
  | "video/mp4"
  | "video/mpeg"
  | "audio/ogg"
  | "video/ogg"
  | "application/ogg"
  | "audio/opus"
  | "font/otf"
  | "application/pdf"
  | "image/png"
  | "application/rtf"
  | "image/svg+xml"
  | "image/tiff"
  | "video/mp2t"
  | "font/ttf"
  | "text/plain"
  | "application/wasm"
  | "video/webm"
  | "audio/webm"
  | "image/webp"
  | "font/woff"
  | "font/woff2"
  | "application/xhtml+xml"
  | "application/xml"
  | "application/zip"
  | "video/3gpp"
  | "video/3gpp2"
  | "model/gltf+json"
  | "model/gltf-binary";

export interface APIFetcherConfig {
  baseUrl?: string;
  headers?: HTTPHeaders;
  credentials?: Options["credentials"];
}

export type APISchema = Record<
  string,
  Partial<
    Record<
      "get" | "post" | "put" | "delete" | "patch",
      {
        error: unknown;
        success: unknown;
        body?: unknown;
      }
    >
  >
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ExtractParams<T extends string> = T extends `${string}://${infer _}`
  ? never
  : T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<`/${Rest}`>]: string }
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : never;
