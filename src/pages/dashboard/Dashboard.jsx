import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Clock,
  Users,
  DollarSign,
  ShoppingCart,
  IndianRupee,
  Table,
  Wine,
  ChefHat,
  Wallet,
  Activity,
} from "lucide-react";
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
import { formatNumber } from "../../utils/numberFormatter";

export default function Page() {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    dispatch(fetchAllDahboardStats({ outletId, dateRange }));
  }, [dateRange]);

  const { dahbordStats } = useSelector((state) => state.dashboard);

  const { sales, activeTables, pendingKots, paymentBreakdown } =
    dahbordStats || {};

  const stats = [
    {
      title: "Orders",
      value: sales?.total_orders,
      icon: ShoppingCart,
      color: "blue",
    },
    {
      title: "Active",
      value: sales?.active_orders,
      icon: Activity,
      color: "amber",
    },
    {
      title: "Guests",
      value: sales?.total_guests,
      icon: Users,
      color: "purple",
    },
    {
      title: "Net Sales",
      value: `${formatNumber(sales?.net_sales, true)}`,
      icon: IndianRupee,
      color: "emerald",
    },
    {
      title: "Tables",
      value: activeTables,
      icon: Table,
      color: "indigo",
    },
    {
      title: "Kitchen KOT",
      value: pendingKots?.kitchen,
      icon: ChefHat,
      color: "rose",
    },
    {
      title: "Bar KOT",
      value: pendingKots?.bar,
      icon: Wine,
      color: "pink",
    },
    {
      title: "Cash",
      value: `${formatNumber(paymentBreakdown?.cash, true)}`,
      icon: Wallet,
      color: "green",
    },
  ];

  return (
    <div className="space-y-6">
      <WelcomeBanner />

      <div className="flex justify-end">
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
          defaultRange={"Last 7 Days"}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            color={stat.color}
          />
        ))}
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
