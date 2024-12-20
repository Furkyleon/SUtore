import React, { useState, useEffect } from "react";
import "./AddProduct.css";

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    model: "",
    category: "",
    description: "",
    price: "",
    discount: "0",
    stock: "",
    serial_number: "",
    warranty_status: "",
    distributor_info: "",
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/categories/get_all/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleAddProduct = async () => {
    setError("");
    setSuccessMessage("");

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    const productData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      productData.append(key, value);
    });

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/products/add_product/",
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
          },
          body: productData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.error || "An error occurred while adding the product."
        );
        return;
      }

      setSuccessMessage("Product added successfully!");
      setFormData({
        name: "",
        image: null,
        model: "",
        category: "",
        description: "",
        price: "",
        discount: "0",
        stock: "",
        serial_number: "",
        warranty_status: "",
        distributor_info: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="add-product-container">
      <h1>Add Product</h1>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="serial_number">Serial Number</label>
          <input
            type="text"
            id="serial_number"
            name="serial_number"
            value={formData.serial_number}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount">Discount (%)</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          className="description-textarea"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="warranty_status">Warranty Status</label>
          <input
            type="text"
            id="warranty_status"
            name="warranty_status"
            value={formData.warranty_status}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="distributor_info">Distributor Info</label>
          <textarea
            id="distributor_info"
            name="distributor_info"
            value={formData.distributor_info}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <button className="action-button" onClick={handleAddProduct}>
        Add Product
      </button>
    </div>
  );
};

export default AddProductPage;
