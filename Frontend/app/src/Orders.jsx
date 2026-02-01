import React, { useEffect, useState } from "react";
import api from "./api";
import * as Lucide from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE_URL = "https://nandinibrassmetals-1.onrender.com";

  // Safe JSON Parsing Helper
  const getParsedItems = (itemsData) => {
    try {
      if (!itemsData) return [];
      if (typeof itemsData === "string") {
        return JSON.parse(itemsData);
      }
      return itemsData; // Already an object/array
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
    const items = getParsedItems(order.items); // Using Safe Helper
    const invoiceWindow = window.open("", "_blank");

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice_#${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Dancing+Script:wght@700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            .invoice-card { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 20px; position: relative; }
            .top-bar { position: absolute; top: 0; left: 0; width: 100%; height: 8px; background: #3b82f6; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company-brand { color: #1e293b; font-weight: 900; font-size: 24px; margin: 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 15px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 12px; background: #f1f5f9; font-size: 11px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
            .grand-total { background: #1e293b; color: white; padding: 15px; border-radius: 10px; margin-top: 20px; text-align: right; font-weight: bold; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="top-bar"></div>
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
                ${items.map(i => `
                  <tr>
                    <td>${i.name}</td>
                    <td>${i.quantity || 1}</td>
                    <td>₹${parseFloat(i.price).toLocaleString()}</td>
                    <td style="text-align:right">₹${((i.quantity || 1) * i.price).toLocaleString()}</td>
                  </tr>`).join('')}
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

  if (!user) return <div className="p-10 text-center">Please login to view orders.</div>;
  if (loading) return <div className="p-10 text-center">Loading your orders...</div>;

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-screen">
      <h2 className="text-4xl font-black mb-10 text-slate-900 tracking-tighter">MY ORDERS</h2>

      {orders.length === 0 ? (
        <div className="text-center p-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
          No orders found.
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            // const items = (order.items); // Safe call
            const items =order.items || []

            return (
              <div key={order.id} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold uppercase tracking-widest">Order ID: #{order.id}</span>
                    <p className="text-xs text-slate-400 mt-2 font-medium">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === "Cancelled" ? "bg-red-50 text-red-600" :
                        order.status === "Delivered" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {order.status}
                    </span>
                    {order.status === "Delivered" && (
                      <button onClick={() => handleDownloadInvoice(order)} className="p-2 bg-slate-900 text-white rounded-full hover:bg-blue-600 transition">
                        <Lucide.FileText size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <img 
                          src={item.image ? `${API_BASE_URL}${item.image}` : "https://via.placeholder.com/80"} 
                          className="w-12 h-12 rounded-xl object-cover bg-white border" 
                          alt="" 
                        />
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase leading-none">{item.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1 font-bold">Qty: {item.quantity || 1} • Price: ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Paid</p>
                      <h3 className="text-3xl font-black">₹{parseFloat(order.total_amount).toLocaleString()}</h3>
                    </div>
                    {order.status === "Pending" && canCancel(order.created_at) && (
                      <button onClick={() => handleCancel(order.id)} className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all">
                        CANCEL
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