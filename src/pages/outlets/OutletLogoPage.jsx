import React, { useEffect, useState } from "react";
import PageHeader from "../../layout/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOutletPrintLogo,
  updateOutletPrintLogo,
} from "../../redux/slices/outletSlice";
import DragDropUploader from "../../components/DragDropUploader";
import ToggleField from "../../components/fields/ToggleField";
import { Loader2, Save, Pencil, X, ImageIcon } from "lucide-react";
import { handleResponse } from "../../utils/helpers";
import LoadingOverlay from "../../components/LoadingOverlay";

const OutletLogoPage = () => {
  const dispatch = useDispatch();

  const { outletId } = useSelector((state) => state.auth);

  const {
    outletPrintLogo,
    isFetchingOutletPrintLogo,
    isUpdatingOutletPrintLogo,
  } = useSelector((state) => state.outlet);

  const [logo, setLogo] = useState([]);
  const [printLogoEnabled, setPrintLogoEnabled] = useState(false);
  const [editing, setEditing] = useState(false);

  // Sync toggle with API
  useEffect(() => {
    if (outletPrintLogo) {
      setPrintLogoEnabled(outletPrintLogo.printLogoEnabled);
    }
  }, [outletPrintLogo]);

  const fetchLogo = () => {
    dispatch(fetchOutletPrintLogo(outletId));
  };

  useEffect(() => {
    if (outletId) fetchLogo();
  }, [dispatch, outletId]);

const handleSubmit = async () => {
  const values = {
    printLogoUrl: logo.length ? logo[0] : null,
    printLogoEnabled: printLogoEnabled,
  };

  await handleResponse(
    dispatch(
      updateOutletPrintLogo({
        outletId,
        values,
      }),
    ),
    () => {
      setEditing(false);
      setLogo([]);
      fetchLogo();
    },
  );
};

  if (isFetchingOutletPrintLogo) {
    return <LoadingOverlay />;
  }

  console.log(logo)

  return (
    <div className="space-y-6">
      <PageHeader title="Receipt Logo" />

      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Outlet</p>
            <p className="text-sm font-semibold text-gray-800">
              {outletPrintLogo?.outletName}
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn bg-primary-500 text-white hover:bg-primary-600"
            >
              <Pencil size={15} className="mr-2" />
              Update Logo
            </button>
          )}
        </div>

        {/* Logo Preview */}
        <div className="bg-gray-50 rounded-lg p-10 flex flex-col items-center justify-center border border-gray-200">
          {outletPrintLogo?.printLogoUrl ? (
            <img
              src={outletPrintLogo.printLogoUrl}
              alt="Receipt Logo"
              className="h-[90px] object-contain"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400 gap-2">
              <ImageIcon size={36} />
              <p className="text-sm">No logo uploaded</p>
            </div>
          )}

          <span className="text-xs text-gray-500 mt-3">
            Logo displayed on printed receipts
          </span>
        </div>

        {/* Edit Section */}
        {editing && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
            {/* Toggle */}
            <ToggleField
              label="Enable Receipt Logo"
              description="Show logo on printed receipts"
              checked={printLogoEnabled}
              onChange={(val) => setPrintLogoEnabled(val)}
            />

            {/* Logo Upload */}
            {printLogoEnabled && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Upload New Logo
                </p>

                <DragDropUploader
                  value={logo}
                  onChange={(files) => setLogo(files)}
                  multiple={false}
                  accept="image/png,image/jpeg"
                  maxFiles={1}
                  maxSize={100 * 1024}
                  enableCrop={true}
                  aspectRatio={3/2}
                  uploadToServer={true}
                />
              </div>
            )}

            {/* Guidelines */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 border border-gray-200">
              <p className="font-medium text-gray-800 mb-2">Recommended</p>

              <ul className="space-y-1 list-disc list-inside">
                <li>PNG format</li>
                <li>300 × 100 pixels</li>
                <li>Under 100KB</li>
                <li>Black & white for better receipt printing</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditing(false);
                  setLogo([]);
                }}
                className="btn border border-gray-300 hover:bg-gray-100"
              >
                <X size={15} className="mr-2" />
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={isUpdatingOutletPrintLogo}
                className="btn bg-primary-500 text-white hover:bg-primary-600"
              >
                {isUpdatingOutletPrintLogo ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <Save size={15} className="mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutletLogoPage;
