import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../src/redux/slices/authSlice";
import outletSlice from "../src/redux/slices/outletSlice";
import floorSlice from "../src/redux/slices/floorSlice";
import userSlice from "../src/redux/slices/userSlice";
import sectionSlice from "../src/redux/slices/sectionSlice";
import roleSlice from "../src/redux/slices/roleSlice";
import permissionSlice from "../src/redux/slices/permissionSlice";
import tableSlice from "../src/redux/slices/tableSlice";
import categorySlice from "../src/redux/slices/categorySlice";
import itemSlice from "../src/redux/slices/itemSlice";
import taxSlice from "../src/redux/slices/taxSlice";
import kitchenSlice from "../src/redux/slices/kitchenSlice";
import addonSlice from "../src/redux/slices/addonSlice";
import kotSlice from "../src/redux/slices/kotSlice";
import socketSlice from "../src/redux/slices/socketSlice";
import uiSlice from "./redux/slices/uiSlice";
import reportSlice from "./redux/slices/reportSlice";
import dashboardSlice from "./redux/slices/dashboardSlice";
import orderSlice from './redux/slices/orderSlice';

const reducer = {
  auth: authSlice,
  outlet: outletSlice,
  floor: floorSlice,
  user: userSlice,
  section: sectionSlice,
  role: roleSlice,
  permission: permissionSlice,
  table: tableSlice,
  category: categorySlice,
  item: itemSlice,
  tax: taxSlice,
  kitchen: kitchenSlice,
  addon: addonSlice,
  kot: kotSlice,
  socket: socketSlice,
  ui: uiSlice,
  report: reportSlice,
  dashboard: dashboardSlice,
  order:orderSlice,
};

const store = configureStore({
  reducer,
});

export default store;
