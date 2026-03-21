import {
  Home,
  Building2,
  Users,
  CreditCard,
  Package,
  UtensilsCrossed,
  ShoppingCart,
  ReceiptText,
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
  CalendarDays,
  PieChart,
  Clock,
  CalendarCheck,
  LayoutGrid,
  Image,
  BadgeIndianRupee,
  ClipboardList,
  FlaskConical,
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

      {
        name: "Reports",
        icon: BarChart3,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        children: [
          {
            name: "Daily Sales",
            path: "/daily-sales",
            icon: CalendarDays,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Item Sales",
            path: "/item-sales",
            icon: Package,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Category Sales",
            path: "/category-sales",
            icon: Layers,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Staff Sales",
            path: "/staff-sales",
            icon: Users,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Payments Report",
            path: "/payment-mode",
            icon: CreditCard,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Tax Report",
            path: "/tax-report",
            icon: Percent,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Service Type Breakdown",
            path: "/service-type-breakdown",
            icon: PieChart,
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
            icon: Layers,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "Due Report",
            path: "/due-report",
            icon: BadgeIndianRupee,
            roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
          },
          {
            name: "NC (No Charge) Report",
            path: "/nc-report",
            icon: ReceiptIndianRupee,
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
  title: "Inventory",
  roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
  items: [
    // ─────────── DASHBOARD ───────────
    {
      name: "Stock Overview",
      icon: Warehouse,
      path: "/inventory",
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    },

    // ─────────── OPERATIONS ───────────
    {
      name: "Operations",
      icon: BarChart3,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      children: [
        {
          name: "Stock Movements",
          icon: BarChart3,
          path: "/inventory-movements",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          name: "Purchase Orders",
          icon: ReceiptText,
          path: "/purchase-orders",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          name: "Vendors",
          icon: Truck,
          path: "/inventory-vendors",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        },
        {
         name: "Inventory Wastage",
          icon: Truck,
          path: "/inventory-wastage",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        },
      ],
    },

    // ─────────── PRODUCTION / RECIPES ───────────
    {
      name: "Production",
      icon: ClipboardList,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      children: [
        {
          name: "Recipes",
          icon: ClipboardList,
          path: "/recipes",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          name: "Prep Recipes",
          icon: FlaskConical,
          path: "/prep-recipes",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        },
      ],
    },

    // ─────────── MASTER DATA / SETUP ───────────
    {
      name: "Setup",
      icon: Layers,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      children: [
        {
          name: "Items",
          icon: Package,
          path: "/inventory-items",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          name: "Ingredients",
          icon: Package,
          path: "/ingredients",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          name: "Categories",
          icon: Layers,
          path: "/inventory-categories",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
        },
        {
          name: "Units",
          icon: Layers,
          path: "/inventory/units",
          roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
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
        icon: ShoppingCart,
        path: "/running-orders",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Running Tables",
        icon: Table,
        path: "/running-tables",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Shift Summary",
        icon: Clock,
        path: "/shift-history",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Day End Summary",
        icon: CalendarCheck,
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
        name: "Outlet Logo",
        path: "/outlet-logo",
        icon: Image,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
      {
        name: "Users & Staff",
        icon: Users,
        path: "/users",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
    ],
  },

  {
    title: "Menu & Inventory",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
    items: [
      {
        name: "Menu Categories",
        icon: Layers,
        path: "/categories",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Menu Items",
        icon: UtensilsCrossed,
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
      {
        name: "NC (No Charge) Reasons",
        icon: XCircle,
        path: "/nc-reasons",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
      },
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
        icon: LayoutGrid,
        path: "/floors",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MANAGER],
      },
      {
        name: "Order Display",
        icon: Monitor,
        path: "/order-display",
        roles: [ROLES.KITCHEN, ROLES.BAR],
      },
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
      {
        name: "Guide",
        icon: Info,
        path: "/guide",
        public: true,
      },
    ],
  },
];
