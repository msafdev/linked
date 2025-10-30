import type { DashboardState } from "./dashboard-config";
import {
  sectionInitialValues,
  type SectionInitialValuesMap,
} from "./dashboard-forms";

const aggregatedValues: SectionInitialValuesMap = JSON.parse(
  JSON.stringify(sectionInitialValues)
) as SectionInitialValuesMap;

export function updateSectionValues<K extends DashboardState>(
  state: K,
  values: SectionInitialValuesMap[K]
) {
  aggregatedValues[state] = values;
}

export function getAllSectionValues(): SectionInitialValuesMap {
  return aggregatedValues;
}
