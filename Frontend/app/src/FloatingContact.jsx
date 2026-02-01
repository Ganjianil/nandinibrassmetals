import React, { useState } from "react";
import { MessageCircle, Phone, Mail, Plus, X } from "lucide-react";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: <MessageCircle size={24} />,
      color: "bg-[#25D366]",
      href: "https://wa.me/1234567890",
      label: "WhatsApp",
    },
    {
      icon: <Phone size={24} />,
      color: "bg-blue-500",
      href: "tel:+1234567890",
      label: "Call",
    },
    {
      icon: <Mail size={24} />,
      color: "bg-rose-500",
      href: "mailto:hello@example.com",
      label: "Email",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse items-center gap-4 z-50">
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-10 w-14 h-14 flex items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 active:scale-95 ${
          isOpen ? "bg-gray-800 rotate-45" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isOpen ? <X size={28} /> : <Plus size={28} />}

        {/* Subtle Ping Animation when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></span>
        )}
      </button>

      {/* Contact Menu */}
      <div
        className={`flex flex-col gap-3 transition-all duration-500 transform ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        {contactOptions.map((option, index) => (
          <div key={index} className="flex items-center group">
            {/* Tooltip Label */}
            <span className="mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
              {option.label}
            </span>

            <a
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${option.color} w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg hover:scale-110 transition-transform duration-200 active:scale-90`}
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
