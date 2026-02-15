import React, { useState } from "react";
import * as Lucide from "lucide-react";
import api from "./api"; // Ensure this points to your axios/api config

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6">
        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-1000">
          <div className="w-20 h-20 bg-[#C5A059]/10 text-[#C5A059] rounded-full flex items-center justify-center mx-auto border border-[#C5A059]/20">
            <Lucide.Check size={32} strokeWidth={1.5} />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-serif italic text-[#1A1A1A]">
              Pranams.
            </h2>
            <p className="text-zinc-500 text-lg max-w-sm mx-auto font-serif italic">
              Your inquiry has been archived. Our master artisans will reach out
              to you at{" "}
              <span className="text-[#C5A059] font-bold">{formData.phone}</span>
              .
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="px-12 py-4 bg-[#1A1A1A] text-white rounded-sm font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-[#C5A059] transition-all duration-500 shadow-xl"
          >
            New Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F8F6] min-h-screen py-24 px-6 lg:px-20 relative overflow-hidden selection:bg-[#C5A059]/30">
      {/* Decorative Accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#C5A059]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />

      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-12 gap-20 items-start relative z-10">
        {/* Left: Content Section */}
        <div className="lg:col-span-5 space-y-16 lg:sticky lg:top-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-[#C5A059]">
              <div className="h-[1px] w-12 bg-[#C5A059]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                Legacy Collection
              </span>
            </div>
            <h1 className="text-[10vw] lg:text-[7vw] font-serif italic leading-[0.85] tracking-tighter text-[#1A1A1A]">
              Customized <br />{" "}
              <span className="not-italic text-[#E5E1DA]">Order.</span>
            </h1>
            <p className="text-zinc-500 text-xl font-serif italic leading-relaxed max-w-sm">
              From divine iconography to architectural marvels, book your
              consultation with our master sculptors.
            </p>
          </div>

          <div className="space-y-8 pt-8 border-t border-[#E5E1DA]">
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-white shadow-sm border border-[#F0EDE8]">
                <Lucide.ShieldCheck className="text-[#C5A059]" size={20} />
              </div>
              <div>
                <h4 className="text-[#1A1A1A] font-bold text-xs uppercase tracking-widest">
                  Shilpa Shastra
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Absolute adherence to Agamic traditions and divine
                  proportions.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="p-3 bg-white shadow-sm border border-[#F0EDE8]">
                <Lucide.Crown className="text-[#C5A059]" size={20} />
              </div>
              <div>
                <h4 className="text-[#1A1A1A] font-bold text-xs uppercase tracking-widest">
                  Museum Quality
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Certified purity in Brass, Silver, and Panchaloha alloys.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 md:p-16 border border-[#E5E1DA] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.04)] rounded-sm">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Metal Selection */}
              <div className="space-y-6">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400">
                  Select Composition
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Brass", "Silver", "Panchaloha"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, metal: m })}
                      className={`py-4 border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 rounded-sm
                        ${
                          formData.metal === m
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                            : "bg-transparent text-zinc-400 border-[#E5E1DA] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 group-focus-within:text-[#C5A059] transition-colors">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 --- --- ----"
                    className="w-full bg-transparent border-b border-[#E5E1DA] py-4 text-[#1A1A1A] focus:border-[#C5A059] transition-all outline-none font-serif text-lg italic"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 group-focus-within:text-[#C5A059] transition-colors">
                    Temple Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City / State"
                    className="w-full bg-transparent border-b border-[#E5E1DA] py-4 text-[#1A1A1A] focus:border-[#C5A059] transition-all outline-none font-serif text-lg italic"
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 group-focus-within:text-[#C5A059] transition-colors">
                    Desired Height (ft)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3.5 ft"
                    className="w-full bg-transparent border-b border-[#E5E1DA] py-4 text-[#1A1A1A] focus:border-[#C5A059] transition-all outline-none font-serif text-lg italic"
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 group-focus-within:text-[#C5A059] transition-colors">
                    Estimated Weight (kg)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50 kg"
                    className="w-full bg-transparent border-b border-[#E5E1DA] py-4 text-[#1A1A1A] focus:border-[#C5A059] transition-all outline-none font-serif text-lg italic"
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-3 group md:col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 group-focus-within:text-[#C5A059] transition-colors">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full bg-transparent border-b border-[#E5E1DA] py-4 text-[#1A1A1A] focus:border-[#C5A059] transition-all outline-none font-sans text-sm uppercase tracking-tighter"
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 group">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 group-focus-within:text-[#C5A059] transition-colors">
                  Iconography Details
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe the deity posture, Mudras, or specific Vahana requirements..."
                  className="w-full bg-[#FDFDFD] border border-[#E5E1DA] rounded-sm p-6 text-[#1A1A1A] outline-none focus:border-[#C5A059] resize-none font-serif italic text-lg shadow-inner"
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden bg-[#1A1A1A] py-6 transition-all duration-700 hover:bg-[#C5A059] disabled:opacity-50 shadow-2xl"
              >
                <div className="relative z-10 flex items-center justify-center gap-4 text-white font-black uppercase text-[11px] tracking-[0.6em]">
                  {loading ? "Archiving Request..." : "Book Now"}
                  <Lucide.ArrowRight
                    size={16}
                    className="group-hover:translate-x-3 transition-transform duration-500"
                  />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderSuite;
