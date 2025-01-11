import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductManager.css";

const ProductManager = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("/product-manager/add-product");
  };

  const handleDeleteProduct = () => {
    navigate("/product-manager/delete-product");
  };

  const handleCategory = () => {
    navigate("/product-manager/category-management");
  };

  const handleComments = () => {
    navigate("/product-manager/comment-management");
  };

  const handleStock = () => {
    navigate("/product-manager/stock-management");
  };

  const handleInvoices = () => {
    navigate("/manager/invoices");
  };

  const handleDeliveries = () => {
    navigate("/product-manager/deliveries-page");
  };

  return (
    <div className="product-manager-container">
      <h1>Product Manager Dashboard</h1>

      <div className="sections">
        <div className="section">
          <h2>Products</h2>
          <button className="action-button" onClick={handleAddProduct}>
            Add Product
          </button>
          <button className="action-button" onClick={handleDeleteProduct}>
            Remove Product
          </button>
        </div>

        <div className="section">
          <h2>Categories</h2>
          <button className="action-button" onClick={handleCategory}>
            Manage Categories
          </button>
        </div>

        <div className="section">
          <h2>Comments</h2>
          <button className="action-button" onClick={handleComments}>
            Manage Comments
          </button>
        </div>

        <div className="section">
          <h2>Stocks</h2>
          <button className="action-button" onClick={handleStock}>
            Manage Stocks
          </button>
        </div>

        <div className="section">
          <h2>Invoices</h2>
          <button className="action-button" onClick={handleInvoices}>
            View Invoices
          </button>
        </div>

        <div className="section">
          <h2>Deliveries</h2>
          <button className="action-button" onClick={handleDeliveries}>
            View Deliveries
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
