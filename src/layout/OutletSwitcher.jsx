import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronsUpDown, Check } from "lucide-react";
import { setOutletId } from "../redux/slices/authSlice";

const OutletSwitcher = () => {
  const dispatch = useDispatch();
  const { meData, outletId } = useSelector((s) => s.auth);

  const outlets = meData?.outlets || [];
  if (!outlets.length) return null;

  const selectedOutlet =
    outlets.find((o) => o.id === Number(outletId)) || outlets[0];

  const handleChange = (outlet) => {
    dispatch(setOutletId(outlet.id));
  };

  // 👉 ONLY ONE OUTLET — NO DROPDOWN
  if (outlets.length === 1) {
    return (
      <div className="w-52">
        <div
          className="w-full flex items-center gap-3 px-3 py-1.5
          bg-gray-100 border border-gray-200
          rounded-lg text-gray-800 text-sm font-medium"
        >
          {selectedOutlet.name}
        </div>
      </div>
    );
  }

  // 👉 MULTIPLE OUTLETS — SHOW LISTBOX
  return (
    <div className="w-52">
      <Listbox value={selectedOutlet} onChange={handleChange}>
        <div className="relative">
          {/* BUTTON */}
          <Listbox.Button
            className="w-full flex items-center gap-3 px-3 py-1.5
            bg-gray-100 border border-gray-200
            rounded-lg text-left
            hover:bg-gray-200 transition"
          >
            <span className="flex-1 truncate text-sm font-medium text-gray-800">
              {selectedOutlet.name}
            </span>

            <ChevronsUpDown size={18} className="text-gray-500" />
          </Listbox.Button>

          {/* DROPDOWN */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options
              className="absolute mt-2 w-full overflow-hidden
              bg-gray-50 border border-gray-200
              rounded-lg shadow-sm z-50 outline-none ring-0"
            >
              {outlets.map((outlet) => (
                <Listbox.Option
                  key={outlet.id}
                  value={outlet}
                  className={({ active }) =>
                    `cursor-pointer select-none px-3 py-2
                    flex items-center gap-3 transition
                    ${active ? "bg-gray-100" : ""}`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`flex-1 truncate text-sm ${
                          selected
                            ? "font-semibold text-primary-600"
                            : "text-gray-700"
                        }`}
                      >
                        {outlet.name}
                      </span>

                      {selected && (
                        <Check size={16} className="text-primary-600" />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default OutletSwitcher;
