export function formatNumber(num, showRupee = false, decimals) {
  const parsed = Number(num);

  if (isNaN(parsed)) {
    return showRupee ? `₹${Number(0).toFixed(decimals)}` : Number(0).toFixed(decimals);
  }

  const formattedNumber = parsed.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return showRupee ? `₹${formattedNumber}` : formattedNumber;
}