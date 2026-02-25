import React, { useState } from "react";
import Papa from "papaparse";
import PageHeader from "../../layout/PageHeader";
import { UploadCloud, AlertTriangle } from "lucide-react";

const headers = [
  "outletId",
  "categoryId",
  "name",
  "description",
  "itemType",
  "taxGroupId",
  "kitchenStationId",
  "hasVariants",
  "variantName",
  "variantPrice",
  "isDefault",
  "basePrice",
  "hasAddons",
  "addonGroupIds",
  "allowSpecialNotes",
  "minQuantity",
  "maxQuantity",
  "imageUrl",
];

const AddBulkItemPage = () => {
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});

  /* ------------------------------
     FILE PARSE
  ------------------------------ */
  const handleFileUpload = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(results.data);
        validate(results.data);
      },
    });
  };

  /* ------------------------------
     HANDLE CELL CHANGE
  ------------------------------ */
  const handleChange = (rowIndex, field, value) => {
    const updated = [...rows];
    updated[rowIndex][field] = value;
    setRows(updated);
    validate(updated);
  };

  /* ------------------------------
     VALIDATION PER ROW
  ------------------------------ */
  const validate = (data) => {
    const newErrors = {};

    data.forEach((row, index) => {
      const rowErrors = {};

      if (!row.outletId) rowErrors.outletId = "Required";
      if (!row.categoryId) rowErrors.categoryId = "Required";
      if (!row.name) rowErrors.name = "Required";
      if (!row.taxGroupId) rowErrors.taxGroupId = "Required";
      if (!row.kitchenStationId)
        rowErrors.kitchenStationId = "Required";

      if (row.hasVariants === "true") {
        if (!row.variantName)
          rowErrors.variantName = "Required";
        if (!row.variantPrice)
          rowErrors.variantPrice = "Required";
      } else {
        if (!row.basePrice)
          rowErrors.basePrice = "Required";
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[index] = rowErrors;
      }
    });

    setErrors(newErrors);
  };

  /* ------------------------------
     UPLOAD
  ------------------------------ */
  const handleUpload = async () => {
    if (Object.keys(errors).length > 0) return;

    console.log("Uploading cleaned rows:", rows);

    // send rows to backend
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Bulk Upload Items" showBackButton />

      {/* Upload Section */}
      <div className="border-2 border-dashed p-6 rounded-lg text-center">
        <UploadCloud className="mx-auto mb-2" />
        <input
          type="file"
          accept=".csv"
          onChange={(e) =>
            handleFileUpload(e.target.files[0])
          }
        />
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-600">
          <AlertTriangle size={16} />
          {Object.keys(errors).length} rows contain errors
        </div>
      )}

      {/* Editable Table */}
      {rows.length > 0 && (
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left border"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((field) => (
                    <td
                      key={field}
                      className={`border px-2 py-1 ${
                        errors[rowIndex]?.[field]
                          ? "bg-red-100"
                          : ""
                      }`}
                    >
                      <input
                        type="text"
                        value={row[field] || ""}
                        onChange={(e) =>
                          handleChange(
                            rowIndex,
                            field,
                            e.target.value
                          )
                        }
                        className="w-full outline-none bg-transparent"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Button */}
      {rows.length > 0 && (
        <div className="flex justify-end">
          <button
            disabled={Object.keys(errors).length > 0}
            onClick={handleUpload}
            className="btn bg-primary-500 text-white"
          >
            Upload Items
          </button>
        </div>
      )}
    </div>
  );
};

export default AddBulkItemPage;