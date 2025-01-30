import { JSX } from "react";

export type NavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: NavItem[];
  bottom?: boolean;
};

export type MessageTypes = "success" | "error";
