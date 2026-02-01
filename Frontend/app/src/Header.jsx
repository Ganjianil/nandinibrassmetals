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

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Sync user state
  useEffect(() => {
    const checkUser = () => {
      const sessionCookie = Cookies.get("user_session");
      if (sessionCookie) {
        try {
          setUser(JSON.parse(sessionCookie));
        } catch (error) {
          setUser(null);
        }
      } else {
        const localUser = localStorage.getItem("user");
        setUser(localUser ? JSON.parse(localUser) : null);
      }
    };
    checkUser();
    window.addEventListener("userLogin", checkUser);
    return () => window.removeEventListener("userLogin", checkUser);
  }, [location]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = user && user.email?.toLowerCase() === "admin@gmail.com";

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookies.remove("user_session");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("userLogin"));
      clearCart();
      setUser(null);
      setIsMobileMenuOpen(false);
      navigate("/auth");
    }
  };

  return (
    <>
      {/* Spacer so content doesn't hide behind the fixed header */}
      <div className="h-[76px] lg:h-[92px]"></div>

      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl py-3 shadow-lg border-b border-slate-100"
            : "bg-white py-5 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* MOBILE HAMBURGER */}
          <button
            className="lg:hidden p-2 text-slate-900 active:scale-90 transition-all"
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
              NANDHINI <span className="text-blue-600">BRASS</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-1.5">
              Premium Artistry
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-10">
            <Link
              to="/"
              className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/orders"
              className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600"
            >
              My Orders
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
              >
                <Lucide.ShieldCheck size={14} className="text-blue-400" /> Admin
              </Link>
            )}
          </div>

          {/* ACTION AREA (Cart & Profile) */}
          <div className="flex items-center gap-3 md:gap-6">
            {user && (
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-black">
                  {user.username?.charAt(0)}
                </div>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Lucide.LogOut size={15} />
                </button>
              </div>
            )}

            {/* BEAUTIFUL PREMIUM CART */}
            <Link
              to="/cart"
              className="group relative flex items-center gap-2 p-2 md:pl-4 md:pr-2 md:py-2 bg-slate-900 text-white rounded-2xl transition-all duration-300 hover:bg-blue-600 hover:shadow-xl active:scale-95"
            >
              <div className="relative">
                <Lucide.ShoppingBag
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                {totalItems > 0 && (
                  <span className="absolute -top-3 -right-3 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce-short">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start pr-2 border-l border-white/10 pl-3 leading-tight">
                <span className="text-[8px] font-black uppercase opacity-60">
                  Total
                </span>
                <span className="text-[11px] font-black">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU SIDEBAR (Admin fixed here) */}
      <div
        className={`lg:hidden fixed inset-0 z-[2000] transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-[80%] bg-white p-6 shadow-2xl transition-transform duration-500 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-black text-slate-900">MENU</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 bg-slate-100 rounded-lg"
            >
              <Lucide.X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 font-bold text-slate-800"
            >
              <Lucide.Home size={20} className="text-blue-600" /> HOME
            </Link>
            <Link
              to="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 font-bold text-slate-800"
            >
              <Lucide.Package size={20} className="text-blue-600" /> MY ORDERS
            </Link>

            {/* ADMIN VIEW IN MOBILE - Added here */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 text-white font-bold"
              >
                <Lucide.ShieldCheck size={20} className="text-blue-400" /> ADMIN
                PANEL
              </Link>
            )}
          </div>

          <div className="mt-auto border-t pt-6">
            {user ? (
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm"
              >
                <Lucide.LogOut size={18} /> LOGOUT
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center p-4 bg-blue-600 text-white rounded-2xl font-black"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
