import { SECTION_TYPES } from "../constants";

export const ORDER_STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Sent to Kitchen", value: "sent_to_kitchen" },
  { label: "Ready", value: "ready" },
  { label: "Served", value: "served" },
  { label: "Billed", value: "billed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export const ORDER_TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Dine In", value: "dine_in" },
  { label: "Takeaway", value: "takeaway" },
  { label: "Delivery", value: "delivery" },
];

export const PAYMENT_STATUS_OPTIONS = [
  { label: "All Payments", value: "" },
  { label: "Paid", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Partial", value: "partial" },
  { label: "Unpaid", value: "unpaid" },
];

export const SECTION_TYPE_OPTIONS = [
  { value: SECTION_TYPES.DINE_IN, label: "Dine In" },
  { value: SECTION_TYPES.TAKEAWAY, label: "Takeaway" },
  { value: SECTION_TYPES.DELIVERY, label: "Delivery" },
  { value: SECTION_TYPES.BAR, label: "Bar" },
  { value: SECTION_TYPES.ROOFTOP, label: "Rooftop" },
  { value: SECTION_TYPES.PRIVATE, label: "Private Dining" },
  { value: SECTION_TYPES.OUTDOOR, label: "Outdoor" },
  { value: SECTION_TYPES.AC, label: "AC Section" },
  { value: SECTION_TYPES.NON_AC, label: "Non-AC Section" },
];

export const SERVICE_TYPE_OPTIONS = [
  { label: "Restaurant", value: "restaurant" },
  { label: "Bar", value: "bar" },
  { label: "Both", value: "both" }, // default
];
