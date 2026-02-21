import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaymentModeReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import SmartTable from "../../components/SmartTable";
import { formatNumber } from "../../utils/numberFormatter";
import StatCard from "../../components/StatCard";
import {
  CreditCard,
  HandCoins,
  IndianRupee,
  ReceiptIndianRupee,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";

const PaymentModeReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { paymentModeReport, isFetchingPaymentModeReport } = useSelector(
    (state) => state.report,
  );
  const { modes, summary } = paymentModeReport || {};

  const [dateRange, setDateRange] = useState();

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchPaymentModeReport({ outletId, dateRange }));
  }, [outletId, dateRange]);

  const stats = [
    {
      title: "Total Collected",
      value: formatNumber(summary?.total_collected, true),
      subtitle: "Final received amount",
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Base Amount",
      value: formatNumber(summary?.total_base_amount, true),
      subtitle: "Before tips",
      icon: Wallet,
      color: "blue",
    },
    {
      title: "Total Transactions",
      value: summary?.total_transactions,
      subtitle: "Completed payments",
      icon: CreditCard,
      color: "purple",
    },
    {
      title: "Average Transaction",
      value: formatNumber(summary?.average_transaction, true),
      subtitle: "Per transaction",
      icon: TrendingUp,
      color: "amber",
    },
    {
      title: "Total Tips",
      value: formatNumber(summary?.total_tips, true),
      subtitle: "Additional earnings",
      icon: ReceiptIndianRupee,
      color: "rose",
    },
  ];

  const columns = [
    {
      key: "payment_mode",
      label: "Payment Mode",
      render: (row) => (
        <span className="font-medium text-slate-800 capitalize">
          {row.payment_mode}
        </span>
      ),
    },

    {
      key: "transaction_count",
      label: "Transactions",
      render: (row) => (
        <span className="text-slate-700 font-medium">
          {row.transaction_count}
        </span>
      ),
    },

    {
      key: "base_amount",
      label: "Base Amount",
      render: (row) => formatNumber(row.base_amount, true),
    },

    {
      key: "tip_amount",
      label: "Tips",
      render: (row) => (
        <span className="text-emerald-600">
          {formatNumber(row.tip_amount, true)}
        </span>
      ),
    },

    {
      key: "total_amount",
      label: "Total",
      render: (row) => (
        <span className="font-semibold text-indigo-700">
          {formatNumber(row.total_amount, true)}
        </span>
      ),
    },

    {
      key: "percentage_share",
      label: "Share",
      render: (row) => {
        const percent = parseFloat(row.percentage_share) || 0;

        return (
          <div className="w-[120px]">
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>{percent}%</span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader title={"Payment Mode Report"} />
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {stats?.map((stat, index) => (
          <StatCard
            key={index}
            title={stat?.title}
            value={stat?.value}
            subtitle={stat?.subtitle}
            icon={stat?.icon}
            color={stat?.color}
          />
        ))}
      </div>

      <SmartTable
        title={"Payment Mode Report"}
        totalcount={modes?.length}
        data={modes}
        columns={columns}
        loading={isFetchingPaymentModeReport}
        //   actions={rowActions}
      />
    </div>
  );
};

export default PaymentModeReportPage;
