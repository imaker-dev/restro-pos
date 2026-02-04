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
  icon: Home,
  children: [
    { name: "Overview", path: "/" },
    { name: "Sales", path: "/sales" },
  ],
},
      {
        name: "Analytics",
        icon: BarChart3,
        path: "/super-admin/analytics",
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
        path: "/super-admin/menu/categories",
      },
      {
        name: "Menu Items",
        icon: UtensilsCrossed,
        path: "/super-admin/menu/items",
      },
      {
        name: "Modifiers / Add-ons",
        icon: Percent,
        path: "/super-admin/menu/modifiers",
      },
      {
        name: "Inventory",
        icon: Warehouse,
        path: "/super-admin/inventory",
      },
      {
        name: "Suppliers",
        icon: Truck,
        path: "/super-admin/suppliers",
      },
      {
        name: "Stock Adjustments",
        icon: Package,
        path: "/super-admin/stock-adjustments",
      },
    ],
  },

  {
    title: "Operations",
    items: [
      {
        name: "Orders",
        icon: ShoppingCart,
        path: "/super-admin/orders",
      },
      {
        name: "Tables & Floors",
        icon: Table,
        path: "/super-admin/tables",
      },
      {
        name: "Kitchen Display (KDS)",
        icon: Receipt,
        path: "/super-admin/kitchen-display",
      },
      {
        name: "Transactions",
        icon: CreditCard,
        path: "/super-admin/transactions",
      },
    ],
  },

  {
    title: "Billing & Plans",
    items: [
      {
        name: "Subscriptions",
        icon: CreditCard,
        path: "/super-admin/subscriptions",
      },
      {
        name: "Packages / Plans",
        icon: Layers,
        path: "/super-admin/plans",
      },
      {
        name: "Invoices",
        icon: Receipt,
        path: "/super-admin/invoices",
      },
    ],
  },

  {
    title: "System",
    items: [
      {
        name: "Settings",
        icon: Settings,
        path: "/super-admin/settings",
      },
      {
        name: "Audit Logs",
        icon: Shield,
        path: "/super-admin/audit-logs",
      },
    ],
  },
];
