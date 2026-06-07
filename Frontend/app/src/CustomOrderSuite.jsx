import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as Lucide from "lucide-react";
import api from "./api";
import Seo from "./seo/Seo";

const CustomOrderSuite = () => {
  const [formData, setFormData] = useState({
    metal: "Brass",
    phone: "",
    height: "",
    weight: "",
    state: "",
    expectedDate: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/custom-consultations", formData);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      alert("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100dvh-7rem)] bg-[#faf7f2] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md text-center space-y-6 bg-white border border-[#e8dcc8] shadow-lg rounded-2xl p-8">
          <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <Lucide.Check size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif italic text-slate-900">
            Pranams.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your inquiry has been received. Our artisans will call you at{" "}
            <span className="text-amber-700 font-semibold">{formData.phone}</span>
            .
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold uppercase text-xs tracking-wider"
            >
              Back to Shop
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  metal: "Brass",
                  phone: "",
                  height: "",
                  weight: "",
                  state: "",
                  expectedDate: "",
                  details: "",
                });
              }}
              className="px-6 py-3 border border-amber-300 text-amber-800 rounded-xl font-semibold uppercase text-xs tracking-wider"
            >
              New Inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-7rem)] bg-[#faf7f2] pb-8 md:pb-16">
      <Seo
        title="Custom Brass & Silver Idol Orders"
        description="Order bespoke brass idols, silver god statues, temple gajastambham cladding & custom metalwork."
        keywords="custom brass idols, custom silver idols, temple gajastambham order"
        path="/custom-order"
      />

      {/* Mobile page header */}
      <div className="sticky top-[86px] md:top-[98px] z-30 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#e8dcc8] px-4 py-3 md:hidden">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Link
            to="/"
            className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#7a6548]"
          >
            <Lucide.ArrowLeft size={16} />
            Back
          </Link>
          <span className="text-sm font-serif font-semibold text-[#3d3028]">
            Custom Order
          </span>
          <span className="w-12" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-10">
        {/* Desktop intro — hidden clutter on mobile */}
        <div className="hidden md:block mb-10 text-center max-w-2xl mx-auto">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b89130] mb-3">
            Bespoke Craftsmanship
          </p>
          <h1 className="text-4xl lg:text-5xl font-serif text-[#3d3028] leading-tight">
            Custom Brass & Silver Orders
          </h1>
          <p className="mt-3 text-slate-600 text-base">
            Share your requirements — our master artisans will guide you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">
          {/* Form first on mobile */}
          <div className="lg:col-span-3 order-1">
            <div className="bg-white border border-[#e8dcc8] shadow-md rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="mb-5 md:mb-6">
                <h2 className="text-xl md:text-2xl font-serif font-semibold text-[#3d3028] md:hidden">
                  Book Your Consultation
                </h2>
                <h2 className="hidden md:block text-2xl font-serif font-semibold text-[#3d3028]">
                  Consultation Form
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  Fill in the details below. We respond within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8b7355]">
                    Metal Type
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["Brass", "Silver", "Panchaloha"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormData({ ...formData, metal: m })}
                        className={`py-2.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide rounded-lg border transition-all ${
                          formData.metal === m
                            ? "bg-[#3d3028] text-white border-[#3d3028]"
                            : "bg-[#faf7f2] text-[#6b5a45] border-[#e0d4c0] hover:border-[#b89130]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b7355]">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="mt-1.5 w-full bg-[#faf7f2] border border-[#e0d4c0] rounded-lg px-3 py-2.5 text-sm text-[#3d3028] focus:border-[#b89130] focus:ring-1 focus:ring-[#b89130]/30 outline-none"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b7355]">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="City, State"
                      className="mt-1.5 w-full bg-[#faf7f2] border border-[#e0d4c0] rounded-lg px-3 py-2.5 text-sm text-[#3d3028] focus:border-[#b89130] focus:ring-1 focus:ring-[#b89130]/30 outline-none"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b7355]">
                      Height (ft)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3.5"
                      className="mt-1.5 w-full bg-[#faf7f2] border border-[#e0d4c0] rounded-lg px-3 py-2.5 text-sm text-[#3d3028] focus:border-[#b89130] focus:ring-1 focus:ring-[#b89130]/30 outline-none"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b7355]">
                      Weight (kg)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50"
                      className="mt-1.5 w-full bg-[#faf7f2] border border-[#e0d4c0] rounded-lg px-3 py-2.5 text-sm text-[#3d3028] focus:border-[#b89130] focus:ring-1 focus:ring-[#b89130]/30 outline-none"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b7355]">
                    Expected Delivery *
                  </label>
                  <input
                    type="date"
                    required
                    className="mt-1.5 w-full bg-[#faf7f2] border border-[#e0d4c0] rounded-lg px-3 py-2.5 text-sm text-[#3d3028] focus:border-[#b89130] focus:ring-1 focus:ring-[#b89130]/30 outline-none"
                    value={formData.expectedDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDate: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8b7355]">
                    Design Details
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Deity, posture, size, temple requirements..."
                    className="mt-1.5 w-full bg-[#faf7f2] border border-[#e0d4c0] rounded-lg p-3 text-sm text-[#3d3028] focus:border-[#b89130] focus:ring-1 focus:ring-[#b89130]/30 outline-none resize-none"
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#3d3028] text-white font-semibold uppercase text-xs tracking-[0.15em] hover:bg-[#b89130] transition-colors disabled:opacity-50 shadow-md"
                >
                  {loading ? "Submitting..." : "Submit Custom Order"}
                </button>
              </form>
            </div>
          </div>

          {/* Info sidebar — below form on mobile */}
          <div className="lg:col-span-2 order-2 space-y-4">
            <div className="bg-white/80 border border-[#e8dcc8] rounded-2xl p-4 md:p-6">
              <h3 className="text-sm font-serif font-semibold text-[#3d3028] mb-3">
                Why Choose Us
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    icon: Lucide.ShieldCheck,
                    title: "Shilpa Shastra",
                    desc: "Traditional Agamic proportions",
                  },
                  {
                    icon: Lucide.Crown,
                    title: "Museum Quality",
                    desc: "Certified brass, silver & panchaloha",
                  },
                  {
                    icon: Lucide.Hammer,
                    title: "Master Artisans",
                    desc: "Handcrafted in Hyderabad since 1998",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <item.icon
                      size={16}
                      className="text-[#b89130] shrink-0 mt-0.5"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#3d3028]">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block bg-gradient-to-br from-[#3d3028] to-[#5c4a3a] rounded-2xl p-6 text-white">
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300/80 mb-2">
                Need help?
              </p>
              <p className="text-sm font-serif leading-relaxed text-stone-200">
                Call us for temple gajastambham, custom idols & bulk orders.
              </p>
              <a
                href="tel:+919848012345"
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-amber-300 hover:text-amber-200"
              >
                <Lucide.Phone size={14} />
                +91 98480 12345
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderSuite;
