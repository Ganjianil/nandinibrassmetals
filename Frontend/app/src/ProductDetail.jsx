import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import * as Lucide from "lucide-react";

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const [qty, setQty] = useState(1);
  const API_BASE_URL = "https://nandinibrassmetals-1.onrender.com";

  const product = products.find((p) => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQty(1); // Reset quantity when switching products
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Lucide.SearchX size={64} className="text-slate-200 mb-4" />
        <h2 className="text-2xl font-black uppercase text-slate-400">
          Product not found
        </h2>
        <Link to="/" className="mt-4 text-amber-600 font-bold underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isInCart = cart.some((item) => item.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const similarProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12">
      {/* HEADER NAVIGATION */}
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
          {/* LEFT: IMAGE GALLERY GALLERY STYLE */}
          <div className="space-y-4">
            <div className="relative aspect-square md:aspect-[4/5] bg-slate-50 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={
                  product.image
                    ? `${API_BASE_URL}${product.image}`
                    : "https://via.placeholder.com/800"
                }
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                alt={product.name}
              />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-white text-slate-900 px-8 py-3 rounded-full font-black uppercase tracking-widest -rotate-12 shadow-2xl">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: CONTENT & ACTIONS */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Authentic Brass
                </span>
                {product.stock < 5 && !isOutOfStock && (
                  <span className="text-red-500 text-[10px] font-black uppercase animate-pulse">
                    Only {product.stock} pieces left
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9] mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-black text-amber-600">
                  ₹{product.price}
                </p>
                <span className="text-slate-400 text-sm line-through decoration-2">
                  ₹{Math.round(product.price * 1.2)}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                Product Summary
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium italic">
                "{product.description}"
              </p>
            </div>

            {/* DESKTOP ADD TO CART ACTIONS */}
            {!isOutOfStock && (
              <div className="hidden md:flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-slate-100 p-2 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all"
                    >
                      <Lucide.Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-black text-xl">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-all"
                    >
                      <Lucide.Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart({ ...product, quantity: qty })}
                    className={`flex-1 py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
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
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-2">
                  <Lucide.ShieldCheck size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500 leading-tight">
                  Authentic Material
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-2">
                  <Lucide.Truck size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500 leading-tight">
                  Secured Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-2">
                  <Lucide.RotateCcw size={20} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500 leading-tight">
                  Quality Inspected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS ACCORDION STYLE */}
        <div className="mt-24 max-w-4xl border-t border-slate-100 pt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              Craftsmanship & Care
            </h2>
            <div className="h-[2px] flex-1 bg-amber-100"></div>
          </div>
          <div className="text-slate-600 leading-loose text-lg whitespace-pre-wrap font-medium bg-slate-50 p-8 md:p-12 rounded-[3rem]">
            {product.long_description ||
              "This exquisite piece is handcrafted by master artisans, showcasing centuries-old metalworking traditions. Perfect for sacred spaces or as a statement of heritage in your home decor."}
          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <section className="mt-24">
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                You May Also Like
              </h2>
              <Link
                to="/"
                className="text-amber-600 font-black text-xs uppercase tracking-widest border-b-2 border-amber-600 pb-1"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group"
                >
                  <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 mb-4 border-2 border-transparent group-hover:border-amber-200 transition-all">
                    <img
                      src={
                        item.image
                          ? `${API_BASE_URL}${item.image}`
                          : "https://via.placeholder.com/300"
                      }
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={item.name}
                    />
                  </div>
                  <h4 className="font-black text-slate-800 uppercase text-xs tracking-wider group-hover:text-amber-600 transition-colors">
                    {item.name}
                  </h4>
                  <p className="font-black text-amber-600 mt-1">
                    ₹{item.price}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* MOBILE FIXED ACTION BAR */}
      {!isOutOfStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl p-4 border-t border-slate-100 md:hidden z-50">
          <div className="flex items-center gap-4 max-w-7xl mx-auto">
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
              onClick={() => addToCart({ ...product, quantity: qty })}
              className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg flex items-center justify-center gap-2 ${
                isInCart ? "bg-green-600 text-white" : "bg-slate-900 text-white"
              }`}
            >
              <Lucide.ShoppingCart size={16} />
              {isInCart ? "Added" : "Add to Bag"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
