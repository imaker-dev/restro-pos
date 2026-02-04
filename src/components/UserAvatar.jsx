// components/UserAvatar.jsx
import React from "react";

function getColorFromName(name = "") {
  const colors = [
    "#D32F2F", // Red 700
    "#C2185B", // Pink 700
    "#7B1FA2", // Purple 700
    "#512DA8", // Deep Purple 700
    "#303F9F", // Indigo 700
    "#1976D2", // Blue 700
    "#0288D1", // Light Blue 700
    "#0097A7", // Cyan 700
    "#00796B", // Teal 700
    "#388E3C", // Green 700
    "#689F38", // Light Green 700
    "#F57C00", // Orange 700
    "#E64A19", // Deep Orange 700
    "#5D4037", // Brown 700
    "#455A64", // Blue Grey 700
  ];

  if (!name) return "#9E9E9E"; // neutral grey

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}


export default function UserAvatar({
  url,
  name = "",
  status,
  className = "",
  rounded = true,
  preview = false,
}) {
  const letter = name?.trim()?.[0]?.toUpperCase() || "?";
  const bgColor = getColorFromName(name);

  const handlePreview = () => {
    if (preview && avatarUrl) {
      window.open(avatarUrl, "_blank");
    }
  };

  return (
    <div
      title={name}
      onClick={handlePreview}
      className={`
        relative inline-flex items-center justify-center
        overflow-hidden shadow-sm ring-1 ring-black/5 select-none
        ${rounded ? "rounded-full" : "rounded-md"}
        ${preview ? "cursor-pointer" : "cursor-default"}
        ${className}
      `}
    >
      {url ? (
        <img
          src={url}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "")}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="40"
              fill="white"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
            >
              {letter}
            </text>
          </svg>
        </div>
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full ring-2 ring-white
            ${status === "online" && "bg-green-500"}
            ${status === "busy" && "bg-red-500"}
            ${status === "away" && "bg-yellow-400"}
            ${status === "offline" && "bg-gray-400"}
          `}
          style={{
            width: "25%",
            height: "25%",
          }}
        />
      )}
    </div>
  );
}
