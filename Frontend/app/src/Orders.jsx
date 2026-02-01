import React, { useEffect, useState } from "react";
import api from "./api"; // UPDATED: Use your custom api instance
import * as Lucide from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve user data to get the ID
  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE_URL = "https://nandinibrassmetals-1.onrender.com";

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
      // UPDATED: Using 'api' instance automatically sends the auth cookie
      const res = await api.get(`/api/orders/${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders", err);
      if (err.response?.status === 401) {
        console.error("Unauthorized: Please log in again.");
      }
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
      // UPDATED: Use 'api' for patch request as well
      await api.patch(`/api/orders/${orderId}/cancel`);
      alert("Order Cancelled successfully.");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || "Error cancelling order");
    }
  };

  // --- INVOICE GENERATION LOGIC ---
  const handleDownloadInvoice = (order) => {
    const items = JSON.parse(order.items || "[]");
    const invoiceWindow = window.open("", "_blank");

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice_#${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Dancing+Script:wght@700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            .invoice-card { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 20px; position: relative; overflow: hidden; }
            .top-bar { position: absolute; top: 0; left: 0; width: 100%; height: 8px; background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; align-items: flex-start; }
            .company-brand { color: #3b82f6; font-weight: 900; font-size: 28px; letter-spacing: -1px; margin: 0; }
            .gst-text { font-size: 11px; color: #64748b; font-weight: bold; margin-top: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 15px; }
            .info-label { font-size: 10px; text-transform: uppercase; font-weight: 900; color: #94a3b8; letter-spacing: 1px; margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 15px; background: #1e293b; color: white; font-size: 12px; text-transform: uppercase; }
            td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .grand-total { background: #3b82f6; color: white; padding: 10px 20px; border-radius: 10px; margin-top: 10px; display: flex; justify-content: space-between; width: 250px; }
            .signature-section { margin-top: 50px; display: flex; justify-content: flex-end; text-align: center; }
            .digital-sig { font-family: 'Dancing Script', cursive; font-size: 24px; border-bottom: 1px solid #e2e8f0; }
            @media print { .no-print { display: none; } body { padding: 0; } .invoice-card { border: none; } }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="top-bar"></div>
            <div class="header">
              <div>
                <h2 class="company-brand">NANDHINI BRASS & METALS</h2>
                <div class="gst-text">GSTIN: 36ANUPY8270B1ZB</div>
                <p style="font-size: 12px; color: #64748b; margin: 5px 0;">UPPAL, CHILKANAGAR<br>Hyderabad, Telangana, India</p>
              </div>
              <div style="text-align: right;">
                <h1 style="margin:0; color:#e2e8f0;">INVOICE</h1>
                <div class="info-label">Invoice #ORD-${order.id}</div>
                <div style="font-weight: bold;">${new Date(order.created_at).toLocaleDateString("en-IN")}</div>
              </div>
            </div>

            <div class="info-grid">
              <div>
                <div class="info-label">Bill To</div>
                <div style="font-weight: bold;">${order.username}</div>
                <div style="font-size: 13px;">${order.email}</div>
                <div style="font-size: 13px;">${order.address}</div>
              </div>
              <div style="text-align: right;">
                <div class="info-label">Payment</div>
                <div style="font-weight: bold;">${order.payment_method.toUpperCase()}</div>
                <div style="color: #3b82f6; font-size: 12px; font-weight: bold;">STATUS: ${order.status}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item) => `
                  <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.quantity || 1}</td>
                    <td>₹${parseFloat(item.price).toLocaleString("en-IN")}</td>
                    <td style="text-align: right;">₹${((item.quantity || 1) * item.price).toLocaleString("en-IN")}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <div style="display: flex; flex-direction: column; align-items: flex-end;">
              <div class="grand-total">
                <span>TOTAL</span>
                <span>₹${parseFloat(order.total_amount).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div class="signature-section">
              <div>
                <div class="digital-sig">Srikanth Y</div>
                <div style="font-size: 10px; color: #94a3b8;">Authorized Signatory</div>
              </div>
            </div>
          </div>
          <script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  if (!user)
    return (
      <div className="p-10 text-center text-xl font-semibold">
        Please login to view orders.
      </div>
    );

  if (loading)
    return <div className="p-10 text-center">Loading your orders...</div>;

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-screen">
      <h2 className="text-4xl font-bold mb-10 text-gray-800">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center p-20 bg-gray-50 rounded-3xl border-2 border-dashed text-gray-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = JSON.parse(order.items || "[]");

            return (
              <div
                key={order.id}
                className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                    <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                      Order ID: #{order.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placed on: {new Date(order.created_at).toLocaleString()}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : order.status === "Delivered"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {order.status}
                      </span>
                      {order.status === "Delivered" && (
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-blue-600 transition"
                        >
                          <Lucide.FileText size={12} /> Invoice
                        </button>
                      )}
                    </div>
                  </div>

                  {order.status === "Pending" &&
                    (canCancel(order.created_at) ? (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="bg-red-50 text-red-600 px-5 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition"
                      >
                        Cancel Order
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Cancellation closed
                      </span>
                    ))}
                </div>

                <div className="mb-6 space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl"
                    >
                      <img
                        src={
                          item.image
                            ? `${API_BASE_URL}${item.image}`
                            : "https://via.placeholder.com/80"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border bg-white"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          Qty: {item.quantity || 1} | Price: ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-4 pt-4 border-t border-gray-100">
                  <div className="w-full md:max-w-md">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Shipping Address
                    </h4>
                    <p className="text-gray-700 text-sm mt-1">
                      {order.address}
                    </p>
                    <p className="text-[10px] text-blue-500 font-bold mt-2 uppercase tracking-tighter">
                      Paid via: {order.payment_method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs font-bold uppercase">
                      Total Amount
                    </p>
                    <h3 className="text-2xl font-black text-gray-900">
                      ₹{parseFloat(order.total_amount).toLocaleString()}
                    </h3>
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
