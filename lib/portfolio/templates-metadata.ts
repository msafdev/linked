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
  classic: {
    label: "Classic",
    description:
      "Timeline layout with balanced typography for multi-section portfolios.",
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
