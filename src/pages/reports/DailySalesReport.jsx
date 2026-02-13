import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailySalesReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";

const DailySalesReport = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { dailySalesReport } = useSelector((state) => state.report);
  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    dispatch(fetchDailySalesReport({ outletId, dateRange }));
  }, [dateRange]);


  console.log(dailySalesReport)
  return (
    <div className="space-y-6">
      <PageHeader title={"Daily Sales Report"} />
      <div className="w-full flex justify-">
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
        />
      </div>
    </div>
  );
};

export default DailySalesReport;
