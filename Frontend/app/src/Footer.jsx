import React from "react";
import * as Lucide from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0A0A0B] text-white pt-28 pb-10 overflow-hidden">
      {/* Decorative Radial Gradient - Gives a subtle "glow" to the metal theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px]" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-12">
          {/* Brand & Manifesto Section */}
          <div className="md:col-span-5 space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif italic text-[#C5A059] tracking-tighter">
                Nandhini Metals
              </h2>
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-zinc-700"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                  Est. 1998 • Crafting Divinity
                </span>
              </div>
            </div>
            <p className="text-zinc-400 text-lg font-serif italic leading-relaxed max-w-md">
              "Every curve is a prayer, every alloy is an ancestral secret. We
              don't just cast metal; we anchor tradition into the modern home."
            </p>
            <div className="flex gap-6">
              {[
                { Icon: Lucide.Instagram, link: "#" },
                { Icon: Lucide.Facebook, link: "#" },
                { Icon: Lucide.Youtube, link: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  className="group relative p-3 border border-zinc-800 rounded-full hover:border-[#C5A059] transition-all duration-500"
                >
                  <social.Icon
                    size={18}
                    className="text-zinc-400 group-hover:text-[#C5A059] transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059]">
              Curations
            </h4>
            <ul className="space-y-4">
              {["Divine Idols", "Temple Decor", "Ritualware", "Panchaloha"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-zinc-500 hover:text-white text-sm transition-all duration-300 flex items-center gap-2 group"
                    >
                      <div className="w-0 h-[1px] bg-[#C5A059] group-hover:w-4 transition-all duration-500" />
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C5A059]">
              The Studio
            </h4>
            <div className="space-y-6 text-zinc-400">
              <div className="group flex gap-4 items-start">
                <Lucide.MapPin size={20} className="text-[#C5A059] shrink-0" />
                <p className="text-sm leading-relaxed group-hover:text-white transition-colors">
                  Uppal Industrial Estate,
                  <br /> Hyderabad, TS 500039
                </p>
              </div>
              <div className="group flex gap-4 items-center">
                <Lucide.Phone size={20} className="text-[#C5A059] shrink-0" />
                <p className="text-sm group-hover:text-white transition-colors">
                  +91 98480 12345
                </p>
              </div>
              <div className="group flex gap-4 items-center">
                <Lucide.Mail size={20} className="text-[#C5A059] shrink-0" />
                <p className="text-sm group-hover:text-white transition-colors">
                  heritage@nandhini.com
                </p>
              </div>
            </div>
          </div>

          {/* Back to Top / Seal */}
          <div className="md:col-span-2 flex flex-col justify-between items-end">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center group hover:border-[#C5A059] transition-all duration-700"
            >
              <Lucide.ArrowUp
                size={20}
                className="text-zinc-500 group-hover:text-[#C5A059] group-hover:-translate-y-1 transition-all"
              />
            </button>
            <div className="text-right">
              <Lucide.ShieldCheck
                size={32}
                className="text-zinc-900 ml-auto mb-2"
              />
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-800">
                100% Certified Purity
              </p>
            </div>
          </div>
        </div>

        {/* The Mega Signature Footer */}
        <div className="mt-24 pt-10 border-t border-zinc-900/50">
          <div className="relative">
            <h1 className="text-[14vw] font-serif italic text-[#141415] leading-none select-none tracking-tighter">
              Legacy.
            </h1>

            {/* Final Copyright Bar */}
            <div className="md:absolute bottom-4 left-0 w-full flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.5em]">
                © {currentYear} Nandhini Brass & Metals. Hand-cast with
                devotion.
              </p>
              <div className="flex gap-10">
                {["Terms", "Privacy", "Shipping"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-zinc-600 hover:text-[#C5A059] text-[9px] font-bold uppercase tracking-[0.3em] transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
