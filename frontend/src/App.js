import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Header from './Components/Header/Header';
import MainPage from './Components/MainPage/MainPage';
import StorePage from './Components/Store/StorePage';
import LoginForm from './Components/Login/LoginForm';
import RegisterForm from './Components/Register/RegisterForm';
import Categories from './Components/Categories/CategoriesPage';
import CategoryPage from './Components/Categories/CategoryPage'; // Import the CategoryPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:categoryName" element={<CategoryPage />} /> {/* Dynamic route for each category */}
      </Routes>
    </Router>
  );
}

export default App;
