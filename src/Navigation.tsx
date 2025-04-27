import React from "react";
import { Link } from "react-router";
import { ROUTES } from "./Constants";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "./assets/logo.png";
import { NavItem } from "./types/nav";

const navigationItems: NavItem[] = [
  {
    type: "submenu",
    label: "Admin",
    items: [
      {
        label: "Adaugare client",
        description: "Adauga clienti noi in sistem",
        route: ROUTES.ADD_CLIENT,
      },
      {
        label: "Adaugare aparat",
        description: "Inregistreaza aparate noi",
        route: ROUTES.ADD_EQUIPMENT,
      },
      {
        label: "Adaugare piesa",
        description: "Adauga piese in inventar",
        route: ROUTES.ADD_PART,
      },
      {
        label: "Adaugare furnizor",
        description: "Inregistreaza furnizori noi",
        route: ROUTES.ADD_SUPPLIER,
      },
    ],
  },
  {
    type: "link",
    label: "Raport service",
    route: ROUTES.ADD_SERVICE_REPORT,
  },
  {
    type: "link",
    label: "Clienti",
    route: ROUTES.CLIENTS,
  },
  {
    type: "link",
    label: "Aparate",
    route: ROUTES.EQUIPMENT,
  },
  {
    type: "link",
    label: "Piese",
    route: ROUTES.PARTS,
  },
  {
    type: "link",
    label: "Rapoarte",
    route: ROUTES.REPORTS,
  },
];

// Updated Navigation component using the config
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const renderDesktopNav = (item: NavItem) => {
    if (item.type === "link") {
      return (
        <NavigationMenuItem key={item.route}>
          <Link
            to={item.route}
            className="px-4 py-2 text-slate-200 hover:text-white"
          >
            {item.label}
          </Link>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem key={item.label}>
        <NavigationMenuTrigger className="text-slate-800 hover:text-white hover:bg-slate-800">
          {item.label}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid gap-3 p-4 w-[400px] bg-white">
            <div className="grid grid-cols-2 gap-2">
              {item.items.map((subItem) => (
                <NavigationMenuLink asChild key={subItem.route}>
                  <Link
                    to={subItem.route}
                    className="block p-3 space-y-1 hover:bg-slate-100 rounded-md text-slate-900"
                  >
                    <div className="font-medium">{subItem.label}</div>
                    <div className="text-sm text-slate-600">
                      {subItem.description}
                    </div>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  };

  const renderMobileNav = (item: NavItem) => {
    if (item.type === "link") {
      return (
        <Link
          key={item.route}
          to={item.route}
          className="block py-2 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <div key={item.label}>
        <div className="font-medium mb-2">{item.label}</div>
        <div className="pl-4 space-y-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.route}
              to={subItem.route}
              className="block py-2 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <header className="border-b bg-slate-900">
      <div className="container mx-auto px-4 py-1">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-1">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu className="text-slate-200 navigation-no-hover">
              <NavigationMenuList>
                {navigationItems.map(renderDesktopNav)}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
            <Button
              variant="ghost"
              className="text-slate-200 hover:text-white hover:bg-slate-800"
            >
              Sign In
            </Button>
            <Button className="bg-white text-slate-900 hover:bg-slate-100">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 text-slate-200">
            <nav className="space-y-4">
              {navigationItems.map(renderMobileNav)}
              <div className="pt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-slate-200 hover:text-white hover:bg-slate-800"
                >
                  Sign In
                </Button>
                <Button className="w-full justify-center bg-white text-slate-900 hover:bg-slate-100">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
