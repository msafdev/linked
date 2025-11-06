import {
  DEFAULT_PORTFOLIO_TEMPLATE_ID,
  PORTFOLIO_TEMPLATE_IDS,
  type PortfolioTemplateId,
} from "@/types/portfolio-template";

import { ClassicPortfolioTemplate } from "./classic-template";
import type {
  PortfolioTemplateComponent,
  PortfolioTemplateProps,
} from "./types";

const TEMPLATE_COMPONENTS: Record<
  PortfolioTemplateId,
  PortfolioTemplateComponent
> = {
  classic: ClassicPortfolioTemplate,
};

const isTemplateId = (value: unknown): value is PortfolioTemplateId => {
  return (
    typeof value === "string" &&
    (PORTFOLIO_TEMPLATE_IDS as readonly string[]).includes(value)
  );
};

export function resolvePortfolioTemplateComponent(
  templateId: unknown,
): PortfolioTemplateComponent {
  const resolvedId = isTemplateId(templateId)
    ? templateId
    : DEFAULT_PORTFOLIO_TEMPLATE_ID;
  return TEMPLATE_COMPONENTS[resolvedId];
}

export type { PortfolioTemplateProps };
