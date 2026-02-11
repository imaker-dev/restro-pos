import React, { useState, useMemo, useCallback } from "react";

const staffData = [
  { name: "Rahul Sharma", role: "Chef", served: 58, avatar: "/images/staff1.jpg" },
  { name: "Anita Verma", role: "Waiter", served: 51, avatar: "/images/staff2.jpg" },
  { name: "Mohit Singh", role: "Bartender", served: 46, avatar: "/images/staff3.jpg" },
  { name: "Pooja Patel", role: "Cashier", served: 39, avatar: "/images/staff4.jpg" },
  { name: "Arjun Mehta", role: "Waiter", served: 35, avatar: "/images/staff5.jpg" },
  { name: "Neha Gupta", role: "Chef", served: 30, avatar: "/images/staff6.jpg" },
];

const rankStyles = [
  "from-yellow-400 to-yellow-600 text-yellow-900",
  "from-gray-300 to-gray-500 text-gray-900",
  "from-orange-400 to-orange-600 text-orange-900",
];

const StaffCard = React.memo(({ staff, index }) => (
  <div
    className="group flex items-center justify-between p-4 rounded-2xl
    bg-white border border-gray-200
    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
  >
    {/* LEFT */}
    <div className="flex items-center gap-4">
      {/* AVATAR + RANK */}
      <div className="relative">
        <img
          src={staff.avatar}
          alt={staff.name}
          loading="lazy"
          className="w-11 h-11 rounded-full object-cover shadow-sm"
        />

        <span
          className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center
          rounded-full text-[10px] font-bold shadow border border-white
          bg-gradient-to-br ${
            rankStyles[index] || "from-blue-400 to-blue-500 text-white"
          }`}
        >
          {index + 1}
        </span>
      </div>

      {/* TEXT */}
      <div>
        <p className="text-sm font-semibold text-gray-900 group-hover:text-black">
          {staff.name}
        </p>
        <p className="text-[11px] text-gray-500">{staff.role}</p>
      </div>
    </div>

    {/* RIGHT – PERFORMANCE METRIC */}
    <div className="text-right">
      <p
        className={`text-lg font-bold leading-none ${
          index === 0
            ? "text-yellow-600"
            : index === 1
            ? "text-gray-700"
            : index === 2
            ? "text-orange-600"
            : "text-gray-900"
        }`}
      >
        {staff.served}
      </p>
      <p className="text-[11px] text-gray-500">Orders</p>
    </div>
  </div>
));

export default function StaffPerformance() {
  const [showAll, setShowAll] = useState(false);

  const items = useMemo(
    () => (showAll ? staffData : staffData.slice(0, 5)),
    [showAll]
  );

  const toggleView = useCallback(() => {
    setShowAll((p) => !p);
  }, []);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* HEADER */}
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Staff Performance
        </h2>
      </div>

      {/* LIST */}
      <div className="space-y-3 p-5">
        {items.map((staff, index) => (
          <StaffCard key={staff.name} staff={staff} index={index} />
        ))}

        {staffData.length > 5 && (
          <button
            onClick={toggleView}
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold
            bg-black text-white hover:bg-gray-900 transition"
          >
            {showAll ? "Show Less" : "View All Staff"}
          </button>
        )}
      </div>
    </div>
  );
}
