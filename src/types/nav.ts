type NavItemType = "link" | "submenu";

interface BaseNavItem {
  type: NavItemType;
  label: string;
}

interface NavLink extends BaseNavItem {
  type: "link";
  route: string;
}

interface NavSubmenu extends BaseNavItem {
  type: "submenu";
  items: {
    label: string;
    description: string;
    route: string;
  }[];
}

export type NavItem = NavLink | NavSubmenu;
