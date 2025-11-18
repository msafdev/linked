import { JSX } from "react";

import type { MenuSessionState } from "@/components/menu";

import type { ReadCV } from "@/types/cv";

export type PortfolioTemplateProps = {
  portfolio: ReadCV;
  menuSessionState: MenuSessionState;
};

export type PortfolioTemplateComponent = (
  props: PortfolioTemplateProps,
) => JSX.Element;
