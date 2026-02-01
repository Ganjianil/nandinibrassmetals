import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as Lucide from "lucide-react";
import { useCart } from "./CartContext";
import Cookies from "js-cookie";

const Header = () => {
  const { cart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  // --- SYNC USER STATE WITH COOKIES/STORAGE ---
  useEffect(() => {
    const checkUser = () => {
      const sessionCookie = Cookies.get("user_session");
      if (sessionCookie) {
        try {
          setUser(JSON.parse(sessionCookie));
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
        }
      } else {
        const localUser = localStorage.getItem("user");
        setUser(localUser ? JSON.parse(localUser) : null);
      }
    };

    // 1. Initial check
    checkUser();

    // 2. LISTEN FOR AUTH EVENTS (Fixes the refresh issue)
    window.addEventListener("userLogin", checkUser);

    return () => {
      window.removeEventListener("userLogin", checkUser);
    };
  }, [location]);

  const isAdmin = user && user.email?.toLowerCase() === "admin@gmail.com";

  // --- SCROLL EFFECT ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGOUT HANDLER ---
  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Clear all data
      Cookies.remove("user_session");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("nandhini_cart_cache");

      // TRIGGER THE UPDATE (This tells the Header & App to reset state immediately)
      window.dispatchEvent(new Event("userLogin"));

      clearCart();
      setUser(null);
      setIsMobileMenuOpen(false);
      navigate("/auth");
    }
  };

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md py-3 shadow-lg"
          : "bg-white py-5 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden p-2 text-slate-900 active:scale-90 transition-transform"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Lucide.Menu size={28} />
        </button>

        {/* LOGO */}
        <Link
          to="/"
          className="flex flex-col items-center lg:items-start group"
        >
          <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
            NANDHINI{" "}
            <span className="text-blue-600 group-hover:text-slate-900">
              BRASS
            </span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">
            & Metals Est. 1986
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-black uppercase tracking-widest hover:text-blue-600 transition ${
              location.pathname === "/" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            Home
          </Link>
          <Link
            to="/orders"
            className={`text-sm font-black uppercase tracking-widest hover:text-blue-600 transition ${
              location.pathname === "/orders"
                ? "text-blue-600"
                : "text-slate-500"
            }`}
          >
            My Orders
          </Link>
        </div>

        {/* ACTION ICONS */}
        <div className="flex items-center gap-2 md:gap-5">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95"
            >
              <Lucide.ShieldCheck size={16} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Admin
              </span>
            </Link>
          )}

          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-4 rounded-full border border-slate-100">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs uppercase">
                  {user.username?.charAt(0) || "U"}
                </div>
                <button
                  onClick={logout}
                  className="ml-2 text-slate-300 hover:text-red-500 transition"
                >
                  <Lucide.LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="p-2.5 text-slate-500 hover:text-blue-600 transition group relative"
              >
                <Lucide.User size={24} />
              </Link>
            )}
          </div>

          {/* CART BUTTON */}
          <Link
            to="/cart"
            className="relative flex items-center gap-3 p-2 md:p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 hover:bg-slate-900 transition-all active:scale-90"
          >
            <Lucide.ShoppingBag size={22} />
            <div className="hidden sm:flex flex-col items-start leading-none pr-1">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-70">
                Total
              </span>
              <span className="text-xs font-black">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`lg:hidden fixed inset-0 z-[150] transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="absolute right-0 top-0 bottom-0 w-[85%] md:w-[400px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 leading-none">
                Nandhini
              </span>
              <span className="text-lg font-black uppercase tracking-tighter text-slate-900">
                BRASS & METALS
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-900 shadow-sm"
            >
              <Lucide.X size={24} />
            </button>
          </div>

          {/* MOBILE USER CARD */}
          <div className="mb-8 p-6 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-black shadow-lg">
                  {user ? user.username?.charAt(0) : <Lucide.User size={28} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                    Welcome
                  </span>
                  <h4 className="text-lg font-black truncate max-w-[120px]">
                    {user ? user.username : "Guest User"}
                  </h4>
                </div>
              </div>
              {user ? (
                <button
                  onClick={logout}
                  className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <Lucide.LogOut size={20} />
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* MENU LINKS */}
          <div className="flex flex-col gap-4 mb-8">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-all">
                  <Lucide.Home size={22} />
                </div>
                <span className="text-xl font-bold text-slate-800 uppercase tracking-tighter">
                  Home
                </span>
              </div>
              <Lucide.ChevronRight size={20} className="text-slate-300" />
            </Link>

            <Link
              to="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-all">
                  <Lucide.Package size={22} />
                </div>
                <span className="text-xl font-bold text-slate-800 uppercase tracking-tighter">
                  My Orders
                </span>
              </div>
              <Lucide.ChevronRight size={20} className="text-slate-300" />
            </Link>
          </div>

          {/* MOBILE CART SUMMARY */}
          <Link
            to="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mb-8 p-6 rounded-[2.5rem] bg-blue-50 border-2 border-blue-100 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <Lucide.ShoppingBag size={28} />
                </div>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 leading-none mb-1">
                  Your Basket
                </span>
                <span className="text-xl font-black text-slate-900 tracking-tighter">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
              <Lucide.ArrowRight size={20} />
            </div>
          </Link>

          {/* SUPPORT LINKS */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest"
              >
                <Lucide.Phone size={14} /> Call
              </a>
              <a
                href="https://wa.me/919876543210"
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-green-500 text-white font-black text-[10px] uppercase tracking-widest"
              >
                <Lucide.MessageCircle size={14} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
