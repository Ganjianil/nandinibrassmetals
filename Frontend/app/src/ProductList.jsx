import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "./CartContext";
import * as Lucide from "lucide-react";
import api from "./api";
const API_BASE_URL = api.defaults.baseURL;

// --- PREMIUM PRODUCT CARD ---
const ProductCard = ({ p, API_BASE_URL, addToCart, isRow = false }) => {
  const navigate = useNavigate();
  const displayPrice = p.discount_price || p.price;

  // FIXED: Handles both single strings (Category) and Arrays (Product)
  const getImgSrc = (path) => {
    // 1. Handle Empty Array []
    if (Array.isArray(path) && path.length === 0) {
      return "https://placehold.co/400x500?text=No+Image+Uploaded";
    }

    // 2. Extract path if it's an array with items
    const cleanPath = Array.isArray(path) ? path[0] : path;

    // 3. Final safety check
    if (!cleanPath || typeof cleanPath !== "string") {
      return "https://placehold.co/400x500?text=No+Image+Found";
    }

    return cleanPath.startsWith("http")
      ? cleanPath
      : `${API_BASE_URL}${cleanPath}`;
  };

  return (
    <div
      className={`group flex flex-col items-center text-center transition-all duration-1000 
      ${isRow ? "min-w-[180px] md:min-w-[280px]" : "w-full mx-auto max-w-[220px] md:max-w-[320px]"}`}
    >
      <div
        onClick={() => navigate(`/product/${p.id}`)}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] bg-[#f2f1ee] transition-all duration-700 cursor-pointer border border-slate-200/40 shadow-sm"
      >
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.02)_100%)] pointer-events-none" />

        <img
          src={getImgSrc(p.image)}
          className="h-full w-full object-cover transition-all duration-[2s] ease-out group-hover:scale-110"
          alt={p.name}
        />

        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full z-20 shadow-sm border border-white/20">
          <span className="text-[9px] md:text-[11px] font-black text-[#0c1322]">
            ₹{displayPrice}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart({ ...p, quantity: 1, price: displayPrice });
          }}
          className="absolute bottom-3 right-3 bg-[#0c1322] text-white p-2.5 rounded-full z-30 shadow-lg hover:bg-amber-600 transition-all transform hover:scale-110 active:scale-95"
        >
          <Lucide.Plus size={18} strokeWidth={3} />
        </button>
      </div>

      <div className="mt-4 w-full px-2">
        <h2 className="font-serif text-[11px] md:text-sm lg:text-base text-[#0c1322] tracking-tight uppercase line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
          {p.name}
        </h2>
        <div className="flex justify-center mt-1.5">
          <div className="h-[1px] w-4 bg-slate-200 group-hover:w-8 group-hover:bg-amber-500 transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );
};

// --- AUTO-SCROLLING HORIZONTAL ROW ---
const ProductRow = ({ category, products, API_BASE_URL, addToCart }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const catProducts = products.filter((p) => p.category_id === category.id);

  useEffect(() => {
    if (isPaused || !scrollRef.current) return;
    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 1) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 1, behavior: "auto" });
      }
    }, 40);
    return () => clearInterval(interval);
  }, [isPaused]);

  if (catProducts.length === 0) return null;

  return (
    <div
      className="py-12 md:py-20 border-t border-slate-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 px-2 gap-4">
        <div className="space-y-1">
          <span className="text-amber-700/60 font-black text-[9px] uppercase tracking-[0.5em] block">
            Exclusive Collection
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#0c1322] uppercase tracking-tighter italic opacity-90">
            {category.name}
          </h2>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-6 px-2 scroll-smooth"
      >
        {catProducts.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            API_BASE_URL={API_BASE_URL}
            addToCart={addToCart}
            isRow={true}
          />
        ))}
      </div>
    </div>
  );
};

// --- CATEGORY PANEL ---
const CategoryPanel = ({ cat, isFull, API_BASE_URL }) => {
  const navigate = useNavigate();

  // FIXED: Handles single strings (Category) effectively
  const getImgSrc = (path) => {
    const cleanPath = Array.isArray(path) ? path[0] : path;
    if (!cleanPath || typeof cleanPath !== "string") return "/placeholder.png";
    return cleanPath.startsWith("http")
      ? cleanPath
      : `${API_BASE_URL}${cleanPath}`;
  };

  return (
    <div
      onClick={() => navigate(`/category/${cat.id}`)}
      className={`relative overflow-hidden group cursor-pointer rounded-[1.5rem] md:rounded-[3rem] transition-all duration-1000 shadow-md 
        ${isFull ? "h-[300px] md:h-[600px] lg:h-[700px]" : "h-[200px] md:h-[400px] lg:h-[450px]"}`}
    >
      <img
        src={getImgSrc(cat.image)}
        className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105 brightness-[0.85] md:group-hover:brightness-95"
        alt={cat.name}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:pb-16 text-center px-4">
        <h3
          className={`text-white font-serif uppercase tracking-tighter leading-none mb-3 ${isFull ? "text-3xl md:text-7xl" : "text-xl md:text-4xl"}`}
        >
          {cat.name}
        </h3>
        <span className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">
          Explore Collection
        </span>
      </div>
    </div>
  );
};

const ProductList = ({ products = [], categories = [] }) => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const bannerCategories = categories.slice(0, 6);
  const rowCategories = categories.slice(6);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = id ? p.category_id === parseInt(id) : true;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-20 py-8 space-y-16 md:space-y-32">
        {!id && (
          <div className="space-y-6 md:space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
              {bannerCategories.slice(0, 2).map((cat) => (
                <CategoryPanel
                  key={cat.id}
                  cat={cat}
                  isFull={true}
                  API_BASE_URL={API_BASE_URL}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {bannerCategories.slice(2, 6).map((cat) => (
                <CategoryPanel
                  key={cat.id}
                  cat={cat}
                  isFull={false}
                  API_BASE_URL={API_BASE_URL}
                />
              ))}
            </div>
          </div>
        )}

        <section>
          <div className="flex flex-col items-center mb-12 md:mb-24 text-center">
            <span className="text-amber-800/40 font-black text-[10px] uppercase tracking-[0.8em] mb-4">
              Discovery
            </span>
            <h2 className="text-4xl md:text-7xl lg:text-9xl font-serif text-[#0c1322] uppercase tracking-tighter leading-none mb-10 opacity-90">
              {id
                ? categories.find((c) => c.id === parseInt(id))?.name
                : "The Gallery"}
            </h2>
            <div className="relative w-full max-w-xs border-b border-slate-300">
              <Lucide.Search
                className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 pl-8 text-[10px] font-black tracking-[0.3em] focus:ring-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 md:gap-x-12 gap-y-10 md:gap-y-24">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                p={p}
                API_BASE_URL={API_BASE_URL}
                addToCart={addToCart}
              />
            ))}
          </div>
        </section>

        {!id && !searchQuery && (
          <div className="pt-10">
            {rowCategories.map((cat) => (
              <ProductRow
                key={cat.id}
                category={cat}
                products={products}
                API_BASE_URL={API_BASE_URL}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
