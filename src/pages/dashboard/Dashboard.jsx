import React, { useEffect, useState } from "react";
import { BarChart3, Clock, Users, DollarSign } from "lucide-react";
// import StatCard from "../../partial/dashboard/StatCard";
import WelcomeBanner from "../../partial/dashboard/WelcomeBanner";
import TopItems from "../../partial/dashboard/TopItems";
import StaffPerformance from "../../partial/dashboard/StaffPerformance";
import FloorAnalytics from "../../partial/dashboard/FloorAnalytics";
import PeakHours from "../../partial/dashboard/PeakHours";
import WeeklyOrdersAnalytics from "../../partial/dashboard/WeeklyOrdersAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDahboardStats } from "../../redux/slices/dashboardSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import StatCard from "../../components/StatCard";

export default function Page() {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState();

  // useEffect(() => {
  //   dispatch(fetchAllDahboardStats({ outletId, dateRange }));
  // }, [dateRange]);

  const { dahbordStats } = useSelector((state) => state.dashboard);

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      {/* <div className="flex justify-end">
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
          defaultRange={"Last 7 Days"}
        />
      </div> */}

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="₹1,45,230"
          subtitle="Today's total sales"
          icon={DollarSign}
          color="green"
        />

        <StatCard
          title="Total Orders"
          value="284"
          subtitle="Orders placed today"
          icon={BarChart3}
          color="blue"
        />

        <StatCard
          title="Active Tables"
          value="18/28"
          subtitle="Current occupancy"
          icon={Users}
          color="purple"
        />

        <StatCard
          title="Avg Check"
          value="₹511"
          subtitle="Per table average"
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <WeeklyOrdersAnalytics />
        <PeakHours />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* <FloorAnalytics /> */}
        <TopItems />
        <StaffPerformance />
      </div>

      {/* Staff & Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* <CustomerSatisfaction /> */}
      </div>
    </div>
  );
}
