export const formatDate = (input, type = "short") => {
  if (!input) return "Not provided";

  const date = new Date(input);
  if (isNaN(date)) return "Invalid date";

  // ---- timeAgo helper ----
  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthName = monthNames[date.getMonth()];

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const isPM = hours >= 12;
  const hours12 = hours % 12 || 12;
  const meridian = isPM ? "PM" : "AM";

  switch (type) {
    case "short":
      return `${day}-${month}-${year}`;

    case "shortTime":
      return `${day}-${month}-${year} ${hours12}:${minutes} ${meridian}`;

    case "long":
      return `${day} ${monthName}, ${year}`;

    case "longTime":
      return `${day} ${monthName}, ${year} ${hours12}:${minutes} ${meridian}`;

    case "timeAgo":
      return timeAgo(input);

    default:
      throw new Error("Unsupported format type");
  }
};


// Utils
export const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Convert to local timezone and format for datetime-local input
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
