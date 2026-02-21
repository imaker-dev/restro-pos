import React from "react";
import ModalBasic from "../../components/ModalBasic";
import { Loader2 } from "lucide-react";

const RemoveStationFromUserModal = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  loading = false,
}) => {
  const station = user?.station;

  const handleRemove = async () => {
    if (!station) return;

    await onSubmit({
      userId: user.id,
      stationId: station.stationId,
    });
  };

  return (
    <ModalBasic
      id="remove-station-user"
      title="Remove Station"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="p-5 space-y-5">
        {/* USER INFO */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-800">
            {user?.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            You are about to remove the assigned station.
          </p>
        </div>

        {/* STATION INFO */}
        {!station ? (
          <div className="text-sm text-slate-400 italic">
            No station assigned.
          </div>
        ) : (
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-red-700">
                {station.stationName}
              </span>

              <span className="text-xs text-red-600 font-mono">
                {station.stationCode}
              </span>

              {station.isPrimary && (
                <span className="text-xs text-amber-600 mt-1">
                  Primary Station
                </span>
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="btn border border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleRemove}
            disabled={!station || loading}
            className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Removing..." : "Remove Station"}
          </button>
        </div>
      </div>
    </ModalBasic>
  );
};

export default RemoveStationFromUserModal;