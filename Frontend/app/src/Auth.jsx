import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import * as Lucide from "lucide-react";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import Seo from "./seo/Seo";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  // ✅ FIX 4: Centralized form reset
  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const resetToLogin = () => {
    setIsForgot(false);
    setForgotStep(1);
    setIsLogin(true);
    resetForm(); // ✅ FIX 4: Reset form on going back to login
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgot) {
        if (forgotStep === 1) {
          // STEP 1: Send OTP to Email
          await api.post("/api/send-otp", { email: formData.email });
          setForgotStep(2);
          toast.success("Verification code sent to your email!"); // ✅ FIX 6: toast instead of alert
        } else if (forgotStep === 2) {
          // STEP 2: Verify OTP
          // ✅ FIX 5: Validate OTP length before sending
          if (formData.otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.");
            setLoading(false);
            return;
          }
          await api.post("/api/verify-otp", {
            email: formData.email,
            otp: formData.otp,
          });
          setForgotStep(3);
          toast.success("OTP verified! Set your new password.");
        } else {
          // STEP 3: Reset Password
          if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match!"); // ✅ FIX 6: toast instead of alert
            setLoading(false); // ✅ FIX 1: setLoading on early return
            return;
          }
          await api.post("/api/reset-password", {
            email: formData.email,
            newPassword: formData.newPassword,
          });
          toast.success("Password updated successfully!");
          resetForm(); // ✅ FIX 4: Reset form after success
          resetToLogin();
        }
      } else {
        // LOGIN / REGISTER
        const url = `/api/${isLogin ? "login" : "register"}`;
        const res = await api.post(url, {
          ...formData,
          email: formData.email.trim().toLowerCase(),
        });

        if (isLogin) {
          const { token, user } = res.data;
          if (token) localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          Cookies.set("user_session", JSON.stringify(user), {
            expires: 7,
            sameSite: "Lax",
          });
          window.dispatchEvent(new Event("userLogin"));
          navigate("/");
        } else {
          toast.success("Welcome to the family! Please sign in."); // ✅ FIX 6
          resetForm(); // ✅ FIX 4: Reset form after register
          setIsLogin(true);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong"); // ✅ FIX 6
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans px-3 py-6 sm:px-5 sm:py-8">
      <Seo title="Sign In" path="/auth" noindex />
      {/* ✅ FIX 6: Toaster for toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#d97706", secondary: "#fff" } },
        }}
      />

      {/* Aesthetic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[45%] sm:w-[45%] sm:h-[40%] bg-amber-600/15 rounded-full blur-[110px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[45%] sm:w-[45%] sm:h-[40%] bg-indigo-600/15 rounded-full blur-[110px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_45%)] pointer-events-none" />

      <div className="w-full max-w-5xl h-auto lg:h-[650px] flex bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[1.8rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/30 relative z-10">
        {/* LEFT SIDE: Brand Experience */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1634546503901-b2099308a05e?auto=format&fit=crop&q=80&w=1200"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt="Craftsmanship"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <span className="text-amber-500 font-bold tracking-[0.3em] text-xs uppercase mb-2 block">
              Premium Brassware
            </span>
            <h2 className="text-5xl font-serif mb-4 leading-tight">
              Authentic <br /> Artisan Spirit.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Discover a legacy of divine craftsmanship. Every piece at Nandhini
              is forged with devotion and tradition.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Interactive Form */}
        <div className="w-full lg:w-1/2 flex flex-col p-5 sm:p-8 md:p-12 lg:p-14 bg-white/95 overflow-y-auto">
          <div className="mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] mb-3">
              <Lucide.ShieldCheck size={12} />
              Secure Access
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 leading-tight">
              {isForgot
                ? "Security Check"
                : isLogin
                  ? "Welcome Back"
                  : "Create Account"}
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm">
              {isForgot
                ? "Step " + forgotStep + " of 3"
                : "Enter your details to continue the journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 flex-1">
            {/* EMAIL FIELD */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Lucide.Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email} // ✅ FIX 3: Controlled input
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  onChange={handleChange("email")}
                  required
                />
              </div>
            </div>

            {/* REGISTER: FULL NAME */}
            {!isLogin && !isForgot && (
              <div className="space-y-1">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <Lucide.User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.username} // ✅ FIX 3: Controlled input
                    className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    onChange={handleChange("username")}
                    required
                  />
                </div>
              </div>
            )}

            {/* FORGOT: OTP FIELD */}
            {isForgot && forgotStep === 2 && (
              <div className="space-y-1">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wide">
                  Verification Code
                </label>
                <div className="relative">
                  <Lucide.ShieldCheck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp} // ✅ FIX 3: Controlled input
                    maxLength={6} // ✅ FIX 5: Limit to 6 digits
                    inputMode="numeric" // ✅ FIX 5: Mobile number keyboard
                    pattern="[0-9]{6}" // ✅ FIX 5: Only numbers allowed
                    className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all tracking-[0.35em] sm:tracking-[0.5em] font-bold text-sm"
                    onChange={(e) => {
                      // ✅ FIX 5: Only allow digits
                      const val = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, otp: val }));
                    }}
                    required
                  />
                </div>
                {/* OTP digit counter */}
                <p className="text-[11px] text-slate-400 ml-1">
                  {formData.otp.length}/6 digits entered
                </p>
              </div>
            )}

            {/* PASSWORD FIELD (Login / Register) */}
            {!isForgot && (
              <div className="space-y-1">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lucide.Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password} // ✅ FIX 3: Controlled input
                    className="w-full pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    onChange={handleChange("password")} // ✅ FIX 2: Only updates password
                    required
                  />
                  {/* Show/Hide password toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-500 transition-colors"
                  >
                    {showPassword ? (
                      <Lucide.EyeOff size={18} />
                    ) : (
                      <Lucide.Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* NEW PASSWORD FIELD (Forgot Step 3) */}
            {isForgot && forgotStep === 3 && (
              <>
                <div className="space-y-1">
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wide">
                    New Password
                  </label>
                  <div className="relative">
                    <Lucide.Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.newPassword} // ✅ FIX 3: Controlled input
                      className="w-full pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      onChange={handleChange("newPassword")} // ✅ FIX 2: Only updates newPassword
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-500 transition-colors"
                    >
                      {showPassword ? (
                        <Lucide.EyeOff size={18} />
                      ) : (
                        <Lucide.Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-wide">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lucide.Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword} // ✅ FIX 3: Controlled input
                      className="w-full pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      onChange={handleChange("confirmPassword")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-500 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <Lucide.EyeOff size={18} />
                      ) : (
                        <Lucide.Eye size={18} />
                      )}
                    </button>
                  </div>
                  {/* ✅ Live password match indicator */}
                  {formData.confirmPassword && (
                    <p
                      className={`text-[11px] ml-1 font-semibold ${formData.newPassword === formData.confirmPassword ? "text-green-500" : "text-red-400"}`}
                    >
                      {formData.newPassword === formData.confirmPassword
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm tracking-[0.15em] uppercase hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl shadow-slate-300/40 active:scale-[0.99] disabled:opacity-50 mt-3 sm:mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Lucide.Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : isForgot ? (
                forgotStep === 1 ? (
                  "Send Code"
                ) : forgotStep === 2 ? (
                  "Verify OTP"
                ) : (
                  "Reset Password"
                )
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* FOOTER ACTIONS */}
          <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4">
            {isLogin && !isForgot && (
              <button
                onClick={() => setIsForgot(true)}
                className="text-[11px] sm:text-xs text-slate-400 hover:text-amber-600 transition-colors uppercase font-bold tracking-wider"
              >
                Forgot Password?
              </button>
            )}

            <p className="text-xs sm:text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
              <button
                type="button"
                onClick={() => {
                  isForgot ? resetToLogin() : setIsLogin(!isLogin);
                  resetForm(); // ✅ FIX 4: Reset form on mode switch
                }}
                className="text-amber-600 font-black hover:underline"
              >
                {isForgot ? "Back to Login" : isLogin ? "Join Now" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
