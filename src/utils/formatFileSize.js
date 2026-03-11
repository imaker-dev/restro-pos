export const formatFileSize = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const size = bytes / Math.pow(k, i);

  return `${parseFloat(size.toFixed(decimals))} ${sizes[i]}`;
};