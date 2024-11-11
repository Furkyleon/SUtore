import React from "react";
import "./CategoriesPage.css";

const categories = [
  { name: "Telephone", path: "/categories/telephone" },
  { name: "TV", path: "/categories/television" },
  { name: "Laptop", path: "/categories/laptop" },
  { name: "White", path: "/categories/white" },
  { name: "Accessory", path: "/categories/accessory" },
  { name: "Consoles", path: "/categories/consoles" },
];

const CategoriesPage = () => {
  return (
    <div className="categories-page">
      <h1>Categories</h1>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={index} className="category-item">
            <a href={category.path}>{category.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
