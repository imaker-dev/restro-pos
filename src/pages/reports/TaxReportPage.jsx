import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";

import SmartTable from "../../components/SmartTable";
import { formatDate } from "../../utils/dateFormatter";

const TaxReportPage = () => {
  const dispatch = useDispatch();
  const { outletId } = useSelector((state) => state.auth);
  const { taxReport, isFetchingTaxReport } = useSelector(
    (state) => state.report,
  );
  const { daily, taxComponents, summary } = taxReport || {};

  const [dateRange, setDateRange] = useState();
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(fetchTaxReport({ outletId, dateRange }));
  }, [outletId, dateRange]);

  const taxCards = [
    {
      title: "Subtotal",
      value: formatNumber(summary?.total_subtotal, true),
      color: "blue",
    },
    {
      title: "Discount",
      value: formatNumber(summary?.total_discount, true),
      color: "red",
    },
    {
      title: "Taxable",
      value: formatNumber(summary?.total_taxable, true),
      color: "indigo",
    },

    {
      title: "CGST",
      value: formatNumber(summary?.total_cgst, true),
      color: "purple",
    },
    {
      title: "SGST",
      value: formatNumber(summary?.total_sgst, true),
      color: "pink",
    },
    {
      title: "IGST",
      value: formatNumber(summary?.total_igst, true),
      color: "cyan",
    },
    {
      title: "VAT",
      value: formatNumber(summary?.total_vat, true),
      color: "amber",
    },
    {
      title: "CESS",
      value: formatNumber(summary?.total_cess, true),
      color: "orange",
    },

    {
      title: "Service Charge",
      value: formatNumber(summary?.total_service_charge, true),
      color: "teal",
    },

    {
      title: "Total Tax",
      value: formatNumber(summary?.total_tax, true),
      color: "yellow",
    },

    {
      title: "Grand Total",
      value: formatNumber(summary?.total_grand, true),
      color: "green",
    },

    {
      title: "Invoices",
      value: formatNumber(summary?.total_invoices),
      color: "slate",
    },
  ];

  const dailyColumns = [
    {
      key: "report_date",
      label: "Date",
      render: (row) => (
        <span className="font-medium text-slate-800">
          {formatDate(row?.report_date, "long")}
        </span>
      ),
    },

    {
      key: "invoice_count",
      label: "Invoices",
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.invoice_count}</span>
      ),
    },

    {
      key: "subtotal",
      label: "Subtotal",
      render: (row) => formatNumber(row.subtotal, true),
    },

    {
      key: "discount_amount",
      label: "Discount",
      render: (row) => (
        <span className="text-rose-600">
          {formatNumber(row.discount_amount, true)}
        </span>
      ),
    },

    {
      key: "total_tax",
      label: "Tax",
      render: (row) => (
        <span className="text-amber-600">
          {formatNumber(row.total_tax, true)}
        </span>
      ),
    },

    {
      key: "service_charge",
      label: "Service Charge",
      render: (row) => formatNumber(row.service_charge, true),
    },

    {
      key: "grand_total",
      label: "Grand Total",
      render: (row) => (
        <span className="font-semibold text-indigo-700">
          {formatNumber(row.grand_total, true)}
        </span>
      ),
    },
  ];

  const taxColumns = [
    {
      key: "name",
      label: "Tax Name",
      render: (row) => (
        <span className="font-medium text-slate-800">{row.name}</span>
      ),
    },

    {
      key: "rate",
      label: "Rate",
      render: (row) => (
        <span className="text-slate-700 font-medium">{row.rate}%</span>
      ),
    },

    {
      key: "taxableAmount",
      label: "Taxable Amount",
      render: (row) => formatNumber(row.taxableAmount, true),
    },

    {
      key: "taxAmount",
      label: "Tax Amount",
      render: (row) => (
        <span className="text-emerald-600 font-medium">
          {formatNumber(row.taxAmount, true)}
        </span>
      ),
    },

    {
      key: "invoiceCount",
      label: "Invoices",
      render: (row) => (
        <span className="text-slate-700">{row.invoiceCount}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <PageHeader title={"Tax Report"} />
        <CustomDateRangePicker
          value={dateRange}
          onChange={(newRange) => {
            setDateRange(newRange);
          }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {taxCards.map((card, i) => (
          <StatCard
            key={i}
            title={card?.title}
            value={card?.value}
            color={card?.color}
            variant="secondary"
          />
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("daily")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "daily"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Daily Report
        </button>

        <button
          onClick={() => setActiveTab("tax")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "tax"
              ? "border-primary-500 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Tax Components
        </button>
      </div>

      {activeTab === "daily" && (
        <SmartTable
          title={"Daily Tax Report"}
          totalcount={daily?.length}
          data={daily}
          columns={dailyColumns}
          loading={isFetchingTaxReport}
        />
      )}

      {activeTab === "tax" && (
        <SmartTable
          title={"Tax Summary Report"}
          totalcount={taxComponents?.length}
          data={taxComponents}
          columns={taxColumns}
          loading={isFetchingTaxReport}
        />
      )}
    </div>
  );
};

export default TaxReportPage;
