export const ORDER_STATUSES = {
  pending: {
    label: "Pending",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    dotColor: "bg-orange-500",
  },
  preparing: {
    label: "Preparing",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    dotColor: "bg-blue-500",
  },
  ready: {
    label: "Ready",
    color: "text-green-600",
    bgColor: "bg-green-50",
    dotColor: "bg-green-500",
  },
  served: {
    label: "Served",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    dotColor: "bg-purple-500",
  },

  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50",
    dotColor: "bg-red-500",
  },
};

export const STATUS_FLOW = ["pending", "preparing", "ready"]; // "served"
