import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import * as Lucide from "lucide-react";

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const [qty, setQty] = useState(1);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const API_BASE_URL = "https://nandinibrassmetals-1.onrender.com";

  const product = products.find((p) => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQty(1);
  }, [id]);

  if (!product) return null;

  // --- PRICE LOGIC ---
  const hasDiscount =
    product.discount_price && product.discount_price < product.price;
  const displayPrice = hasDiscount ? product.discount_price : product.price;
  const originalPrice = product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const isInCart = cart.some((item) => item.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const similarProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const getImgSrc = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800";
    return imagePath.startsWith("http")
      ? imagePath
      : `${API_BASE_URL}${imagePath}`;
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12">
      {/* NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          to="/"
          className="group inline-flex items-center text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:text-amber-600 transition-colors"
        >
          <Lucide.ChevronLeft
            size={18}
            className="mr-1 group-hover:-translate-x-1 transition-transform"
          />
          Back to Catalog
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* IMAGE SECTION - CLEAN & SHARP */}
          <div className="relative group/zoom">
            <div
              className="relative aspect-square md:aspect-[4/5] bg-slate-50 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
            >
              {/* DISCOUNT BADGE */}
              {hasDiscount && !isOutOfStock && (
                <div className="absolute top-6 left-6 z-30">
                  <div className="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-2">
                    <span className="text-red-600 font-black text-sm">
                      -{discountPercentage}%
                    </span>
                    <span className="h-3 w-[1px] bg-slate-200"></span>
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Limited Offer
                    </span>
                  </div>
                </div>
              )}

              {/* IMAGE & ZOOM */}
              <img
                src={getImgSrc(product.image)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${zoomPos.show ? "opacity-0" : "opacity-100"}`}
                alt={product.name}
              />

              {zoomPos.show && !isOutOfStock && (
                <div
                  className="absolute inset-0 pointer-events-none bg-no-repeat"
                  style={{
                    backgroundImage: `url(${getImgSrc(product.image)})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: "220%",
                  }}
                />
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-white text-slate-900 px-8 py-3 rounded-full font-black uppercase tracking-widest -rotate-12 shadow-2xl">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Premium Brass
                </span>
                {product.stock < 5 && !isOutOfStock && (
                  <span className="text-red-500 text-[10px] font-black uppercase animate-pulse">
                    Only {product.stock} pieces left
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9] mb-8">
                {product.name}
              </h1>

              {/* PRICING WITH COLOR DIFFERENTIATION */}
              <div className="flex items-end gap-5">
                <p className="text-5xl font-black text-slate-900 tracking-tighter">
                  ₹{displayPrice}
                </p>
                {hasDiscount && (
                  <div className="flex flex-col mb-1">
                    <span className="text-slate-300 text-xl line-through font-black decoration-slate-300">
                      ₹{originalPrice}
                    </span>
                    <span className="text-red-500 text-[10px] font-black uppercase tracking-tighter">
                      Save ₹{originalPrice - displayPrice}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-8 mb-10 border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                The Description
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium italic text-lg">
                "{product.description}"
              </p>
            </div>

            {!isOutOfStock && (
              <div className="hidden md:flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-slate-100 p-2 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all"
                    >
                      <Lucide.Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-black text-2xl text-slate-900">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all"
                    >
                      <Lucide.Plus size={18} />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        ...product,
                        quantity: qty,
                        price: displayPrice,
                        original_price: originalPrice,
                      })
                    }
                    className={`flex-1 h-16 rounded-[2rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                      isInCart
                        ? "bg-green-600 text-white"
                        : "bg-slate-900 text-white hover:bg-amber-600 shadow-xl"
                    }`}
                  >
                    <Lucide.ShoppingCart size={20} />
                    {isInCart ? "In Your Bag" : "Add to Bag"}
                  </button>
                </div>
              </div>
            )}

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-slate-100">
              {[
                { icon: <Lucide.ShieldCheck />, label: "Authentic" },
                { icon: <Lucide.Truck />, label: "Secured" },
                { icon: <Lucide.RotateCcw />, label: "Inspected" },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-2">
                    {badge.icon}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="mt-24 max-w-4xl border-t border-slate-100 pt-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-slate-900">
            Craftsmanship & Care
          </h2>
          <div className="text-slate-600 leading-loose text-lg whitespace-pre-wrap font-medium bg-slate-50 p-10 rounded-[3rem]">
            {product.long_description ||
              "This exquisite piece is handcrafted by master artisans, showcasing centuries-old metalworking traditions."}
          </div>
        </div>
      </main>

      {/* MOBILE STICKY */}
      {!isOutOfStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl p-4 border-t border-slate-100 md:hidden z-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 rounded-2xl h-14 px-2">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2 text-slate-500"
              >
                <Lucide.Minus size={14} />
              </button>
              <span className="w-8 text-center font-black">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="p-2 text-slate-500"
              >
                <Lucide.Plus size={14} />
              </button>
            </div>
            <button
              onClick={() =>
                addToCart({
                  ...product,
                  quantity: qty,
                  price: displayPrice,
                  original_price: originalPrice,
                })
              }
              className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2 ${
                isInCart ? "bg-green-600 text-white" : "bg-slate-900 text-white"
              }`}
            >
              {isInCart ? "Added" : "Add to Bag"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
