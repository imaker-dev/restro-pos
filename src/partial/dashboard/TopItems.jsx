import React, { useState, useMemo, useCallback } from "react";

const topItemsData = [
  {
    name: "Chicken Biryani",
    sold: 45,
    value: 285,
    image: "/images/biryani.jpg",
  },
  { name: "Butter Chicken", sold: 38, value: 245, image: "/images/butter.jpg" },
  {
    name: "Tandoori Chicken",
    sold: 31,
    value: 198,
    image: "/images/tandoori.jpg",
  },
  { name: "Paneer Tikka", sold: 26, value: 165, image: "/images/paneer.jpg" },
  { name: "Garlic Naan", sold: 52, value: 142, image: "/images/naan.jpg" },
  { name: "Veg Fried Rice", sold: 29, value: 121, image: "/images/rice.jpg" },
  { name: "Hakka Noodles", sold: 24, value: 110, image: "/images/noodles.jpg" },
];

const rankBadgeStyles = [
  "from-yellow-400 to-yellow-600 text-yellow-900", // 1
  "from-gray-300 to-gray-500 text-gray-900", // 2
  "from-orange-400 to-orange-600 text-orange-900", // 3
];

const ItemCard = React.memo(({ item, index }) => (
  <div
    className="group flex items-center justify-between p-4 rounded-2xl
    bg-white/80 backdrop-blur border border-gray-200
    hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
  >
    {/* LEFT */}
    <div className="flex items-center gap-4">
      {/* IMAGE + RANK BADGE */}
      <div className="relative">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="w-11 h-11 rounded-md object-cover shadow-sm"
        />

        {/* RANK BADGE */}
        <span
          className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center
          rounded-full text-[10px] font-bold shadow border border-white
          bg-gradient-to-br ${
            rankBadgeStyles[index] || "from-blue-400 to-blue-500 text-white"
          }`}
        >
          {index + 1}
        </span>
      </div>

      {/* TEXT */}
      <div>
        <p className="text-sm font-semibold text-gray-900 group-hover:text-black transition">
          {item.name}
        </p>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] text-gray-500 tracking-wide">
            Popular Choice
          </span>
        </div>
      </div>
    </div>

    {/* RIGHT — MAIN SOLD METRIC */}
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
        {item.sold}
      </p>
      <p className="text-[11px] text-gray-500">Sold</p>
    </div>
  </div>
));

export default function TopItems() {
  const [showAll, setShowAll] = useState(false);

  const items = useMemo(
    () => (showAll ? topItemsData : topItemsData.slice(0, 5)),
    [showAll],
  );

  const toggleView = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">
          Top Selling Items
        </h2>
      </div>

      {/* ITEMS */}
      <div className="space-y-3 p-5">
        {items.map((item, index) => (
          <ItemCard key={item.name} item={item} index={index} />
        ))}

        {/* TOGGLE BUTTON */}
        {topItemsData.length > 5 && (
          <button
            onClick={toggleView}
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold
            bg-black text-white hover:bg-gray-900 transition"
          >
            {showAll ? "Show Less" : "View All Items"}
          </button>
        )}
      </div>
    </div>
  );
}
