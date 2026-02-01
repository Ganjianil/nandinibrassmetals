import React from "react";
import * as Lucide from "lucide-react";

const GallerySection = () => {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1614032126233-0498305c6d31?auto=format&fit=crop&w=800",
      label: "Traditional Idols",
      span: "md:col-span-2 md:row-span-2",
    },
    {
      url: "https://images.unsplash.com/photo-1590538711976-5625e4d7561d?auto=format&fit=crop&w=600",
      label: "Aarti Essentials",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      url: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=600",
      label: "Home Decor",
      span: "md:col-span-1 md:row-span-1",
    },
    {
      url: "https://images.unsplash.com/photo-1603566580625-f85278788448?auto=format&fit=crop&w=800",
      label: "Handcrafted Luxury",
      span: "md:col-span-2 md:row-span-1",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 bg-white">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[1px] w-12 bg-amber-500"></span>
            <p className="text-amber-600 font-black text-xs uppercase tracking-[0.4em]">
              Heritage Showcase
            </p>
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9]">
            The Brass{" "}
            <span className="text-amber-500 text-6xl md:text-8xl">.</span>{" "}
            <br />
            Chronicles
          </h2>
          <p className="text-slate-400 mt-6 font-medium text-lg italic">
            "A visual journey through sacred artistry and timeless metalwork."
          </p>
        </div>

        <button className="group flex items-center gap-4 bg-slate-900 text-white pl-8 pr-4 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl">
          Explore Lookbook
          <div className="bg-white/20 p-2 rounded-full group-hover:bg-white group-hover:text-slate-900 transition-all">
            <Lucide.ArrowRight size={16} />
          </div>
        </button>
      </div>

      {/* --- BENTO GRID GALLERY --- */}
      {/* Mobile: Single column 
          Tablet: 2 columns
          Desktop: 4 columns complex grid
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-auto md:h-[800px]">
        {images.map((img, i) => (
          <div
            key={i}
            className={`group relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 ${img.span}`}
          >
            {/* Image */}
            <img
              src={img.url}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              alt={img.label}
            />

            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
              <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-amber-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                  Premium Quality
                </p>
                <h4 className="text-white text-3xl font-black uppercase tracking-tighter leading-none mb-4">
                  {img.label}
                </h4>
                <div className="flex gap-2">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                    <Lucide.ShoppingBag size={14} />
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                    <Lucide.Instagram size={14} />
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle Label (Visible when NOT hovering) */}
            <div className="absolute top-6 left-6 group-hover:opacity-0 transition-opacity">
              <div className="bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">
                  Collection 0{i + 1}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MOBILE FOOTER (Optional) --- */}
      <div className="mt-12 text-center md:hidden">
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
          Scroll to discover more
        </p>
      </div>
    </section>
  );
};

export default GallerySection;
