import Shimmer from "../../layout/Shimmer";

export default function DailySalesDetailsPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ================= HEADER ================= */}
      <div className="space-y-2">
        <Shimmer width="180px" height="22px" />
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3"
          >
            <Shimmer height="14px" width="40%" />
            <Shimmer height="28px" width="60%" />
            <Shimmer height="12px" width="80%" />
          </div>
        ))}
      </div>

      {/* ================= BREAKDOWN SECTION ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="border-b border-gray-200 p-4">
              <Shimmer height="18px" width="40%" />
            </div>

            <div className="p-4 space-y-4">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex justify-between items-center">
                  <Shimmer height="14px" width="40%" />
                  <Shimmer height="16px" width="50px" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ================= PAYMENT + FINANCIAL ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="border-b border-gray-200 p-4">
              <Shimmer height="18px" width="50%" />
            </div>

            <div className="p-4 space-y-4">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex justify-between">
                  <Shimmer height="14px" width="40%" />
                  <Shimmer height="16px" width="60px" />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-4 flex justify-between">
              <Shimmer height="16px" width="40%" />
              <Shimmer height="22px" width="80px" />
            </div>
          </div>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <Shimmer width="120px" height="18px" />
        </div>

        <div className="p-4 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="grid grid-cols-9 gap-4 items-center">
              <Shimmer height="14px" />
              <Shimmer height="14px" />
              <Shimmer height="14px" />
              <Shimmer height="14px" />
              <Shimmer height="14px" />
              <Shimmer height="14px" />
              <Shimmer height="14px" />
              <Shimmer height="14px" />
              <Shimmer height="28px" rounded="lg" />
            </div>
          ))}
        </div>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Shimmer key={i} width="32px" height="32px" rounded="lg" />
        ))}
      </div>
    </div>
  );
}
