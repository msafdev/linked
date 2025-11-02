import type { QueryFunction, UseQueryOptions } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestArgs<TData = unknown> = {
  data?: TData;
  params?: Record<string, unknown>;
};

type QueryParams = Record<string, unknown> | undefined;

export type CrudApi<TData = unknown> = {
  get: (args?: RequestArgs) => Promise<TData>;
  post: (args: RequestArgs) => Promise<TData>;
  put: (args: RequestArgs) => Promise<TData>;
  remove: (args: RequestArgs) => Promise<TData>;
  query: (
    key: string,
    params?: QueryParams,
  ) => UseQueryOptions<TData, unknown, TData, readonly unknown[]>;
};

function logRequest(
  resource: string,
  method: HttpMethod,
  payload?: RequestArgs,
) {
  const timestamp = new Date().toISOString();
  // Placeholder for Supabase request
  // eslint-disable-next-line no-console
  console.info(
    `[Supabase][${resource.toUpperCase()}][${method}] @ ${timestamp}`,
    payload ?? {},
  );

  return {
    ok: true,
    resource,
    method,
    payload,
  } as unknown;
}

export function createCrudApi<TData = unknown>(
  resource: string,
): CrudApi<TData> {
  return {
    async get(args) {
      return logRequest(resource, "GET", args) as TData;
    },
    async post(args) {
      return logRequest(resource, "POST", args) as TData;
    },
    async put(args) {
      return logRequest(resource, "PUT", args) as TData;
    },
    async remove(args) {
      return logRequest(resource, "DELETE", args) as TData;
    },
    query(key, params) {
      return queryOptions({
        queryKey: [resource, key, params],
        queryFn: (async () =>
          logRequest(resource, "GET", {
            params,
          }) as TData) as QueryFunction<TData>,
      });
    },
  };
}
