import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import * as Lucide from "lucide-react";
import Cookies from "js-cookie";
import { CartProvider } from "./CartContext";
import Header from "./Header";
import Hero from "./Hero";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import Auth from "./Auth";
import AdminDashboard from "./AdminDashboard";
import Orders from "./Orders";
import FloatingContact from "./FloatingContact"; // Ensure this is imported
import "./index.css";

// --- SECTION COMPONENTS ---
const VideoSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-20">
      <div className="relative h-[500px] md:h-[750px] rounded-[3rem] md:rounded-[5rem] overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-[8px] md:border-[16px] border-white">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[4s] ease-out"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-8 right-8 z-20">
          <button
            onClick={toggleSound}
            className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/40 transition-all border border-white/30"
          >
            {isMuted ? (
              <Lucide.VolumeX size={20} />
            ) : (
              <Lucide.Volume2 size={20} />
            )}
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-8 md:p-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-[2px] w-12 bg-amber-500"></span>
                <span className="text-amber-500 text-xs font-black uppercase tracking-[0.5em]">
                  The Master's Touch
                </span>
              </div>
              <h2 className="text-6xl md:text-[9rem] font-black text-white uppercase tracking-tighter leading-[0.8] mb-6">
                Divine <br />
                <span className="text-amber-500 italic font-serif lowercase">
                  Metals.
                </span>
              </h2>
              <p className="text-slate-300 text-lg md:text-xl font-medium max-w-md leading-relaxed hidden md:block">
                Witness the transformation of raw earth into sacred heirlooms. A
                legacy of devotion, cast in brass.
              </p>
            </div>
            <button
              onClick={toggleSound}
              className="relative w-24 h-24 md:w-40 md:h-40 rounded-full flex items-center justify-center group/btn overflow-hidden transition-all duration-500"
            >
              <div className="absolute inset-0 bg-amber-600 group-hover/btn:bg-white transition-colors duration-500" />
              {isMuted ? (
                <Lucide.Play
                  fill="currentColor"
                  className="relative z-10 ml-2 text-white group-hover/btn:text-amber-600 size-12"
                />
              ) : (
                <Lucide.Pause
                  fill="currentColor"
                  className="relative z-10 text-white group-hover/btn:text-amber-600 size-12"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutSection = () => (
  <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
    <div className="relative">
      <div className="inline-flex items-center gap-3 bg-amber-50 px-6 py-3 rounded-2xl mb-10 border border-amber-100 shadow-sm">
        <Lucide.History className="text-amber-600" size={20} />
        <span className="text-xs font-black uppercase tracking-widest text-amber-800">
          Established 1998
        </span>
      </div>
      <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-10 text-slate-900">
        Pure Soul <br />
        <span className="text-amber-600 italic font-serif lowercase tracking-normal">
          In Every Detail.
        </span>
      </h2>
      <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-lg mb-12">
        We specialize in temple-grade brass and silver masterpieces. Each idol
        is hand-finished by multi-generational artisans.
      </p>
      <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-100">
        <div>
          <p className="text-5xl font-black tracking-tighter text-slate-900">
            25+
          </p>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mt-3">
            Years Legacy
          </p>
        </div>
        <div>
          <p className="text-5xl font-black tracking-tighter text-slate-900">
            10k+
          </p>
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mt-3">
            Happy Homes
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 md:gap-10 relative">
      <div className="absolute -inset-4 bg-amber-100/50 rounded-[5rem] -z-10 blur-3xl opacity-50" />
      <div className="pt-20">
        <div className="rounded-[3rem] md:rounded-[5rem] overflow-hidden h-[300px] md:h-[500px] shadow-2xl border-[10px] border-white -rotate-6">
          <img
            src="/Gopuram.png"
            className="w-full h-full object-cover"
            alt="Art"
          />
        </div>
      </div>
      <div>
        <div className="rounded-[3rem] md:rounded-[5rem] overflow-hidden h-[300px] md:h-[500px] shadow-2xl border-[10px] border-white rotate-6">
          <img
            src="/lordmaha.png"
            className="w-full h-full object-cover"
            alt="Art"
          />
        </div>
      </div>
    </div>
  </section>
);

const GallerySection = () => (
  <section className="max-w-[1440px] mx-auto px-6 py-32 bg-slate-50 rounded-[4rem] md:rounded-[6rem] my-20">
    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
      <div>
        <span className="text-amber-600 font-black text-xs uppercase tracking-[0.5em] block mb-4">
          Virtual Tour
        </span>
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-none">
          The Gallery.
        </h2>
      </div>
      <button className="group flex items-center gap-4 bg-slate-900 text-white pl-10 pr-4 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-amber-600 transition-all shadow-xl">
        Follow Instagram{" "}
        <div className="bg-white/20 p-2 rounded-full">
          <Lucide.Instagram size={16} />
        </div>
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[600px]">
      <div className="md:col-span-2 rounded-[3rem] overflow-hidden bg-gray-200">
        <img
          src="/img1.jpeg"
          className="w-full h-full object-cover hover:scale-105 transition duration-700"
          alt="Ganesha"
        />
      </div>
      <div className="rounded-[3rem] overflow-hidden bg-gray-200">
        <img
          src="/img2.jpeg"
          className="w-full h-full object-cover hover:scale-105 transition duration-700"
          alt="Thali"
        />
      </div>
      <div className="rounded-[3rem] overflow-hidden bg-gray-200">
        <img
          src="/img3.jpeg"
          className="w-full h-full object-cover hover:scale-105 transition duration-700"
          alt="Silver"
        />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-950 text-white pt-32 pb-12 rounded-t-[4rem] md:rounded-t-[8rem]">
    <div className="max-w-7xl mx-auto px-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-20 border-b border-slate-800/50 pb-24">
        <div className="md:col-span-2">
          <h2 className="text-4xl font-black italic tracking-tighter text-amber-500 mb-10 uppercase">
            Nandhini Metals.
          </h2>
          <p className="text-slate-400 font-medium text-xl max-w-sm mb-10 leading-relaxed">
            Bringing divine energy and heritage craftsmanship into your modern
            living spaces.
          </p>
        </div>
        <div>
          <h4 className="font-black uppercase text-xs tracking-[0.4em] mb-10 text-amber-500">
            Visit Us
          </h4>
          <p className="text-slate-400 font-medium">Uppal, Hyderabad</p>
          <p className="text-amber-600 font-black mt-6">
            Open Mon-Sat: 10am - 8pm
          </p>
        </div>
      </div>
      <p className="pt-12 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">
        © 2026 Nandhini Brass & Metals. Crafted by Elite AI.
      </p>
    </div>
  </footer>
);

// --- MAIN APP COMPONENT ---
function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 1. UPDATE USER ON LOAD & VIA CUSTOM EVENT (No refresh needed)
  useEffect(() => {
    const checkUser = () => {
      const sessionCookie = Cookies.get("user_session");
      const localUser = localStorage.getItem("user");

      let foundUser = null;
      try {
        if (sessionCookie) foundUser = JSON.parse(sessionCookie);
        else if (localUser) foundUser = JSON.parse(localUser);
      } catch (e) {
        foundUser = null;
      }
      setUser(foundUser);
    };

    checkUser();

    // Event listeners for immediate UI updates
    window.addEventListener("userLogin", checkUser);
    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("userLogin", checkUser);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const isAdmin = user && user.email?.toLowerCase() === "admin@gmail.com";

  // 2. FETCH PRODUCTS AND CATEGORIES
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get("http://localhost:5000/products"),
          axios.get("http://localhost:5000/api/categories"),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <CartProvider>
      <Router>
        <div className="selection:bg-amber-100 selection:text-amber-900 relative">
          <Header user={user} />

          {/* FLOATING CONTACT BUTTONS (Visible on all pages) */}
          <FloatingContact />

          <Routes>
            <Route
              path="/"
              element={
                <main className="overflow-x-hidden">
                  <Hero />
                  <AboutSection />
                  <VideoSection />
                  <div id="product-list" className="py-20">
                    <ProductList products={products} categories={categories} />
                  </div>
                  <GallerySection />
                  <Footer />
                </main>
              }
            />
            <Route
              path="/product/:id"
              element={
                <>
                  <ProductDetail products={products} />
                  <Footer />
                </>
              }
            />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/auth"
              element={isAdmin ? <Navigate to="/admin" /> : <Auth />}
            />
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Navigate to="/auth" />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
