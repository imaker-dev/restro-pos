import { useState, useRef } from "react";
import {
  Search,
  Clock,
  Star,
  ChevronLeft,
  Flame,
  Leaf,
  Plus,
  X,
  ChevronRight,
  Bell,
  SlidersHorizontal,
  LayoutGrid,
  List,
  UtensilsCrossed,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Breakfast",
  "Starters",
  "Mains",
  "Desserts",
  "Drinks",
];

const ITEMS = [
  {
    id: 1,
    name: "Pear & Orange Pancakes",
    category: "Breakfast",
    price: 520,
    rating: 4.8,
    time: 20,
    type: "veg",
    isNew: false,
    isBest: true,
    desc: "Fluffy buttermilk pancakes layered with caramelised pear and candied orange zest, finished with maple cream.",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
    addons: [
      { name: "Extra Syrup", price: 40 },
      { name: "Whipped Cream", price: 60 },
    ],
    variants: [
      { name: "Small (2 pcs)", price: 320 },
      { name: "Regular (4 pcs)", price: 520 },
    ],
  },
  {
    id: 2,
    name: "Egg & Sourdough",
    category: "Breakfast",
    price: 380,
    rating: 4.7,
    time: 10,
    type: "veg",
    isNew: false,
    isBest: false,
    desc: "Perfectly poached eggs on toasted sourdough with avocado spread and everything bagel seasoning.",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
    addons: [
      { name: "Extra Egg", price: 50 },
      { name: "Smoked Salmon", price: 140 },
    ],
    variants: [],
  },
  {
    id: 3,
    name: "Acai Power Bowl",
    category: "Breakfast",
    price: 460,
    rating: 4.9,
    time: 8,
    type: "veg",
    isNew: true,
    isBest: false,
    desc: "Thick acai base topped with granola, fresh seasonal berries, honey drizzle and coconut flakes.",
    image:
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80",
    addons: [],
    variants: [
      { name: "Small", price: 320 },
      { name: "Large", price: 460 },
    ],
  },
  {
    id: 4,
    name: "Meat & Mushroom Toast",
    category: "Starters",
    price: 620,
    rating: 5.0,
    time: 30,
    type: "non_veg",
    isNew: false,
    isBest: true,
    desc: "Wild mushroom and braised beef ragù on thick-cut brioche, topped with parmesan shavings and herb oil.",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80",
    addons: [{ name: "Extra Ragù", price: 90 }],
    variants: [],
  },
  {
    id: 5,
    name: "Crispy Calamari",
    category: "Starters",
    price: 480,
    rating: 4.6,
    time: 15,
    type: "non_veg",
    isNew: false,
    isBest: false,
    desc: "Tempura battered squid rings, sea salt dusted, with sriracha aioli and pickled cucumber.",
    image:
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80",
    addons: [{ name: "Extra Aioli", price: 40 }],
    variants: [
      { name: "Half", price: 280 },
      { name: "Full", price: 480 },
    ],
  },
  {
    id: 6,
    name: "Burrata & Tomato",
    category: "Starters",
    price: 540,
    rating: 4.8,
    time: 10,
    type: "veg",
    isNew: true,
    isBest: false,
    desc: "Fresh burrata on heirloom tomatoes, aged balsamic, Sicilian olive oil and fleur de sel.",
    image:
      "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400&q=80",
    addons: [],
    variants: [],
  },
  {
    id: 7,
    name: "Sweet Pancake Stack",
    category: "Mains",
    price: 340,
    rating: 4.9,
    time: 10,
    type: "veg",
    isNew: false,
    isBest: false,
    desc: "Ricotta pancakes with Nutella drizzle, fresh banana and toasted hazelnuts.",
    image:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80",
    addons: [{ name: "Ice Cream", price: 80 }],
    variants: [],
  },
  {
    id: 8,
    name: "Truffle Pasta",
    category: "Mains",
    price: 780,
    rating: 4.9,
    time: 25,
    type: "veg",
    isNew: true,
    isBest: true,
    desc: "House-made tagliatelle tossed in black truffle cream, aged pecorino and toasted breadcrumbs.",
    image:
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
    addons: [
      { name: "Extra Truffle", price: 160 },
      { name: "Parmesan", price: 60 },
    ],
    variants: [],
  },
  {
    id: 9,
    name: "Grilled Sea Bass",
    category: "Mains",
    price: 980,
    rating: 4.8,
    time: 28,
    type: "non_veg",
    isNew: false,
    isBest: false,
    desc: "Mediterranean herb-crusted sea bass fillet, fennel purée, confit cherry tomatoes.",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
    addons: [{ name: "Grilled Veggies", price: 110 }],
    variants: [],
  },
  {
    id: 10,
    name: "Crème Brûlée",
    category: "Desserts",
    price: 320,
    rating: 4.9,
    time: 12,
    type: "veg",
    isNew: false,
    isBest: true,
    desc: "Classic vanilla bean custard with a perfectly caramelised sugar crust. Served warm.",
    image:
      "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80",
    addons: [],
    variants: [],
  },
  {
    id: 11,
    name: "Chocolate Fondant",
    category: "Desserts",
    price: 380,
    rating: 4.8,
    time: 14,
    type: "veg",
    isNew: false,
    isBest: false,
    desc: "Warm 70% Valrhona chocolate fondant with a molten centre and salted caramel ice cream.",
    image:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
    addons: [{ name: "Extra Ice Cream", price: 70 }],
    variants: [],
  },
  {
    id: 12,
    name: "Mango Lassi",
    category: "Drinks",
    price: 220,
    rating: 4.7,
    time: 5,
    type: "veg",
    isNew: false,
    isBest: false,
    desc: "Thick Alphonso mango blended with chilled yoghurt, cardamom and a pinch of saffron.",
    image:
      "https://images.unsplash.com/photo-1571805618149-3a772570f94f?w=400&q=80",
    addons: [],
    variants: [
      { name: "Regular", price: 220 },
      { name: "Large", price: 300 },
    ],
  },
  {
    id: 13,
    name: "Cold Brew Coffee",
    category: "Drinks",
    price: 260,
    rating: 4.8,
    time: 3,
    type: "veg",
    isNew: true,
    isBest: false,
    desc: "18-hour cold steeped single origin Ethiopian coffee. Clean, smooth and naturally sweet.",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
    addons: [{ name: "Oat Milk", price: 30 }],
    variants: [
      { name: "Regular", price: 260 },
      { name: "Large", price: 320 },
    ],
  },
];

const formatPrice = (p) => `₹${p.toLocaleString("en-IN")}`;

function VegDot({ type, size = "md" }) {
  const outer =
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  const inner =
    size === "sm" ? "w-1.5 h-1.5" : size === "lg" ? "w-2.5 h-2.5" : "w-2 h-2";
  return (
    <div
      className={`${outer} rounded-sm border-2 bg-white flex items-center justify-center shrink-0 ${type === "veg" ? "border-emerald-500" : "border-red-500"}`}
    >
      <div
        className={`${inner} rounded-full ${type === "veg" ? "bg-emerald-500" : "bg-red-500"}`}
      />
    </div>
  );
}

// ─── Item Detail ──────────────────────────────────────────────────────────────
function ItemDetail({ item, onClose }) {
  const [selectedVariant, setSelectedVariant] = useState(
    item.variants[0] || null,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-lg bg-white sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        <div className="relative h-56 sm:h-68 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3.5 left-3.5 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-800" />
          </button>
          <div className="absolute bottom-3.5 left-4 right-4">
            <div className="flex gap-1.5 mb-1.5">
              {item.isBest && (
                <span className="text-[10px] font-bold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">
                  ⭐ Best Seller
                </span>
              )}
              {item.isNew && (
                <span className="text-[10px] font-bold bg-[#2d9e8f] text-white px-2 py-0.5 rounded-full">
                  ✦ New
                </span>
              )}
            </div>
            <div className="flex items-end justify-between gap-2">
              <h2 className="text-lg font-black text-white leading-tight">
                {item.name}
              </h2>
              <VegDot type={item.type} size="md" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-black text-[#2d9e8f]">
              {formatPrice(
                selectedVariant ? selectedVariant.price : item.price,
              )}
            </span>
            {item.variants.length > 0 && (
              <span className="text-xs text-gray-400">onwards</span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-amber-700">
                  {item.rating}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                <Clock size={10} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-600">
                  {item.time} min
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {item.desc}
          </p>

          {item.variants.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Choose Size
              </p>
              <div className="flex flex-wrap gap-2">
                {item.variants.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold border-2 transition-all ${selectedVariant?.name === v.name ? "bg-[#2d9e8f] text-white border-[#2d9e8f] shadow-md shadow-[#2d9e8f]/20" : "bg-white text-gray-600 border-gray-200 hover:border-[#2d9e8f]/50"}`}
                  >
                    {v.name}{" "}
                    <span
                      className={`ml-1 text-xs ${selectedVariant?.name === v.name ? "text-white/75" : "text-gray-400"}`}
                    >
                      {formatPrice(v.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.addons.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Add-ons Available
              </p>
              <div className="space-y-1.5">
                {item.addons.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <Plus size={11} className="text-[#2d9e8f]" />
                      <span className="text-sm font-semibold text-gray-700">
                        {a.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#2d9e8f]">
                      +{formatPrice(a.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-100 bg-white shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-2xl hover:bg-gray-800 transition-colors text-sm tracking-wide"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────
function GridCard({ item, onSelect }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-[#2d9e8f]/20 hover:-translate-y-0.5 flex flex-col"
    >
      {/* Image — shorter on mobile */}
      <div className="relative overflow-hidden h-28 sm:h-32">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-2 left-2 flex gap-1">
          {item.isBest && (
            <span className="text-[8px] font-bold bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full">
              Best
            </span>
          )}
          {item.isNew && (
            <span className="text-[8px] font-bold bg-[#2d9e8f] text-white px-1.5 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
        <div className="absolute bottom-2 left-2">
          <VegDot type={item.type} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight mb-1.5 line-clamp-2">
          {item.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
          <span className="text-[11px] font-bold text-gray-600">
            {item.rating}
          </span>
          <span className="text-gray-300 mx-0.5">·</span>
          <Clock size={10} className="text-gray-400 shrink-0" />
          <span className="text-[11px] text-gray-400">{item.time}m</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="min-w-0">
            <span className="font-black text-gray-900 text-xs sm:text-sm">
              {formatPrice(item.price)}
            </span>
            {item.variants.length > 0 && (
              <span className=" text-gray-400 ml-0.5 hidden sm:inline">+</span>
            )}
          </div>
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#2d9e8f] rounded-full flex items-center justify-center shadow-sm shadow-[#2d9e8f]/30 shrink-0">
            <Plus size={12} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────
function ListRow({ item, onSelect }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100 hover:border-[#2d9e8f]/25 flex items-stretch h-20 sm:h-24"
    >
      {/* Image — fixed square */}
      <div className="relative w-20 sm:w-24 shrink-0 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5" />
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
          {item.isBest && (
            <span className="text-[7px] font-bold bg-amber-400 text-amber-900 px-1 py-0.5 rounded-full leading-none">
              Best
            </span>
          )}
          {item.isNew && (
            <span className="text-[7px] font-bold bg-[#2d9e8f] text-white px-1 py-0.5 rounded-full leading-none">
              New
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 px-3 py-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1.5">
          <VegDot type={item.type} size="sm" />
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 flex-1">
            {item.name}
          </h3>
        </div>

        {/* Description — hidden on mobile */}
        <p className="hidden sm:block text-[11px] text-gray-400 leading-relaxed line-clamp-1 mt-0.5">
          {item.desc}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-black text-gray-900 text-xs sm:text-sm">
            {formatPrice(item.price)}
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star size={9} className="text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-gray-600">
                {item.rating}
              </span>
            </div>
            <span className="text-gray-200">·</span>
            <div className="flex items-center gap-0.5 text-gray-400">
              <Clock size={9} />
              <span className="text-[11px]">{item.time}m</span>
            </div>
            {/* Extra tags — desktop only */}
            {item.variants.length > 0 && (
              <span className="hidden md:inline text-[9px] font-semibold text-[#2d9e8f] bg-[#2d9e8f]/8 border border-[#2d9e8f]/20 px-1.5 py-0.5 rounded-md">
                {item.variants.length} sizes
              </span>
            )}
            {item.addons.length > 0 && (
              <span className="hidden md:inline text-[9px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-md">
                +add-ons
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center pr-2.5 shrink-0">
        <div className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-[#2d9e8f]/10 flex items-center justify-center transition-colors">
          <ChevronRight
            size={11}
            className="text-gray-400 group-hover:text-[#2d9e8f] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PublicMenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [vegFilter, setVegFilter] = useState("all");
  const catRef = useRef(null);

  const filtered = ITEMS.filter((item) => {
    const matchCat =
      activeCategory === "All" || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    const matchVeg = vegFilter === "all" || item.type === vegFilter;
    return matchCat && matchSearch && matchVeg;
  });

  const scrollCat = (cat) => {
    setActiveCategory(cat);
    if (catRef.current) {
      const btns = catRef.current.querySelectorAll("button");
      const idx = CATEGORIES.indexOf(cat);
      btns[idx]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f7f8fa]"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── HEADER ── compact, everything in 2 tight rows ────────────────── */}
      <div className="bg-white sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          {/* Row 1: brand + search + controls */}
          <div className="flex items-center gap-2 py-2.5">
            {/* Brand — icon + name, very compact */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-7 h-7 bg-[#2d9e8f] rounded-lg flex items-center justify-center shadow-sm shadow-[#2d9e8f]/25">
                <UtensilsCrossed size={13} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black text-gray-900 leading-none">
                  City View
                </p>
                <p className="text-[9px] text-gray-400 leading-none mt-0.5">
                  Restaurant
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-gray-200 mx-0.5" />

            {/* Search — grows to fill */}
            <div className="relative flex-1">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className="w-full bg-gray-100 rounded-lg pl-8.5 pr-8 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#2d9e8f]/25 transition-all"
                style={{ paddingLeft: "2rem" }}
              />
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X size={12} className="text-gray-400" />
                </button>
              ) : (
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <SlidersHorizontal size={12} className="text-gray-400" />
                </button>
              )}
            </div>

            {/* Veg filter */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 shrink-0">
              <button
                onClick={() =>
                  setVegFilter(vegFilter === "veg" ? "all" : "veg")
                }
                className={`flex items-center gap-1 w-7 h-7 px-2 py-1.5 rounded-md text-[11px] font-bold transition-all ${vegFilter === "veg" ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500"}`}
              >
                <Leaf size={10} />
                {/* <span className="hidden sm:inline">Veg</span> */}
              </button>
              <button
                onClick={() =>
                  setVegFilter(vegFilter === "non_veg" ? "all" : "non_veg")
                }
                className={`flex items-center gap-1 w-7 h-7 px-2 py-1.5 rounded-md text-[11px] font-bold transition-all ${vegFilter === "non_veg" ? "bg-red-400 text-white shadow-sm" : "text-gray-500"}`}
              >
                <Flame size={10} />
                {/* <span className="hidden sm:inline">Non</span> */}
              </button>
            </div>

            {/* View toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${viewMode === "grid" ? "bg-white text-[#2d9e8f] shadow-sm" : "text-gray-400"}`}
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${viewMode === "list" ? "bg-white text-[#2d9e8f] shadow-sm" : "text-gray-400"}`}
              >
                <List size={13} />
              </button>
            </div>
          </div>

          {/* Row 2: category pills only */}
          <div
            ref={catRef}
            className="flex gap-1.5 overflow-x-auto pb-2 hide-scrollbar"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollCat(cat)}
                className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#2d9e8f] text-white shadow-sm shadow-[#2d9e8f]/25"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 pt-3 pb-8">
        {/* Best Sellers strip */}
        {activeCategory === "All" && !search && vegFilter === "all" && (
          <section className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-black text-gray-900">Best Sellers</h2>
              <button className="flex items-center gap-0.5 text-[11px] font-bold text-[#2d9e8f]">
                See all <ChevronRight size={11} />
              </button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-0.5">
              {ITEMS.filter((i) => i.isBest).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="shrink-0 w-28 sm:w-32 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className="relative h-18 sm:h-20"
                    style={{ height: "72px" }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 left-1.5">
                      <VegDot type={item.type} size="sm" />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-gray-900 truncate leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[11px] font-black text-[#2d9e8f] mt-0.5">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section label */}
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-black text-gray-900">
            {activeCategory === "All" ? "All Dishes" : activeCategory}
            <span className="ml-1.5 text-xs font-semibold text-gray-400">
              ({filtered.length})
            </span>
          </h2>
          {(search || vegFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setVegFilter("all");
              }}
              className="text-[11px] text-[#2d9e8f] font-bold flex items-center gap-1"
            >
              <X size={10} /> Clear
            </button>
          )}
        </div>

        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-gray-700 font-bold mb-1">Nothing found</p>
            <p className="text-gray-400 text-sm mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
                setVegFilter("all");
              }}
              className="bg-[#2d9e8f] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#26887a] transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6  gap-2 sm:gap-3">
            {filtered.map((item) => (
              <GridCard key={item.id} item={item} onSelect={setSelectedItem} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
            {filtered.map((item) => (
              <ListRow key={item.id} item={item} onSelect={setSelectedItem} />
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}
