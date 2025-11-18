import type { MenuSessionState } from "@/components/menu";
import type { ReadCV } from "@/types/cv";
import { JSX } from "react";

export type PortfolioTemplateProps = {
  portfolio: ReadCV;
  menuSessionState: MenuSessionState;
};

export type PortfolioTemplateComponent = (
  props: PortfolioTemplateProps,
) => JSX.Element;
