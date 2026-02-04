export const formatNumber = (num, type = "comma") => {
  // Validate number
  if (typeof num !== "number" || isNaN(num)) {
    return "Invalid number";
  }

  // Normalize type (lowercase)
  type = String(type).toLowerCase();

  if (type === "compact") {
    if (Math.abs(num) >= 1_000_000_000_000) {
      return (num / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
    } else if (Math.abs(num) >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (Math.abs(num) >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (Math.abs(num) >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    } else {
      return num.toString();
    }
  } else if (type === "comma") {
    return num.toLocaleString();
  }

  // Invalid type
  return "Invalid format type";
}
