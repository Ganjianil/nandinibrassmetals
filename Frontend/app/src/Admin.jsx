import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import * as Lucide from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-6 fixed h-full">
        <h2 className="text-2xl font-bold mb-10 text-blue-400">ADMIN PANEL</h2>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 p-3 rounded ${
              activeTab === "orders" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            <Lucide.Package size={18} /> Orders
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`w-full flex items-center gap-3 p-3 rounded ${
              activeTab === "inventory" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            <Lucide.Box size={18} /> Inventory
          </button>

          <button
            onClick={() => setActiveTab("promo")}
            className={`w-full flex items-center gap-3 p-3 rounded ${
              activeTab === "promo" ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            <Lucide.Ticket size={18} /> Promo Codes
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="ml-64 p-10 w-full">
        <AdminDashboard activeTab={activeTab} />
      </main>
    </div>
  );
};

export default Admin;
