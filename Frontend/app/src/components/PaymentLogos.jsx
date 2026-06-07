import React from "react";

const LogoWrap = ({ children, className = "" }) => (
  <div
    className={`flex items-center justify-center overflow-hidden ${className}`}
    aria-hidden
  >
    {children}
  </div>
);

export const GooglePayLogo = ({ className = "w-10 h-10" }) => (
  <LogoWrap className={className}>
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <path
        fill="#4285F4"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.9-6.9C35.9 2.7 30.3 0 24 0 14.6 0 6.4 5.4 2.5 13.3l8.1 6.3C12.9 13.8 18 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.5 24.5c0-1.64-.15-3.22-.42-4.74H24v9h12.7c-.55 2.96-2.2 5.47-4.7 7.15l7.4 5.74C43.9 37.8 46.5 31.6 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.6 28.7c-.48-1.45-.76-2.99-.76-4.7s.28-3.25.76-4.7l-8.1-6.3C1.4 17.1 0 20.4 0 24s1.4 6.9 3.5 10.9l8.1-6.2z"
      />
      <path
        fill="#EA4335"
        d="M24 48c6.3 0 11.6-2.1 15.5-5.7l-7.4-5.74c-2.05 1.38-4.68 2.2-8.1 2.2-6 0-11.1-4.05-12.9-9.5l-8.1 6.3C6.4 42.6 14.6 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  </LogoWrap>
);

export const PhonePeLogo = ({ className = "w-10 h-10" }) => (
  <LogoWrap className={className}>
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect width="48" height="48" rx="12" fill="#5F259F" />
      <path
        fill="#fff"
        d="M14 16h6.2c4.8 0 7.8 2.5 7.8 6.6 0 2.4-1.2 4.4-3.2 5.5l4.5 7.9H24l-3.8-6.8H20v6.8h-6V16zm6 9.8c1.8 0 2.8-.9 2.8-2.4 0-1.5-1-2.3-2.8-2.3H20v4.7h6z"
      />
      <path fill="#5AD1E6" d="M31.5 16H38v16h-6.5V16z" />
    </svg>
  </LogoWrap>
);

export const PaytmLogo = ({ className = "w-10 h-10" }) => (
  <LogoWrap className={className}>
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect width="48" height="48" rx="12" fill="#00BAF2" />
      <path
        fill="#fff"
        d="M11 15h8.5c5.2 0 8.5 2.8 8.5 7.2 0 2.4-1.1 4.4-3 5.6l4.2 7.2H21l-3.5-6.1h-2.5v6.1H11V15zm7.8 10.5c2 0 3.1-1 3.1-2.6 0-1.6-1.1-2.5-3.1-2.5h-2.3v5.1h2.3z"
      />
      <path fill="#002E6E" d="M30 15h7v2.8h-4.5v3.2H36v2.8h-3.5v6.2H30V15z" />
    </svg>
  </LogoWrap>
);

export const UpiLogo = ({ className = "w-10 h-10" }) => (
  <LogoWrap className={className}>
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect width="48" height="48" rx="12" fill="#fff" stroke="#E2E8F0" />
      <path fill="#097939" d="M10 30V18h3.5l4.2 7.5L22 18h3.4v12h-2.8v-7.1l-3.8 7.1h-1.9l-3.8-7.1V30H10z" />
      <path fill="#F47920" d="M26.5 18H34c2.8 0 4.5 1.4 4.5 3.7 0 2.5-1.9 3.8-4.8 3.8h-2.8v4.5h-4.4V18zm4.4 5.5h1.8c.9 0 1.4-.4 1.4-1.1 0-.7-.5-1.1-1.4-1.1h-1.8v2.2z" />
      <path fill="#097939" d="M10 34h28v2H10z" opacity="0.25" />
    </svg>
  </LogoWrap>
);

export const VisaLogo = ({ className = "w-10 h-10" }) => (
  <LogoWrap className={className}>
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#1A1F71" />
      <path
        fill="#fff"
        d="M19.8 31h-3.5l2.2-13.5h3.5L19.8 31zm12.1-13.1c-.7-.3-1.8-.6-3.2-.6-3.5 0-6 1.8-6 4.5 0 2 1.8 3.1 3.2 3.8 1.4.7 1.9 1.1 1.9 1.8 0 1-1.1 1.4-2.2 1.4-1.5 0-2.3-.2-3.5-.7l-.5 2.3c1.1.5 2.5.8 4.1.8 3.7 0 6.1-1.8 6.1-4.6 0-1.5-.9-2.7-2.9-3.6-1.2-.6-1.9-1-1.9-1.6 0-.5.6-1.1 1.9-1.1 1.1 0 1.9.2 2.5.5l.5-2.4zm7.5 8.6h3.2l2.7-13.5H42l-2.6 13.5zM15.2 17.5l-3.3 9-.4-2c-.7-2.4-2.9-5-5.4-6.3l3 11.3h3.7l5.5-13.5h-3.1z"
      />
    </svg>
  </LogoWrap>
);

export const MastercardLogo = ({ className = "w-10 h-10" }) => (
  <LogoWrap className={className}>
    <svg viewBox="0 0 48 48" className="w-full h-full">
      <rect width="48" height="48" rx="10" fill="#fff" stroke="#E2E8F0" />
      <circle cx="19" cy="24" r="10" fill="#EB001B" />
      <circle cx="29" cy="24" r="10" fill="#F79E1B" />
      <path
        fill="#FF5F00"
        d="M24 17.2a10 10 0 0 0 0 13.6 10 10 0 0 0 0-13.6z"
      />
    </svg>
  </LogoWrap>
);

export const RazorpayLogo = ({ className = "h-4" }) => (
  <LogoWrap className={className}>
    <svg viewBox="0 0 120 24" className="h-full w-auto">
      <path
        fill="#072654"
        d="M8.2 4.5h4.8l7.2 15H15l-1.4-3.2H8.8L7.4 19.5H3.2l5-15zm1.2 8.8h3.4L10.3 8.4l-.9 4.9zM28.5 4.5h4.1v15h-4.1V4.5zm12.2 0c4.5 0 7.4 2.8 7.4 7.5s-2.9 7.5-7.4 7.5h-6.5V4.5h6.5zm-2.4 11.8h2c2.2 0 3.4-1.2 3.4-4.3 0-3.1-1.2-4.3-3.4-4.3h-2v8.6zM54 4.5h7.8c3.5 0 5.8 1.8 5.8 5.2 0 2.2-1.1 3.8-2.9 4.6l3.4 5.2H63l-3.1-4.8h-2.5v4.8H54V4.5zm2.4 7.8h2.9c1.4 0 2.2-.7 2.2-2 0-1.3-.8-2-2.2-2h-2.9v4zM72.5 4.5h9.8v2.6h-5.4v2.8h4.8v2.5h-4.8v4.5h-4.4V4.5zM86.8 4.5h4.4l5.2 8.5V4.5h4.1v15h-4.2l-5.3-8.6v8.6h-4.2V4.5zM108.5 4.5h4.1l6.2 15h-4.4l-1.1-2.8h-5.5l-1.1 2.8h-4.3l6.3-15zm.8 9.2l-1.7-4.5-1.7 4.5h3.4z"
      />
    </svg>
  </LogoWrap>
);

export const PAYMENT_BRANDS = [
  {
    id: "gpay",
    name: "Google Pay",
    Logo: GooglePayLogo,
    bg: "from-blue-50 to-indigo-50",
    ring: "ring-blue-100",
    accent: "text-blue-700",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    Logo: PhonePeLogo,
    bg: "from-violet-50 to-purple-50",
    ring: "ring-violet-100",
    accent: "text-violet-700",
  },
  {
    id: "paytm",
    name: "Paytm",
    Logo: PaytmLogo,
    bg: "from-sky-50 to-cyan-50",
    ring: "ring-sky-100",
    accent: "text-sky-700",
  },
  {
    id: "upi",
    name: "UPI",
    Logo: UpiLogo,
    bg: "from-emerald-50 to-green-50",
    ring: "ring-emerald-100",
    accent: "text-emerald-700",
  },
  {
    id: "visa",
    name: "Credit Card",
    Logo: VisaLogo,
    bg: "from-slate-50 to-blue-50",
    ring: "ring-slate-200",
    accent: "text-slate-700",
  },
  {
    id: "mastercard",
    name: "Debit Card",
    Logo: MastercardLogo,
    bg: "from-orange-50 to-amber-50",
    ring: "ring-orange-100",
    accent: "text-orange-800",
  },
];

export const PaymentLogoStrip = ({ size = "sm", className = "" }) => {
  const logoSize = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {PAYMENT_BRANDS.map(({ id, Logo }) => (
        <div
          key={id}
          className="w-9 h-9 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1"
        >
          <Logo className={logoSize} />
        </div>
      ))}
    </div>
  );
};
