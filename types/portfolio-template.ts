export const PORTFOLIO_TEMPLATE_IDS = ["classic"] as const;

export type PortfolioTemplateId = (typeof PORTFOLIO_TEMPLATE_IDS)[number];

export const DEFAULT_PORTFOLIO_TEMPLATE_ID: PortfolioTemplateId = "classic";
