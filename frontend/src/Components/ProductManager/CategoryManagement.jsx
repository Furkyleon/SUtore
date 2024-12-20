import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa"; // Font Awesome trash icon
import "./CategoryManagement.css";

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setError("");
      try {
        const response = await fetch("http://127.0.0.1:8000/categories/get_all/");
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Failed to fetch categories.");
          return;
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError("An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    setError("");
    setSuccessMessage("");

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    if (!newCategory.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/categories/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to add category.");
        return;
      }

      const data = await response.json();
      setCategories((prevCategories) => [...prevCategories, data]);
      setSuccessMessage("Category added successfully!");
      setNewCategory("");
    } catch (err) {
      setError("An error occurred while adding the category.");
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    setError("");
    setSuccessMessage("");

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/categories/delete/${categoryName}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: authHeader,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to delete category.");
        return;
      }

      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.name !== categoryName)
      );
      setSuccessMessage(`Category '${categoryName}' deleted successfully!`);
    } catch (err) {
      setError("An error occurred while deleting the category.");
    }
  };

  return (
    <div className="manage-categories-wrapper">
      <h1>Manage Categories</h1>
      {loading && <p>Loading categories...</p>}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {!loading && (
        <div>
          <h2>All Categories</h2>
          {categories.length > 0 ? (
            <ul className="categories-list">
              {categories.map((category) => (
                <li key={category.id} className="category-item">
                  {category.name}
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCategory(category.name)}
                    title="Delete category"
                  >
                    <FaTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No categories available.</p>
          )}
        </div>
      )}

      <div className="add-category-section">
        <h2>Add a New Category</h2>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category name"
          className="category-input"
        />
        <button className="add-category-btn" onClick={handleAddCategory}>
          Add Category
        </button>
      </div>
    </div>
  );
};

export default ManageCategoriesPage;
