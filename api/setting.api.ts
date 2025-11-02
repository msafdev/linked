import { createCrudApi } from "./base.api";

export const settingApi = createCrudApi("setting");

export const settingQueryKeys = {
  all: () => ["setting"] as const,
  domain: (userId: string) => ["setting", "domain", userId] as const,
};
