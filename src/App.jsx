import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Home from "./pages/Home";
import Rent from "./pages/Rent";
import Commercial from "./pages/Commercial";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostProperty from "./pages/PostProperty";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import EnquiryModal from "./components/EnquiryModal";
import EmailOtpLoginModal from "./components/EmailOtpLoginModal";
import { PropertyProvider, useProperty } from "./context/PropertyContext";

// Automatically scroll to the top of the page on every navigation / route change
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, search]);

  return null;
}

function AppContent() {
  const { enquiryProperty, closeEnquiry } = useProperty();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/flats" element={<Rent />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/commercial-office" element={<Commercial />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-property" element={<PostProperty />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

      {/* FLOATING WHATSAPP BUTTON (SIDE MEIN) - HIDDEN ON ADMIN */}
      {!isAdminRoute && <FloatingWhatsApp />}

      {/* AUTO OPEN GMAIL OTP LOGIN POPUP - HIDDEN ON ADMIN */}
      {!isAdminRoute && <EmailOtpLoginModal />}

      {enquiryProperty && (
        <EnquiryModal
          property={enquiryProperty}
          onClose={closeEnquiry}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <PropertyProvider>
      <AppContent />
    </PropertyProvider>
  );
}
