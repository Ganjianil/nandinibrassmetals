import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Lucide from "lucide-react";
import api from "./api";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const PromoChip = ({ promo }) => {
  if (promo.message) {
    return (
      <div className="flex items-center gap-2 px-5 py-2 shrink-0 border border-[#d4c4a8] bg-white/70 rounded-sm">
        <span className="text-[10px] md:text-[11px] font-medium text-[#6b5a45] uppercase tracking-[0.16em] font-serif italic">
          {promo.message}
        </span>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-4 md:gap-6 shrink-0 px-4 md:px-6 py-2 md:py-2.5 bg-white/80 border border-[#d4c4a8] rounded-sm shadow-sm hover:shadow-md hover:border-[#b89130]/60 transition-all duration-500">
      <div className="flex items-baseline gap-1 border-r border-[#e8dcc8] pr-4 md:pr-6">
        <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#8b7355]">
          Flat
        </span>
        <span className="text-lg md:text-xl font-serif font-medium text-[#92400e] tabular-nums italic">
          {promo.discount_percent}%
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#8b7355]">
          Off
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <Lucide.Ticket size={14} className="text-[#b89130] shrink-0" strokeWidth={1.5} />
        <div>
          <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#9c8b76]">
            Use Coupon
          </p>
          <p className="text-xs md:text-sm font-serif font-semibold uppercase tracking-[0.1em] text-[#3d3028]">
            {promo.code}
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <span className="text-[#d4c4a8]">|</span>
        <div className="flex items-center gap-1.5">
          <Lucide.Calendar size={12} className="text-[#b89130]/80 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#9c8b76]">
              Valid Till
            </p>
            <p className="text-[10px] md:text-[11px] font-medium text-[#5c4a3a] whitespace-nowrap font-serif">
              {formatDate(promo.expiry_date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PromoMarquee = () => {
  const [promos, setPromos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get("/api/promos")
      .then((res) => setPromos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPromos([]))
      .finally(() => setLoaded(true));
  }, []);

  const displayItems =
    promos.length > 0
      ? promos
      : loaded
        ? [
            {
              code: "",
              discount_percent: 0,
              expiry_date: null,
              message: "Exclusive offers — add codes in Admin",
            },
          ]
        : [
            {
              code: "",
              discount_percent: 0,
              expiry_date: null,
              message: "Loading offers...",
            },
          ];

  const items = [...displayItems, ...displayItems];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#faf7f2] via-[#f5f0e8] to-[#faf7f2] border-t border-[#e8dcc8] border-b border-[#e0d4c0]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#b89130]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#b89130]/25 to-transparent" />

      <div className="absolute inset-y-0 left-0 w-12 md:w-20 bg-gradient-to-r from-[#f5f0e8] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 md:w-20 bg-gradient-to-l from-[#f5f0e8] to-transparent z-10 pointer-events-none" />

      <div className="relative flex items-center gap-3 md:gap-5 py-2.5 md:py-3">
        <div className="shrink-0 pl-4 md:pl-6 z-20 flex items-center gap-2 border-r border-[#e0d4c0] pr-3 md:pr-4">
          <Lucide.Gem size={13} className="text-[#b89130]" strokeWidth={1.5} />
          <span className="text-[9px] md:text-[10px] font-serif font-semibold uppercase tracking-[0.26em] text-[#7a6548] whitespace-nowrap">
            Offers
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="promo-marquee-track flex w-max items-center gap-4 md:gap-6">
            {items.map((promo, index) => (
              <PromoChip
                key={`${promo.code || promo.message}-${index}`}
                promo={promo}
              />
            ))}
          </div>
        </div>

        <Link
          to="/cart"
          className="shrink-0 mr-4 md:mr-6 z-20 px-3 py-1.5 rounded-sm border border-[#b89130]/40 bg-[#b89130]/10 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a5c1e] hover:bg-[#b89130]/20 hover:border-[#b89130]/60 transition-all whitespace-nowrap font-serif"
        >
          Apply at Checkout
        </Link>
      </div>
    </div>
  );
};

export default PromoMarquee;
