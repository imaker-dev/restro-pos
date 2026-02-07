const FoodTypeIcon = ({ type, size = "sm" }) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
  };

  const dotSizeClasses = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
  };

  let borderColor = "border-gray-400";
  let dotColor = "bg-gray-400";

  const value = type?.toLowerCase();

  if (value === "veg") {
    borderColor = "border-green-600";
    dotColor = "bg-green-600";
  } else if (value === "non-veg") {
    borderColor = "border-red-600";
    dotColor = "bg-red-600";
  }

  return (
    <div
      className={`${sizeClasses[size]} border ${borderColor} rounded flex items-center justify-center flex-shrink-0`}
    >
      <div
        className={`${dotSizeClasses[size]} rounded-full ${dotColor}`}
      />
    </div>
  );
};

export default FoodTypeIcon;
