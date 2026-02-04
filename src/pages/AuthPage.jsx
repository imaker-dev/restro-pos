import { useState } from "react";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { handleResponse } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogging } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

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
    <div className="h-[100dvh] bg-primary-100 flex justify-center items-center ">
      <div>
        {/* Header */}
        <div className="pb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-orange-500 font-bold text-lg">i</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-gray-800 font-bold text-xl">iMaker</span>
              <span className="text-orange-500 font-bold text-xl">POS</span>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex items-center justify-center px-4">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full max-w-md bg-white rounded-lg shadow p-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
            <p className="text-gray-600 text-sm mb-8">
              Access the Dreamspos panel using your email and passcode.
            </p>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-input w-full  ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-400 "
                      : "border-gray-200 "
                  }`}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-input w-full  ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-400 "
                      : "border-gray-200 "
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* REMEMBER */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  className="w-4 h-4 accent-primary-500 text-white"
                />
                <span className="text-sm text-gray-700">Remember Me</span>
              </label>
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
          <p>Copyrights © 2025 - iMakerPOS</p>
        </div>
      </div>
    </div>
  );
}
