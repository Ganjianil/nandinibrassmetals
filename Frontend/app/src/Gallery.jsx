import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "/img1.jpeg",
    title: "Sacred Ganesha",
    category: "BRASS",
    desc: "Hand-cast temple-grade brass idol of Lord Ganesha.",
  },
  {
    id: 2,
    src: "/img2.jpeg",
    title: "Temple Thali",
    category: "RITUALS",
    desc: "Ceremonial vessel with hand-etched traditional motifs.",
  },
  {
    id: 3,
    src: "/img3.jpeg",
    title: "Antique Deepam",
    category: "LIGHTING",
    desc: "Brass deepam crafted for the eternal sacred flame.",
  },
  {
    id: 4,
    src: "/lordmaha.png",
    title: "Lord Mahavisnu",
    category: "PREMIUM",
    desc: "Preserver of the universe in exquisite bronze detail.",
  },
  {
    id: 5,
    src: "/Gopuram.png",
    title: "The Entrance",
    category: "HERITAGE",
    desc: "Architectural homage to majestic temple gopurams.",
  },
];

const CATEGORIES = ["ALL", "BRASS", "RITUALS", "LIGHTING", "PREMIUM", "HERITAGE"];

const Gallery = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("ALL");

  const filteredImages = useMemo(() => {
    return filter === "ALL"
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);
  }, [filter]);

  const goToCustomOrder = () => navigate("/custom-order");

  return (
    <section id="gallery" className="bg-[#faf7f2] text-[#3d3028] pb-16 md:pb-24">
      {/* CTA banner — clear single action */}
      <div className="px-4 sm:px-6 pt-10 md:pt-16 max-w-6xl mx-auto">
        <div className="bg-white border border-[#e8dcc8] rounded-2xl p-5 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b89130] mb-2">
              Custom Orders
            </p>
            <h2 className="text-2xl md:text-3xl font-serif text-[#3d3028] leading-tight">
              Need a bespoke brass or silver piece?
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md">
              Temple idols, gajastambham, or custom designs — tell us your
              requirements and we will craft it for you.
            </p>
          </div>
          <button
            onClick={goToCustomOrder}
            className="shrink-0 w-full md:w-auto px-8 py-3.5 bg-[#3d3028] text-white rounded-xl font-semibold uppercase text-xs tracking-[0.14em] hover:bg-[#b89130] transition-colors shadow-md"
          >
            Start Custom Order
          </button>
        </div>
      </div>

      {/* Gallery header */}
      <div className="px-4 sm:px-6 pt-10 md:pt-14 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b89130] mb-2">
              Our Craftsmanship
            </p>
            <h2 className="text-2xl md:text-4xl font-serif text-[#3d3028]">
              Artisan Gallery
            </h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all ${
                  filter === cat
                    ? "bg-[#3d3028] text-white"
                    : "bg-white border border-[#e0d4c0] text-[#6b5a45] hover:border-[#b89130]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {filteredImages.map((img, idx) => (
            <article
              key={img.id}
              className={`bg-white border border-[#e8dcc8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                idx === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div
                className={`flex flex-col ${
                  idx === 0 ? "md:flex-row" : ""
                }`}
              >
                <div
                  className={`bg-[#f5f0e8] flex items-center justify-center p-4 ${
                    idx === 0 ? "md:w-1/2" : ""
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-auto object-contain max-h-[280px] md:max-h-[360px]"
                  />
                </div>
                <div
                  className={`p-4 md:p-6 flex flex-col justify-between ${
                    idx === 0 ? "md:w-1/2" : ""
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-semibold text-[#b89130] tracking-[0.2em] uppercase">
                      {img.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-serif text-[#3d3028] mt-1">
                      {img.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      {img.desc}
                    </p>
                  </div>
                  <button
                    onClick={goToCustomOrder}
                    className="mt-4 flex items-center justify-between w-full px-4 py-3 border border-[#3d3028] rounded-xl text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3d3028] hover:bg-[#3d3028] hover:text-white transition-colors group"
                  >
                    Order Similar Piece
                    <ArrowUpRight
                      size={16}
                      className="group-hover:rotate-45 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/custom-order"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#b89130] hover:text-[#92400e] transition-colors"
          >
            <ShieldCheck size={16} />
            Go to Custom Order Form
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
