import React from "react";
import Dashboard from "../pages/Dashboard";
import AllProductsPage from "../pages/product/AllProductsPage";
import AllOutletsPage from "../pages/outlets/AllOutletsPage";
import Fields from "../pages/Fields";
import AllUsersPage from "../pages/users/AllUsersPage";
import CreateUserPage from "../pages/users/CreateUserPage";
import OutletAllFloors from "../pages/outlets/OutletAllFloors";
import FloorAllTables from "../pages/outlets/FloorAllTables";
import AllCategoriesPage from "../pages/categories/AllCategoriesPage";
import AllItemsPage from "../pages/items/AllItemsPage";

const routeConfig = [
  { path: "/", element: Dashboard },
  { path: "/products", element: AllProductsPage },

  
  { path: "/outlets", element: AllOutletsPage },
  
  { path: "/outlets/categories", element: AllCategoriesPage },
  { path: "/outlets/categories/items", element: AllItemsPage },

  { path: "/outlets/floors", element: OutletAllFloors },
  { path: "/outlets/floors/tables", element: FloorAllTables },

  { path: "/users", element: AllUsersPage },
  { path: "/users/add", element: CreateUserPage },

  
  { path: "/fields", element: Fields },


];

export default routeConfig;
