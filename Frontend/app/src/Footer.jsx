import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-24 pb-12 rounded-t-[4rem]">
      <div className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 border-b border-slate-800 pb-20">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-black italic tracking-tighter text-blue-500 mb-8">
              ADMIN STORE.
            </h2>
            <p className="text-slate-400 font-bold text-lg max-w-sm mb-8">
              Redefining modern retail with a focus on quality, speed, and
              aesthetics.
            </p>
            <div className="flex gap-4">
              {["Instagram", "Twitter", "Facebook"].map((social) => (
                <div
                  key={social}
                  className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all cursor-pointer hover:-translate-y-1"
                >
                  <Lucide.Share2 size={20} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.3em] mb-8 text-blue-500">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-slate-300">
              <li className="hover:text-blue-400 cursor-pointer transition">
                Shop All
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                New Arrivals
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Our Story
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.3em] mb-8 text-blue-500">
              Support
            </h4>
            <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-slate-300">
              <li className="hover:text-blue-400 cursor-pointer transition">
                Shipping
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Returns
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                Size Guide
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition">
                FAQ
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">
            © 2026 Admin Store. Crafted for Excellence.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase text-slate-500 tracking-widest">
            <span className="hover:text-white cursor-pointer transition">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer transition">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
