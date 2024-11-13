// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Components/Layout';
import MainPage from './Components/MainPage/MainPage';
import LoginForm from './Components/Login/LoginForm';
import RegisterForm from './Components/Register/RegisterForm';
import Categories from './Components/Categories/CategoriesPage';
import CategoryPage from './Components/Categories/CategoryPage';
import ProductPage from './Components/ProductPage/ProductPage';
import StorePage from './Components/Store/StorePage';
import Cart from './Components/Cart/Cart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="store" element={<StorePage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/:categoryName" element={<CategoryPage />} />
          <Route path="product/:productId" element={<ProductPage />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
