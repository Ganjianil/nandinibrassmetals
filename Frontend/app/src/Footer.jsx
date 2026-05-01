import React from "react";
import { Link } from "react-router-dom";
import * as Lucide from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { Icon: Lucide.Instagram, label: "Instagram", href: "#" },
    { Icon: Lucide.Facebook, label: "Facebook", href: "#" },
    { Icon: Lucide.Youtube, label: "Youtube", href: "#" },
  ];

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Gallery", to: "/#gallery" },
    { label: "My Orders", to: "/orders" },
    { label: "Cart", to: "/cart" },
  ];

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[540px] h-[540px] bg-amber-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pt-16 sm:pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] font-black uppercase tracking-[0.16em]">
              <Lucide.Gem size={12} />
              Crafted Since 1998
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-serif text-white tracking-tight">
              Nandhini Brass & Metals
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
              Authentic handcrafted brass idols, pooja essentials, and timeless
              decor pieces designed to bring spiritual elegance into every home.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group w-10 h-10 rounded-xl border border-slate-700 bg-slate-900/70 flex items-center justify-center hover:border-amber-500/60 hover:bg-amber-500/10 transition-all"
                >
                  <social.Icon
                    size={17}
                    className="text-slate-400 group-hover:text-amber-300 transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-slate-300 hover:text-white text-sm flex items-center gap-2 transition-colors"
                  >
                    <Lucide.ChevronRight size={14} className="text-amber-400" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300 mb-4">
              Contact
            </h4>
            <div className="space-y-4 text-slate-300 text-sm">
              <div className="flex items-start gap-3">
                <Lucide.MapPin size={18} className="text-amber-400 mt-0.5 shrink-0" />
                <p>
                  Uppal Industrial Estate,
                  <br />
                  Hyderabad, Telangana 500039
                </p>
              </div>
              <a
                href="tel:+919848012345"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Lucide.Phone size={18} className="text-amber-400 shrink-0" />
                +91 98480 12345
              </a>
              <a
                href="mailto:heritage@nandhini.com"
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Lucide.Mail size={18} className="text-amber-400 shrink-0" />
                heritage@nandhini.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-14 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-[11px] sm:text-xs text-center sm:text-left">
            © {currentYear} Nandhini Brass & Metals. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Terms", "Privacy", "Shipping"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[11px] sm:text-xs text-slate-400 hover:text-amber-300 transition-colors"
              >
                {link}
              </a>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-9 h-9 rounded-lg border border-slate-700 bg-slate-900/80 flex items-center justify-center hover:border-amber-500/60 hover:bg-amber-500/10 transition-all"
              aria-label="Back to top"
            >
              <Lucide.ArrowUp size={16} className="text-amber-300" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
