import React from "react";
import AllProductsPage from "../pages/product/AllProductsPage";
import AllOutletsPage from "../pages/outlets/AllOutletsPage";
import Fields from "../pages/Fields";
import AllUsersPage from "../pages/users/AllUsersPage";
import OutletAllFloors from "../pages/outlets/OutletAllFloors";
import FloorAllTables from "../pages/outlets/FloorAllTables";
import AllCategoriesPage from "../pages/categories/AllCategoriesPage";
import AllItemsPage from "../pages/items/AllItemsPage";
import AllSectionsPage from "../pages/sections/AllSectionsPage";
import AddItemPage from "../pages/items/AddItemPage";
import AllSettingsPage from "../pages/settings/AllSettingsPage";
import AllTaxGroupsPage from "../pages/settings/taxes/AllTaxGroupsPage";
import TaxGroupDetailsPage from "../pages/settings/taxes/TaxGroupDetailsPage";
import AddUserPage from "../pages/users/AddUserPage";
import KitchenDisplayPage from "../pages/kitchen-display/KitchenDisplayPage";
import { ROLES } from "../constants";
import KitchenDashboard from "../pages/dashboard/KitchenDashboard";
import Dashboard from "../pages/dashboard/Dashboard";

const routeConfig = [
  // { path: "/", element: Dashboard, roles: [ROLES.SUPER_ADMIN] },
    {
    path: "/",
    elements: {
      [ROLES.SUPER_ADMIN]: Dashboard,
      [ROLES.KITCHEN]: KitchenDashboard,
    },
    roles: [ROLES.SUPER_ADMIN, ROLES.KITCHEN],
  },
  { path: "/kitchen-display", element: KitchenDisplayPage, roles: [ROLES.KITCHEN] },

  { path: "/products", element: AllProductsPage, roles: [ROLES.SUPER_ADMIN] },

  { path: "/outlets", element: AllOutletsPage, roles: [ROLES.SUPER_ADMIN] },

  { path: "/outlets/categories", element: AllCategoriesPage, roles: [ROLES.SUPER_ADMIN] },
  { path: "/outlets/categories/items", element: AllItemsPage, roles: [ROLES.SUPER_ADMIN] },

  { path: "/outlets/floors", element: OutletAllFloors, roles: [ROLES.SUPER_ADMIN] },
  { path: "/outlets/floors/sections", element: AllSectionsPage, roles: [ROLES.SUPER_ADMIN] },
  { path: "/outlets/floors/tables", element: FloorAllTables, roles: [ROLES.SUPER_ADMIN] },

  { path: "/items/add", element: AddItemPage, roles: [ROLES.SUPER_ADMIN] },

  { path: "/users", element: AllUsersPage, roles: [ROLES.SUPER_ADMIN] },
  { path: "/users/add", element: AddUserPage, roles: [ROLES.SUPER_ADMIN] },

  {
    path: "/fields",
    element: Fields,
    roles: [ROLES.SUPER_ADMIN], // override old user role
  },

  { path: "/settings", element: AllSettingsPage, roles: [ROLES.SUPER_ADMIN] },
  { path: "/settings/tax-types", element: AllTaxGroupsPage, roles: [ROLES.SUPER_ADMIN] },
  { path: "/settings/tax-types/tax", element: TaxGroupDetailsPage, roles: [ROLES.SUPER_ADMIN] },
];


export default routeConfig;
