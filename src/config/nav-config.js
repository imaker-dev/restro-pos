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
        path: "/",
        roles: [ROLES.MANAGER],
      },
      {
        name: "Dashboard",
        icon: Home,
        path: "/",
        roles: [ROLES.KITCHEN, ROLES.BAR],
      },

      // 🔽 NEW REPORTS MENU
      {
        name: "Reports",
        icon: BarChart3,
        roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
        children: [
          {
            name: "Daily Sales",
            path: "/daily-sales",
            roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
          },
          {
            name: "Item Sales",
            path: "/item-sales",
            roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
          },
          {
            name: "Category Sales",
            path: "/category-sales",
            roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
          },
          {
            name: "Staff Sales",
            path: "/staff-sales",
            roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
          },
          {
            name: "Payments Report",
            path: "/payment-mode",
            roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
          },
        ],
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
        roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
      },
      {
        name: "Users & Staff",
        icon: Users,
        path: "/users",
        roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
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
        path: "/categories",
        roles: [ROLES.SUPER_ADMIN],
      },
      {
        name: "Menu Items",
        icon: UtensilsCrossed,
        path: "/items",
        roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
      },
      {
        name: "Modifiers / Add-ons",
        icon: Percent,
        path: "/addons",
        roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
      },
      {
        name: "Inventory",
        icon: Warehouse,
        path: "/inventory",
        roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
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
        path: "/floors",
        roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER],
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
