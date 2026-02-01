import * as Lucide from "lucide-react";
import React, { useState, useRef } from "react";

const VideoSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24">
      <div
        className="relative h-[500px] md:h-[700px] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl group border-[6px] md:border-[12px] border-white bg-slate-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* VIDEO ELEMENT */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-[3s] ease-out"
        >
          {/* Suggestion: Replace with a video of molten brass or metal polishing for Nandhini Brass */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-studio-33358-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* OVERLAY GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent opacity-80 md:opacity-60 transition-opacity duration-500" />

        {/* CONTENT CONTAINER */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-2xl">
              {/* SUBTITLE */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-[2px] bg-amber-500"></span>
                <span className="text-amber-500 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
                  The Art of Metal 2026
                </span>
              </div>

              {/* MAIN TITLE */}
              <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-6">
                Divine <br />{" "}
                <span className="text-amber-500 italic font-serif lowercase pr-2">
                  Hand
                </span>
                Crafted.
              </h2>

              {/* DESCRIPTION TEXT (Only visible on desktop) */}
              <p className="hidden md:block text-slate-300 text-lg font-medium max-w-md leading-relaxed mb-4">
                Witness the transformation of raw brass into sacred heirlooms. A
                legacy of devotion, cast in gold.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-6">
              {/* PLAY BUTTON WITH GLASSMORPHISM */}
              <button className="relative w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-500 group/btn">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover/btn:bg-amber-600 group-hover/btn:border-amber-500 transition-all duration-500 scale-100 group-hover/btn:scale-110" />
                <Lucide.Play
                  fill="white"
                  className="relative z-10 ml-2 text-white transition-transform duration-500 group-hover/btn:scale-125"
                  size={window.innerWidth < 768 ? 24 : 40}
                />
              </button>

              {/* MOBILE CALL TO ACTION */}
              <div className="md:hidden">
                <button className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                  Shop Film
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CORNER BADGE */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12 z-20">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center text-white text-[8px] md:text-[10px] font-black uppercase text-center p-2 leading-tight animate-spin-slow">
            Genuine Brass • Est 1994 • Genuine Brass •
          </div>
        </div>
      </div>

      {/* FOOTER INFO - TRUST INDICATORS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 px-2">
        {[
          "Cinematic Quality",
          "Artisanal Process",
          "Global Delivery",
          "Secure Checkout",
        ].map((text, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
              {text}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoSection;
