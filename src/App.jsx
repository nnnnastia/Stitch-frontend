import './App.css'
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Promo from './pages/Promo/Promo.jsx';
import { Routes, Route } from 'react-router-dom'
import { Profile } from './pages/User/Profile.jsx';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RequireAuth from "./components/RequireAuth/RequireAuth.jsx";
import EditProfile from './pages/EditProfile.jsx';
import SellerDashboard from './pages/Profile/SellerDashboard.jsx';
import HitsNewSection from './components/HitsNewSection/HitsNewSection.jsx';
import Recommendation from './components/Recommendation/Recommendation.jsx';
import SellerProductForm from './pages/Profile/SellerProductForm.jsx';
import VerifyEmail from './pages/Profile/VerifyEmail.jsx';
import CheckEmail from './components/CheckEmail/CheckEmail.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import ProductDetails from './pages/ProductDetails/ProductDetails.jsx';
import CatalogPage from './pages/Catalog/CatalogPage.jsx';
import AdminLayout from './pages/Admin/AdminLayout/AdminLayout.jsx';
import AdminCategoriesPage from './pages/Admin/AdminCategoriesPage/AdminCategoriesPage.jsx';
import AdminUsersPage from './pages/Admin/AdminUsersPage/AdminUsersPage.jsx';
import CartPage from './pages/CartPage/CartPage.jsx';
import FAQSection from './components/FAQSection/FAQSection.jsx';

function App() {
  return (
    <>
      <Header />


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
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* 🔴 КАБІНЕТ ПРОДАВЦЯ */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

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

        <Route
          path="/profile/edit"
          element={
            <RequireAuth>
              <EditProfile />
            </RequireAuth>
          }
        />
        <Route path="/seller" element={<SellerDashboard />} />


        <Route path="*" element={<h1>404 — сторінку не знайдено</h1>} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;