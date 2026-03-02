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
  Utensils,
  SlidersHorizontal,
  Monitor,
  Printer,
  Smartphone,
  XCircle,
} from "lucide-react";
import { ROLES } from "../constants";

export const navConfig = [
  {
    title: "Overview",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    items: [
      {
        name: "Dashboard",
        icon: Home,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        children: [
          {
            name: "Overview",
            path: "/",
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
          },
          {
            name: "Sales",
            path: "/sales",
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
          },
        ],
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
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        children: [
          {
            name: "Daily Sales",
            path: "/daily-sales",
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Item Sales",
            path: "/item-sales",
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Category Sales",
            path: "/category-sales",
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Staff Sales",
            path: "/staff-sales",
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Payments Report",
            path: "/payment-mode",
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Tax Report",
            path: "/tax-report",
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Service Type Breakdown",
            icon: BarChart3,
            path: "/service-type-breakdown",
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Station Sales",
            path: "/station-sales",
            icon: Monitor,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Section Sales",
            path: "/section-sales",
            icon: Layers, // better than Users
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Cancellation Report",
            path: "/cancellation-report",
            icon: XCircle,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
        ],
      },
    ],
  },
  {
    title: "Daily Operations",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    items: [
      {
        name: "Running Orders",
        icon: ReceiptIndianRupee,
        path: "/running-orders",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Running Tables",
        icon: ReceiptIndianRupee,
        path: "/running-tables",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Shift Summary",
        icon: Layers,
        path: "/shift-history",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Day End Summary",
        icon: ReceiptIndianRupee,
        path: "/day-end-summary",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
    ],
  },
  {
    title: "Organization",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    items: [
      {
        name: "Outlets / Restaurants",
        icon: Building2,
        path: "/outlets",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        name: "Users & Staff",
        icon: Users,
        path: "/users",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      // {
      //   name: "Roles & Permissions",
      //   icon: Shield,
      //   path: "/roles",
      //   roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN],
      // },
    ],
  },

  {
    title: "Menu & Inventory",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    items: [
      {
        name: "Menu Categories",
        icon: UtensilsCrossed,
        path: "/categories",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Menu Items",
        icon: Utensils,
        path: "/items",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Modifiers / Add-ons",
        icon: SlidersHorizontal,
        path: "/addons",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Tax Groups",
        icon: Percent,
        path: "/tax-groups",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      // {
      //   name: "Inventory",
      //   icon: Warehouse,
      //   path: "/inventory",
      //   roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER],
      // },
      // {
      //   name: "Suppliers",
      //   icon: Truck,
      //   path: "/suppliers",
      //   roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN],
      // },
      // {
      //   name: "Stock Adjustments",
      //   icon: Package,
      //   path: "/stock-adjustments",
      //   roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN],
      // },
    ],
  },

  {
    title: "Operations",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    items: [
      {
        name: "Orders",
        icon: ShoppingCart,
        path: "/orders",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },

      {
        name: "Customers",
        icon: Users,
        path: "/customers",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },

      {
        name: "Stations",
        icon: Monitor,
        path: "/stations",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },

      {
        name: "Printers",
        icon: Printer,
        path: "/printers",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },

      {
        name: "Tables & Floors",
        icon: Table,
        path: "/floors",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Order Display",
        icon: ReceiptIndianRupee,
        path: "/order-display",
        roles: [ROLES.KITCHEN, ROLES.BAR],
      },

      // {
      //   name: "Transactions",
      //   icon: CreditCard,
      //   path: "/transactions",
      //   roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN],
      // },
    ],
  },

  {
    title: "System",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    items: [
      {
        name: "Settings",
        icon: Settings,
        path: "/settings",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        name: "App Versions",
        icon: Smartphone,
        path: "/versions",
        roles: [ROLES.SUPER_ADMIN],
      },
      // {
      //   name: "Audit Logs",
      //   icon: Shield,
      //   path: "/audit-logs",
      //   roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN],
      // },
      {
        name: "Guide",
        path: "/guide",
        icon: Info,
        public: true,
      },
    ],
  },
];
