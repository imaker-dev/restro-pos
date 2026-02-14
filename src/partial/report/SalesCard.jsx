import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";

export function SalesCard({ data }) {
  const netSales = parseFloat(data.net_sales);
  const totalCollection =
    typeof data.total_collection === "number"
      ? data.total_collection
      : parseFloat(data.total_collection.toString());
  const totalOrders = data.total_orders;
  const totalGuests = parseInt(data.total_guests);

  return (
    <div>
      <div className="group relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow cursor-pointer">

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Sales Report</p>
              <h3 className="mt-1 text-lg font-bold text-gray-900">
                {formatDate(data.report_date, "long")}
              </h3>
            </div>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <TrendingUp size={24} />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {/* Net Sales */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">Net Sales</p>
                <DollarSign size={16} className="text-green-600" />
              </div>
              <p className="text-xl font-bold text-green-600">
                ₹{netSales.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Avg: ₹{parseFloat(data.average_order_value).toFixed(0)}
              </p>
            </div>

            {/* Orders */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">Orders</p>
                <ShoppingCart size={16} className="text-blue-600" />
              </div>
              <p className="text-xl font-bold text-blue-600">{totalOrders}</p>
              <p className="mt-1 text-xs text-gray-400">
                {data.dine_in_orders} dine-in
              </p>
            </div>

            {/* Guests */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">Guests</p>
                <Users size={16} className="text-purple-600" />
              </div>
              <p className="text-xl font-bold text-purple-600">{totalGuests}</p>
              <p className="mt-1 text-xs text-gray-400">
                Per guest: ₹{parseFloat(data.average_guest_spend).toFixed(0)}
              </p>
            </div>

            {/* Collection */}
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">Collection</p>
                <CreditCard size={16} className="text-yellow-600" />
              </div>
              <p className="text-xl font-bold text-yellow-600">
                ₹
                {totalCollection.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {data.cancelled_orders} cancelled
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
            <p className="mb-3 text-xs font-medium text-gray-500">
              Payment Methods
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">💵 Cash</span>
                <span className="text-green-600 font-semibold">
                  ₹
                  {parseFloat(data.cash_collection.toString()).toLocaleString(
                    "en-IN",
                    { maximumFractionDigits: 0 }
                  )}
                </span>
              </div>

              {parseFloat(data.card_collection.toString()) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">💳 Card</span>
                  <span className="text-blue-600 font-semibold">
                    ₹
                    {parseFloat(data.card_collection.toString()).toLocaleString(
                      "en-IN",
                      { maximumFractionDigits: 0 }
                    )}
                  </span>
                </div>
              )}

              {parseFloat(data.upi_collection.toString()) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">📱 UPI</span>
                  <span className="text-purple-600 font-semibold">
                    ₹
                    {parseFloat(data.upi_collection.toString()).toLocaleString(
                      "en-IN",
                      { maximumFractionDigits: 0 }
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between rounded-lg bg-primary-100 px-4 py-2 border border-primary-200">
            <span className="text-sm font-medium text-primary-600">
              View Details
            </span>
            <ChevronRight
              size={16}
              className="text-primary-600 transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
