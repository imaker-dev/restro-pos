import React from "react";
import AllOutletsPage from "../pages/outlets/AllOutletsPage";
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
import AllSectionsPage from "../pages/outlets/AllSectionsPage";
import TableHistoryPage from "../pages/tables/TableHistoryPage";
import TableReportPage from "../pages/tables/TableReportPage";
import TableKotPage from "../pages/tables/TableKotPage";
import OrderDetailsPage from "../pages/orders/OrderDetailsPage";
import StaffSalesReportPage from "../pages/reports/StaffSalesReportPage";
import CategorySalesReportPage from "../pages/reports/CategorySalesReportPage";
import ItemSalesReportPage from "../pages/reports/ItemSalesReportPage";
import DailySalesReportDetailsPage from "../pages/reports/DailySalesReportDetailsPage";
import DailySalesReportPage from "../pages/reports/DailySalesReportPage";
import PaymentModeReportPage from "../pages/reports/PaymentModeReportPage";
import TaxReportPage from "../pages/reports/TaxReportPage";
import AllOrdersPage from "../pages/orders/AllOrdersPage";
import UserDetailsPage from "../pages/users/UserDetailsPage";
import ItemDetailsPage from "../pages/items/ItemDetailsPage";
import ShiftHistoryPage from "../pages/shift/ShiftHistoryPage";
import ShiftHistoryDetailsPage from "../pages/shift/ShiftHistoryDetailsPage";
import AllStationsPage from "../pages/stations/AllStationsPage";
import AllPrintersPage from "../pages/printers/AllPrintersPage";

const routeConfig = [
  // { path: "/", element: Dashboard, roles: [ROLES.SUPER_ADMIN] },
  {
    path: "/",
    elements: {
      [ROLES.SUPER_ADMIN]: Dashboard,
      [ROLES.MANAGER]: Dashboard,
      [ROLES.KITCHEN]: OrderDashboard,
      [ROLES.BAR]: OrderDashboard,
    },
    roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.KITCHEN, ROLES.BAR],
  },
  
  {
    path: "/kitchen-display",
    element: KitchenDisplayPage,
    roles: [ROLES.BAR, ROLES.KITCHEN],
  },

  { path: "/daily-sales", element: DailySalesReportPage, roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER] },
  { path: "/daily-sales/details", element: DailySalesReportDetailsPage, roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER] },
  { path: "/item-sales", element: ItemSalesReportPage, roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER] },
  { path: "/category-sales", element: CategorySalesReportPage, roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER] },
  { path: "/staff-sales", element: StaffSalesReportPage, roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER] },
  { path: "/payment-mode", element: PaymentModeReportPage, roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER] },
  { path: "/tax-report", element: TaxReportPage, roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER] },
  { path: "/shift-history", element: ShiftHistoryPage, roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER] },
  { path: "/shift-history/details", element: ShiftHistoryDetailsPage, roles: [ROLES.SUPER_ADMIN, ROLES.MANAGER] },
  
  { path: "/outlets", element: AllOutletsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/categories", element: AllCategoriesPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER,] },
  { path: "/items", element: AllItemsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/items/details", element: ItemDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/items/add", element: AddItemPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/stations", element: AllStationsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/printers", element: AllPrintersPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/floors", element: AllFloorsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/floors/sections", element: AllSectionsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/floors/sections/tables", element: AllTablesPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/addons", element: AllAddonsGroup, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/addons/item", element: AllAddonItemsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },

  { path: "/users", element: AllUsersPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/users/details", element: UserDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/users/add", element: AddUserPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },


  { path: "/orders", element: AllOrdersPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/orders/details", element: OrderDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },

  { path: "/floors/sections/tables/history", element: TableHistoryPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/floors/sections/tables/report", element: TableReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },
  { path: "/floors/sections/tables/kot", element: TableKotPage, roles: [ROLES.SUPER_ADMIN,ROLES.MANAGER] },


  { path: "/settings", element: AllSettingsPage, roles: [ROLES.SUPER_ADMIN] },
  {
    path: "/settings/tax",
    element: AllTaxGroupsPage,
    roles: [ROLES.SUPER_ADMIN],
  },
  {
    path: "/settings/tax/details",
    element: TaxGroupDetailsPage,
    roles: [ROLES.SUPER_ADMIN],
  },
];

export default routeConfig;
