import type { PortfolioTemplateId } from "@/types/portfolio-template";

export type PortfolioTemplateMetadata = {
  id: PortfolioTemplateId;
  label: string;
  description: string;
};

export const PORTFOLIO_TEMPLATE_METADATA: Record<
  PortfolioTemplateId,
  Omit<PortfolioTemplateMetadata, "id">
> = {
  read: {
    label: "Read",
    description: "Clean timeline layout for structured multi-section profiles.",
  },
  bento: {
    label: "Bento",
    description: "Card-driven grid layout with a strong visual hierarchy.",
  },
};

export const PORTFOLIO_TEMPLATE_OPTIONS: PortfolioTemplateMetadata[] =
  Object.entries(PORTFOLIO_TEMPLATE_METADATA).map(
    ([id, metadata]) =>
      ({
        id: id as PortfolioTemplateId,
        ...metadata,
      }) satisfies PortfolioTemplateMetadata,
  );
