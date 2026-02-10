import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Ellipsis, Loader2, MoreVertical } from "lucide-react";

const COLOR_STYLES = {
  slate: {
    text: "text-slate-700",
    active: "bg-slate-100 text-slate-900",
  },
  emerald: {
    text: "text-emerald-600",
    active: "bg-emerald-100 text-emerald-700",
  },
  yellow: {
    text: "text-yellow-600",
    active: "bg-yellow-100 text-yellow-700",
  },
  blue: {
    text: "text-blue-600",
    active: "bg-blue-100 text-blue-700",
  },
  red: {
    text: "text-red-600",
    active: "bg-red-100 text-red-700",
  },
  amber: {
    text: "text-amber-600",
    active: "bg-amber-100 text-amber-700",
  },

  violet: {
    text: "text-violet-600",
    active: "bg-violet-100 text-violet-700",
  },
  indigo: {
    text: "text-indigo-600",
    active: "bg-indigo-100 text-indigo-700",
  },
  cyan: {
    text: "text-cyan-600",
    active: "bg-cyan-100 text-cyan-700",
  },
  rose: {
    text: "text-rose-600",
    active: "bg-rose-100 text-rose-700",
  },
  teal: {
    text: "text-teal-600",
    active: "bg-teal-100 text-teal-700",
  },
};

const ActionMenu = ({
  items = [],
  loading = false,
  disabled = false,
  width = "w-52",
}) => {
  const getColorStyle = (color) => {
    return COLOR_STYLES[color] ?? COLOR_STYLES.slate;
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        aria-label="Open actions menu"
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MoreVertical className="w-4 h-4" />
        )}
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className={`${width} origin-top-right rounded-md border border-slate-200 bg-white shadow-lg focus:outline-none z-[9999]`}
      >
        {items.map((item, index) => {
          const color = getColorStyle(item.color);

          return (
            <MenuItem key={index} disabled={item.disabled}>
              {({ active, disabled }) => (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    item.onClick?.();
                  }}
                  disabled={disabled}
                  className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition ${
                    disabled
                      ? "text-slate-400 cursor-not-allowed"
                      : active
                        ? color.active
                        : color.text
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </button>
              )}
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
};

export default ActionMenu;
