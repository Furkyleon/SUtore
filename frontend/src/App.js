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
import DiscountPage from "./Components/DiscountPage/DiscountPage";
import RefundPage from "./Components/RefundPage/RefundPage"
import InvoicesPage from "./Components/SalesManager/InvoicesPage";
import RevenueCalc from "./Components/SalesManager/RevenueCalc";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="store" element={<StorePage />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
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
          <Route path="sales-manager/invoices" element={<InvoicesPage />}></Route>
          <Route path="sales-manager/calculate-revenue" element={<RevenueCalc />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
