import type {
  APIFetcherConfig,
  APISchema,
  ExtractParams,
  HTTPHeaders,
  Options,
  Prettify,
} from "../types/fetcher-types";

export class APIFetcher<TRoutes extends APISchema> {
  private baseUrl: string;
  private headers: HTTPHeaders;
  private credentials: Options["credentials"];

  constructor(config: APIFetcherConfig = {}) {
    const { baseUrl = "", credentials, headers = {} } = config;
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.headers = headers;
    this.credentials = credentials;
  }

  private replaceUrlParams(url: string, params: Record<string, string>) {
    return url.replace(/:(\w+)/g, (_, key) => {
      if (params[key] === undefined) {
        throw new Error(`Missing URL parameter: ${key}`);
      }
      return encodeURIComponent(params[key]);
    });
  }

  private async fetchData<TResponse, TError>(
    url: string,
    type: "json" | "text",
    opts: Options & {
      params?: Record<string, string>;
      queryParams?: Record<string, unknown>;
    },
  ) {
    const {
      body,
      method = "GET",
      headers: customHeaders,
      params = {},
      queryParams = {},
    } = opts;
    const headers = { ...this.headers, ...customHeaders };
    const requestBody = this.prepareRequestBody(body, headers);
    const baseUrl = opts.baseUrl ?? this.baseUrl;
    const credentials = opts.credentials ?? this.credentials;

    const queryParamsValueAsString = Object.fromEntries(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)]),
    );
    const searchParams = new URLSearchParams(
      queryParamsValueAsString,
    ).toString();

    const fullUrl = `${baseUrl}${this.replaceUrlParams(url, params)}${
      searchParams ? `?${searchParams}` : ""
    }`;

    const response = await fetch(fullUrl, {
      method,
      headers,
      credentials,
      signal: opts.signal,
      body: requestBody,
    });
    const data =
      type === "json" ? await response.json() : await response.text();

    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      type: response.type,
      url: response.url,
    };

    if (!response.ok)
      return { ...result, data: data as Prettify<TError>, ok: false as const };

    return {
      ...result,
      data: data as Prettify<TResponse>,
      ok: true as const,
    };
  }

  private prepareRequestBody(body: Options["body"], headers: HTTPHeaders) {
    if (body && typeof body === "object" && !(body instanceof FormData)) {
      headers["content-type"] = "application/json";
      return JSON.stringify(body);
    }
    return body;
  }

  private createMethod<
    TMethod extends "get" | "post" | "put" | "delete" | "patch",
  >(method: TMethod) {
    return <
      T extends
        | keyof {
            [K in keyof TRoutes as TMethod extends keyof TRoutes[K]
              ? K
              : never]: unknown;
          }
        | (string & Record<string, unknown>),
    >(
      url: T,
      ...args: ExtractParams<T> extends Record<string, never>
        ? [
            opts?: Omit<Options, "method" | "params" | "body"> &
              (TMethod extends "get"
                ? Record<string, unknown>
                : TRoutes[T][TMethod] extends { body: infer TBody }
                  ? {
                      body: TBody extends
                        | string
                        | FormData
                        | Record<string, unknown>
                        ? TBody
                        : never;
                    }
                  : { body?: Record<string, unknown> | string | FormData }) &
              (TRoutes[T][TMethod] extends { queryParams: infer TQuery }
                ? {
                    queryParams?: TQuery extends Record<string, unknown>
                      ? Partial<TQuery>
                      : never;
                  }
                : { queryParams?: Record<string, unknown> }),
          ]
        : [
            opts: Omit<Options, "method" | "params" | "body"> & {
              params: ExtractParams<T>;
            } & (TMethod extends "get"
                ? Record<string, unknown>
                : TRoutes[T][TMethod] extends { body: infer TBody }
                  ? {
                      body: TBody extends
                        | string
                        | FormData
                        | Record<string, unknown>
                        ? TBody
                        : never;
                    }
                  : { body?: Record<string, unknown> | string | FormData }) &
              (TRoutes[T][TMethod] extends { queryParams: infer TQuery }
                ? {
                    queryParams?: TQuery extends Record<string, unknown>
                      ? Partial<TQuery>
                      : never;
                  }
                : { queryParams?: Record<string, unknown> }),
          ]
    ) => {
      type Route = TRoutes[T];
      type ResultType =
        Route extends Record<TMethod, infer TRoute>
          ? TRoute extends { success: infer TSuccess }
            ? TSuccess
            : unknown
          : unknown;
      type ErrorType =
        Route extends Record<TMethod, infer TRoute>
          ? TRoute extends { error: infer TError }
            ? TError
            : unknown
          : unknown;

      if (typeof url !== "string") {
        throw new Error("The URL must be a string.");
      }

      const [opts] = args;

      return {
        json: <CustomResultType = ResultType, CustomErrorType = ErrorType>() =>
          this.fetchData<CustomResultType, CustomErrorType>(url, "json", {
            ...opts,
            method,
          }),
        text: () =>
          this.fetchData<string, ErrorType>(url, "text", { ...opts, method }),
      };
    };
  }

  get = this.createMethod("get");
  post = this.createMethod("post");
  put = this.createMethod("put");
  delete = this.createMethod("delete");
  patch = this.createMethod("patch");
}

export const api = new APIFetcher();
