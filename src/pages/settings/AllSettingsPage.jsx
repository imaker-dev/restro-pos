import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";
import {
  Printer,
  Percent,
  Layers,
  Settings,
  ChevronRight,
} from "lucide-react";

const settingsItems = [
  { title: "Printer Settings", path: "/settings/printer", icon: Printer },
  { title: "Tax Types", path: "/settings/tax-types", icon: Percent },
  { title: "Groups", path: "/settings/groups", icon: Layers },
  { title: "POS Settings", path: "/settings/pos", icon: Settings },
];

const AllSettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader title={"All Settings"} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="
                group
                bg-white
                border border-gray-200
                rounded-xl
                p-4
                cursor-pointer
                shadow-sm
                hover:shadow-md
                hover:border-gray-300
                transition
                flex items-center justify-between
              "
            >
              {/* Left Content */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gray-100 text-gray-700">
                  <Icon size={22} />
                </div>

                <div className="flex flex-col">
                  <h3 className="text-base font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    Manage {item.title.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div
                className="
                  text-gray-400
                  transition
                  opacity-100
                  lg:opacity-0
                  lg:group-hover:opacity-100
                "
              >
                <ChevronRight size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllSettingsPage;
