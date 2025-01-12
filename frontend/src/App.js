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
import SearchPage from "./Components/Search/SearchPage";
import Invoice from "./Components/Invoice/Invoice";
import Wishlist from "./Components/Wishlist/Wishlist";
import SalesManager from "./Components/SalesManager/SalesManager";
import DiscountPage from "./Components/SalesManager/DiscountPage";
import RefundPage from "./Components/SalesManager/RefundPage";
import InvoicesPage from "./Components/Invoice/ManagerInvoices";
import RevenueCalc from "./Components/SalesManager/RevenueCalc";
import ProductManager from "./Components/ProductManager/ProductManager";
import AddProduct from "./Components/ProductManager/AddProduct";
import DeleteProduct from "./Components/ProductManager/DeleteProduct";
import CategoryManagement from "./Components/ProductManager/CategoryManagement";
import CommentManagement from "./Components/ProductManager/CommentManagement";
import StockManagement from "./Components/ProductManager/StockManagement";
import DeliveryManagement from "./Components/ProductManager/DeliveryManagement";
import ProfilePage from "./Components/Profile/ProfilePage";
import UpdatePricesPage from "./Components/SalesManager/UpdatePricesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="store" element={<StorePage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="profile" element={<ProfilePage />} />
          
          <Route path="payment" element={<PaymentPage />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="categories/:categoryName" element={<CategoryPage />} />
          <Route path="product/:productId" element={<ProductPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="invoice/:orderId" element={<Invoice />} />
          <Route path="wishlist" element={<Wishlist />} />

          <Route path="sales-manager" element={<SalesManager />} />
          <Route path="sales-manager/discount-page" element={<DiscountPage />} />
          <Route path="sales-manager/refund-page" element={<RefundPage />} />
          <Route path="sales-manager/calculate-revenue" element={<RevenueCalc />} />
          <Route path="sales-manager/update-prices-page" element={<UpdatePricesPage />} />
          <Route path="manager/invoices" element={<InvoicesPage />} />
          <Route path="product-manager" element={<ProductManager />} />
          <Route path="product-manager/add-product" element={<AddProduct />} />
          <Route path="product-manager/delete-product" element={<DeleteProduct />} />
          <Route path="product-manager/category-management" element={<CategoryManagement />} />
          <Route path="product-manager/comment-management" element={<CommentManagement />} />
          <Route path="product-manager/stock-management" element={<StockManagement />} />
          <Route path="product-manager/deliveries-page" element={<DeliveryManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
