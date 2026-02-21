// ---------- TIME AGO ----------
export const timeAgo = (input) => {
  if (!input) return "Just now";

  const date = new Date(input);
  if (isNaN(date)) return "Invalid date";

  let diff = Date.now() - date.getTime();

  // Prevent negative time (future dates)
  if (diff < 0) diff = 0;

  const s = Math.floor(diff / 1000);
  if (s < 5) return "Just now";
  if (s < 60) return `${s}s ago`;

  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;

  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;

  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;

  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;

  const y = Math.floor(mo / 12);
  return `${y}y ago`;
};

// ---------- FORMAT DATE ----------
export const formatDate = (input, type = "short") => {
  if (!input) return "Not provided";

  const date = new Date(input);
  if (isNaN(date)) return "Invalid date";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[date.getMonth()];

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
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

      case "dayMonth":
    return `${day} ${monthName}`;


    case "time":
      return `${hours12}:${minutes} ${meridian}`;

    case "timeAgo":
      return timeAgo(date);

    default:
      return `${day}-${month}-${year}`;
  }
};

// ---------- INPUT FORMAT ----------
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date)) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
