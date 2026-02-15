import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as Lucide from "lucide-react";
import { useCart } from "./CartContext";
import Cookies from "js-cookie";
import LogoImg from "/nandini.png"; 

const Header = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
      {/* 1. FIXED SPACER: Matches the header height to prevent content overlap */}
      <div className={`transition-all duration-500 ${isScrolled ? "h-[110px] lg:h-[130px]" : "h-[140px] lg:h-[180px]"}`}></div>

      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md py-2 shadow-md"
            : "bg-white py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          
          {/* LEFT SECTION: Mobile Menu / Desktop Links */}
          <div className="flex items-center lg:flex-1">
            {/* Mobile Menu Button - Search Icon removed */}
            <div className="lg:hidden">
              <button
                className="p-2 text-slate-800"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Lucide.Menu size={28} strokeWidth={1.5} />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-10">
              <Link to="/" className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-amber-700 transition-colors">
                Home
              </Link>
              <Link to="/orders" className="text-[12px] font-bold uppercase tracking-[0.2em] text-slate-600 hover:text-amber-700 transition-colors">
                Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-[12px] font-black uppercase tracking-[0.2em] text-amber-700 border-b-2 border-amber-700 pb-1">
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* CENTER SECTION: STYLISH BRANDING */}
          <Link
            to="/"
            className="flex flex-col items-center group cursor-pointer transition-all duration-300 px-2"
          >
            <img
              src={LogoImg}
              alt="Nandini Brass"
              className="h-12 md:h-16 w-auto object-contain transition-transform duration-700 group-hover:scale-110 mb-2"
            />

            <div className="flex flex-col items-center">
              <h1 className="text-xl md:text-3xl font-serif tracking-[0.25em] text-slate-900 leading-none uppercase">
                Nandhini
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-[1px] w-6 md:w-10 bg-amber-600/30"></div>
                <span className="text-[10px] md:text-xs font-light italic tracking-[0.4em] text-amber-700 uppercase">
                  Crafts
                </span>
                <div className="h-[1px] w-6 md:w-10 bg-amber-600/30"></div>
              </div>
            </div>
          </Link>

          {/* RIGHT SECTION: ACCOUNT & CART */}
          <div className="flex items-center justify-end gap-2 md:gap-6 lg:flex-1">
            <Link
              to={user ? "/profile" : "/auth"}
              className="p-2 text-slate-800 hover:text-amber-700 transition-colors relative"
            >
              <Lucide.User size={26} strokeWidth={1.5} />
              {isAdmin && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
              )}
            </Link>

            <Link to="/cart" className="p-2 text-slate-800 hover:text-amber-700 transition-colors relative group">
              <Lucide.ShoppingCart size={26} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[20px] h-[20px] bg-amber-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR MENU (Stayed the same) */}
      <div
        className={`fixed inset-0 z-[2000] transition-opacity duration-300 ${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-[300px] bg-white transition-transform duration-500 ease-out shadow-2xl ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-12">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Menu
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-black transition-colors"
              >
                <Lucide.X size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-slate-800">
                Home
              </Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-slate-800">
                My Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif text-amber-700 flex items-center gap-3">
                  <Lucide.LayoutDashboard size={24} /> Admin
                </Link>
              )}
            </div>

            <div className="mt-auto border-t border-slate-100 pt-8">
              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-3 text-red-500 font-bold text-lg"
                >
                  <Lucide.LogOut size={22} /> Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-bold text-slate-900"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;