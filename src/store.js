import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../src/redux/slices/authSlice";
import outletSlice from '../src/redux/slices/outletSlice';
import floorSlice from '../src/redux/slices/floorSlice';
import userSlice from '../src/redux/slices/userSlice';
import sectionSlice from '../src/redux/slices/sectionSlice';
import roleSlice from '../src/redux/slices/roleSlice';
import permissionSlice from '../src/redux/slices/permissionSlice';
import tableSlice from '../src/redux/slices/tableSlice';
import categorySlice from '../src/redux/slices/categorySlice';
import itemSlice from '../src/redux/slices/itemSlice';

const reducer = {
  auth: authSlice,
  outlet:outletSlice,
  floor:floorSlice,
  user:userSlice,
  section:sectionSlice,
  role:roleSlice,
  permission:permissionSlice,
  table:tableSlice,
  category:categorySlice,
  item:itemSlice,
};

const store = configureStore({
  reducer,
});

export default store;
