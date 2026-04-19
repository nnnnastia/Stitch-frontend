import './App.css'
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Promo from './pages/Promo/Promo.jsx';
import { Routes, Route } from 'react-router-dom'
import { Profile } from './pages/User/Profile/Profile.jsx';
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import RequireAuth from "./components/RequireAuth/RequireAuth.jsx";
import HitsNewSection from './components/HitsNewSection/HitsNewSection.jsx';
import Recommendation from './components/Recommendation/Recommendation.jsx';
import SellerLayout from './pages/Seller/SellerLayout/SellerLayout.jsx';
import SellerOrdersPage from './pages/Seller/SellerOrdersPage/SellerOrdersPage.jsx';
import SellerProductsPage from './pages/Seller/SellerProductsPage/SellerProductsPage.jsx';
import SellerProductForm from './pages/Seller/SellerProductForm/SellerProductForm.jsx';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail.jsx';
import CheckEmail from './components/CheckEmail/CheckEmail.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import ProductDetails from './pages/ProductDetails/ProductDetails.jsx';
import CatalogPage from './pages/Catalog/CatalogPage.jsx';
import AdminLayout from './pages/Admin/AdminLayout/AdminLayout.jsx';
import AdminCategoriesPage from './pages/Admin/AdminCategoriesPage/AdminCategoriesPage.jsx';
import AdminUsersPage from './pages/Admin/AdminUsersPage/AdminUsersPage.jsx';
import CartPage from './pages/CartPage/CartPage.jsx';
import FAQSection from './components/FAQSection/FAQSection.jsx';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage.jsx';
import MyOrdersPage from "./pages/User/MyOrdersPage/MyOrdersPage.jsx";
import AdminOrdersPage from './pages/Admin/AdminOrdersPage/AdminOrdersPage.jsx';
import ChatWidget from './components/ChatWidget/ChatWidget.jsx';
import SellerPublicPage from './pages/Seller/SellerPublicPage/SellerPublicPage.jsx';
import SellerProfilePage from './pages/Seller/SellerProfilePage/SellerProfilePage.jsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.jsx';
import CompleteGoogleSignupPage from './pages/CompleteGoogleSignupPage/CompleteGoogleSignupPage.jsx';

function App() {
  return (
    <>

      <Header />
      <ChatWidget />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Promo />
              <HitsNewSection />
              <Recommendation />
              <FAQSection />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path='orders' element={<AdminOrdersPage />} />
        </Route>

        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/complete-google-signup" element={<CompleteGoogleSignupPage />} />
        {/* 🔴 КАБІНЕТ ПРОДАВЦЯ */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerProductsPage />} />
          <Route path="store" element={<SellerProfilePage />} />
          <Route path="orders" element={<SellerOrdersPage />} />
          {/* <Route path="payment" element={<SellerPaymentPage />} /> */}
        </Route>

        <Route path="/shops/:slug" element={<SellerPublicPage />} />

        <Route
          path="/seller/products/new"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerProductForm mode="create" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/products/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerProductForm mode="edit" />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<h1>404 — сторінку не знайдено</h1>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;