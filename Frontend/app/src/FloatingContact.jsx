import React, { useState } from "react";
import { MessageCircle, Phone, Mail, Plus, X } from "lucide-react";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: <MessageCircle size={24} />,
      color:
        "from-emerald-500 to-green-500 shadow-emerald-500/30 hover:shadow-emerald-500/45",
      href: "https://wa.me/1234567890",
      label: "WhatsApp",
    },
    {
      icon: <Phone size={24} />,
      color:
        "from-blue-500 to-indigo-500 shadow-blue-500/30 hover:shadow-blue-500/45",
      href: "tel:+1234567890",
      label: "Call",
    },
    {
      icon: <Mail size={24} />,
      color:
        "from-rose-500 to-pink-500 shadow-rose-500/30 hover:shadow-rose-500/45",
      href: "mailto:hello@example.com",
      label: "Email",
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        className={`relative z-20 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl text-white shadow-2xl transition-all duration-300 active:scale-95 border border-white/20 backdrop-blur-sm ${
          isOpen
            ? "bg-slate-900 rotate-45 shadow-slate-900/40"
            : "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 hover:brightness-110 shadow-indigo-500/35"
        }`}
      >
        {isOpen ? <X size={28} /> : <Plus size={28} />}

        {/* Glow and ping effect when closed */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-2xl bg-indigo-500/30 blur-lg scale-105" />
            <span className="absolute inset-0 rounded-2xl bg-indigo-500 animate-ping opacity-20" />
          </>
        )}
      </button>

      {/* Contact Menu */}
      <div
        className={`absolute bottom-[4.5rem] right-0 md:bottom-[5rem] flex flex-col gap-3 rounded-3xl border border-white/30 bg-white/80 backdrop-blur-xl p-3 shadow-2xl shadow-slate-900/10 transition-all duration-500 ${
          isOpen
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-6 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <p className="px-2 pb-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
          Contact Us
        </p>
        {contactOptions.map((option, index) => (
          <div
            key={option.label}
            className="flex items-center justify-end gap-2 group"
            style={{
              transitionDelay: isOpen ? `${index * 45}ms` : "0ms",
            }}
          >
            {/* Tooltip Label */}
            <span className="px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-lg opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-sm whitespace-nowrap">
              {option.label}
            </span>

            <a
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={option.label}
              className={`bg-gradient-to-br ${option.color} w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl text-white shadow-xl hover:scale-110 transition-all duration-200 active:scale-95`}
            >
              {option.icon}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloatingContact;
