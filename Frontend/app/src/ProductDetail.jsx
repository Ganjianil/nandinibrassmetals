import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import * as Lucide from "lucide-react";
import api from "./api";

const ProductDetail = ({ products, categories }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const API_BASE_URL = api.defaults.baseURL;

  const product = products.find((p) => p.id === parseInt(id));

  // --- LOGIC FOR SIMILAR PRODUCTS ---
  const similarProducts = React.useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) => p.category_id === product.category_id && p.id !== product.id,
      )
      .slice(0, 4); // Show top 4 similar items
  }, [product, products]);

  const productImages = React.useMemo(() => {
    if (!product?.image) return ["/placeholder.png"];
    try {
      const parsed =
        typeof product.image === "string"
          ? JSON.parse(product.image)
          : product.image;
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return [product.image];
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQty(1);
    setActiveImgIndex(0);
  }, [id]);

  if (!product) return null;

  const displayPrice = product.discount_price || product.price;
  const isInCart = cart.some((item) => item.id === product.id);
  const isOutOfStock = product.stock <= 0;

  const discountPercent = product.discount_price
    ? Math.round(
        ((product.price - product.discount_price) / product.price) * 100,
      )
    : null;

  const getImgSrc = (path) => {
    if (!path || typeof path !== "string") return "/placeholder.png";
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  return (
    <div className="bg-[#FCFBFA] min-h-screen pb-24 md:pb-12 font-sans">
      {/* 1. FULL SCREEN IMAGE (LIGHTBOX) */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-4 bg-slate-100 hover:bg-slate-200 rounded-full transition-all flex items-center gap-2 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900">
              Close Full View
            </span>
            <Lucide.X size={24} strokeWidth={2} className="text-slate-900" />
          </button>

          <img
            src={getImgSrc(productImages[activeImgIndex])}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
            alt="Full view"
          />
        </div>
      )}

      {/* 2. BREADCRUMB */}
      <nav className="max-w-7xl mx-auto px-6 pt-6 md:pt-12">
        <Link
          to="/"
          className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-amber-700 transition-colors gap-2"
        >
          <Lucide.ArrowLeft size={14} /> Back to Collection
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* 3. IMAGE GALLERY SECTION */}
          <div className="space-y-6">
            <div className="relative aspect-square md:aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group">
              <button
                onClick={() => navigate(-1)}
                className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all transform active:scale-90 flex items-center gap-2"
              >
                <Lucide.X size={20} className="text-slate-900" />
              </button>

              {discountPercent && (
                <div className="absolute top-6 left-6 z-10">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-2xl shadow-xl flex flex-col items-center justify-center rotate-[-5deg] border-2 border-white">
                    <span className="text-[10px] font-black uppercase tracking-tighter leading-none">
                      Save
                    </span>
                    <span className="text-xl font-black">
                      {discountPercent}%
                    </span>
                  </div>
                </div>
              )}

              <img
                onClick={() => setIsLightboxOpen(true)}
                src={getImgSrc(productImages[activeImgIndex])}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
                alt={product.name}
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImgIndex === idx ? "border-amber-600 scale-95 shadow-inner" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={getImgSrc(img)}
                    className="w-full h-full object-cover"
                    alt="thumb"
                  />
                </button>
              ))}
            </div>

            {product.description && (
              <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                <p className="text-slate-600 text-sm font-medium italic leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>

          {/* 4. INFO SECTION */}
          <div className="flex flex-col space-y-8 md:pt-4">
            <header className="space-y-4">
              <span className="text-amber-700 font-black text-[10px] uppercase tracking-[0.4em]">
                {product.category_name || "Handcrafted Brass"}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-[1.1] tracking-tight italic">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <span className="text-3xl font-bold text-slate-900">
                  ₹{displayPrice}
                </span>
                {product.discount_price && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-slate-300 line-through">
                      ₹{product.price}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                      {discountPercent}% OFF
                    </span>
                  </div>
                )}
              </div>
            </header>

            <hr className="border-slate-100" />

            {/* INVENTORY BAR */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Inventory Status
                </span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                  Available
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${Math.min((product.stock / 50) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                Only {product.stock} pieces left in our collection
              </p>
            </div>

            {/* LONG DESCRIPTION */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">
                  Craftsmanship & Story
                </h3>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-500 text-lg leading-relaxed font-light whitespace-pre-line">
                  {product.long_description}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            {!isOutOfStock && (
              <div className="flex flex-col gap-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-16">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-5 hover:bg-slate-50 transition-colors h-full border-r"
                    >
                      <Lucide.Minus size={16} />
                    </button>
                    <span className="w-14 text-center font-bold text-lg">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="px-5 hover:bg-slate-50 transition-colors h-full border-l"
                    >
                      <Lucide.Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      addToCart({
                        ...product,
                        quantity: qty,
                        price: displayPrice,
                      })
                    }
                    className={`flex-1 h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg transition-all transform active:scale-95 ${isInCart ? "bg-emerald-600 text-white" : "bg-slate-900 text-white hover:bg-amber-800"}`}
                  >
                    {isInCart ? "Already In Bag" : "Add to Shopping Bag"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 5. SIMILAR PRODUCTS SECTION --- */}
        {similarProducts.length > 0 && (
          <section className="mt-32 pt-20 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-amber-700 font-black text-[10px] uppercase tracking-[0.4em]">
                  Curated for You
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-900 italic mt-2">
                  Similar Masterpieces
                </h2>
              </div>
              <Link
                to="/"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-700 transition-all flex items-center gap-2 border-b-2 border-slate-100 pb-1"
              >
                View All Collection <Lucide.ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {similarProducts.map((item) => {
                const itemImg = item.image
                  ? typeof item.image === "string"
                    ? JSON.parse(item.image)[0]
                    : item.image[0]
                  : "/placeholder.png";
                return (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    className="group"
                  >
                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-white border border-slate-100 mb-6 relative shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                      <img
                        src={getImgSrc(itemImg)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={item.name}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    </div>
                    <div className="space-y-1 px-2">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-amber-700 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-slate-900">
                        ₹{item.discount_price || item.price}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
