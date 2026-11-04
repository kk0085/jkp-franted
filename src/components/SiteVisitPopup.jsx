import { useState, useEffect } from "react";
import { X, Building2, CheckCircle2, ShieldCheck, Calendar } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function SiteVisitPopup({ isOpen, onClose, onManualOpen }) {
    const { siteSettings, addBuyerLead, isLoginModalOpen } = useProperty();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [propertyType, setPropertyType] = useState("Flat / Apartment");
    const [locality, setLocality] = useState("Mansarovar");
    const [budget, setBudget] = useState("₹20 Lakh - ₹50 Lakh");
    const [submitted, setSubmitted] = useState(false);
    const [visible, setVisible] = useState(false);

    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    // Auto-open logic: opens after 7.5 seconds if user hasn't closed it in this session
    useEffect(() => {
        if (isOpen !== undefined && isOpen !== null) {
            setVisible(isOpen);
            return;
        }

        const wasDismissed = sessionStorage.getItem("jkp_site_visit_popup_dismissed");
        if (wasDismissed) return;

        const timer = setTimeout(() => {
            if (!isLoginModalOpen) {
                setVisible(true);
            }
        }, 7500);

        return () => clearTimeout(timer);
    }, [isOpen, isLoginModalOpen]);

    const handleClose = () => {
        setVisible(false);
        sessionStorage.setItem("jkp_site_visit_popup_dismissed", "true");
        if (onClose) onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanPhone = phone.replace(/\D/g, "");
        if (cleanPhone.length < 10) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (addBuyerLead) {
            addBuyerLead({
                name: name.trim() || "Website Visitor",
                phone: `+91 ${cleanPhone}`,
                propertyTitle: `Property Visit Request (${propertyType} in ${locality})`,
                propertyPrice: `Budget: ${budget}`,
                message: `Customer requested Property Visit in ${locality}. Type: ${propertyType}, Budget: ${budget}.`,
            });
        }

        setSubmitted(true);

        const waText = encodeURIComponent(
            `Hello Jaipur Ki Property! I want to schedule a Property Visit for ${propertyType} in ${locality} (Budget: ${budget}). My Name: ${name || "Visitor"}, Phone: +91 ${cleanPhone}.`
        );
        setTimeout(() => {
            window.open(`https://wa.me/${waNumber}?text=${waText}`, "_blank");
        }, 1200);
    };

    return (
        <>
            {/* FLOATING TRIGGER PILL: JAIPUR KI PROPERTY + VISIT */}
            {!visible && (
                <button
                    type="button"
                    className="site-visit-floating-pill"
                    onClick={() => {
                        setVisible(true);
                        if (onManualOpen) onManualOpen();
                    }}
                    title="Jaipur Ki Property - Book Visit"
                >
                    <Building2 size={16} className="pill-car-icon" />
                    <span>Jaipur Ki Property</span>
                    <span className="pill-badge">VISIT</span>
                </button>
            )}

            {/* POPUP MODAL */}
            {visible && (
                <div className="site-visit-modal-backdrop" onClick={handleClose}>
                    <div className="site-visit-modal-box" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="site-visit-close-btn"
                            onClick={handleClose}
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>

                        {!submitted ? (
                            <>
                                <div className="site-visit-header">
                                    <div className="site-visit-badge">
                                        <Building2 size={14} color="#ec268f" />
                                        <span>Jaipur Verified Properties • Zero Brokerage</span>
                                    </div>
                                    <h3 className="site-visit-title">
                                        Book a <span className="highlight-text">Property Visit</span> in Jaipur
                                    </h3>
                                    <p className="site-visit-desc">
                                        Tour verified flats, luxury villas & plots with our local property experts. Verified paperwork & RERA legal guidance.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="site-visit-form">
                                    <div className="site-visit-input-group">
                                        <label>Your Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="site-visit-input-group">
                                        <label>Mobile Number (WhatsApp)</label>
                                        <div className="phone-input-wrap">
                                            <span className="phone-prefix">+91</span>
                                            <input
                                                type="tel"
                                                placeholder="10-digit mobile number"
                                                value={phone}
                                                maxLength={10}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="site-visit-grid-2">
                                        <div className="site-visit-input-group">
                                            <label>Looking For</label>
                                            <select
                                                value={propertyType}
                                                onChange={(e) => setPropertyType(e.target.value)}
                                            >
                                                <option value="Flat / Apartment">Flat / Apartment</option>
                                                <option value="Independent House / Villa">House / Villa</option>
                                                <option value="Rental Property">Rental Property</option>
                                                <option value="Residential Plot">Residential Plot</option>
                                                <option value="Commercial Space">Commercial Space</option>
                                            </select>
                                        </div>

                                        <div className="site-visit-input-group">
                                            <label>Preferred Locality</label>
                                            <select
                                                value={locality}
                                                onChange={(e) => setLocality(e.target.value)}
                                            >
                                                <option value="Mansarovar">Mansarovar</option>
                                                <option value="Jagatpura">Jagatpura</option>
                                                <option value="Vaishali Nagar">Vaishali Nagar</option>
                                                <option value="Malviya Nagar">Malviya Nagar</option>
                                                <option value="Tonk Road">Tonk Road</option>
                                                <option value="Ajmer Road">Ajmer Road</option>
                                                <option value="Patrakar Colony">Patrakar Colony</option>
                                                <option value="Sitapura">Sitapura</option>
                                                <option value="C Scheme">C Scheme</option>
                                                <option value="Raja Park">Raja Park</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="site-visit-input-group">
                                        <label>Budget Range</label>
                                        <select
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                        >
                                            <option value="Under ₹20 Lakh">Under ₹20 Lakh</option>
                                            <option value="₹20 Lakh - ₹50 Lakh">₹20 Lakh - ₹50 Lakh</option>
                                            <option value="₹50 Lakh - ₹1 Crore">₹50 Lakh - ₹1 Crore</option>
                                            <option value="Above ₹1 Crore">Above ₹1 Crore</option>
                                            <option value="₹10,000 - ₹25,000 / month (Rent)">₹10,000 - ₹25,000 / month (Rent)</option>
                                            <option value="₹25,000+ / month (Rent)">₹25,000+ / month (Rent)</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="site-visit-submit-btn">
                                        <Calendar size={16} />
                                        <span>Confirm Property Visit Now</span>
                                    </button>
                                </form>

                                <div className="site-visit-footer-note">
                                    <ShieldCheck size={14} color="#15803d" />
                                    <span>100% Free Service • No Hidden Charges • Immediate Callback</span>
                                </div>
                            </>
                        ) : (
                            <div className="site-visit-success-state">
                                <div className="success-icon-wrap">
                                    <CheckCircle2 size={48} color="#15803d" />
                                </div>
                                <h3>Property Visit Request Received!</h3>
                                <p>
                                    Thank you <strong>{name || "Customer"}</strong>! Our Jaipur Property Advisor will call you within 15 minutes on <strong>+91 {phone}</strong> to confirm your visit time and project details.
                                </p>
                                <div className="success-actions">
                                    <button
                                        type="button"
                                        className="success-done-btn"
                                        onClick={handleClose}
                                    >
                                        Continue Browsing Jaipur Properties
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
