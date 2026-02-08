import React, { useEffect, useState } from "react";
import api from "./api";
import * as Lucide from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE_URL = api.defaults.baseURL;

  // --- FIXED: HELPER TO RESOLVE IMAGE URL SAFELY ---
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150?text=No+Image";

    let finalPath = path;

    // 1. Handle if path is a JSON string (e.g. '["url.jpg"]')
    if (
      typeof path === "string" &&
      (path.startsWith("[") || path.startsWith("{"))
    ) {
      try {
        const parsed = JSON.parse(path);
        finalPath = Array.isArray(parsed) ? parsed[0] : parsed;
      } catch (e) {
        finalPath = path;
      }
    }
    // 2. Handle if path is already an Array
    else if (Array.isArray(path)) {
      finalPath = path[0];
    }

    // 3. Final safety check: ensure we are working with a string now
    if (typeof finalPath !== "string") {
      return "https://via.placeholder.com/150?text=No+Image";
    }

    // 4. Check for absolute vs relative URL
    if (finalPath.startsWith("http")) return finalPath;
    return `${API_BASE_URL}${finalPath}`;
  };

  // Safe JSON Parsing Helper
  const getParsedItems = (itemsData) => {
    try {
      if (!itemsData) return [];
      if (typeof itemsData === "string") return JSON.parse(itemsData);
      return itemsData;
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
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.patch(`/api/orders/${orderId}/cancel`);
      alert("Order Cancelled successfully.");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || "Error cancelling order");
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
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            .invoice-card { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company-brand { font-weight: 900; font-size: 24px; margin: 0; color: #b45309; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 15px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 12px; background: #f1f5f9; font-size: 11px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
            .grand-total { background: #1e293b; color: white; padding: 15px; border-radius: 10px; margin-top: 20px; text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div>
                <h2 class="company-brand">NANDINI BRASS & METALS</h2>
                <p style="font-size: 11px;">GSTIN: 36ANUPY8270B1ZB<br>Hyderabad, Telangana</p>
              </div>
              <div style="text-align: right;">
                <h1 style="margin:0; color:#cbd5e1;">INVOICE</h1>
                <p style="font-size: 12px;">#ORD-${order.id}</p>
              </div>
            </div>
            <div class="info-grid">
              <div><strong>Bill To:</strong><br>${order.username}<br>${order.address}</div>
              <div style="text-align: right;"><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            <table>
              <thead>
                <tr><th>Item</th><th>Qty</th><th>Price</th><th style="text-align:right">Total</th></tr>
              </thead>
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
            <div class="grand-total">Amount Payable: ₹${parseFloat(order.total_amount).toLocaleString()}</div>
          </div>
          <script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
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
      <div className="p-10 text-center animate-pulse">
        Loading your orders...
      </div>
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
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span
                      className={`flex-1 md:flex-none text-center px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
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
                      title="Download Invoice"
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
                        <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-white shadow-sm">
                          <img
                            src={getImageUrl(item.image)}
                            className="w-full h-full object-cover"
                            alt={item.name}
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150?text=Brass";
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
