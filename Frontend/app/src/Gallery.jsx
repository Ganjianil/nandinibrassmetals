import React, { useState, useMemo, useEffect, useRef } from "react";
import * as Lucide from "lucide-react";
import {
  ArrowUpRight,
  Hammer,
  Sparkles,
  ShieldCheck,
  Crown,
  Check,
  ArrowRight,
} from "lucide-react";
import api from "./api";

// --- PARENT WRAPPER ---
const ArtisanMain = () => {
  const orderSectionRef = useRef(null);

  const scrollToOrder = () => {
    orderSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-[#F9F8F6]">
      <Gallery onBookNow={scrollToOrder} />
      <div ref={orderSectionRef}>
        <CustomOrderSuite />
      </div>
    </div>
  );
};

// --- GALLERY COMPONENT ---
const galleryImages = [
  {
    id: 1,
    src: "/img1.jpeg",
    title: "Sacred Ganesha",
    category: "BRASS",
    technique: "Lost Wax Casting",
    material: "Antique Brass",
    desc: "A masterful representation of wisdom, hand-cast in temple-grade brass.",
  },
  {
    id: 2,
    src: "/img2.jpeg",
    title: "Temple Thali",
    category: "RITUALS",
    technique: "Hand Etching",
    material: "Pure Copper",
    desc: "A ceremonial vessel of purity, featuring hand-etched traditional motifs.",
  },
  {
    id: 3,
    src: "/img3.jpeg",
    title: "Antique Deepam",
    category: "LIGHTING",
    technique: "Sand Casting",
    material: "Yellow Brass",
    desc: "Crafted to hold the eternal flame, bringing ancient heritage to the home.",
  },
  {
    id: 4,
    src: "/lordmaha.png",
    title: "Lord Mahavisnu",
    category: "PREMIUM",
    technique: "Fine Chiseling",
    material: "Bronze Alloy",
    desc: "The preserver of the universe, rendered in exquisite detail.",
  },
  {
    id: 5,
    src: "/Gopuram.png",
    title: "The Entrance",
    category: "HERITAGE",
    technique: "Architectural Study",
    material: "Mixed Medium",
    desc: "An architectural homage to the majestic gopurams.",
  },
];

const Gallery = ({ onBookNow }) => {
  const [filter, setFilter] = useState("ALL");
  const categories = [
    "ALL",
    "BRASS",
    "RITUALS",
    "LIGHTING",
    "PREMIUM",
    "HERITAGE",
  ];

  const filteredImages = useMemo(() => {
    return filter === "ALL"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);
  }, [filter]);

  return (
    <div className="bg-[#F9F8F6] min-h-screen text-[#2D2D2D] selection:bg-[#C5A059] selection:text-white">
      <nav className="sticky top-0 z-[100] bg-white/60 backdrop-blur-xl border-b border-[#E5E1DA] px-8 py-5">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[12px] font-black tracking-[0.6em] uppercase text-[#1A1A1A]">
              Artisan Archive
            </span>
            <span className="text-[8px] tracking-[0.3em] text-[#C5A059] uppercase font-bold text-center">
              Heritage Excellence
            </span>
          </div>
          <div className="hidden md:flex gap-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all relative pb-1 ${filter === cat ? "text-[#C5A059] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C5A059]" : "text-zinc-400 hover:text-[#1A1A1A]"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={onBookNow}
            className="bg-[#1A1A1A] text-white px-7 py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-[#C5A059] transition-all duration-500 rounded-sm"
          >
            Book Now
          </button>
        </div>
      </nav>

      <header className="pt-28 pb-16 px-8 max-w-[1400px] mx-auto text-center">
        <h1 className="text-[12vw] md:text-[7vw] font-serif italic leading-[0.9] tracking-tighter text-[#1A1A1A]">
          Customized <span className="not-italic text-[#E5E1DA]">Orders.</span>
        </h1>
      </header>

      <main className="px-6 pb-40 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              className={`group bg-white border border-[#E5E1DA] p-5 transition-all duration-700 hover:shadow-2xl ${idx % 3 === 0 ? "md:col-span-2" : "col-span-1"}`}
            >
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-1/2 flex items-center justify-center bg-[#FDFDFD] border border-[#F5F2ED] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-auto object-contain max-h-[550px] transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="lg:w-1/2 flex flex-col justify-between py-2">
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-[#C5A059] tracking-[0.4em] uppercase block">
                          {img.category}
                        </span>
                        <h3 className="text-5xl font-serif text-[#1A1A1A] tracking-tight leading-none">
                          {img.title}
                        </h3>
                      </div>
                      <ShieldCheck
                        size={24}
                        className="text-[#E5E1DA]"
                        strokeWidth={1}
                      />
                    </div>
                    <p className="text-xl text-zinc-500 font-serif italic leading-relaxed">
                      "{img.desc}"
                    </p>
                  </div>
                  <button
                    onClick={onBookNow}
                    className="mt-12 group/btn relative overflow-hidden flex items-center justify-between w-full p-5 border border-[#1A1A1A] hover:text-white transition-colors duration-500"
                  >
                    <span className="relative z-10 text-[10px] font-black tracking-[0.4em] uppercase">
                      Book Now
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="relative z-10 group-hover/btn:rotate-45 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#1A1A1A] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// --- CUSTOM ORDER SUITE COMPONENT ---
const CustomOrderSuite = () => {
  const [formData, setFormData] = useState({
    metal: "Brass",
    phone: "",
    height: "",
    weight: "",
    state: "",
    expectedDate: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Animation Logic: Visibility Observer
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/custom-consultations", formData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Error submitting request.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6">
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-1000">
          <div className="w-20 h-20 bg-[#C5A059]/10 text-[#C5A059] rounded-full flex items-center justify-center mx-auto border border-[#C5A059]/20">
            <Check size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-5xl md:text-7xl font-serif italic text-[#1A1A1A]">
            Pranams.
          </h2>
          <button
            onClick={() => setSubmitted(false)}
            className="px-12 py-4 bg-[#1A1A1A] text-white font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-[#C5A059] transition-all duration-500 shadow-xl"
          >
            New Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="bg-[#F9F8F6] min-h-screen py-24 px-6 lg:px-20 relative overflow-hidden selection:bg-[#C5A059]/30"
    >
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px]" />

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-20 items-start relative z-10">
        {/* Left Section (Animated) */}
        <div
          className={`lg:col-span-5 space-y-16 lg:sticky lg:top-24 transition-all duration-[1200ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-[#C5A059]">
              <div className="h-[1px] w-12 bg-[#C5A059]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                Legacy Collection
              </span>
            </div>
            <h1 className="text-[10vw] lg:text-[7vw] font-serif italic leading-[0.85] tracking-tighter text-[#1A1A1A]">
              Customized <br />{" "}
              <span className="not-italic text-[#E5E1DA]">Order.</span>
            </h1>
            <p className="text-zinc-500 text-xl font-serif italic leading-relaxed max-w-sm">
              From divine iconography to architectural marvels, book your
              consultation with our master sculptors.
            </p>
          </div>
          <div className="space-y-8 pt-8 border-t border-[#E5E1DA]">
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-white shadow-sm border border-[#F0EDE8]">
                <ShieldCheck className="text-[#C5A059]" size={20} />
              </div>
              <div>
                <h4 className="text-[#1A1A1A] font-bold text-xs uppercase tracking-widest">
                  Shilpa Shastra
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Absolute adherence to Agamic traditions.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-white shadow-sm border border-[#F0EDE8]">
                <Crown className="text-[#C5A059]" size={20} />
              </div>
              <div>
                <h4 className="text-[#1A1A1A] font-bold text-xs uppercase tracking-widest">
                  Museum Quality
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Certified purity in Brass, Silver, and Panchaloha alloys.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (Animated) */}
        <div
          className={`lg:col-span-7 transition-all duration-[1200ms] delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
        >
          <div className="bg-white p-8 md:p-16 border border-[#E5E1DA] shadow-2xl rounded-sm">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-6">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400">
                  Select Composition
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Brass", "Silver", "Panchaloha"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, metal: m })}
                      className={`py-4 border text-[10px] font-bold uppercase transition-all duration-500 rounded-sm ${formData.metal === m ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "text-zinc-400 border-[#E5E1DA] hover:border-[#1A1A1A]"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 group-focus-within:text-[#C5A059] transition-colors">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 --- --- ----"
                    className="w-full bg-transparent border-b border-[#E5E1DA] py-4 text-[#1A1A1A] focus:border-[#C5A059] transition-all outline-none font-serif text-lg italic"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 group-focus-within:text-[#C5A059] transition-colors">
                    Temple Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City / State"
                    className="w-full bg-transparent border-b border-[#E5E1DA] py-4 text-[#1A1A1A] focus:border-[#C5A059] transition-all outline-none font-serif text-lg italic"
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden bg-[#1A1A1A] py-6 transition-all duration-700 hover:bg-[#C5A059] shadow-2xl"
              >
                <div className="relative z-10 flex items-center justify-center gap-4 text-white font-black uppercase text-[11px] tracking-[0.6em]">
                  {loading ? "Archiving Request..." : "Book Now"}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-3 transition-transform duration-500"
                  />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanMain;
