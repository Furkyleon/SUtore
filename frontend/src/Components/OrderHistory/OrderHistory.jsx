import React from "react";
import "./OrderHistory.css";
import orders from "../../data/order";

const OrderHistory = ({ orders }) => {
  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {orders.length > 0 ? (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-header">
                <span className="order-id">Order ID: {order.id}</span>
                <span className="order-date">Date: {order.date}</span>
                <span className="order-total">Total: {order.total.toFixed(2)} TL</span>
              </div>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id} className="order-item-detail">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">
                      {(item.price * item.quantity).toFixed(2)} TL
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-history-message">You have no order history.</p>
      )}
    </div>
  );
};

// Bu bileşeni doğru şekilde export edin
export default () => <OrderHistory orders={orders} />;
