import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";
import * as Lucide from "lucide-react";

// --- SUB-COMPONENT FOR INDIVIDUAL PRODUCT LOGIC ---
const ProductCard = ({
  p,
  API_BASE_URL,
  addToCart,
  removeFromCart,
  updateQuantity,
  cartItem,
}) => {
  const isOutOfStock = p.stock <= 0;

  // Current quantity is derived directly from the cart
  const currentQty = cartItem ? cartItem.quantity : 0;

  const handleAddOne = () => {
    if (currentQty < p.stock) {
      if (currentQty === 0) {
        addToCart({ ...p, quantity: 1 });
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
      className={`group relative flex flex-col ${isOutOfStock ? "opacity-60" : ""}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] bg-slate-100 border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-500">
        <Link
          to={isOutOfStock ? "#" : `/product/${p.id}`}
          className={isOutOfStock ? "cursor-default" : ""}
        >
          {p.image ? (
            <img
              src={`${API_BASE_URL}${p.image}`}
              className={`h-full w-full object-cover transition-transform duration-1000 ${!isOutOfStock && "group-hover:scale-110"}`}
              alt={p.name}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-200">
              <Lucide.Image size={40} className="text-slate-400" />
            </div>
          )}
        </Link>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-white text-slate-900 font-black px-6 py-2 rounded-full uppercase tracking-widest text-xs shadow-2xl transform -rotate-12">
              Sold Out
            </span>
          </div>
        )}

        {/* --- DESKTOP HOVER ACTION --- */}
        {!isOutOfStock && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hidden md:flex items-center justify-center z-20">
            {currentQty === 0 ? (
              <button
                onClick={handleAddOne}
                className="w-full py-3 bg-amber-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center justify-between w-full px-2">
                <button
                  onClick={handleRemoveOne}
                  className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                >
                  {currentQty === 1 ? (
                    <Lucide.Trash2 size={16} />
                  ) : (
                    <Lucide.Minus size={16} />
                  )}
                </button>
                <span className="font-black text-slate-900">{currentQty}</span>
                <button
                  onClick={handleAddOne}
                  className="p-2 hover:bg-slate-100 rounded-lg text-amber-600"
                >
                  <Lucide.Plus size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-6 px-2 text-center">
        <h3 className="font-black text-lg uppercase text-slate-900 tracking-tight leading-tight">
          {p.name}
        </h3>
        <p className="text-slate-400 text-[11px] font-medium mt-1 mb-3 italic">
          {isOutOfStock
            ? "Checking restock dates..."
            : `Stock Available: ${p.stock}`}
        </p>

        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl font-black text-slate-900">₹{p.price}</span>

          {/* --- MOBILE SPECIFIC CONTROLS --- */}
          {!isOutOfStock && (
            <div className="w-full md:hidden">
              {currentQty === 0 ? (
                <button
                  onClick={handleAddOne}
                  className="w-full py-3 bg-amber-600 text-white rounded-xl font-black uppercase text-xs"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  <button
                    onClick={handleRemoveOne}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400"
                  >
                    {currentQty === 1 ? (
                      <Lucide.Trash2 size={14} />
                    ) : (
                      <Lucide.Minus size={14} />
                    )}
                  </button>
                  <span className="font-black text-slate-900">
                    {currentQty}
                  </span>
                  <button
                    onClick={handleAddOne}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-600"
                  >
                    <Lucide.Plus size={14} />
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

  // Added removeFromCart and updateQuantity from Context
  const { addToCart, removeFromCart, updateQuantity, cart } = useCart();
  const productSectionRef = useRef(null);

  const API_BASE_URL = "http://localhost:5000";

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
                  src={`${API_BASE_URL}${cat.image}`}
                  className="w-full h-full object-cover"
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
            placeholder="Search divine metals..."
            className="w-full bg-slate-50 py-5 pl-14 pr-6 rounded-[2rem] outline-none font-bold focus:ring-2 ring-amber-500/20"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
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
            className="w-14 h-14 rounded-full border-2 flex items-center justify-center disabled:opacity-20 hover:bg-slate-900 hover:text-white transition-all"
          >
            <Lucide.ChevronLeft size={24} />
          </button>
          <span className="font-black px-6">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-14 h-14 rounded-full border-2 flex items-center justify-center disabled:opacity-20 hover:bg-slate-900 hover:text-white transition-all"
          >
            <Lucide.ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
