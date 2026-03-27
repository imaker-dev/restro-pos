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
import { ROLES } from "../constants";
import Dashboard from "../pages/dashboard/Dashboard";
import OrderDashboard from "../pages/dashboard/OrderDashboard";
import AllTablesPage from "../pages/outlets/AllTablesPage";
import AllAddonsGroup from "../pages/addons/AllAddonsGroup";
import AllAddonItemsPage from "../pages/addons/AllAddonItemsPage";
import AllFloorsPage from "../pages/outlets/AllFloorsPage";
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
import SettingDetailsPage from "../pages/settings/SettingDetailsPage";
import RunningOrdersPage from "../pages/reports/RunningOrdersPage";
import ServiceTypeBreakdownReportPage from "../pages/reports/ServiceTypeBreakdownReportPage";
import DayEndSummaryPage from "../pages/reports/DayEndSummaryPage";
import AddOutletPage from "../pages/outlets/AddOutletPage";
import OutletDetails from "../pages/outlets/OutletDetails";
import AllVersionsPage from "../pages/versions/AllVersionsPage";
import AddVersionPage from "../pages/versions/AddVersionPage";
import OrderDisplayPage from "../pages/kitchen-display/OrderDisplayPage";
import AddBulkItemPage from "../pages/items/AddBulkItemPage";
import SetupGuide from "../pages/guide/SetupGuidePage";
import OutletDeletePage from "../pages/outlets/OutletDeletePage";
import AllCustomersPage from "../pages/customers/AllCustomersPage";
import CustomerDetailsPage from "../pages/customers/CustomerDetailsPage";
import SectionSalesPage from "../pages/reports/SectionSalesPage";
import StationSalesPage from "../pages/reports/StationSalesPage";
import CancellationReport from "../pages/reports/CancellationReport";
import RunningTablesPage from "../pages/reports/RunningTablesPage";
import DayEndSummaryDetailsPage from "../pages/reports/DayEndSummaryDetailsPage";
import TaxReportDetailsPage from "../pages/reports/TaxReportDetailsPage";
import OutletLogoPage from "../pages/outlets/OutletLogoPage";
import DueReportPage from "../pages/reports/DueReportPage";
import NcReportPage from "../pages/reports/NcReportPage";
import AllNcReasonsPage from "../pages/nc/AllNcReasonsPage";
import AllUnitsPage from "../pages/inventory/AllUnitsPage";
import AllVendorsPage from "../pages/inventory/AllVendorsPage";
import AddVendorPage from "../pages/inventory/AddVendorPage";
import InventoryCategoryPage from "../pages/inventory/InventoryCategoryPage";
import InventoryItemPage from "../pages/inventory/InventoryItemPage";
import AddInventoryItemPage from "../pages/inventory/AddInventoryItemPage";
import AllPurchaseOrdersPage from "../pages/inventory/AllPurchaseOrdersPage";
import AddPurchaseOrdersPage from "../pages/inventory/AddPurchaseOrdersPage";
import PurchaseOrderDetailsPage from "../pages/inventory/PurchaseOrderDetailsPage";
import IngredientsPage from "../pages/receipe/IngredientsPage";
import AddIngredientPage from "../pages/receipe/AddIngredientPage";
import AllRecipePage from "../pages/receipe/AllRecipePage";
import AddRecipePage from "../pages/receipe/AddRecipePage";
import RecipeDetailsPage from "../pages/receipe/RecipeDetailsPage";
import InventoryItemDetailsPage from "../pages/inventory/InventoryItemDetailsPage";
import InventoryMovementsPage from "../pages/inventory/InventoryMovementsPage";
import AllProductionRecipePage from "../pages/receipe/AllProductionRecipePage";
import AddProductionRecipePage from "../pages/receipe/AddProductionRecipePage";
import ProductionRecipeDetailsPage from "../pages/receipe/ProductionRecipeDetailsPage";
import VendorDetailsPage from "../pages/inventory/VendorDetailsPage";
import InventoryItemBatches from "../pages/inventory/InventoryItemBatches";
import inventorySummaryPage from "../pages/inventory/inventorySummaryPage";
import InventoryWastagePage from "../pages/inventory/InventoryWastagePage";
import BulkUploadSummaryPage from "../pages/items/BulkUploadSummaryPage";
import MenuMediaPage from "../pages/items/MenuMediaPage";

const routeConfig = [
  // { path: "/", element: Dashboard, roles: [ROLES.SUPER_ADMIN] },
  {
    path: "/",
    elements: {
      [ROLES.SUPER_ADMIN]: Dashboard,
      [ROLES.ADMIN]: Dashboard,
      [ROLES.MANAGER]: Dashboard,
      [ROLES.KITCHEN]: OrderDashboard,
      [ROLES.BARTENDER]: OrderDashboard,
    },
    roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER, ROLES.KITCHEN, ROLES.BARTENDER],
  },

  { path: "/order-display", element: OrderDisplayPage, roles: [ROLES.BARTENDER, ROLES.KITCHEN] },

  { path: "/daily-sales", element: DailySalesReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/daily-sales/details", element: DailySalesReportDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/item-sales", element: ItemSalesReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/category-sales", element: CategorySalesReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/section-sales", element: SectionSalesPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/station-sales", element: StationSalesPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/staff-sales", element: StaffSalesReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/payment-mode", element: PaymentModeReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/tax-report", element: TaxReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/tax-report/details", element: TaxReportDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/service-type-breakdown", element: ServiceTypeBreakdownReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/shift-history", element: ShiftHistoryPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/shift-history/details", element: ShiftHistoryDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/due-report", element: DueReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/nc-report", element: NcReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/cancellation-report", element: CancellationReport, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  
  { path: "/nc-reasons", element: AllNcReasonsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },



  { path: "/inventory", element: inventorySummaryPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory/units", element: AllUnitsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory-vendors", element: AllVendorsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory-vendors/add", element: AddVendorPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory-vendors/details", element: VendorDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory-categories", element: InventoryCategoryPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },

  { path: "/inventory-items", element: InventoryItemPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory-items/add", element: AddInventoryItemPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory-items/details", element: InventoryItemDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory-items/batches", element: InventoryItemBatches, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory-movements", element: InventoryMovementsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/inventory-wastage", element: InventoryWastagePage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },

  { path: "/purchase-orders", element: AllPurchaseOrdersPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/purchase-orders/details", element: PurchaseOrderDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/purchase-orders/add", element: AddPurchaseOrdersPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },


  { path: "/ingredients", element: IngredientsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/ingredients/add", element: AddIngredientPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/recipes", element: AllRecipePage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/recipes/add", element: AddRecipePage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/recipes/details", element: RecipeDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/prep-recipes", element: AllProductionRecipePage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/prep-recipes/add", element: AddProductionRecipePage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/prep-recipes/details", element: ProductionRecipeDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },


  { path: "/running-orders", element: RunningOrdersPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/running-tables", element: RunningTablesPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/day-end-summary", element: DayEndSummaryPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  { path: "/day-end-summary/details", element: DayEndSummaryDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER] },
  
  { path: "/outlets", element: AllOutletsPage, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: "/outlet-logo", element: OutletLogoPage, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] },
  { path: "/outlets/details", element: OutletDetails, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN] },
  { path: "/outlets/add", element: AddOutletPage, roles: [ROLES.SUPER_ADMIN] },
  { path: "/outlets/delete", element: OutletDeletePage, roles: [ROLES.SUPER_ADMIN] },

  { path: "/categories", element: AllCategoriesPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN, ROLES.MANAGER,] },
  { path: "/menu-media", element: MenuMediaPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/items", element: AllItemsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/items/details", element: ItemDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/items/add", element: AddItemPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/items/bulk-add", element: AddBulkItemPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/items/bulk-add/summary", element: BulkUploadSummaryPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  
  { path: "/stations", element: AllStationsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/printers", element: AllPrintersPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  
  { path: "/floors", element: AllFloorsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/floors/tables", element: AllTablesPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/floors/sections/tables", element: AllTablesPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },

  { path: "/addons", element: AllAddonsGroup, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/addons/item", element: AllAddonItemsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },

  { path: "/users", element: AllUsersPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/users/details", element: UserDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/users/add", element: AddUserPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },


  { path: "/orders", element: AllOrdersPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/orders/details", element: OrderDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },

  { path: "/floors/sections/tables/history", element: TableHistoryPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/floors/sections/tables/report", element: TableReportPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/floors/sections/tables/kot", element: TableKotPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },


  { path: "/customers", element: AllCustomersPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },
  { path: "/customers/details", element: CustomerDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN,ROLES.MANAGER] },


  { path: "/settings", element: AllSettingsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN] },
  { path: "/settings/categories", element: SettingDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN] },
  { path: "/tax-groups",element: AllTaxGroupsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN], },
  { path: "/tax-groups/details", element: TaxGroupDetailsPage, roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN], },

  { path: "/versions", element: AllVersionsPage, roles: [ROLES.SUPER_ADMIN], },
  { path: "/versions/add", element: AddVersionPage, roles: [ROLES.SUPER_ADMIN], },

  { path: "/guide", element: SetupGuide, public:true, },
];

export default routeConfig;
