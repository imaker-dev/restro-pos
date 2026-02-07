import React, { useEffect } from "react";
import PageHeader from "../../../layout/PageHeader";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaxGroupById } from "../../../redux/slices/taxSlice";
import { Percent, CheckCircle2, XCircle, Layers } from "lucide-react";

const TaxGroupDetailsPage = () => {
  const { groupId } = useQueryParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (groupId) dispatch(fetchTaxGroupById(groupId));
  }, [groupId]);

  const { isFetchingTaxGroupDetails, taxGroupDetails } = useSelector(
    (state) => state.tax,
  );

  if (isFetchingTaxGroupDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="animate-pulse text-lg font-medium">
          Loading Tax Group...
        </div>
      </div>
    );
  }

  if (!taxGroupDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        No Tax Group Found
      </div>
    );
  }

  const { name, code, total_rate, is_inclusive, is_active, components } =
    taxGroupDetails;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={name}
        badge={[
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-50 border border-gray-200 text-gray-700 ">
            <span className="font-medium">{total_rate}%</span>
          </div>,

          <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 text-gray-700  font-medium">
            {is_inclusive ? "Inclusive Tax" : "Exclusive Tax"}
          </div>,

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-md border  font-medium ${
              is_active
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {is_active ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {is_active ? "Active" : "Inactive"}
          </div>,
        ]}
        showBackButton
      />

      {/* Components */}
      <div>
        {components?.length === 0 ? (
          <div className="text-gray-400 text-center py-10 border rounded-xl bg-gray-50">
            No Components Added
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {components?.map((comp) => (
              <div
                key={comp.id}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition">
                    {comp.name}
                  </h4>

                  <span className="text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                    {comp.rate}%
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-">
                  Applied to this tax group
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxGroupDetailsPage;
