import React from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";

const NoDataFound = ({
  title = "No data available",
  description = "There is nothing to display at the moment.",
  icon: Icon = Package,
  className = "",
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      className={`py-16 flex flex-col items-center justify-center text-center px-4 ${className}`}
    >
      {Icon && <Icon className="w-12 h-12 text-gray-300 mb-4" />}

      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h2>

      {description && (
        <p className="text-gray-500 text-sm md:text-base mb-4">{description}</p>
      )}

      {showBackButton && (
        <button
          onClick={handleGoBack}
          className="btn  bg-secondary text-white hover:bg-secondary-600"
        >
          Go Back
        </button>
      )}
    </div>
  );
};

export default NoDataFound;
