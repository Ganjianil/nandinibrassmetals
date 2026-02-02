import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import * as Lucide from "lucide-react";

const API_BASE_URL = "https://nandinibrassmetals.vercel.app";

// --- REDESIGNED BEAUTIFUL PRODUCT CARD ---
const ProductCard = ({
  p,
  API_BASE_URL,
  addToCart,
  removeFromCart,
  updateQuantity,
  cartItem,
}) => {
  const isOutOfStock = p.stock <= 0;
  const currentQty = cartItem ? cartItem.quantity : 0;

  // --- LUXURY DISCOUNT LOGIC ---
  const hasDiscount = p.discount_price && p.discount_price < p.price;
  const displayPrice = hasDiscount ? p.discount_price : p.price;
  const originalPrice = p.price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  // Smart URL logic to prevent doubling
  const getImgSrc = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  const handleAddOne = () => {
    if (currentQty < p.stock) {
      if (currentQty === 0) {
        addToCart({ ...p, quantity: 1, price: displayPrice });
      } else {
        updateQuantity(p.id, currentQty + 1);
      }
    }
  };

  const handleRemoveOne = () => {
    if (currentQty > 1) {
      updateQuantity(p.id, currentQty - 1);
    } else {
      removeFromCart(p.id);
    }
  };

  return (
    <div
      className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${isOutOfStock ? "opacity-60" : ""}`}
    >
      {/* Premium Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#f8f9fa] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700">
        {/* LUXURY BADGE: Glassmorphism Effect */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-5 left-5 z-30">
            <div className="bg-white/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl shadow-xl flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none">
                Save
              </span>
              <span className="text-sm font-black text-red-600 tracking-tighter">
                {discountPercentage}%
              </span>
            </div>
          </div>
        )}

        <Link
          to={isOutOfStock ? "#" : `/product/${p.id}`}
          className={`block h-full w-full ${isOutOfStock ? "cursor-default" : "cursor-pointer"}`}
        >
          {p.image ? (
            <img
              src={getImgSrc(p.image)}
              className={`h-full w-full object-cover transition-all duration-[1.5s] ease-out ${!isOutOfStock && "group-hover:scale-110 group-hover:rotate-1"}`}
              alt={p.name}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Lucide.Package size={40} className="text-slate-200" />
            </div>
          )}
        </Link>

        {/* Sold Out Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white/10 border border-white/20 px-8 py-3 rounded-full">
              <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">
                Vault Closed
              </span>
            </div>
          </div>
        )}

        {/* Floating Action Button (Desktop Only) */}
        {!isOutOfStock && (
          <div className="absolute bottom-8 left-0 right-0 px-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 hidden md:block">
            {currentQty === 0 ? (
              <button
                onClick={handleAddOne}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl hover:bg-amber-600 transition-colors"
              >
                <Lucide.ShoppingBag size={16} />
                Add to Collection
              </button>
            ) : (
              <div className="flex items-center justify-between bg-white rounded-2xl p-2 shadow-2xl border border-slate-100">
                <button
                  onClick={handleRemoveOne}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
                >
                  {currentQty === 1 ? (
                    <Lucide.Trash2 size={16} />
                  ) : (
                    <Lucide.Minus size={16} />
                  )}
                </button>
                <span className="font-black text-slate-900 text-lg">
                  {currentQty}
                </span>
                <button
                  onClick={handleAddOne}
                  className="w-10 h-10 flex items-center justify-center text-amber-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <Lucide.Plus size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Elegant Product Info */}
      <div className="mt-8 text-center px-2">
        <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
          Exclusive Brass
        </h3>
        <h2 className="font-black text-xl uppercase text-slate-900 tracking-tighter leading-none mb-3 group-hover:text-amber-600 transition-colors">
          {p.name}
        </h2>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            {hasDiscount && (
              <span className="text-slate-300 line-through text-sm font-bold decoration-slate-300">
                ₹{originalPrice}
              </span>
            )}
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              ₹{displayPrice}
            </span>
          </div>

          {/* Minimalist Mobile Controls */}
          {!isOutOfStock && (
            <div className="w-full md:hidden pt-2">
              {currentQty === 0 ? (
                <button
                  onClick={handleAddOne}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg"
                >
                  Quick Add
                </button>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button
                    onClick={handleRemoveOne}
                    className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400"
                  >
                    {currentQty === 1 ? (
                      <Lucide.Trash2 size={16} />
                    ) : (
                      <Lucide.Minus size={16} />
                    )}
                  </button>
                  <span className="font-black text-slate-900">
                    {currentQty}
                  </span>
                  <button
                    onClick={handleAddOne}
                    className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-600"
                  >
                    <Lucide.Plus size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PRODUCT LIST COMPONENT ---
const ProductList = ({ products = [], categories = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { addToCart, removeFromCart, updateQuantity, cart } = useCart();
  const productSectionRef = useRef(null);

  const getImgSrc = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory
      ? p.category_id === selectedCategory
      : true;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: productSectionRef.current?.offsetTop - 100,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-20 bg-white">
      {/* CATEGORY SECTION */}
      <section className="mb-24">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-black text-xs uppercase tracking-[0.4em] block mb-3">
            Divine Curation
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900">
            Shop by Category
          </h2>
        </div>

        <div className="flex overflow-x-auto pb-6 md:pb-0 md:grid md:grid-cols-5 gap-6 snap-x no-scrollbar">
          <div
            onClick={() => setSelectedCategory(null)}
            className={`min-w-[160px] md:min-w-0 cursor-pointer group relative overflow-hidden rounded-[2.5rem] h-52 transition-all snap-center flex items-center justify-center bg-slate-900 ${
              !selectedCategory ? "ring-4 ring-amber-500 ring-offset-4" : ""
            }`}
          >
            <div className="p-6 text-white font-black text-[10px] uppercase tracking-widest">
              Show All
            </div>
          </div>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-w-[160px] md:min-w-0 cursor-pointer group relative overflow-hidden rounded-[2.5rem] h-52 transition-all snap-center ${
                selectedCategory === cat.id
                  ? "ring-4 ring-amber-500 ring-offset-4"
                  : ""
              }`}
            >
              {cat.image && (
                <img
                  src={getImgSrc(cat.image)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={cat.name}
                />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-white font-black text-[10px] uppercase tracking-widest text-center">
                {cat.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEARCH HEADER */}
      <div
        ref={productSectionRef}
        className="mb-16 flex flex-col lg:flex-row items-center justify-between gap-10 border-b pb-12"
      >
        <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : "Catalog"}
        </h2>
        <div className="relative w-full max-w-md">
          <Lucide.Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search our collection..."
            className="w-full bg-slate-50 py-5 pl-14 pr-6 rounded-[2rem] outline-none font-bold focus:ring-2 ring-amber-500/20"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
          {currentProducts.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              API_BASE_URL={API_BASE_URL}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              cartItem={cart?.find((item) => item.id === p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-[4rem]">
          <p className="text-slate-400 font-black uppercase tracking-widest">
            No items found.
          </p>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-24 flex justify-center items-center gap-3">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center disabled:opacity-20 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            <Lucide.ChevronLeft size={24} />
          </button>
          <span className="font-black px-6 text-slate-900 uppercase text-xs tracking-widest">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center disabled:opacity-20 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            <Lucide.ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
