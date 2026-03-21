import { useEffect, useState, useMemo, useRef } from "react";
import PageHeader from "../../layout/PageHeader";
import {
  Plus,
  Search,
  ArrowUpRight,
  Building2,
  Phone,
  Hash,
  CalendarDays,
  BadgeIndianRupee,
  ReceiptText,
  ChevronDown,
  X,
  CreditCard,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  IndianRupee,
  Wallet,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  cancelPurchase,
  fetchAllPurchase,
  updatePurchasePayment,
} from "../../redux/slices/inventorySlice";
import LoadingOverlay from "../../components/LoadingOverlay";
import { formatNumber } from "../../utils/numberFormatter";
import { formatDate } from "../../utils/dateFormatter";
import NoDataFound from "../../layout/NoDataFound";
import { PurchasePaymentModal } from "../../partial/inventory/purchase-order/PurchasePaymentModal";
import { PurchaseCard } from "../../partial/inventory/purchase-order/PurchaseCard";
import { handleResponse } from "../../utils/helpers";
import { CancelPurchaseModal } from "../../partial/inventory/purchase-order/CancelPurchaseModal";
import StatCard from "../../components/StatCard";
import PurchaseCardSkeleton from "../../partial/inventory/purchase-order/PurchaseCardSkeleton";
import SearchBar from "../../components/SearchBar";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import Pagination from "../../components/Pagination";

/* ─── Summary bar ─────────────────────────────────────────────────────────── */
function SummaryBar({ purchases }) {
  const total = purchases.length;
  const totalAmt = purchases.reduce((s, p) => s + (p.totalAmount ?? 0), 0);
  const totalPaid = purchases.reduce((s, p) => s + (p.paidAmount ?? 0), 0);
  const totalDue = purchases.reduce((s, p) => s + (p.dueAmount ?? 0), 0);
  const unpaidCnt = purchases.filter(
    (p) => p.paymentStatus?.toLowerCase() === "unpaid",
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        {
          label: "Total Orders",
          value: total,
          sub: "Purchase orders",
          color: "slate",
          icon: ReceiptText,
        },
        {
          label: "Total Value",
          value: formatNumber(totalAmt, true),
          sub: "Gross purchase value",
          color: "violet",
          icon: BadgeIndianRupee,
        },
        {
          label: "Total Paid",
          value: formatNumber(totalPaid, true),
          sub: "Amount settled",
          color: "emerald",
          icon: BadgeIndianRupee,
        },
        {
          label: "Total Due",
          value: formatNumber(totalDue, true),
          sub: `${unpaidCnt} unpaid`,
          color: "red",
          icon: Hash,
        },
      ].map(({ label, value, sub, color, iconBg, icon }) => (
        <StatCard
          key={label}
          icon={icon}
          title={label}
          value={value}
          subtitle={sub}
          variant="v9"
          color={color}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
const AllPurchaseOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [showCancelOverlay, setShowCancelOverlay] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  

  const { outletId } = useSelector((state) => state.auth);
  const {
    allPurchaseData,
    isFetchingPurchase,
    isUpdatingPurchasePayment,
    isCancellingPurchase,
  } = useSelector((state) => state.inventory);

  const { purchases, pagination } = allPurchaseData || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState();

  const fetchPurchases = () => {
    if (!outletId || !dateRange?.startDate || !dateRange?.endDate) return;

    dispatch(
      fetchAllPurchase({
        outletId,
        page: currentPage,
        limit: itemsPerPage,
        search,
        dateRange,
      }),
    );
  };

  useEffect(() => {
    fetchPurchases();
  }, [outletId, search, dateRange, currentPage, itemsPerPage]);

  const resetPurchaseStates = () => {
    setSelectedPurchase(null);
    setShowPaymentOverlay(false);
    setShowCancelOverlay(false);
  };

  // TODO: wire these to your redux thunks
  async function handlePaymentConfirm({ purchaseId, values }) {
    await handleResponse(
      dispatch(updatePurchasePayment({ id: purchaseId, values })),
      () => {
        fetchPurchases();
        resetPurchaseStates();
      },
    );
  }

  async function handleCancelConfirm({ purchaseId, reason }) {
    await handleResponse(
      dispatch(cancelPurchase({ id: purchaseId, reason })),
      () => {
        fetchPurchases();
        resetPurchaseStates();
      },
    );
  }

  const actions = [
    {
      label: "Create Purchase Order",
      type: "primary",
      icon: Plus,
      onClick: () => navigate("/purchase-orders/add"),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="All Purchase Orders"
          actions={actions}
          rightContent={
            <CustomDateRangePicker value={dateRange} onChange={setDateRange} />
          }
        />
        {purchases?.length > 0 && <SummaryBar purchases={purchases} />}
        <SearchBar onSearch={(value) => setSearch(value)} />
        {isFetchingPurchase ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <PurchaseCardSkeleton key={i} />
            ))}
          </div>
        ) : purchases?.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {purchases?.map((p) => (
              <PurchaseCard
                key={p.id}
                purchase={p}
                onPay={(purchase) => {
                  setSelectedPurchase(purchase);
                  setShowPaymentOverlay(true);
                }}
                onCancel={(purchase) => {
                  setSelectedPurchase(purchase);
                  setShowCancelOverlay(true);
                }}
              />
            ))}
          </div>
        ) : (
          <NoDataFound
            icon={ReceiptText}
            title={
              purchases?.length === 0
                ? "No purchase orders yet"
                : "No results match your filters"
            }
            className="bg-white"
          />
        )}

        <Pagination
          totalItems={pagination?.total}
          currentPage={currentPage}
          pageSize={itemsPerPage}
          totalPages={pagination?.totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          maxPageNumbers={5}
          showPageSizeSelector={true}
          onPageSizeChange={(size) => {
            setCurrentPage(1);
            setItemsPerPage(size);
          }}
        />
      </div>

      {/* Payment overlay */}
      <PurchasePaymentModal
        isOpen={showPaymentOverlay}
        onClose={resetPurchaseStates}
        purchase={selectedPurchase}
        onConfirm={handlePaymentConfirm}
        loading={isUpdatingPurchasePayment}
      />

      {/* Cancel overlay */}
      <CancelPurchaseModal
        isOpen={showCancelOverlay}
        onClose={resetPurchaseStates}
        purchase={selectedPurchase}
        onConfirm={handleCancelConfirm}
        loading={isCancellingPurchase}
      />
    </>
  );
};

export default AllPurchaseOrdersPage;
