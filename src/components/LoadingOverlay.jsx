import { RefreshCw } from "lucide-react";

export default function LoadingBlock({
  show = false,
  text = "Loading...",
}) {
  if (!show) return null;

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-[80dvh]"
    >
      <RefreshCw className="w-6 h-6 animate-spin text-gray-500 mb-2" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}
