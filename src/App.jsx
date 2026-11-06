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
import EnquiryModal from "./components/EnquiryModal";
import ScheduleCabModal from "./components/ScheduleCabModal";
import SiteVisitPopup from "./components/SiteVisitPopup";
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

  return (
    <>
      <ScrollToTop />
      <Navbar />

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
        </Routes>
      </main>

      <Footer />

      {/* FLOATING WHATSAPP BUTTON (SIDE MEIN) */}
      <FloatingWhatsApp />

      {/* FREE CAB SITE VISIT BOOKING MODAL */}
      <ScheduleCabModal />

      {/* GLOBAL JAIPUR KI PROPERTY [VISIT] FLOATING PILL & MODAL */}
      <SiteVisitPopup />

      {/* AUTO OPEN GMAIL OTP LOGIN POPUP */}
      <EmailOtpLoginModal />

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
