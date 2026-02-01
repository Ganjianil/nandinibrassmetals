import React, { useState } from "react";
import api from "./api"; // Updated: Using your custom instance
import { useNavigate } from "react-router-dom";
import * as Lucide from "lucide-react";
import Cookies from "js-cookie";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      email: formData.email.trim().toLowerCase(),
    };

    // Updated: Using relative paths because api.js handles the BaseURL
    let url = `/api/${isLogin ? "login" : "register"}`;
    if (isForgot) url = `/api/forgot-password`;

    try {
      // Updated: Using 'api' instead of 'axios' to allow cookie storage
      const res = await api.post(url, payload);

      if (isForgot) {
        alert("Success! Your journey continues with a new password.");
        setIsForgot(false);
        setIsLogin(true);
      } else if (isLogin) {
        const { token, user } = res.data;

        // 1. Store Token (Fallback for manual header use if needed)
        localStorage.setItem("token", token);

        // 2. Store User (For displaying name/email in UI)
        localStorage.setItem("user", JSON.stringify(user));

        // 3. Set Client-side Cookie (For session tracking)
        Cookies.set("user_session", JSON.stringify(user), {
          expires: 7,
          secure: false, // Set to true if using HTTPS
          sameSite: "Lax",
        });

        // --- TRIGGER UI UPDATE ---
        window.dispatchEvent(new Event("userLogin"));

        navigate("/");
      } else {
        alert("Account Created! Welcome to the Nandhini Family.");
        setIsLogin(true);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Connection error";
      alert(errorMsg);
      console.error("Auth Error:", err.response?.data);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-slate-950">
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1614032126233-0498305c6d31?auto=format&fit=crop&w=1200"
          className="w-full h-full object-cover scale-110 lg:scale-100 opacity-60 lg:opacity-40"
          alt="Artisan Brass"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/80 to-slate-950 lg:bg-none" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col lg:flex-row">
        {/* --- LEFT SIDE: DESKTOP TEXT --- */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-20 text-center">
          <span className="text-amber-500 font-black text-xs uppercase tracking-[0.5em] mb-6 block">
            Nandhini Metals
          </span>
          <h1 className="text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
            The Soul of <br />
            <span className="text-amber-500 italic font-serif lowercase">
              Tradition.
            </span>
          </h1>
          <p className="text-slate-300 text-lg font-medium max-w-md mx-auto leading-relaxed">
            Join our community and bring home master-crafted pieces that tell a
            story of divinity.
          </p>
          <div className="mt-12 flex items-center gap-4 text-white/30 text-[10px] font-black uppercase tracking-widest">
            <Lucide.ShieldCheck size={20} className="text-amber-500" />
            Secure Heritage Connection
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM CARD --- */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-12">
          <div className="w-full max-w-[440px] bg-white/10 lg:bg-white backdrop-blur-2xl lg:backdrop-blur-none border border-white/20 lg:border-none p-8 md:p-12 rounded-[2.5rem] lg:rounded-none shadow-2xl lg:shadow-none">
            <div className="text-center lg:text-left mb-10">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                  <Lucide.Trophy className="text-amber-500" size={24} />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white lg:text-slate-900 uppercase tracking-tighter mb-4 leading-none">
                {isForgot ? "Reset" : isLogin ? "Welcome" : "Join Us"}
              </h2>
              <p className="text-slate-300 lg:text-slate-400 font-medium text-sm md:text-base">
                {isForgot
                  ? "Reclaim your access to the divine."
                  : isLogin
                    ? "Sign in to manage your collection."
                    : "Start your journey with handcrafted excellence."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group relative">
                <Lucide.Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 lg:bg-slate-50 text-white lg:text-slate-900 border border-white/10 lg:border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium placeholder:text-slate-500"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {!isLogin && !isForgot && (
                <div className="group relative">
                  <Lucide.User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 lg:bg-slate-50 text-white lg:text-slate-900 border border-white/10 lg:border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium placeholder:text-slate-500"
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {!isForgot && (
                <div className="group relative">
                  <Lucide.Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 lg:bg-slate-50 text-white lg:text-slate-900 border border-white/10 lg:border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium placeholder:text-slate-500"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {isForgot && (
                <div className="group relative">
                  <Lucide.ShieldAlert
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 lg:bg-slate-50 text-white lg:text-slate-900 border border-white/10 lg:border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all font-medium placeholder:text-slate-500"
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 shadow-xl shadow-amber-900/40 transition-all active:scale-[0.96] mt-4"
              >
                {isForgot
                  ? "Update Secret Key"
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <div className="mt-8 space-y-6">
              {!isForgot && isLogin && (
                <button
                  onClick={() => setIsForgot(true)}
                  className="text-slate-400 hover:text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] block mx-auto transition-colors"
                >
                  Forgot your password?
                </button>
              )}

              <div className="pt-6 border-t border-white/10 lg:border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsForgot(false);
                    setIsLogin(!isLogin);
                  }}
                  className="text-white lg:text-slate-900 font-black uppercase text-[11px] tracking-[0.2em] group"
                >
                  {isForgot ? (
                    <span className="flex items-center gap-2 justify-center">
                      Back to{" "}
                      <span className="text-amber-500 underline">Login</span>
                    </span>
                  ) : isLogin ? (
                    <span className="flex items-center gap-2 justify-center italic font-serif normal-case text-sm">
                      New here?{" "}
                      <span className="text-amber-500 not-italic font-sans font-black uppercase text-[11px]">
                        Create Account
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center italic font-serif normal-case text-sm">
                      Have an account?{" "}
                      <span className="text-amber-500 not-italic font-sans font-black uppercase text-[11px]">
                        Sign In
                      </span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
