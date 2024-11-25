import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import MainPage from "./Components/MainPage/MainPage";
import LoginForm from "./Components/Login/LoginForm";
import RegisterForm from "./Components/Register/RegisterForm";
import CategoryPage from "./Components/Categories/CategoryPage";
import ProductPage from "./Components/ProductPage/ProductPage";
import StorePage from "./Components/Store/StorePage";
import Cart from "./Components/Cart/Cart";
import PaymentPage from "./Components/PaymentPage/PaymentPage";
import OrderHistory from "./Components/OrderHistory/OrderHistory";

function App() {
  // State to store cart items
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Handle purchase
  const handlePurchase = () => {
    alert("Purchase complete!");
    setCartItems([]); // Clear the cart after purchase
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="store" element={<StorePage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="orderhistory" element={<OrderHistory/>} />
          <Route
            path="categories/:categoryName"
            element={<CategoryPage addToCart={addToCart} />}
          />
          <Route path="product/:productId" element={<ProductPage />} />
          <Route
            path="cart"
            element={<Cart cartItems={cartItems} handlePurchase={handlePurchase} />}
          />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
