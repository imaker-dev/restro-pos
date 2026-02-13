import React from "react";
import AllOutletsPage from "../pages/outlets/AllOutletsPage";
import Fields from "../pages/Fields";
import AllUsersPage from "../pages/users/AllUsersPage";
import AllCategoriesPage from "../pages/categories/AllCategoriesPage";
import AllItemsPage from "../pages/items/AllItemsPage";
import AddItemPage from "../pages/items/AddItemPage";
import AllSettingsPage from "../pages/settings/AllSettingsPage";
import AllTaxGroupsPage from "../pages/settings/taxes/AllTaxGroupsPage";
import TaxGroupDetailsPage from "../pages/settings/taxes/TaxGroupDetailsPage";
import AddUserPage from "../pages/users/AddUserPage";
import KitchenDisplayPage from "../pages/kitchen-display/KitchenDisplayPage";
import { ROLES } from "../constants";
import Dashboard from "../pages/dashboard/Dashboard";
import OrderDashboard from "../pages/dashboard/OrderDashboard";
import AllTablesPage from "../pages/outlets/AllTablesPage";
import AllAddonsGroup from "../pages/addons/AllAddonsGroup";
import AllAddonItemsPage from "../pages/addons/AllAddonItemsPage";
import AllFloorsPage from "../pages/outlets/AllFloorsPage";
import DailySalesReport from "../pages/reports/DailySalesReport";
import AllSectionsPage from "../pages/outlets/AllSectionsPage";

const routeConfig = [
  // { path: "/", element: Dashboard, roles: [ROLES.SUPER_ADMIN] },
  {
    path: "/",
    elements: {
      [ROLES.SUPER_ADMIN]: Dashboard,
      [ROLES.KITCHEN]: OrderDashboard,
      [ROLES.BAR]: OrderDashboard,
    },
    roles: [ROLES.SUPER_ADMIN, ROLES.KITCHEN, ROLES.BAR],
  },
  {
    path: "/kitchen-display",
    element: KitchenDisplayPage,
    roles: [ROLES.BAR, ROLES.KITCHEN],
  },

  { path: "/reports/daily-sales", element: DailySalesReport, roles: [ROLES.SUPER_ADMIN] },
  
  { path: "/outlets", element: AllOutletsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/categories", element: AllCategoriesPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/items", element: AllItemsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/items/add", element: AddItemPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/floors", element: AllFloorsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/floors/sections", element: AllSectionsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/floors/tables", element: AllTablesPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/addons", element: AllAddonsGroup, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/addons/item", element: AllAddonItemsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/users", element: AllUsersPage, roles: [ROLES.SUPER_ADMIN] },
  { path: "/users/add", element: AddUserPage, roles: [ROLES.SUPER_ADMIN] },







  {
    path: "/fields",
    element: Fields,
    roles: [ROLES.SUPER_ADMIN], // override old user role
  },

  { path: "/settings", element: AllSettingsPage, roles: [ROLES.SUPER_ADMIN] },
  {
    path: "/settings/tax-types",
    element: AllTaxGroupsPage,
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    path: "/settings/tax-types/tax",
    element: TaxGroupDetailsPage,
    roles: [ROLES.SUPER_ADMIN],
  },
];

export default routeConfig;
