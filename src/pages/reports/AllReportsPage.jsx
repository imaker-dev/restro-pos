// import React from 'react'

// const AllReportsPage = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default AllReportsPage

import { useNavigate } from "react-router-dom";
import {
  CalendarDays, Package, Layers, Users, CreditCard,
  Percent, PieChart, Monitor, BadgeIndianRupee,
  ReceiptIndianRupee, XCircle, BarChart3, ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import PageHeader from "../../layout/PageHeader";

// ─── Data ─────────────────────────────────────────────────────────────────────
const GROUPS = [
  {
    key: "sales",
    label: "Sales",
    desc: "Revenue & performance",
    accent: "#6366f1",
    reports: [
      { name: "Daily Sales",    path: "/daily-sales",            icon: CalendarDays,       desc: "Day-by-day revenue"           },
      { name: "Item Sales",     path: "/item-sales",             icon: Package,            desc: "Menu item performance"        },
      { name: "Category Sales", path: "/category-sales",         icon: Layers,             desc: "Category revenue split"       },
      { name: "Staff Sales",    path: "/staff-sales",            icon: Users,              desc: "Staff order performance"      },
      { name: "Service Type",   path: "/service-type-breakdown", icon: PieChart,           desc: "Dine-in vs delivery"          },
    ],
  },
  {
    key: "financial",
    label: "Financial",
    desc: "Payments & deductions",
    accent: "#10b981",
    reports: [
      { name: "Payments",       path: "/payment-mode",           icon: CreditCard,         desc: "Revenue by payment mode"      },
      { name: "Tax",            path: "/tax-report",             icon: Percent,            desc: "GST & tax collected"          },
      { name: "Discount",       path: "/discount-report",        icon: BadgeIndianRupee,   desc: "Discounts applied"            },
      { name: "Adjustment",     path: "/adjustment-report",      icon: BarChart3,          desc: "Price adjustments"            },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    desc: "Floor, station & dues",
    accent: "#f59e0b",
    reports: [
      { name: "Station",        path: "/station-sales",          icon: Monitor,            desc: "Kitchen & bar stations"       },
      { name: "Section",        path: "/section-sales",          icon: Layers,             desc: "Floor & section revenue"      },
      { name: "Due",            path: "/due-report",             icon: BadgeIndianRupee,   desc: "Outstanding balances"         },
      { name: "No Charge",      path: "/nc-report",              icon: ReceiptIndianRupee, desc: "Complimentary items"          },
      { name: "Cancellation",   path: "/cancellation-report",    icon: XCircle,            desc: "Cancelled orders"             },
    ],
  },
];

// ─── Report Card ──────────────────────────────────────────────────────────────
const ReportCard = ({ report, accent, onClick }) => {
  const Icon = report.icon;

  return (
    <button
      onClick={onClick}
      className="group relative w-full bg-white border border-gray-100 rounded-2xl p-4 text-left overflow-hidden transition-all duration-300 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 focus:outline-none"
    >
      {/* Subtle bg glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 0% 0%, ${accent}10 0%, transparent 70%)` }}
      />

      <div className="relative flex flex-col gap-4">
        {/* Top row: icon + arrow */}
        <div className="flex items-start justify-between">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}25` }}
          >
            <Icon size={17} style={{ color: accent }} strokeWidth={1.75} />
          </div>
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200"
            style={{ backgroundColor: accent }}
          >
            <ArrowUpRight size={13} className="text-white" />
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="text-sm font-black text-gray-900 leading-none mb-1.5">{report.name}</p>
          <p className="text-[11px] text-gray-400 leading-relaxed">{report.desc}</p>
        </div>
      </div>
    </button>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const AllReportsPage = ({ basePath = "/reports" }) => {
  const navigate = useNavigate();
  const total = GROUPS.reduce((s, g) => s + g.reports.length, 0);

  return (
    <div className="space-y-8">

      {/* ── Page Header ── */}
      <PageHeader title={'Reports'}/>


      {/* ── Groups ── */}
      <div className="space-y-10">
        {GROUPS.map((group) => (
          <div key={group.key}>

            {/* Group header */}
            <div className="flex items-center gap-3 mb-4">
              {/* Accent bar */}
              <div
                className="w-1 h-8 rounded-full shrink-0"
                style={{ backgroundColor: group.accent }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-base font-black text-gray-900">{group.label}</h2>
                  <span className="text-xs text-gray-400">{group.desc}</span>
                </div>
              </div>
              <span
                className="text-[10px] font-black px-2.5 py-1 rounded-full border shrink-0"
                style={{
                  backgroundColor: `${group.accent}10`,
                  borderColor: `${group.accent}30`,
                  color: group.accent,
                }}
              >
                {group.reports.length} reports
              </span>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {group.reports.map((report) => (
                <ReportCard
                  key={report.path}
                  report={report}
                  accent={group.accent}
                  onClick={() => navigate(`${basePath}${report.path}`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer note ── */}
      <p className="text-center text-[11px] text-gray-300 mt-12">
        All reports are generated in real-time from live transaction data
      </p>
    </div>
  );
};

export default AllReportsPage;