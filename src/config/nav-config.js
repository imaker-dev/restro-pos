import {
  Home,
  Building2,
  Users,
  CreditCard,
  Package,
  UtensilsCrossed,
  ShoppingCart,
  Receipt,
  BarChart3,
  Settings,
  Shield,
  Table,
  Truck,
  Percent,
  Layers,
  Warehouse,
  Building,
} from "lucide-react";

export const navConfig = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        // roles: ["user"], 
        icon: Home,
        children: [
          { name: "Overview", path: "/" },
          { name: "Sales", path: "/sales" },
        ],
      },
      {
        name: "Analytics",
        icon: BarChart3,
        path: "/analytics",
      },
      {
        name: "Fields",
        icon: BarChart3,
        path: "/fields",
        roles: ["user"], 
        // permissions: ["VIEW_USERS"],
      },
    ],
  },

  {
    title: "Organization",
    items: [
      {
        name: "Outlets / Restaurants",
        icon: Building2,
        path: "/outlets",
      },

      {
        name: "Users & Staff",
        icon: Users,
        path: "/users",
      },
      {
        name: "Roles & Permissions",
        icon: Shield,
        path: "/roles",
      },
    ],
  },

  {
    title: "Menu & Inventory",
    items: [
      {
        name: "Menu Categories",
        icon: UtensilsCrossed,
        path: "/menu/categories",
      },
      {
        name: "Menu Items",
        icon: UtensilsCrossed,
        path: "/menu/items",
      },
      {
        name: "Modifiers / Add-ons",
        icon: Percent,
        path: "/menu/modifiers",
      },
      {
        name: "Inventory",
        icon: Warehouse,
        path: "/inventory",
      },
      {
        name: "Suppliers",
        icon: Truck,
        path: "/suppliers",
      },
      {
        name: "Stock Adjustments",
        icon: Package,
        path: "/stock-adjustments",
      },
    ],
  },

  {
    title: "Operations",
    items: [
      {
        name: "Orders",
        icon: ShoppingCart,
        path: "/orders",
      },
      {
        name: "Tables & Floors",
        icon: Table,
        path: "/tables",
      },
      {
        name: "Kitchen Display (KDS)",
        icon: Receipt,
        path: "/kitchen-display",
      },
      {
        name: "Transactions",
        icon: CreditCard,
        path: "/transactions",
      },
    ],
  },

  {
    title: "Billing & Plans",
    items: [
      {
        name: "Subscriptions",
        icon: CreditCard,
        path: "/subscriptions",
      },
      {
        name: "Packages / Plans",
        icon: Layers,
        path: "/plans",
      },
      {
        name: "Invoices",
        icon: Receipt,
        path: "/invoices",
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        name: "Settings",
        icon: Settings,
        path: "/settings",
      },
      {
        name: "Audit Logs",
        icon: Shield,
        path: "/audit-logs",
      },
    ],
  },
];
