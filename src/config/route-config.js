import React from "react";
import Dashboard from "../pages/Dashboard";
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

const routeConfig = [
  { path: "/", element: Dashboard },
  { path: "/kitchen-display", element: KitchenDisplayPage },

  { path: "/products", element: AllProductsPage },

  { path: "/outlets", element: AllOutletsPage },

  { path: "/outlets/categories", element: AllCategoriesPage },
  { path: "/outlets/categories/items", element: AllItemsPage },

  { path: "/outlets/floors", element: OutletAllFloors },
  { path: "/outlets/floors/sections", element: AllSectionsPage },
  { path: "/outlets/floors/tables", element: FloorAllTables },

  { path: "/items/add", element: AddItemPage },

  { path: "/users", element: AllUsersPage },
  { path: "/users/add", element: AddUserPage },

  {
    path: "/fields",
    element: Fields,
    roles: ["user"],
    // permissions: ["ADD_ITEM"],
  },

  { path: "/settings", element: AllSettingsPage },
  { path: "/settings/tax-types", element: AllTaxGroupsPage },
  { path: "/settings/tax-types/tax", element: TaxGroupDetailsPage },
];

export default routeConfig;
