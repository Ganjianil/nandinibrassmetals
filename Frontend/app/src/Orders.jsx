import React, { useEffect, useState } from "react";
import api from "./api";
import * as Lucide from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE_URL = api.defaults.baseURL || "http://localhost:5000";

  // --- BULLETPROOF IMAGE RESOLVER ---
const getImageUrl = (path) => {
  if (!path || path === "undefined" || path === "null") {
    return "https://placehold.co/150x150?text=No+Image";
  }

  let finalPath = path;

  // 1. Handle deep nesting (The [[url]] issue from your logs)
  try {
    // If it's a stringified array, parse it
    if (typeof path === "string" && path.startsWith("[")) {
      finalPath = JSON.parse(path);
    }

    // If it's an array, keep grabbing the first element until it's a string
    while (Array.isArray(finalPath) && finalPath.length > 0) {
      finalPath = finalPath[0];
    }
  } catch (e) {
    console.error("Image parsing error:", e);
  }

  // 2. SAFETY CHECK: If it's still not a string, return placeholder
  if (typeof finalPath !== "string") {
    return "https://placehold.co/150x150?text=Error";
  }

  // 3. CRITICAL FIX: If it is a Cloudinary/External URL, return it AS IS
  if (finalPath.startsWith("http")) {
    return finalPath;
  }

  // 4. Only append Localhost if it's a local file path (like /uploads/...)
  const base = (api.defaults.baseURL || "http://localhost:5000").replace(
    /\/$/,
    "",
  );
  const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;

  return `${base}${cleanPath}`;
};
  // Safe JSON Parsing Helper
  const getParsedItems = (itemsData) => {
    try {
      if (!itemsData) return [];
      // Handle double stringification
      let parsed =
        typeof itemsData === "string" ? JSON.parse(itemsData) : itemsData;
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Parsing Error:", e);
      return [];
    }
  };

  const canCancel = (orderDate) => {
    const created = new Date(orderDate);
    const now = new Date();
    const diffInHours = (now - created) / (1000 * 60 * 60);
    return diffInHours <= 6;
  };

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/orders/${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;
    try {
      await api.patch(`/api/orders/${orderId}/cancel`);
      alert("Order Cancelled.");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  const handleDownloadInvoice = (order) => {
    const items = getParsedItems(order.items || order.cartItems);
    const invoiceWindow = window.open("", "_blank");
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice_#${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; }
            .invoice-card { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 15px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 12px; background: #f1f5f9; font-size: 11px; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
            .grand-total { background: #1e293b; color: white; padding: 15px; border-radius: 10px; margin-top: 20px; text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div><h2 style="color:#b45309">NANDINI BRASS & METALS</h2><p style="font-size:11px">GSTIN: 36ANUPY8270B1ZB</p></div>
              <div style="text-align:right"><h1>INVOICE</h1><p>#ORD-${order.id}</p></div>
            </div>
            <div class="info-grid">
              <div><strong>Bill To:</strong><br>${order.username}<br>${order.address}</div>
              <div style="text-align:right"><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            <table>
              <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th style="text-align:right">Total</th></tr></thead>
              <tbody>
                ${items
                  .map(
                    (i) => `
                  <tr>
                    <td>${i.name}</td>
                    <td>${i.quantity || 1}</td>
                    <td>₹${parseFloat(i.price).toLocaleString()}</td>
                    <td style="text-align:right">₹${((i.quantity || 1) * i.price).toLocaleString()}</td>
                  </tr>`,
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="grand-total">Amount Paid: ₹${parseFloat(order.total_amount).toLocaleString()}</div>
          </div>
          <script>window.onload = () => setTimeout(() => window.print(), 500);</script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  if (!user)
    return (
      <div className="p-10 text-center font-bold">
        Please login to view orders.
      </div>
    );
  if (loading)
    return (
      <div className="p-10 text-center animate-pulse">Loading orders...</div>
    );

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-screen">
      <h2 className="text-5xl font-black mb-12 text-slate-900 tracking-tighter uppercase">
        My Orders<span className="text-amber-600">.</span>
      </h2>

      {orders.length === 0 ? (
        <div className="text-center p-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Lucide.PackageX size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => {
            const items = getParsedItems(order.items || order.cartItems);

            return (
              <div
                key={order.id}
                className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <span className="text-[10px] bg-amber-100 px-3 py-1 rounded-full text-amber-700 font-black uppercase tracking-widest">
                      #{order.id}
                    </span>
                    <p className="text-xs text-slate-400 mt-2 font-bold flex items-center gap-1">
                      <Lucide.Calendar size={12} />{" "}
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                        order.status === "Cancelled"
                          ? "bg-red-50 text-red-600"
                          : order.status === "Delivered"
                            ? "bg-green-50 text-green-600"
                            : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {order.status}
                    </span>
                    <button
                      onClick={() => handleDownloadInvoice(order)}
                      className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-amber-600 transition-colors shadow-lg"
                    >
                      <Lucide.Download size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-7 space-y-4">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-5 p-4 bg-slate-50 rounded-[2rem] border border-slate-100"
                      >
                        <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-white shadow-sm bg-white">
                          <img
                            // ATTEMPT TO FIND IMAGE PROPERTY BY MULTIPLE NAMES
                            src={getImageUrl(
                              item.image ||
                                item.product_image ||
                                item.img ||
                                item.url,
                            )}
                            className="w-full h-full object-cover"
                            alt={item.name}
                            onError={(e) => {
                              // If even the resolved URL fails, use an inline SVG as last resort
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/150x150?text=Brass";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-800 uppercase leading-none">
                            {item.name}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-[10px] text-slate-500 font-bold uppercase">
                              Qty: {item.quantity || 1}
                            </p>
                            <p className="text-sm font-black text-slate-900">
                              ₹{item.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                          Final Amount
                        </p>
                        <h3 className="text-4xl font-black text-amber-500 tracking-tighter">
                          ₹{parseFloat(order.total_amount).toLocaleString()}
                        </h3>
                        <div className="mt-6 pt-6 border-t border-slate-800">
                          <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                            <Lucide.MapPin
                              size={12}
                              className="text-amber-600"
                            />{" "}
                            Delivery Address
                          </p>
                          <p className="text-[11px] text-slate-300 mt-2 leading-relaxed italic">
                            {order.address}
                          </p>
                        </div>
                      </div>
                      <Lucide.Package
                        className="absolute -bottom-4 -right-4 text-white/5"
                        size={120}
                      />
                    </div>

                    {order.status === "Pending" &&
                      canCancel(order.created_at) && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="mt-4 w-full py-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-red-100"
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
