import React from "react";
import {
  ArrowLeft,
  Loader2,
  ChevronRight,
  Home,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const buttonVariants = {
  primary: "bg-primary-500 text-white hover:bg-primary-600",
  secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
  info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  export:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
};

const PageHeader = ({
  title,
  description,
  showBackButton = false,
  actions = [],
  badge = null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------------- BREADCRUMB ---------------- */
const generateBreadcrumbs = () => {
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center flex-wrap text-sm text-gray-500 gap-1">
      <Link
        to="/"
        className="hover:text-primary-600 transition-colors font-medium"
      >
        Dashboard
      </Link>

      {paths.map((segment, index) => {
        const routeTo = "/" + paths.slice(0, index + 1).join("/");
        const isLast = index === paths.length - 1;

        const label =
          segment.charAt(0).toUpperCase() +
          segment.slice(1).replace(/-/g, " ");

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />

            {isLast ? (
              <span className="font-semibold text-gray-800 truncate max-w-[150px]">
                {label}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary-600 transition-colors truncate max-w-[140px]"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};


  return (
    <header className="flex flex-col gap-4 sm:gap-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-4 w-full">
        {/* Title Section */}
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="flex-shrink-0 p-2 sm:p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
              {title}
            </h1>

            {description ? (
              <p className="text-gray-600 mt-1 text-sm sm:text-base line-clamp-2">
                {description}
              </p>
            ) : (
              <div className="mt-2">{generateBreadcrumbs()}</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {badge && <div>{badge}</div>}

          {actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {actions.map((action, index) => {
                const variantClass =
                  buttonVariants[action.type] || buttonVariants.secondary;

                const ActionIcon = action.icon;
                const isDisabled = action.loading || action.disabled;

                const content = (
                  <>
                    {action.loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      ActionIcon && <ActionIcon className="h-4 w-4 mr-2" />
                    )}
                    <span className="whitespace-nowrap">
                      {action.loading
                        ? action.loadingText || action.label
                        : action.label}
                    </span>
                  </>
                );

                /* LINK ACTION */
                if (action.href) {
                  return (
                    <a
                      key={index}
                      href={action.href}
                      target={action.target || "_blank"}
                      rel="noopener noreferrer"
                      className={`btn lg:btn-lg ${variantClass} flex items-center ${
                        isDisabled ? "pointer-events-none opacity-70" : ""
                      }`}
                    >
                      {content}
                    </a>
                  );
                }

                /* BUTTON ACTION */
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={action.onClick}
                    disabled={isDisabled}
                    className={`btn lg:btn-lg ${variantClass} flex items-center ${
                      isDisabled ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
