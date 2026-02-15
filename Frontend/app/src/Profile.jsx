import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Lucide from "lucide-react";
import Cookies from "js-cookie";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = Cookies.get("user_session");
    if (session) {
      setUser(JSON.parse(session));
    } else {
      const localUser = localStorage.getItem("user");
      if (localUser) setUser(JSON.parse(localUser));
      else navigate("/auth"); // Redirect if no user found
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookies.remove("user_session");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("userLogin"));
      navigate("/auth");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      {/* Header Decoration */}
      <div className="h-64 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1634546503901-b2099308a05e?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover"
            alt="texture"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fcfcfd]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar Circle */}
              <div className="w-32 h-32 rounded-full bg-amber-50 border-4 border-white shadow-lg flex items-center justify-center text-amber-700 text-4xl font-serif">
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 text-center md:text-left">
                <span className="text-[10px] font-black tracking-[0.3em] text-amber-600 uppercase">
                  Member Since 2026
                </span>
                <h2 className="text-4xl font-serif text-slate-900 mt-1 capitalize">
                  {user.username}
                </h2>
                <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mt-2">
                  <Lucide.Mail size={16} /> {user.email}
                </p>
              </div>

              <button
                onClick={() => navigate("/orders")}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-amber-700 active:scale-95"
              >
                View My Orders
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-50 bg-slate-50/50">
            <button className="p-8 flex flex-col items-center gap-3 hover:bg-white transition-colors group">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:text-amber-600 transition-colors">
                <Lucide.Settings size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Account Settings
              </span>
            </button>

            <button className="p-8 flex flex-col items-center gap-3 hover:bg-white transition-colors group border-x border-slate-100">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:text-amber-600 transition-colors">
                <Lucide.MapPin size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Saved Addresses
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="p-8 flex flex-col items-center gap-3 hover:bg-red-50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:text-red-600 transition-colors">
                <Lucide.LogOut size={22} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
                Logout
              </span>
            </button>
          </div>
        </div>

        {/* Brand Banner */}
        <div className="mt-12 bg-amber-50 rounded-3xl p-8 border border-amber-100 flex items-center justify-between">
          <div className="max-w-md">
            <h4 className="text-amber-900 font-serif text-xl">
              Exclusive Artisan Access
            </h4>
            <p className="text-amber-700/70 text-sm mt-2 font-medium">
              As a member of Nandhini Crafts, you get early access to our
              limited edition temple brassware and custom idol consultations.
            </p>
          </div>
          <Lucide.Crown className="text-amber-300 hidden md:block" size={48} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
