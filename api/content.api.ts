import { createCrudApi } from "./base.api";

export const contentApi = createCrudApi("content");

export const contentQueryKeys = {
  all: () => ["content"] as const,
  listByType: (type: string) => ["content", type] as const,
};
