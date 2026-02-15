import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import * as Lucide from "lucide-react";
import Cookies from "js-cookie";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgot) {
        if (forgotStep === 1) {
          // STEP 1: Send OTP to Email
          await api.post("/api/send-otp", { email: formData.email });
          setForgotStep(2);
          alert("Verification code sent to your email!");
        } else if (forgotStep === 2) {
          // STEP 2: Verify OTP
          await api.post("/api/verify-otp", {
            email: formData.email,
            otp: formData.otp,
          });
          setForgotStep(3);
        } else {
          // STEP 3: Reset Password
          if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
          }
          await api.post("/api/reset-password", {
            email: formData.email,
            newPassword: formData.newPassword,
          });
          alert("Password updated successfully!");
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
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          Cookies.set("user_session", JSON.stringify(user), {
            expires: 7,
            sameSite: "Lax",
          });
          window.dispatchEvent(new Event("userLogin"));
          navigate("/");
        } else {
          alert("Welcome to the family! Please sign in.");
          setIsLogin(true);
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setIsForgot(false);
    setForgotStep(1);
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-5xl h-[650px] flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 m-4">
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
        <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-14 bg-white">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">
              {isForgot
                ? "Security Check"
                : isLogin
                  ? "Welcome Back"
                  : "Create Account"}
            </h3>
            <p className="text-slate-500 text-sm">
              {isForgot
                ? "Step " + forgotStep + " of 3"
                : "Enter your details to continue the journey."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            {/* EMAIL FIELD - Always visible for forgot/login/register */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
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
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* CONDITIONAL: REGISTER NAME */}
            {!isLogin && !isForgot && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
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
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* CONDITIONAL: OTP FIELD */}
            {isForgot && forgotStep === 2 && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
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
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all tracking-[0.5em] font-bold"
                    onChange={(e) =>
                      setFormData({ ...formData, otp: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* CONDITIONAL: PASSWORD FIELDS */}
            {(!isForgot || forgotStep === 3) && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
                  {forgotStep === 3 ? "New Password" : "Password"}
                </label>
                <div className="relative">
                  <Lucide.Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                        newPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {isForgot && forgotStep === 3 && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lucide.Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-amber-600 transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading
                ? "Processing..."
                : isForgot
                  ? forgotStep === 1
                    ? "Send Code"
                    : forgotStep === 2
                      ? "Verify OTP"
                      : "Reset Password"
                  : isLogin
                    ? "Login"
                    : "Sign Up"}
            </button>
          </form>

          {/* FOOTER ACTIONS */}
          <div className="mt-8 text-center space-y-4">
            {isLogin && !isForgot && (
              <button
                onClick={() => setIsForgot(true)}
                className="text-xs text-slate-400 hover:text-amber-600 transition-colors uppercase font-bold tracking-wider"
              >
                Forgot Password?
              </button>
            )}

            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
              <button
                onClick={() => {
                  isForgot ? resetToLogin() : setIsLogin(!isLogin);
                }}
                className="text-amber-600 font-bold hover:underline"
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
