import React from "react";

const AboutSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="order-2 lg:order-1">
        <div className="inline-block p-3 bg-blue-50 rounded-2xl mb-6">
          <Lucide.Zap className="text-blue-600" size={32} />
        </div>
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
          Beyond <br />
          <span className="text-blue-600 italic">Ordinary.</span>
        </h2>
        <p className="text-slate-500 text-lg md:text-xl font-bold leading-relaxed max-w-md mb-10">
          We don’t just sell products; we curate a lifestyle. Every piece is a
          statement of intent, crafted for those who refuse to blend in.
        </p>
        <div className="grid grid-cols-2 gap-10 border-t border-slate-100 pt-10">
          <div>
            <p className="text-4xl font-black tracking-tighter text-slate-900">
              10K+
            </p>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">
              Active Members
            </p>
          </div>
          <div>
            <p className="text-4xl font-black tracking-tighter text-slate-900">
              100%
            </p>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">
              Quality Ethics
            </p>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2 grid grid-cols-2 gap-6">
        <div className="pt-12">
          <div className="rounded-[3rem] overflow-hidden h-[300px] md:h-[450px] shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
              className="w-full h-full object-cover"
              alt="Fashion"
            />
          </div>
        </div>
        <div className="pb-12">
          <div className="rounded-[3rem] overflow-hidden h-[300px] md:h-[450px] shadow-2xl rotate-[2deg] hover:rotate-0 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e"
              className="w-full h-full object-cover"
              alt="Style"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
