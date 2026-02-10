import { useState } from "react";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleResponse } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { InputField } from "../components/fields/InputField";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogging } = useSelector((state) => state.auth);

  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    rememberMe: Yup.boolean(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleResponse(dispatch(signIn(values)), () => {
        navigate("/");
      });
    },
  });

  return (
    <div className="h-[100dvh] bg-primary-100 flex justify-center items-center relative">
      <div>
        {/* Header */}
        <div className="pb-8 flex justify-center">
          <img src="/Images/Logo.svg" alt="" className="w-56" />
        </div>

        {/* Main */}
        <div className="flex-1 flex items-center justify-center px-4">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full max-w-md bg-white rounded-lg shadow p-8 space-y-6"
          >
            <div className="">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
              <p className="text-gray-600 text-sm">
                Access the Dreamspos panel using your email and passcode.
              </p>
            </div>

            {/* EMAIL */}
            <InputField
              label="Email"
              name="email"
              required
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
              icon={Mail}
              iconPosition="right"
            />

            <InputField
              label="Password"
              name="password"
              required
              type="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && formik.errors.password}
            />

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-primary-500 font-medium">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || isLogging}
              className="btn w-full bg-primary-500 text-white  hover:bg-primary-600 disabled:opacity-50 "
            >
              {isLogging && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
              {isLogging ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
        {/* Footer */}
        <div className="py-8 text-center text-gray-600 text-sm">
          <p>Copyrights © 2025 - iMaker Restro</p>
        </div>
      </div>
    </div>
  );
}
