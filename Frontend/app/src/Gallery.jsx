import React from "react";
import * as Lucide from "lucide-react";

const Gallery = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="relative h-[400px] md:h-[650px] rounded-[3.5rem] overflow-hidden group shadow-2xl border-8 border-white">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-[2s]"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-studio-33358-large.mp4"
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-10 md:p-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-xl">
                <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.3em] mb-6 inline-block">
                  Exclusive Reveal 2026
                </span>
                <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-4">
                  The New <br />{" "}
                  <span className="text-blue-500 italic">Standard.</span>
                </h2>
              </div>
              <button className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl group/btn active:scale-95">
                <Lucide.Play
                  fill="black"
                  className="ml-2 group-hover/btn:text-blue-600 transition-colors"
                  size={40}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
