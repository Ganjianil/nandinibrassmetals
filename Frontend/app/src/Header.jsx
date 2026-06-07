import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as Lucide from "lucide-react";
import { useCart } from "./CartContext";
import Cookies from "js-cookie";
import LogoImg from "/nandini.png";
import PromoMarquee from "./PromoMarquee";

const Header = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/custom-order", label: "Custom Order" },
    { to: "/orders", label: "Orders" },
  ];

  useEffect(() => {
    const checkUser = () => {
      const sessionCookie = Cookies.get("user_session");
      if (sessionCookie) {
        try {
          setUser(JSON.parse(sessionCookie));
        } catch {
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
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isAdmin = user && user.email?.toLowerCase() === "anilrocky519@gmail.com";
  const isHome = location.pathname === "/";

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      Cookies.remove("user_session");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("userLogin"));
      clearCart();
      setUser(null);
      setIsMobileMenuOpen(false);
      navigate("/auth");
    }
  };

  return (
    <>
      <div
        className={`transition-all duration-500 ${
          isHome
            ? isScrolled
              ? "h-[136px] lg:h-[148px]"
              : "h-[158px] lg:h-[178px]"
            : isScrolled
              ? "h-[86px] lg:h-[98px]"
              : "h-[108px] lg:h-[128px]"
        }`}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl py-2 shadow-lg border-b border-slate-200/80"
            : "bg-white/95 py-4 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center lg:flex-1">
            <div className="lg:hidden">
              <button
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Lucide.Menu size={28} strokeWidth={1.5} />
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.16em] transition-all ${
                      isActive
                        ? "bg-amber-100 text-amber-800"
                        : "text-slate-600 hover:text-amber-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.16em] bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/30"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <Link
            to="/"
            className="flex flex-col items-center group cursor-pointer transition-all duration-300 px-2"
          >
            <img
              src={LogoImg}
              alt="Nandini Brass"
              className="h-11 md:h-14 w-auto object-contain transition-transform duration-700 group-hover:scale-110 mb-1.5"
            />

            <div className="flex flex-col items-center">
              <h1 className="text-lg md:text-2xl font-serif tracking-[0.22em] text-slate-900 leading-none uppercase">
                Nandhini
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-[1px] w-5 md:w-8 bg-amber-600/35" />
                <span className="text-[9px] md:text-[10px] font-medium tracking-[0.32em] text-amber-700 uppercase">
                  Crafts
                </span>
                <div className="h-[1px] w-5 md:w-8 bg-amber-600/35" />
              </div>
            </div>
          </Link>

          <div className="flex items-center justify-end gap-1 md:gap-3 lg:flex-1">
            <Link
              to={user ? "/profile" : "/auth"}
              className="p-2.5 rounded-xl text-slate-700 hover:text-amber-700 hover:bg-slate-100 transition-colors relative"
              aria-label="Account"
            >
              <Lucide.User size={24} strokeWidth={1.7} />
              {isAdmin && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full border-2 border-white" />
              )}
            </Link>

            <Link
              to="/cart"
              className="p-2.5 rounded-xl text-slate-700 hover:text-amber-700 hover:bg-slate-100 transition-colors relative"
              aria-label="Cart"
            >
              <Lucide.ShoppingCart size={24} strokeWidth={1.7} />
              {totalItems > 0 && (
                <span className="absolute top-[3px] right-[3px] min-w-[20px] h-[20px] bg-gradient-to-r from-amber-700 to-orange-700 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
        {isHome && <PromoMarquee />}
      </nav>

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
                aria-label="Close menu"
              >
                <Lucide.X size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-serif transition-colors ${
                    location.pathname === link.to
                      ? "text-amber-700"
                      : "text-slate-800 hover:text-amber-700"
                  }`}
                >
                  {link.to === "/orders"
                    ? "My Orders"
                    : link.to === "/custom-order"
                      ? "Custom Order"
                      : link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif text-amber-700 flex items-center gap-3"
                >
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