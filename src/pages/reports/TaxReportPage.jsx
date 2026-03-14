import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxReport } from "../../redux/slices/reportSlice";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import StatCard from "../../components/StatCard";
import { formatNumber } from "../../utils/numberFormatter";

import SmartTable from "../../components/SmartTable";
import { formatDate, formatFileDate } from "../../utils/dateFormatter";
import Tabs from "../../components/Tabs";
import { Download, Eye, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleResponse } from "../../utils/helpers";
import { exportTaxReport } from "../../redux/slices/exportReportSlice";
import { downloadBlob } from "../../utils/blob";

const TaxReportPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { outletId } = useSelector((state) => state.auth);
  const { isExportingTaxReport } = useSelector((state) => state.exportReport);
  const { taxReport, isFetchingTaxReport } = useSelector(
    (state) => state.report,
  );

  const { daily, taxComponents, summary } = taxReport || {};

  const [dateRange, setDateRange] = useState();
  const [activeTab, setActiveTab] = useState("daily");

  const fetchReport = () => {
    dispatch(fetchTaxReport({ outletId, dateRange }));
  };

  useEffect(() => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;
    fetchReport();
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
      title: "Taxable Amount",
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
      title: "Total Invoices",
      value: summary?.total_invoices,
      color: "slate",
    },

    {
      title: "NC Orders",
      value: summary?.nc_orders,
      color: "gray",
    },

    {
      title: "NC Amount",
      value: formatNumber(summary?.nc_amount, true),
      color: "gray",
    },

    {
      title: "Due Amount",
      value: formatNumber(summary?.due_amount, true),
      color: "rose",
    },
  ];

  const taxColumns = [
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
        <span className="text-slate-700 font-medium">
          {formatNumber(row.invoice_count)}
        </span>
      ),
    },

    {
      key: "taxable_amount",
      label: "Taxable",
      render: (row) => (
        <span className="text-slate-700">
          {formatNumber(row.taxable_amount, true)}
        </span>
      ),
    },

    {
      key: "cgst_amount",
      label: "CGST",
      render: (row) => (
        <span className="text-indigo-600">
          {formatNumber(row.cgst_amount, true)}
        </span>
      ),
    },

    {
      key: "sgst_amount",
      label: "SGST",
      render: (row) => (
        <span className="text-indigo-600">
          {formatNumber(row.sgst_amount, true)}
        </span>
      ),
    },

    {
      key: "igst_amount",
      label: "IGST",
      render: (row) => (
        <span className="text-indigo-600">
          {formatNumber(row.igst_amount, true)}
        </span>
      ),
    },

    {
      key: "vat_amount",
      label: "VAT",
      render: (row) => (
        <span className="text-amber-600">
          {formatNumber(row.vat_amount, true)}
        </span>
      ),
    },

    {
      key: "cess_amount",
      label: "CESS",
      render: (row) => (
        <span className="text-rose-600">
          {formatNumber(row.cess_amount, true)}
        </span>
      ),
    },

    {
      key: "total_tax",
      label: "Total Tax",
      render: (row) => (
        <span className="font-semibold text-green-700">
          {formatNumber(row.total_tax, true)}
        </span>
      ),
    },

    {
      key: "grand_total",
      label: "Grand Total",
      render: (row) => (
        <span className="font-semibold text-slate-900">
          {formatNumber(row.grand_total, true)}
        </span>
      ),
    },
  ];

  const taxComponentColumns = [
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

  const tabs = [
    {
      id: "daily",
      label: "Daily Report",
      badgeCount: daily?.length,
    },
    {
      id: "tax",
      label: "Tax Components",
      badgeCount: taxComponents?.length,
    },
  ];

  const rowActions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) => navigate(`/tax-report/details?date=${row.report_date}`),
    },
  ];

  const handleExportTaxReport = async () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return;

    const fileName = `Tax-Report_${formatFileDate(
      dateRange.startDate,
    )}_to_${formatFileDate(dateRange.endDate)}`;

    await handleResponse(
      dispatch(exportTaxReport({ outletId, dateRange })),
      (res) => {
        downloadBlob({
          data: res.payload,
          fileName,
        });
      },
    );
  };

  const actions = [
    {
      label: "Export",
      type: "export",
      icon: Download,
      onClick: () => handleExportTaxReport(),
      loading: isExportingTaxReport,
      loadingText: "Exporting...",
    },
    {
      label: "Refresh",
      type: "refresh",
      icon: RotateCcw,
      onClick: fetchReport,
      loading: isFetchingTaxReport,
      loadingText: "Refreshing...",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={"Tax Report"}
        rightContent={
          <CustomDateRangePicker
            value={dateRange}
            onChange={(newRange) => {
              setDateRange(newRange);
            }}
          />
        }
        actions={actions}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {taxCards.map((card, i) => (
          <StatCard
            key={i}
            title={card?.title}
            value={card?.value}
            color={card?.color}
            variant="v9"
            loading={isFetchingTaxReport}
          />
        ))}
      </div>

      {/* ── Tab switcher ── */}
      <Tabs
        tabs={tabs}
        active={activeTab}
        onChange={setActiveTab}
        variant="v2"
      />

      {activeTab === "daily" && (
        <SmartTable
          title={"Daily Tax Report"}
          totalcount={daily?.length}
          data={daily}
          columns={taxColumns}
          loading={isFetchingTaxReport}
          actions={rowActions}
        />
      )}

      {activeTab === "tax" && (
        <SmartTable
          title={"Tax Summary Report"}
          totalcount={taxComponents?.length}
          data={taxComponents}
          columns={taxComponentColumns}
          loading={isFetchingTaxReport}
        />
      )}
    </div>
  );
};

export default TaxReportPage;
