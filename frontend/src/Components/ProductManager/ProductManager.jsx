import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductManager.css";

const ProductManager = () => {
  const navigate = useNavigate();

  const handleAddProduct = () => {
    navigate("./add-product"); // Adjust the path to match your route for the Add Product page
  };

  const handleDeleteProduct = () => {
    navigate("./delete-product"); // Adjust the path to match your route for the Add Product page
  };

  const handleCategory = () => {
    navigate("./category-management"); // Adjust the path to match your route for the Add Product page
  };

  const handleComments = () => {
    navigate("./comment-management"); // Adjust the path to match your route for the Add Product page
  };

  const handleStock = () => {
    navigate("./stock-management"); // Adjust the path to match your route for the Add Product page
  };

  const handleInvoices = () => {
    navigate("./invoice-page"); // Adjust the path to match your route for the Add Product page
  };

  const handleDeliveries = () => {
    navigate("./deliveries-page"); // Adjust the path to match your route for the Add Product page
  };



  return (
    <div className="product-manager-container">
      <h1>Product Manager Interface</h1>

      <div className="sections">
        <div className="section light-blue">
          <h2>Product Management</h2>
          <button className="action-button" onClick={handleAddProduct}>
            Add Product
          </button>
          <button className="action-button" onClick={handleDeleteProduct}>Remove Product</button>
        </div>

        <div className="section light-green">
          <h2>Category Management</h2>
          <button className="action-button" onClick={handleCategory}>Manage Categories</button>
        </div>

        <div className="section light-yellow">
          <h2>Comment Management</h2>
          <button className="action-button" onClick={handleComments}>Manage Comments</button>
        </div>

        <div className="section light-red">
          <h2>Stock Management</h2>

          <button className="action-button" onClick={handleStock}>Manage Stocks</button>
        </div>

        <div className="section light-purple">
          <h2>Invoices</h2>
          <button className="action-button" onClick={handleInvoices}>View Invoices</button>
        </div>

        <div className="section light-teal">
          <h2>Delivery Management</h2>
          <button className="action-button" onClick={handleDeliveries}>View Products to be Delivered</button>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
