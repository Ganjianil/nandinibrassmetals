import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import api from "./api";
import Cookies from "js-cookie";
import { CartProvider } from "./CartContext";
import Header from "./Header";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import Cart from "./Cart";
import Auth from "./Auth";
import AdminDashboard from "./AdminDashboard";
import Orders from "./Orders";
import FloatingContact from "./FloatingContact";
import CustomOrderSuite from "./CustomOrderSuite";
import "./index.css";
import Profile from "./Profile";
import Gallery from "./Gallery";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const sessionCookie = Cookies.get("user_session");
      const localUser = localStorage.getItem("user");
      let foundUser = null;
      try {
        if (sessionCookie) foundUser = JSON.parse(sessionCookie);
        else if (localUser) foundUser = JSON.parse(localUser);
      } catch {
        foundUser = null;
      }
      setUser(foundUser);
    };

    checkUser();
    window.addEventListener("userLogin", checkUser);
    window.addEventListener("storage", checkUser);
    return () => {
      window.removeEventListener("userLogin", checkUser);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const isAdmin = user && user.email?.toLowerCase() === "anilrocky519@gmail.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/api/categories"),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="selection:bg-amber-100 selection:text-amber-900 relative">
          <Header user={user} />
          <FloatingContact />

          <Routes>
            <Route
              path="/"
              element={
                <main className="overflow-x-hidden">
                  <div id="product-list" className="pt-0 bg-white">
                    <ProductList products={products} categories={categories} />
                  </div>
                  <div className="bg-[#F9F8F6]">
                    <Gallery />
                  </div>
                  <Footer />
                </main>
              }
            />

            <Route path="/custom-order" element={<CustomOrderSuite />} />

            <Route
              path="/category/:id"
              element={
                <main className="pt-20">
                  <ProductList products={products} categories={categories} />
                  <Footer />
                </main>
              }
            />

            <Route
              path="/product/:id"
              element={
                <>
                  <ProductDetail
                    products={products}
                    categories={categories}
                  />
                  <Footer />
                </>
              }
            />

            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/auth" />}
            />
            <Route
              path="/auth"
              element={isAdmin ? <Navigate to="/admin" /> : <Auth />}
            />
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/auth" />}
            />
            <Route path="/login" element={<Navigate to="/auth" />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
