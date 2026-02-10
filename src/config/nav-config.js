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
  Info,
  ReceiptIndianRupee,
} from "lucide-react";
import { ROLES } from "../constants";

export const navConfig = [
  {
    title: "Overview",
    roles: [ROLES.SUPER_ADMIN],
    items: [
      {
        name: "Dashboard",
        icon: Home,
        roles: [ROLES.SUPER_ADMIN],
        children: [
          { name: "Overview", path: "/", roles: [ROLES.SUPER_ADMIN] },
          { name: "Sales", path: "/sales", roles: [ROLES.SUPER_ADMIN] },
        ],
      },
      {
        name: "Dashboard",
        icon: Home,
        path: "/", // always /
        roles: [ROLES.KITCHEN,ROLES.BAR],
      },
      {
        name: "Analytics",
        icon: BarChart3,
        path: "/analytics",
        roles: [ROLES.SUPER_ADMIN],
      },
    ],
  },

  {
    title: "Organization",
    roles: [ROLES.SUPER_ADMIN],
    items: [
      {
        name: "Outlets / Restaurants",
        icon: Building2,
        path: "/outlets",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Users & Staff",
        icon: Users,
        path: "/users",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Roles & Permissions",
        icon: Shield,
        path: "/roles",
        roles: [ROLES.SUPER_ADMIN],
      },
    ],
  },

  {
    title: "Menu & Inventory",
    roles: [ROLES.SUPER_ADMIN],
    items: [
      {
        name: "Menu Categories",
        icon: UtensilsCrossed,
        path: "/menu/categories",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Menu Items",
        icon: UtensilsCrossed,
        path: "/menu/items",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Modifiers / Add-ons",
        icon: Percent,
        path: "/menu/modifiers",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Inventory",
        icon: Warehouse,
        path: "/inventory",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Suppliers",
        icon: Truck,
        path: "/suppliers",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Stock Adjustments",
        icon: Package,
        path: "/stock-adjustments",
        roles: [ROLES.SUPER_ADMIN],
      },
    ],
  },

  {
    title: "Operations",
    roles: [ROLES.SUPER_ADMIN],
    items: [
      {
        name: "Orders",
        icon: ShoppingCart,
        path: "/orders",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Tables & Floors",
        icon: Table,
        path: "/tables",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Order Display",
        icon: ReceiptIndianRupee,
        path: "/kitchen-display",
        roles: [ROLES.KITCHEN, ROLES.BAR],
      },

      {
        name: "Transactions",
        icon: CreditCard,
        path: "/transactions",
        roles: [ROLES.SUPER_ADMIN],
      },
    ],
  },

  {
    title: "Billing & Plans",
    roles: [ROLES.SUPER_ADMIN],
    items: [
      {
        name: "Subscriptions",
        icon: CreditCard,
        path: "/subscriptions",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Packages / Plans",
        icon: Layers,
        path: "/plans",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Invoices",
        icon: Receipt,
        path: "/invoices",
        roles: [ROLES.SUPER_ADMIN],
      },
    ],
  },

  {
    title: "System",
    roles: [ROLES.SUPER_ADMIN],
    items: [
      {
        name: "Settings",
        icon: Settings,
        path: "/settings",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Audit Logs",
        icon: Shield,
        path: "/audit-logs",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Help",
        path: "/help",
        icon: Info,
        public: true,
      },
    ],
  },
];
