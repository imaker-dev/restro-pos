import React, { useRef, useEffect, useState } from "react";

export default function Tabs({ tabs = [], value, onChange }) {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.id === value);

    if (tabsRef.current[activeIndex]) {
      const tabElement = tabsRef.current[activeIndex];
      setIndicatorStyle({
        left: tabElement.offsetLeft,
        width: tabElement.offsetWidth,
      });
    }
  }, [value, tabs]);

  return (
    <div className="relative flex justify-center sm:justify-start">
      <div className="flex w-full sm:w-auto bg-gray-200 p-1 rounded-lg relative overflow-hidden">
        {/* Sliding Background */}
        <span
          className="absolute top-1 bottom-1 bg-white rounded-lg transition-all duration-300 ease-in-out"
          style={{
            left: indicatorStyle.left || 0,
            width: indicatorStyle.width || 0,
          }}
        />

        {tabs.map((tab, index) => {
          const isActive = value === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={index}
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => onChange(tab.id)}
              title={tab.title || tab.label}
              className={`
                relative flex items-center justify-center gap-2
                transition-all duration-200
                rounded-lg px-3 sm:px-4 py-2 text-sm font-medium
                w-full sm:w-auto
                ${
                  isActive
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-800"
                }
              `}
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span className="hidden sm:inline">{tab.label}</span>

              {tab.badgeCount > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
