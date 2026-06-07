import React, { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/custom-consultations", formData);
      setSubmitted(true);
    } catch (err) {
      alert("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-b from-[#F9F8F6] to-white py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-7 bg-white border border-amber-100 shadow-xl rounded-3xl p-8 sm:p-12 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <Lucide.Check size={32} strokeWidth={1.5} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif italic text-slate-900">
              Pranams.
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Your inquiry has been archived. Our master artisans will reach out
              to you at{" "}
              <span className="text-amber-700 font-bold">{formData.phone}</span>
              .
            </p>
          </div>
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
            className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.18em] hover:bg-amber-600 transition-all duration-300 shadow-lg"
          >
            New Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#F9F8F6] via-[#fdfcf9] to-white py-14 sm:py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden selection:bg-amber-200/40">
      <Seo
        title="Custom Brass & Silver Idol Orders"
        description="Order bespoke brass idols, silver god statues, temple gajastambham cladding & custom metalwork. Master artisans at Nandhini Brass & Metals, Hyderabad."
        keywords="custom brass idols, custom silver idols, temple gajastambham order, bespoke metal idols india"
        path="/custom-order"
      />
      {/* Decorative Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[440px] h-[440px] bg-amber-300/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[360px] h-[360px] bg-indigo-200/20 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-start relative z-10">
        {/* Left: Content Section */}
        <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-amber-700">
              <Lucide.Sparkles size={12} />
              <span className="text-[10px] font-black uppercase tracking-[0.24em]">
                Legacy Collection
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif italic leading-[0.9] tracking-tight text-slate-900">
              Custom
              <span className="block not-italic text-amber-700">Order</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-md">
              From divine iconography to architectural masterpieces, share your
              requirements and our artisans will guide you step by step.
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-amber-100">
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-white shadow-sm border border-amber-100">
                <Lucide.ShieldCheck className="text-amber-700" size={18} />
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest">
                  Shilpa Shastra
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Absolute adherence to Agamic traditions and divine
                  proportions.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-xl bg-white shadow-sm border border-amber-100">
                <Lucide.Crown className="text-amber-700" size={18} />
              </div>
              <div>
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest">
                  Museum Quality
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Certified purity in Brass, Silver, and Panchaloha alloys.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="lg:col-span-7">
          <div className="bg-white p-5 sm:p-8 md:p-10 border border-amber-100 shadow-xl rounded-3xl">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Book Consultation
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Fill the form and get a callback in 24 hours.
                </p>
              </div>
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-amber-50 text-amber-700 items-center justify-center border border-amber-200">
                <Lucide.ScrollText size={18} />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Metal Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Select Composition
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Brass", "Silver", "Panchaloha"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, metal: m })}
                      className={`py-3 sm:py-3.5 border text-[11px] font-bold uppercase tracking-wide transition-all duration-300 rounded-xl
                        ${
                          formData.metal === m
                            ? "bg-slate-900 text-white border-slate-900 shadow-md"
                            : "bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-slate-900"
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-3 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 group-focus-within:text-amber-700 transition-colors">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 --- --- ----"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 transition-all outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    value={formData.phone}
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 group-focus-within:text-amber-700 transition-colors">
                    Temple Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City / State"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 transition-all outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    value={formData.state}
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 group-focus-within:text-amber-700 transition-colors">
                    Desired Height (ft)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3.5 ft"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 transition-all outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    value={formData.height}
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 group-focus-within:text-amber-700 transition-colors">
                    Estimated Weight (kg)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50 kg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 transition-all outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    value={formData.weight}
                  />
                </div>

                <div className="space-y-3 group md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 group-focus-within:text-amber-700 transition-colors">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 transition-all outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDate: e.target.value })
                    }
                    value={formData.expectedDate}
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 group-focus-within:text-amber-700 transition-colors">
                  Iconography Details
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe the deity posture, Mudras, or specific Vahana requirements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/60 resize-none"
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                  value={formData.details}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 py-4 rounded-xl transition-all duration-300 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 shadow-xl"
              >
                <div className="relative z-10 flex items-center justify-center gap-3 text-white font-black uppercase text-xs tracking-[0.18em]">
                  {loading ? "Archiving Request..." : "Book Now"}
                  <Lucide.ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderSuite;
