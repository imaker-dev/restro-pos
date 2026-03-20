import React, { useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import PageHeader from "../../layout/PageHeader";
import AccordionSection from "../../components/AccordionSection";
import LoadingOverlay from "../../components/LoadingOverlay";
import { InputField } from "../../components/fields/InputField";
import { SelectField } from "../../components/fields/SelectField";
import { TextareaField } from "../../components/fields/TextareaField";
import { SearchSelectField } from "../../components/fields/SearchSelectField";

import {
  BookOpen,
  FlaskConical,
  Plus,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { handleResponse } from "../../utils/helpers";

// import {
//   createProductionRecipe,
//   updateProductionRecipe,
//   fetchProductionRecipeById,
// } from "../../redux/slices/productionSlice";

import { fetchAllInventoryItems } from "../../redux/slices/inventorySlice";
import { fetchAllUnits } from "../../redux/slices/unitSlice";

/* ─── Ingredient Row (SAME DESIGN AS YOUR RECIPE PAGE) ───────────────────── */
function IngredientRow({
  index,
  values,
  items,
  units,
  formik,
  remove,
  canRemove,
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-200 flex items-center justify-center">
            <span className="text-[10px] font-bold text-slate-600">
              {index + 1}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Ingredient {index + 1}
          </span>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-5">
        <SearchSelectField
          label="Item"
          value={values.inventoryItemId}
          onChange={(v) =>
            formik.setFieldValue(
              `ingredients.${index}.inventoryItemId`,
              v
            )
          }
          onBlur={() =>
            formik.setFieldTouched(
              `ingredients.${index}.inventoryItemId`,
              true
            )
          }
          options={(items || []).map((i) => ({
            value: i.id,
            label: i.name,
          }))}
          error={
            formik.touched.ingredients?.[index]?.inventoryItemId &&
            formik.errors.ingredients?.[index]?.inventoryItemId
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputField
            label="Quantity"
            name={`ingredients.${index}.quantity`}
            type="number"
            placeholder="0.00"
            required
            value={values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.ingredients?.[index]?.quantity &&
              formik.errors.ingredients?.[index]?.quantity
            }
          />

          <SelectField
            label="Unit"
            name={`ingredients.${index}.unitId`}
            required
            options={units?.map((u) => ({
              value: u.id,
              label: u.abbreviation ?? u.name,
            }))}
            value={values.unitId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.ingredients?.[index]?.unitId &&
              formik.errors.ingredients?.[index]?.unitId
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

const AddProductionRecipePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recipeId } = useQueryParams();

  const { outletId } = useSelector((s) => s.auth);
  // const { productionRecipeDetails, isFetching } = useSelector(
  //   (s) => s.production
  // );

  const { allInventoryItems } = useSelector((s) => s.inventory);
  const { items } = allInventoryItems || {};

  const { allUnits } = useSelector((s) => s.unit);
  const { units } = allUnits || {};

  useEffect(() => {
    if (!outletId) return;
    dispatch(fetchAllInventoryItems(outletId));
    dispatch(fetchAllUnits(outletId));
  }, [outletId]);

  useEffect(() => {
    if (recipeId) {
      dispatch(fetchProductionRecipeById(recipeId));
    }
  }, [recipeId]);

  const getInitialValues = () => {
    if (!recipeId || !productionRecipeDetails) {
      return {
        name: "",
        outputInventoryItemId: "",
        outputQuantity: "",
        outputUnitId: "",
        preparationTimeMins: "",
        description: "",
        ingredients: [
          {
            inventoryItemId: "",
            quantity: "",
            unitId: "",
          },
        ],
      };
    }

    return {
      name: productionRecipeDetails.name || "",
      outputInventoryItemId:
        productionRecipeDetails.outputInventoryItemId || "",
      outputQuantity: productionRecipeDetails.outputQuantity || "",
      outputUnitId: productionRecipeDetails.outputUnitId || "",
      preparationTimeMins:
        productionRecipeDetails.preparationTimeMins || "",
      description: productionRecipeDetails.description || "",
      ingredients:
        productionRecipeDetails.ingredients?.map((i) => ({
          inventoryItemId: i.inventoryItemId,
          quantity: i.quantity,
          unitId: i.unitId,
        })) || [],
    };
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    outputInventoryItemId: Yup.number().required("Required"),
    outputQuantity: Yup.number().required("Required"),
    outputUnitId: Yup.number().required("Required"),
    ingredients: Yup.array()
      .of(
        Yup.object({
          inventoryItemId: Yup.number().required("Required"),
          quantity: Yup.number().required("Required"),
          unitId: Yup.number().required("Required"),
        })
      )
      .min(1, "Add at least one ingredient"),
  });

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name.trim(),
      outputInventoryItemId: Number(values.outputInventoryItemId),
      outputQuantity: Number(values.outputQuantity),
      outputUnitId: Number(values.outputUnitId),
      preparationTimeMins: values.preparationTimeMins
        ? Number(values.preparationTimeMins)
        : null,
      description: values.description || null,
      ingredients: values.ingredients.map((i) => ({
        inventoryItemId: Number(i.inventoryItemId),
        quantity: Number(i.quantity),
        unitId: Number(i.unitId),
      })),
    };

    const action = recipeId
      ? updateProductionRecipe({ id: recipeId, values: payload })
      : createProductionRecipe({ outletId, values: payload });

    await handleResponse(dispatch(action), () =>
      navigate("/production-recipes")
    );
  };

  if (recipeId && isFetching) return <LoadingOverlay />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          recipeId
            ? "Edit Production Recipe"
            : "Create Production Recipe"
        }
        showBackButton
      />

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form className="space-y-5">
            {/* INFO */}
            <AccordionSection title="Production Info" icon={BookOpen}>
              <div className="space-y-5">
                <InputField
                  label="Recipe Name"
                  name="name"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <SearchSelectField
                    label="Output Item"
                    value={formik.values.outputInventoryItemId}
                    onChange={(v) =>
                      formik.setFieldValue(
                        "outputInventoryItemId",
                        v
                      )
                    }
                    options={items?.map((i) => ({
                      value: i.id,
                      label: i.name,
                    }))}
                  />

                  <SelectField
                    label="Output Unit"
                    name="outputUnitId"
                    options={units?.map((u) => ({
                      value: u.id,
                      label: u.name,
                    }))}
                    value={formik.values.outputUnitId}
                    onChange={formik.handleChange}
                  />
                </div>

                <InputField
                  label="Output Quantity"
                  name="outputQuantity"
                  type="number"
                  value={formik.values.outputQuantity}
                  onChange={formik.handleChange}
                />

                <TextareaField
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
              </div>
            </AccordionSection>

            {/* INGREDIENTS */}
            <AccordionSection title="Ingredients" icon={FlaskConical}>
              <FieldArray name="ingredients">
                {({ push, remove }) => (
                  <div className="space-y-3">
                    {typeof formik.errors.ingredients === "string" && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.ingredients}
                      </div>
                    )}

                    {formik.values.ingredients.map((ing, i) => (
                      <IngredientRow
                        key={i}
                        index={i}
                        values={ing}
                        items={items}
                        units={units}
                        formik={formik}
                        remove={remove}
                        canRemove={
                          formik.values.ingredients.length > 1
                        }
                      />
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        push({
                          inventoryItemId: "",
                          quantity: "",
                          unitId: "",
                        })
                      }
                      className="w-full border-2 border-dashed py-3 rounded-xl flex justify-center gap-2"
                    >
                      <Plus size={16} /> Add Ingredient
                    </button>
                  </div>
                )}
              </FieldArray>
            </AccordionSection>

            {/* SUBMIT */}
            <div className="flex justify-end">
              <button className="btn bg-primary-500 text-white">
                Save Recipe
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProductionRecipePage;