import { useState, useEffect } from "react";
import api from "./api";
import * as Lucide from "lucide-react";
import axios from "axios";

const BASE_URL = api.defaults.baseURL; // ← centralize this
const getImageUrl = (imagePath) => {
  // 1. If it's null or undefined, return placeholder
  if (!imagePath) return "https://placehold.co/150";

  // 2. If it's an ARRAY (common when multiple images are uploaded), take the first one
  const path = Array.isArray(imagePath) ? imagePath[0] : imagePath;

  // 3. Safety check: Ensure 'path' is now a string before calling startsWith
  if (typeof path !== "string") return "https://placehold.co/150";

  // 4. Check for Cloudinary/External URL
  if (path.startsWith("http")) return path;

  // 5. Local path
  return `${BASE_URL}${path}`;
};
const Admin = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [promos, setPromos] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState(null);
const [inquiries, setInquiries] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryFile, setCategoryFile] = useState(null);
  const [editCategoryImage, setEditCategoryImage] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    discount_price: "",
    stock: "",
    description: "",
    long_description: "",
    category_id: "",
  });
const [imageFiles, setImageFiles] = useState([]);
  const [newPromo, setNewPromo] = useState({
    code: "",
    discount: "",
    start_date: "",
    expiry_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/api/admin/orders"),
        api.get("/api/admin/promos"),
        api.get("/products"),
        api.get("/api/categories"),
      ]);

      if (results[0].status === "fulfilled") setOrders(results[0].value.data);
      if (results[1].status === "fulfilled") setPromos(results[1].value.data);
      if (results[2].status === "fulfilled") setProducts(results[2].value.data);
      if (results[3].status === "fulfilled") setCategories(results[3].value.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", newCategoryName);
    if (categoryFile) data.append("image", categoryFile);
    try {
      await api.post("/api/admin/categories", data);
      setNewCategoryName("");
      setCategoryFile(null);
      fetchData();
      alert("Category Created!");
    } catch (err) {
      alert("Failed to add category");
    }
  };

  const handleUpdateCategory = async (e, id) => {
    e.stopPropagation();
    try {
      await api.put(`/api/admin/categories/${id}`, { name: editCategoryName });
      setIsEditing(null);
      fetchData();
      alert("Category Updated!");
    } catch (err) {
      alert("Update failed.");
    }
  };
const updateCategory = async (id, newName, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("name", newName);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.put(
      `${BASE_URL}/api/admin/categories/${id}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    if (response.status === 200) {
      // Update local state so the UI refreshes
      setCategories(
        categories.map((cat) =>
          cat.id === id
            ? { ...cat, name: newName, image: response.data.image || cat.image }
            : cat,
        ),
      );
      setIsEditing(null);
      setEditCategoryImage(null);
      alert("Category updated successfully!");
    }
  } catch (error) {
    console.error("Error updating category:", error);
    alert("Update failed. Make sure you are logged in as admin.");
  }
};
  const deleteCategory = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure? This may affect products in this category.")) {
      try {
        await api.delete(`/api/admin/categories/${id}`);
        fetchData();
      } catch (err) {
        alert("Delete failed. Make sure the category is empty first.");
      }
    }
  };

 const handleAddProduct = async (e) => {
   e.preventDefault();

   const data = new FormData();

   // Required fields
   data.append("name", newProduct.name.trim());
   data.append("price", Number(newProduct.price) || 0);
   data.append("stock", Number(newProduct.stock) || 0);
   data.append("description", newProduct.description.trim());
   data.append("long_description", newProduct.long_description.trim());

   // Optional fields
   if (newProduct.discount_price !== "") {
     data.append("discount_price", Number(newProduct.discount_price));
   }

   if (newProduct.category_id) {
     data.append("category_id", Number(newProduct.category_id));
   }

   // Multiple images (IMPORTANT: same key every time)
   if (imageFiles?.length) {
     imageFiles.forEach((file) => {
       data.append("images", file);
     });
   }

   try {
     await api.post("/api/admin/products", data);
     alert("Product added successfully!");

     setNewProduct({
       name: "",
       price: "",
       discount_price: "",
       stock: "",
       description: "",
       long_description: "",
       category_id: "",
     });

     setImageFiles([]);
     fetchData();
   } catch (err) {
     console.error(err);
     alert("Upload failed");
   }
 };



  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        await api.delete(`/api/admin/products/${id}`);
        setViewingProduct(null);
        fetchData();
      } catch (err) {
        alert("Failed to delete product.");
      }
    }
  };

  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (newPromo.discount <= 0 || newPromo.discount > 100) {
      alert("Please enter a discount between 1 and 100");
      return;
    }
    try {
      await api.post("/api/admin/promos", {
        code: newPromo.code.toUpperCase(),
        discount: parseInt(newPromo.discount),
        start_date: new Date().toISOString().split("T")[0],
        expiry_date: newPromo.expiry_date || "2026-12-31",
      });
      alert(`Success! Code ${newPromo.code} is now active.`);
      setNewPromo({ code: "", discount: "", start_date: "", expiry_date: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create promo code.");
    }
  };

  const deletePromo = async (id) => {
    if (window.confirm("Delete this promo?")) {
      try {
        await api.delete(`/api/admin/promos/${id}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete promo code");
      }
    }
  };
  useEffect(() => {
    if (activeTab === "custom_inquiries") {
      fetchInquiries();
    }
  }, [activeTab]);

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get("/api/admin/custom-inquiries");
      setInquiries(data);
    } catch (err) {
      console.error("Error fetching inquiries", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this inquiry?")) {
      try {
        await api.delete(`/api/admin/custom-inquiries/${id}`);
        fetchInquiries(); // Refresh list
      } catch (err) {
        alert("Failed to delete inquiry");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white p-6 fixed h-full shadow-2xl z-50">
        <h2 className="text-2xl font-black mb-10 tracking-tighter text-blue-400 italic">
          ADMIN PANEL
        </h2>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === "orders" ? "bg-blue-600 shadow-lg" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Lucide.Package size={18} /> Orders
          </button>
          <button
            onClick={() => {
              setActiveTab("inventory");
              setSelectedCategory(null);
              setViewingProduct(null);
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === "inventory" ? "bg-blue-600 shadow-lg" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Lucide.LayoutGrid size={18} /> Inventory
          </button>
          <button
            onClick={() => setActiveTab("add-new")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === "add-new" ? "bg-blue-600 shadow-lg" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Lucide.PlusCircle size={18} /> Add New Content
          </button>
          <button
            onClick={() => setActiveTab("promo")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === "promo" ? "bg-blue-600 shadow-lg" : "hover:bg-slate-800 text-slate-400"}`}
          >
            <Lucide.Ticket size={18} /> Promotions
          </button>
          {/* ADD THIS BUTTON TO YOUR SIDEBAR NAV */}
          <button
            onClick={() => setActiveTab("custom_inquiries")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              activeTab === "custom_inquiries"
                ? "bg-amber-600 shadow-lg"
                : "hover:bg-slate-800 text-slate-400"
            }`}
          >
            <Lucide.Flame size={18} /> Custom Inquiries
          </button>
        </nav>
      </div>

      <div className="flex-1 ml-64 p-10">
        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
              Incoming Orders
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => {
                let cartData = [];
                try {
                  cartData =
                    typeof order.items === "string"
                      ? JSON.parse(order.items)
                      : order.items || [];
                } catch (e) {
                  console.error(e);
                }
                const firstItem = cartData[0] || {};
                return (
                  <div
                    key={order.id}
                    className="bg-white p-6 rounded-[2.5rem] border shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-6 flex-1 w-full">
                      <img
                        // Ensure we pass the image string/array through our safety helper
                        src={getImageUrl(firstItem.image)}
                        onError={(e) => {
                          // Fallback if the URL returns a 404
                          e.target.onerror = null; // Prevent infinite loops if fallback fails
                          e.target.src =
                            "https://placehold.co/150?text=No+Image";
                        }}
                        className="w-28 h-28 object-cover rounded-3xl border shadow-sm bg-slate-50"
                        alt={firstItem.name || "Product"}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">
                            Order #{order.id}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${order.status === "Pending" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-black uppercase text-slate-800 leading-tight">
                          {cartData.length > 1
                            ? `${firstItem.name} (+${cartData.length - 1} more)`
                            : firstItem.name || "Unknown"}
                        </h3>
                        <p className="text-blue-600 font-black text-xl mb-1">
                          ₹{Number(order.total_amount || 0).toFixed(2)}
                        </p>
                        <button
                          onClick={() => setSelectedOrderItems(cartData)}
                          className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition mb-3 flex items-center gap-1 w-fit"
                        >
                          <Lucide.Eye size={12} /> View Items
                        </button>
                        <div className="space-y-1 text-xs font-bold text-slate-500">
                          <p className="flex items-center gap-2">
                            <Lucide.User size={12} className="text-blue-600" />{" "}
                            {order.username}
                          </p>
                          <p className="flex items-center gap-2 text-blue-500">
                            <Lucide.Mail size={12} /> {order.email}
                          </p>
                          <p className="flex items-center gap-2 uppercase">
                            <Lucide.MapPin size={12} /> {order.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order status buttons */}
                    {/* Order status buttons */}
                    <div className="flex flex-col gap-2 w-full lg:w-48">
                      {/* 1. PENDING STATE */}
                      {order.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "Accepted")
                            }
                            className="bg-blue-500 text-white py-3 rounded-2xl font-black text-xs uppercase hover:bg-blue-600 shadow-sm"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "Cancelled")
                            }
                            className="border-2 border-red-500 text-red-500 py-3 rounded-2xl font-black text-xs uppercase hover:bg-red-500 hover:text-white transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* 2. ACCEPTED STATE */}
                      {order.status === "Accepted" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "Shipped")}
                          className="bg-orange-500 text-white py-3 rounded-2xl font-black text-xs uppercase hover:bg-orange-600 shadow-sm"
                        >
                          Mark as Shipped
                        </button>
                      )}

                      {/* 3. SHIPPED STATE */}
                      {order.status === "Shipped" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order.id, "Delivered")
                          }
                          className="bg-green-600 text-white py-3 rounded-2xl font-black text-xs uppercase hover:bg-green-700 shadow-sm"
                        >
                          Mark as Delivered
                        </button>
                      )}

                      {/* 4. DELIVERED STATE */}
                      {order.status === "Delivered" && (
                        <div className="text-center bg-green-50 py-4 rounded-2xl border border-dashed border-green-200 uppercase font-black text-[10px] text-green-600">
                          <Lucide.CheckCircle2
                            size={14}
                            className="mx-auto mb-1"
                          />
                          Order Completed
                        </div>
                      )}

                      {/* 5. CANCELLED STATE */}
                      {order.status === "Cancelled" && (
                        <div className="text-center bg-red-50 py-4 rounded-2xl border border-dashed border-red-200 uppercase font-black text-[10px] text-red-400">
                          <Lucide.XCircle size={14} className="mx-auto mb-1" />
                          Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* 1. ORDERS SECTION (Existing) */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase">
              General Orders
            </h2>
            {/* Your Order List Component goes here */}
          </div>
        )}

        {/* 2. CUSTOM INQUIRIES SECTION */}
        {activeTab === "custom_inquiries" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-serif italic text-slate-900 tracking-tight">
                  Sacred Temple Inquiries
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">
                  Bespoke Idols & Architecture Requests
                </p>
              </div>
              <button
                onClick={fetchInquiries}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-bold text-xs hover:bg-amber-100 transition-all border border-amber-100 shadow-sm shadow-amber-100/50"
              >
                <Lucide.RefreshCw size={14} /> Refresh Data
              </button>
            </div>

            <div className="overflow-x-auto rounded-[1.5rem] border border-slate-100 shadow-inner bg-slate-50/30">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="p-5 border-b border-slate-800">
                      Date Received
                    </th>
                    <th className="p-5 border-b border-slate-800">
                      Metal Type
                    </th>
                    <th className="p-5 border-b border-slate-800">
                      Client Contact
                    </th>
                    <th className="p-5 border-b border-slate-800">Location</th>
                    <th className="p-5 border-b border-slate-800">
                      Specifications
                    </th>
                    <th className="p-5 border-b border-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {inquiries.length > 0 ? (
                    inquiries.map((iq) => (
                      <tr
                        key={iq.id}
                        className="hover:bg-amber-50/30 transition-colors group"
                      >
                        <td className="p-5 text-xs font-medium text-slate-400">
                          {new Date(iq.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-5">
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-full border border-amber-200">
                            {iq.metal}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 underline decoration-slate-200 underline-offset-4 cursor-pointer">
                              {iq.phone}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-slate-600 text-sm italic">
                            <Lucide.MapPin
                              size={14}
                              className="text-slate-300"
                            />{" "}
                            {iq.location}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                              Height / Weight
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              {iq.height}ft • {iq.weight}kg
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                alert(`DETAILED REQUIREMENTS:\n\n${iq.details}`)
                              }
                              className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                              title="View Requirements"
                            >
                              <Lucide.FileText size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(iq.id)}
                              className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Delete Record"
                            >
                              <Lucide.Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-slate-300">
                          <Lucide.Inbox size={48} strokeWidth={1} />
                          <span className="text-xs font-black uppercase tracking-widest">
                            No inquiries yet
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div className="animate-fadeIn">
            {!selectedCategory ? (
              /* --- 1. CATEGORY GRID VIEW --- */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white p-6 rounded-3xl border shadow-sm group relative"
                  >
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEditing(cat.id);
                          setEditCategoryName(cat.name);
                        }}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
                      >
                        <Lucide.Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => deleteCategory(e, cat.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
                      >
                        <Lucide.Trash size={14} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div
                      onClick={() => !isEditing && setSelectedCategory(cat)}
                      className="cursor-pointer"
                    >
                      {/* IMAGE SECTION */}
                      {isEditing === cat.id ? (
                        <div
                          className="mb-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="block text-[10px] font-black text-slate-400 mb-1 uppercase">
                            Change Image
                          </label>
                          <input
                            type="file"
                            onChange={(e) =>
                              setEditCategoryImage(e.target.files[0])
                            }
                            className="text-xs block w-full text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                      ) : (
                        <img
                          src={getImageUrl(cat.image)}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                          className="w-full h-32 object-cover rounded-2xl mb-4"
                          alt={cat.name}
                        />
                      )}

                      {/* NAME SECTION */}
                      {isEditing === cat.id ? (
                        <div
                          className="space-y-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="block text-[10px] font-black text-slate-400 uppercase">
                            Category Name
                          </label>
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={(e) =>
                              setEditCategoryName(e.target.value)
                            }
                            className="w-full border-2 border-blue-500 rounded-xl p-2 text-sm font-bold outline-none"
                            autoFocus
                          />
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() =>
                                updateCategory(
                                  cat.id,
                                  editCategoryName,
                                  editCategoryImage,
                                )
                              }
                              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-[10px] font-black"
                            >
                              SAVE
                            </button>
                            <button
                              onClick={() => {
                                setIsEditing(null);
                                setEditCategoryImage(null);
                              }}
                              className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-[10px] font-black"
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-black text-slate-800 uppercase">
                            {cat.name}
                          </h3>
                          <p className="text-xs font-bold text-slate-400 mt-1">
                            Products:{" "}
                            {
                              products.filter((p) => p.category_id === cat.id)
                                .length
                            }
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : viewingProduct ? (
              /* --- 2. PRODUCT DETAIL VIEW --- */
              <div className="animate-fadeIn space-y-6">
                <button
                  onClick={() => setViewingProduct(null)}
                  className="flex items-center gap-2 text-blue-600 font-black"
                >
                  <Lucide.ArrowLeft size={20} /> BACK TO LIST
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl border shadow-sm">
                  <img
                    src={getImageUrl(viewingProduct.image)}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400";
                    }}
                    className="w-full rounded-2xl shadow-lg border-4 border-slate-50"
                    alt={viewingProduct.name}
                  />
                  <div>
                    <h2 className="text-4xl font-black uppercase text-slate-800 mb-2">
                      {viewingProduct.name}
                    </h2>
                    <p className="text-3xl text-blue-600 font-black mb-6">
                      ₹{Number(viewingProduct.price).toFixed(2)}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase">
                          Short Description
                        </h4>
                        <p className="text-slate-600 font-medium">
                          {viewingProduct.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase">
                          Long Description
                        </h4>
                        <p className="text-slate-500 text-sm whitespace-pre-wrap">
                          {viewingProduct.long_description ||
                            "No long description available."}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteProduct(viewingProduct.id)}
                      className="mt-8 bg-red-50 text-red-600 px-6 py-4 rounded-xl font-black w-full hover:bg-red-600 hover:text-white transition"
                    >
                      DELETE PRODUCT
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* --- 3. PRODUCT LIST VIEW --- */
              <div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-blue-600 font-black mb-6"
                >
                  <Lucide.ArrowLeft size={20} /> BACK TO CATEGORIES
                </button>
                <div className="bg-white rounded-3xl border divide-y">
                  {products
                    .filter((p) => p.category_id === selectedCategory.id)
                    .map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setViewingProduct(p)}
                        className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-6">
                          <img
                            src={
                              p.image
                                ? Array.isArray(p.image)
                                  ? p.image[0]
                                  : `${BASE_URL}${p.image}`
                                : "https://via.placeholder.com/64"
                            }
                            className="w-16 h-16 object-cover rounded-xl"
                            alt={p.name}
                          />
                          <div>
                            <h4 className="font-black text-slate-800 uppercase text-sm">
                              {p.name}
                            </h4>
                            <p className="text-blue-600 font-black">
                              ₹{Number(p.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <Lucide.ChevronRight className="text-slate-300" />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* ADD NEW CONTENT TAB */}
        {activeTab === "add-new" && (
          <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* NEW CATEGORY FORM */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm h-fit">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase">
                <Lucide.Tag className="text-orange-500" /> New Category
              </h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <input
                  type="text"
                  placeholder="Category Name"
                  className="w-full p-4 border-2 rounded-2xl outline-none font-bold"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setCategoryFile(e.target.files[0])}
                  required
                  className="text-xs"
                />
                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">
                  CREATE CATEGORY
                </button>
              </form>
            </div>

            {/* NEW PRODUCT FORM */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 uppercase">
                <Lucide.PlusCircle className="text-blue-500" /> New Product
              </h3>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="w-full p-4 border-2 rounded-2xl font-bold"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />

                <select
                  className="w-full p-4 border-2 rounded-2xl bg-slate-50 font-bold"
                  value={newProduct.category_id}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      category_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                      Base Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 5000"
                      className="w-full p-4 border-2 rounded-2xl font-bold"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-blue-500 ml-2">
                      Sale Price (₹) - Optional
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 3999"
                      className="w-full p-4 border-2 border-blue-100 bg-blue-50/30 rounded-2xl font-bold text-blue-600 outline-blue-500"
                      value={newProduct.discount_price || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          discount_price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {newProduct.price &&
                  newProduct.discount_price &&
                  Number(newProduct.discount_price) > 0 && (
                    <div className="p-3 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
                      <Lucide.TrendingDown
                        size={18}
                        className="text-green-600"
                      />
                      <span className="text-xs font-bold text-green-700">
                        Customer saves ₹
                        {(
                          Number(newProduct.price) -
                          Number(newProduct.discount_price)
                        ).toFixed(2)}{" "}
                        (
                        {Math.round(
                          ((Number(newProduct.price) -
                            Number(newProduct.discount_price)) /
                            Number(newProduct.price)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                  )}

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Stock Qty"
                    className="w-full p-4 border-2 rounded-2xl font-bold"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    required
                  />
                </div>

                <textarea
                  placeholder="Short Summary (Display on card)"
                  className="w-full p-4 border-2 rounded-2xl h-24 font-medium"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Full Detailed Description"
                  className="w-full p-4 border-2 rounded-2xl h-48 font-medium"
                  value={newProduct.long_description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      long_description: e.target.value,
                    })
                  }
                />

                <div className="p-4 bg-slate-50 border-2 border-dashed rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-2">
                    Product Image
                  </p>
                  <input
                    type="file"
                    multiple // <--- CRITICAL: allows multiple selection
                    accept="image/*" // (Optional) Helps mobile users
                    onChange={(e) => setImageFiles(Array.from(e.target.files))} // Convert FileList to Array
                    required
                    className="text-xs w-full"
                  />
                </div>

                <button className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black hover:bg-slate-900 transition-all shadow-lg hover:shadow-blue-200">
                  PUBLISH ARTIFACT
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PROMOTIONS TAB */}
        {activeTab === "promo" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
            {/* 1. HEADER */}
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
                Promotional Codes
              </h2>
              <p className="text-slate-500 font-medium">
                Create and manage discount coupons for your customers.
              </p>
            </div>

            {/* 2. CREATE NEW PROMO FORM */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <form
                onSubmit={handleAddPromo}
                className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Code Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FESTIVE20"
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold uppercase"
                    value={newPromo.code}
                    onChange={(e) =>
                      setNewPromo({ ...newPromo, code: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Discount %
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                    value={newPromo.discount}
                    onChange={(e) =>
                      setNewPromo({ ...newPromo, discount: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                    value={newPromo.expiry_date}
                    onChange={(e) =>
                      setNewPromo({ ...newPromo, expiry_date: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-4 rounded-2xl font-black uppercase text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <Lucide.PlusCircle size={18} /> Create Promo
                </button>
              </form>
            </div>

            {/* 3. PROMOS TABLE */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="p-6">Code</th>
                    <th className="p-6">Discount</th>
                    <th className="p-6">Expiry</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {promos.length > 0 ? (
                    promos.map((promo) => (
                      <tr
                        key={promo.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-6">
                          <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-black text-sm">
                            {promo.code}
                          </span>
                        </td>
                        <td className="p-6 font-bold text-slate-700">
                          {/* Change 'discount' to 'discount_percent' */}
                          {promo.discount_percent}% OFF
                        </td>

                        <td className="p-6 text-sm font-medium text-slate-400">
                          {new Date(promo.expiry_date).toLocaleDateString()}
                        </td>
                        <td className="p-6 text-right">
                          <button
                            onClick={() => deletePromo(promo.id)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Lucide.Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-10 text-center text-slate-300 font-bold uppercase text-xs tracking-widest"
                      >
                        No active promo codes found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ORDER ITEMS MODAL */}
      {selectedOrderItems && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrderItems(null)}
              className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full"
            >
              <Lucide.X size={24} />
            </button>
            <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              <Lucide.PackageSearch className="text-blue-600" /> Order Items
              List
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {selectedOrderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100"
                >
                  <img
                    src={
                      item.image
                        ? `${BASE_URL}${item.image}`
                        : "https://via.placeholder.com/80"
                    }
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80";
                    }}
                    className="w-20 h-20 object-cover rounded-2xl"
                    alt={item.name}
                  />
                  <div className="flex-1">
                    <h4 className="font-black uppercase text-slate-800 text-sm">
                      {item.name}
                    </h4>
                    <div className="flex gap-4 mt-1 text-xs font-bold text-slate-500">
                      <p>
                        Qty:{" "}
                        <span className="text-blue-600">
                          {item.quantity || 1}
                        </span>
                      </p>
                      <p>
                        Price:{" "}
                        <span className="text-slate-900">
                          ₹{Number(item.price).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedOrderItems(null)}
              className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase"
            >
              Close View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;