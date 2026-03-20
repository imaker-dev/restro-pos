import React, { useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";
import { Info, Loader2, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInventoryItems } from "../../redux/slices/inventorySlice";
import {
  createIngredient,
  fetchIngredientById,
  updateIngredient,
} from "../../redux/slices/ingredientSlice";
import { handleResponse } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/InfoCard";
import { useQueryParams } from "../../hooks/useQueryParams";

const AddIngredientPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ingredientId } = useQueryParams();
  const isEditMode = Boolean(ingredientId);

  const { outletId } = useSelector((state) => state.auth);
  const { allItemsData, isFetchingItems } = useSelector(
    (state) => state.inventory,
  );
  const { items } = allItemsData || {};

  const {
    isFetchingIngredientDetails,
    ingredientDetails,
    isCreatingIngredient,
    isUpdatingIngredient,
  } = useSelector((state) => state.ingredient);

  useEffect(() => {
    if (outletId) {
      dispatch(fetchAllInventoryItems(outletId));
    }
  }, [outletId, dispatch]);

  useEffect(() => {
    if (ingredientId) {
      dispatch(fetchIngredientById(ingredientId));
    }
  }, [ingredientId, dispatch]);

  // helper
  const getFieldError = (formik, name) => {
    const error = name
      .split(".")
      .reduce((acc, part) => acc?.[part], formik.errors);

    const touched = name
      .split(".")
      .reduce((acc, part) => acc?.[part], formik.touched);

    return touched && error ? error : null;
  };

  // initial values
  const getInitialValues = () => {
    if (!isEditMode || !ingredientDetails) {
      return {
        items: [
          {
            inventoryItemId: "",
            name: "",
            description: "",
            yieldPercentage: "",
            wastagePercentage: "",
            preparationNotes: "",
          },
        ],
      };
    }

    return {
      items: [
        {
          inventoryItemId: ingredientDetails.inventoryItemId || "",
          name: ingredientDetails.name || "",
          description: ingredientDetails.description || "",
          yieldPercentage: ingredientDetails.yieldPercentage || "",
          wastagePercentage: ingredientDetails.wastagePercentage || "",
          preparationNotes: ingredientDetails.preparationNotes || "",
        },
      ],
    };
  };

  const validationSchema = Yup.object({
    items: Yup.array().of(
      Yup.object({
        inventoryItemId: Yup.string().required("Inventory item is required"),
        name: Yup.string().required("Ingredient name is required"),
        yieldPercentage: Yup.number()
          .typeError("Enter valid number")
          .min(0)
          .max(100)
          .required("Yield is required"),
        wastagePercentage: Yup.number().min(0).max(100).notRequired(),
      }),
    ),
  });

  const handleSubmit = async (values) => {
    const item = values.items[0];

    const payload = {
      inventoryItemId: Number(item.inventoryItemId),
      name: item.name?.trim() || null,
      description: item.description?.trim() || null,
      yieldPercentage: Number(item.yieldPercentage),
      wastagePercentage: Number(item.wastagePercentage || 0),
      preparationNotes: item.preparationNotes?.trim() || null,
    };

    const action = isEditMode
      ? updateIngredient({ id: ingredientId, values: payload })
      : createIngredient({ outletId, values: { items: values.items } });

    await handleResponse(dispatch(action), () => {
      navigate("/ingredients");
    });
  };

  if (isEditMode && isFetchingIngredientDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Ingredient" : "Add Ingredients"}
        showBackButton
      />

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-6">
            <AccordionSection title="Ingredients" icon={Info}>
              <FieldArray name="items">
                {({ push, remove }) => (
                  <div className="space-y-6">
                    {formik.values.items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 flex items-center justify-center rounded-md bg-primary-100 text-primary-700 text-xs font-semibold">
                              {index + 1}
                            </div>
                            <h4 className="text-sm font-semibold text-gray-800">
                              Ingredient Details
                            </h4>
                          </div>

                          {!isEditMode && formik.values.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        <div className="p-5 space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField
                              label="Inventory Item"
                              name={`items.${index}.inventoryItemId`}
                              required
                              loading={isFetchingItems}
                              options={items?.map((i) => ({
                                value: i.id,
                                label: i.name,
                              }))}
                              value={item.inventoryItemId}
                              onChange={(e) => {
                                const value = e.target.value;
                                formik.setFieldValue(
                                  `items.${index}.inventoryItemId`,
                                  value,
                                );

                                const selected = items.find(
                                  (i) => i.id === Number(value),
                                );

                                if (selected) {
                                  formik.setFieldValue(
                                    `items.${index}.name`,
                                    selected.name,
                                  );
                                }
                              }}
                              onBlur={formik.handleBlur}
                              error={getFieldError(
                                formik,
                                `items.${index}.inventoryItemId`,
                              )}
                              placeholder="Select inventory item"
                              disabled={isEditMode}
                            />

                            <InputField
                              label="Ingredient Name"
                              name={`items.${index}.name`}
                              placeholder="Auto-filled or custom name"
                              value={item.name}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={getFieldError(
                                formik,
                                `items.${index}.name`,
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <InputField
                              label="Yield (%)"
                              name={`items.${index}.yieldPercentage`}
                              type="number"
                              placeholder="e.g. 80"
                              helperText="After prep usable quantity"
                              value={item.yieldPercentage}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={getFieldError(
                                formik,
                                `items.${index}.yieldPercentage`,
                              )}
                            />

                            <InputField
                              label="Wastage (%)"
                              name={`items.${index}.wastagePercentage`}
                              type="number"
                              placeholder="Optional"
                              helperText="Loss during cooking"
                              value={item.wastagePercentage}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </div>

                          <TextareaField
                            label="Preparation Notes"
                            name={`items.${index}.preparationNotes`}
                            placeholder="Wash, peel, chop..."
                            rows={2}
                            value={item.preparationNotes}
                            onChange={formik.handleChange}
                          />

                          <TextareaField
                            label="Description"
                            name={`items.${index}.description`}
                            placeholder="Optional description..."
                            rows={2}
                            value={item.description}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>
                    ))}

                    {!isEditMode && (
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            inventoryItemId: "",
                            name: "",
                            yieldPercentage: "",
                            wastagePercentage: "",
                          })
                        }
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 text-gray-600 hover:text-primary-600 transition"
                      >
                        <Plus size={16} />
                        Add Another Ingredient
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>
            </AccordionSection>

            <InfoCard
              type="info"
              title="Understanding Yield & Wastage"
              description={`Yield = usable portion after preparation.
              Example: 1kg → 800g usable → Yield = 80%.
              Raw Needed = Recipe Qty ÷ (Yield / 100)
              Wastage = additional cooking loss.
              Effective Qty = Recipe Qty × (1 + wastage%) × (100 / yield)`}
            />

           <div className="flex justify-end">
  <button
    type="submit"
    disabled={isCreatingIngredient || isUpdatingIngredient}
    className="btn bg-primary-500 hover:bg-primary-600 text-white font-medium flex items-center gap-2"
  >
    {(isCreatingIngredient || isUpdatingIngredient) && (
      <Loader2 className="w-4 h-4 animate-spin" />
    )}

    {isEditMode
      ? isUpdatingIngredient
        ? "Updating..."
        : "Update Ingredient"
      : isCreatingIngredient
        ? "Creating..."
        : "Create Ingredients"}
  </button>
</div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddIngredientPage;
