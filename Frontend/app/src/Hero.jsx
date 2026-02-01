import React, { useState, useEffect } from "react";
import * as Lucide from "lucide-react";

const Hero = () => {
  const [discountIndex, setDiscountIndex] = useState(0);

  // Array of dynamic offers
  const offers = [
    { label: "Welcome Offer", value: "20% OFF", sub: "ON FIRST ORDER" },
    { label: "Silver Special", value: "15% OFF", sub: "ON SILVER IDOLS" },
    { label: "Festive Deal", value: "FREE GIFT", sub: "ON ORDERS ABOVE ₹5000" },
    { label: "Brass Legacy", value: "10% OFF", sub: "HANDCRAFTED BRASS" },
  ];

  // Auto-change discount logic
  useEffect(() => {
    const interval = setInterval(() => {
      setDiscountIndex((prev) => (prev + 1) % offers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const scrollToProducts = () => {
    const productSection = document.getElementById("product-list");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex items-center bg-white overflow-hidden font-sans">
      {/* --- PREMIUM DECORATION --- */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-50/50 hidden lg:block" />
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-200 rounded-full blur-[150px] opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-12 md:py-20">
        {/* --- TEXT CONTENT --- */}
        <div className="text-center lg:text-left z-10 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 bg-amber-100/50 px-4 py-2 rounded-full mb-8 border border-amber-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">
              Divine Heritage Est. 1986
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-6">
            Divine <br />
            <span className="text-amber-600 italic font-serif lowercase tracking-normal">
              Brass & Silver
            </span>{" "}
            <br />
            Idols.
          </h1>

          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
            Experience the spiritual grace of{" "}
            <span className="text-slate-900 font-bold">Nandhini Metals</span>.
            Exquisite, hand-cast masterpieces crafted for temple and home.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={scrollToProducts}
              className="group bg-slate-900 text-white px-10 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all hover:bg-amber-600 hover:shadow-2xl hover:shadow-amber-200 active:scale-95 flex items-center gap-3"
            >
              Explore Collection
              <Lucide.ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button className="px-8 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest text-slate-900 hover:bg-amber-50 transition-all flex items-center gap-2 border border-slate-100 shadow-sm">
              <Lucide.PlayCircle size={20} className="text-amber-600" />
              Process Story
            </button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  className="w-10 h-10 rounded-full border-4 border-white object-cover"
                  src={`https://i.pravatar.cc/100?img=${i + 5}`}
                  alt="Devotee"
                />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400">
              <span className="text-slate-900 font-black">4,800+</span> Blessed
              Homes
            </p>
          </div>
        </div>

        {/* --- IMAGE COMPOSITION --- */}
        <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[500px]">
            {/* Main Image Container */}
            <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] aspect-square relative z-10 border-[12px] border-white bg-white">
              <img
                src="/nandini.png"
                // object-contain ensures the image is not cropped/zoomed
                className="w-full h-full object-contain p-6"
                alt="Exquisite Brass Idol"
              />
            </div>

            {/* Heritage Badge (Moved to Top Left for balance) */}
            <div className="absolute -top-6 -left-6 bg-white p-5 rounded-[2rem] shadow-2xl z-20 border border-amber-50">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
                  <Lucide.ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Verified
                  </p>
                  <p className="text-xs font-black text-slate-900 uppercase">
                    99% Pure Metal
                  </p>
                </div>
              </div>
            </div>

            {/* DYNAMIC OFFER CARD (Moved to BOTTOM) */}
            <div className="absolute -bottom-10 -right-4 md:-right-10 bg-amber-500 p-7 rounded-[2.5rem] shadow-2xl z-30 text-white min-w-[210px] transform transition-all duration-500">
              <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-90 animate-pulse">
                  {offers[discountIndex].label}
                </p>
                <p className="text-4xl font-black tracking-tighter leading-none mt-1">
                  {offers[discountIndex].value}
                </p>
                <p className="text-[10px] font-bold mt-2 opacity-80">
                  {offers[discountIndex].sub}
                </p>

                {/* Progress Indicators */}
                <div className="flex gap-1 mt-4">
                  {offers.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i === discountIndex ? "bg-white w-4" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SCROLL INDICATOR --- */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] font-black uppercase tracking-widest">
          Explore
        </span>
        <div className="w-[2px] h-12 bg-slate-900 rounded-full overflow-hidden">
          <div className="w-full h-1/2 bg-amber-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
