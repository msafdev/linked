export const PORTFOLIO_TEMPLATE_IDS = ["read", "bento"] as const;

export type PortfolioTemplateId = (typeof PORTFOLIO_TEMPLATE_IDS)[number];

export const DEFAULT_PORTFOLIO_TEMPLATE_ID: PortfolioTemplateId = "read";
