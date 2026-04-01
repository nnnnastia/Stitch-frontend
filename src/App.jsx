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

        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* 🔴 КАБІНЕТ ПРОДАВЦЯ */}
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/products/new" element={<SellerProductForm mode="create" />} />
        <Route path="/seller/products/:id/edit" element={<SellerProductForm mode="edit" />} />

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