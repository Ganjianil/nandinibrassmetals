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
      // REDIRECTING TO BACKEND
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
      <div className="min-h-screen bg-[#0c1322] flex items-center justify-center px-6">
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
            <Lucide.CheckCircle size={48} strokeWidth={1} />
          </div>
          <h2 className="text-4xl md:text-6xl font-serif italic text-white">
            Pranams.
          </h2>
          <p className="text-amber-200/60 text-lg max-w-md mx-auto font-light">
            Your sacred request has been sent to our master artisans. We will
            reach out to you at{" "}
            <span className="text-amber-400 font-bold">{formData.phone}</span>{" "}
            shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-10 py-4 bg-white text-[#0c1322] rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 transition-colors"
          >
            New Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0c1322] min-h-screen py-16 px-6 lg:px-20 relative overflow-hidden selection:bg-amber-500/30">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
        {/* Visual Hero Section */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="h-[1px] w-12 bg-amber-500"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                Legacy Craft
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif italic text-white leading-[0.9] tracking-tighter">
              Bespoke <br /> <span className="text-amber-500">Divine</span>{" "}
              Works
            </h1>
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-sm">
              Customizing sacred idols, Dhwajastambhams, and temple architecture
              since generations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
              <Lucide.ShieldCheck className="text-amber-500 mb-4" size={28} />
              <h4 className="text-white font-bold text-sm">Shilpa Shastra</h4>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                Agamic Compliance
              </p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
              <Lucide.Crown className="text-amber-500 mb-4" size={28} />
              <h4 className="text-white font-bold text-sm">Pure Metals</h4>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
                Certified Quality
              </p>
            </div>
          </div>
        </div>

        {/* The Form Card */}
        <div className="lg:col-span-7">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-900 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

            <form
              onSubmit={handleSubmit}
              className="relative bg-[#161d2b] border border-white/10 p-8 md:p-14 rounded-[3rem] shadow-2xl space-y-10"
            >
              <div className="grid md:grid-cols-2 gap-10">
                {/* Metal Selection */}
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/60">
                    Primary Metal
                  </label>
                  <div className="flex bg-[#0c1322] p-1.5 rounded-2xl border border-white/5">
                    {["Brass", "Silver", "Panchaloha"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormData({ ...formData, metal: m })}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all
                          ${formData.metal === m ? "bg-amber-600 text-white shadow-lg" : "text-slate-500 hover:text-white"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/60">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91"
                    className="w-full bg-[#0c1322] border border-white/5 rounded-2xl p-4 text-white focus:border-amber-500 transition-all outline-none"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/60">
                    Dimensions & Weight
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Height (ft)"
                      className="w-1/2 bg-[#0c1322] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-amber-500"
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Weight (kg)"
                      className="w-1/2 bg-[#0c1322] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-amber-500"
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/60">
                    Temple State / City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Location"
                    className="w-full bg-[#0c1322] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-amber-500"
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-1 gap-10">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/60">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full bg-[#0c1322] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-amber-500 invert brightness-200"
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500/60">
                  Specific Iconography Details
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe the deity posture (Asana), Mudra, or Vahana details..."
                  className="w-full bg-[#0c1322] border border-white/5 rounded-3xl p-6 text-white outline-none focus:border-amber-500 resize-none"
                  onChange={(e) =>
                    setFormData({ ...formData, details: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-full bg-amber-600 py-6 transition-all hover:bg-amber-500 active:scale-95 disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center justify-center gap-3 text-white font-black uppercase text-[10px] tracking-[0.5em]">
                  {loading ? "Transmitting..." : "Initiate Consultation"}
                  <Lucide.ChevronRight
                    size={16}
                    className="group-hover:translate-x-2 transition-transform"
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
