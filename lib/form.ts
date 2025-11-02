import type { DashboardState } from "@/lib/config";
import type { SectionFormValuesMap } from "@/lib/schema";

const aggregatedValuesByUser: Record<string, SectionFormValuesMap> = {};

function cloneValues<T>(values: T): T {
  return JSON.parse(JSON.stringify(values)) as T;
}

export function initializeUserSectionValues(
  userId: string,
  initialValues: SectionFormValuesMap,
) {
  if (!aggregatedValuesByUser[userId]) {
    aggregatedValuesByUser[userId] = cloneValues(initialValues);
  }
}

export function updateSectionValues<K extends DashboardState>(
  userId: string,
  state: K,
  values: SectionFormValuesMap[K],
) {
  if (!aggregatedValuesByUser[userId]) {
    aggregatedValuesByUser[userId] = {} as SectionFormValuesMap;
  }

  aggregatedValuesByUser[userId][state] = cloneValues(values);
}

export function getAllSectionValues(
  userId: string,
): SectionFormValuesMap | undefined {
  return aggregatedValuesByUser[userId];
}
