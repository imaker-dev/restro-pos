import React, { useEffect } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders } from "../../redux/slices/orderSlice";

const AllOrdersPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);

  useEffect(() => {
    // dispatch(fetchAllOrders(outletId))
  }, [outletId]);

  return (
    <div>
      <PageHeader title={"All Orders"} />
    </div>
  );
};

export default AllOrdersPage;
