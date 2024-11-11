import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './Components/MainPage/MainPage';
import LoginForm from './Components/Login/LoginForm';
import RegisterForm from './Components/Register/RegisterForm';
import Categories from './Components/Categories/CategoriesPage';
import CategoryPage from './Components/Categories/CategoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryName" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
