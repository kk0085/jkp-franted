import { useState, useEffect } from "react";
import { X, Car, CheckCircle2, ShieldCheck, Sparkles, MessageCircle, Gift, ArrowRight, Clock, Zap } from "lucide-react";
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
    const [isBarDismissed, setIsBarDismissed] = useState(false);

    const waNumber = siteSettings?.whatsappNumber || "917023077367";
    const contactPhone = siteSettings?.phone || "+91 70230 77367";

    // Auto-open logic: opens after 6 seconds if user hasn't closed it in this session
    useEffect(() => {
        if (isOpen !== undefined && isOpen !== null) {
            setVisible(isOpen);
            return;
        }

        const wasDismissed = sessionStorage.getItem("jkp_banner_popup_dismissed");
        if (wasDismissed) return;

        const timer = setTimeout(() => {
            if (!isLoginModalOpen) {
                setVisible(true);
            }
        }, 6000);

        return () => clearTimeout(timer);
    }, [isOpen, isLoginModalOpen]);

    const handleClose = () => {
        setVisible(false);
        sessionStorage.setItem("jkp_banner_popup_dismissed", "true");
        if (onClose) onClose();
    };

    const handleOpenModal = () => {
        setVisible(true);
        if (onManualOpen) onManualOpen();
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
                name: name.trim() || "VIP Pass Visitor",
                phone: `+91 ${cleanPhone}`,
                propertyTitle: `VIP Pass: Free Cab Site Visit (${propertyType} in ${locality})`,
                propertyPrice: `Budget: ${budget}`,
                message: `User claimed VIP Free Site Visit Pass in ${locality}. Type: ${propertyType}, Budget: ${budget}.`,
            });
        }

        setSubmitted(true);

        const waText = encodeURIComponent(
            `Hello Jaipur Ki Property! I claimed the VIP Free Site Visit Pass on your website for ${propertyType} in ${locality} (Budget: ${budget}). My Name: ${name || "Visitor"}, Mobile: +91 ${cleanPhone}. Please connect me with property owner & schedule my free cab visit.`
        );
        setTimeout(() => {
            window.open(`https://wa.me/${waNumber}?text=${waText}`, "_blank");
        }, 1200);
    };

    const handleDirectWhatsApp = () => {
        const waText = encodeURIComponent(
            `Hello Jaipur Ki Property! I saw your Jaipur Property Festival Banner on the website. I want to claim the Free Site Visit Pass & Zero Brokerage details.`
        );
        window.open(`https://wa.me/${waNumber}?text=${waText}`, "_blank");
    };

    return (
        <>
            {/* 1. SLIDE-UP BOTTOM BANNER RIBBON (WHEN POPUP IS CLOSED) */}
            {!visible && !isBarDismissed && (
                <aside className="sticky-bottom-promo-bar" aria-label="Special Jaipur Property Offer">
                    <div className="bottom-bar-content" onClick={handleOpenModal}>
                        <div className="bottom-bar-tag">
                            <Gift size={15} className="pulse-icon" />
                            <span>VIP Pass</span>
                        </div>
                        <div className="bottom-bar-text">
                            <strong>🔥 Special Jaipur Offer:</strong>
                            <span> Free AC Cab Site Visit & 0% Brokerage Deals in Mansarovar & Jagatpura</span>
                        </div>
                        <button type="button" className="bottom-bar-claim-btn">
                            <span>Claim Free Pass</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                    <button
                        type="button"
                        className="bottom-bar-close-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsBarDismissed(true);
                        }}
                        title="Dismiss offer"
                        aria-label="Dismiss banner"
                    >
                        <X size={14} />
                    </button>
                </aside>
            )}

            {/* 2. FLOATING TRIGGER PILL ON BOTTOM-LEFT */}
            {!visible && isBarDismissed && (
                <button
                    type="button"
                    className="site-visit-floating-pill"
                    onClick={handleOpenModal}
                    title="Claim Free Site Visit Pass in Jaipur"
                >
                    <Car size={16} className="pill-car-icon" />
                    <span>Free Site Visit Pass</span>
                    <span className="pill-badge">FREE CAB</span>
                </button>
            )}

            {/* 3. FULL VISUAL BANNER POPUP MODAL */}
            {visible && (
                <div className="banner-popup-backdrop" onClick={handleClose}>
                    <div className="banner-popup-dialog" onClick={(e) => e.stopPropagation()}>
                        {/* CLOSE BUTTON */}
                        <button
                            type="button"
                            className="banner-popup-close-btn"
                            onClick={handleClose}
                            aria-label="Close offer banner"
                        >
                            <X size={20} />
                        </button>

                        {!submitted ? (
                            <div className="banner-popup-grid">
                                {/* LEFT PANEL: GRAPHIC POSTER BANNER */}
                                <div className="banner-poster-panel">
                                    <div className="poster-bg-overlay"></div>
                                    <div className="poster-inner-content">
                                        <div className="poster-top-badge">
                                            <Sparkles size={14} />
                                            <span>Jaipur Property Festival 2026</span>
                                        </div>

                                        <h3 className="poster-main-title">
                                            Get <span className="gold-highlight">0% Brokerage</span> + Free AC Cab Site Visit Pass
                                        </h3>

                                        <p className="poster-subtext">
                                            Tour hand-picked verified flats, duplexes & luxury villas across Jaipur's prime locations with our dedicated property experts.
                                        </p>

                                        <div className="poster-perks-list">
                                            <div className="poster-perk-item">
                                                <Car size={16} className="perk-icon-pink" />
                                                <div>
                                                    <strong>Free AC Cab Pickup & Drop</strong>
                                                    <p>From your home or station across Jaipur</p>
                                                </div>
                                            </div>
                                            <div className="poster-perk-item">
                                                <ShieldCheck size={16} className="perk-icon-green" />
                                                <div>
                                                    <strong>100% RERA & JDA Verified</strong>
                                                    <p>Clean legal titles & verified documents</p>
                                                </div>
                                            </div>
                                            <div className="poster-perk-item">
                                                <Zap size={16} className="perk-icon-orange" />
                                                <div>
                                                    <strong>Direct Owner Deals</strong>
                                                    <p>No agent commission or hidden fees</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="poster-urgency-pill">
                                            <Clock size={13} />
                                            <span>Limited: Only 4 Free Passes Remaining Today!</span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT PANEL: CLAIM FORM & WHATSAPP */}
                                <div className="banner-form-panel">
                                    <div className="form-panel-header">
                                        <span className="form-badge">VIP Property Pass</span>
                                        <h4>Claim Your Free Pass in 10 Seconds</h4>
                                        <p>Enter your contact details to receive your pass & schedule your visit.</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="banner-claim-form">
                                        <div className="banner-input-box">
                                            <label>Your Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Rahul Sharma"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="banner-input-box">
                                            <label>WhatsApp Mobile Number</label>
                                            <div className="banner-phone-row">
                                                <span className="banner-country-code">+91</span>
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

                                        <div className="banner-inputs-grid">
                                            <div className="banner-input-box">
                                                <label>Looking For</label>
                                                <select
                                                    value={propertyType}
                                                    onChange={(e) => setPropertyType(e.target.value)}
                                                >
                                                    <option value="Flat / Apartment">Flat / Apartment</option>
                                                    <option value="House / Villa">House / Villa</option>
                                                    <option value="Rental Flat">Rental Flat</option>
                                                    <option value="Residential Plot">Residential Plot</option>
                                                    <option value="Commercial Space">Commercial Space</option>
                                                </select>
                                            </div>

                                            <div className="banner-input-box">
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
                                                </select>
                                            </div>
                                        </div>

                                        <button type="submit" className="banner-claim-submit-btn">
                                            <Gift size={16} />
                                            <span>Claim Free VIP Pass Now</span>
                                            <ArrowRight size={15} />
                                        </button>
                                    </form>

                                    {/* DIVIDER OR DIRECT WHATSAPP */}
                                    <div className="banner-or-divider">
                                        <span>OR CONNECT DIRECTLY</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="banner-whatsapp-quick-btn"
                                        onClick={handleDirectWhatsApp}
                                    >
                                        <MessageCircle size={17} />
                                        <span>Claim Pass via WhatsApp</span>
                                    </button>

                                    <div className="banner-trust-note">
                                        <ShieldCheck size={13} color="#15803d" />
                                        <span>100% Privacy Protected • Immediate Callback</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* SUCCESS SCREEN */
                            <div className="banner-success-card">
                                <div className="banner-success-icon">
                                    <CheckCircle2 size={54} color="#15803d" />
                                </div>
                                <h3>🎉 Congratulations {name || "Customer"}!</h3>
                                <div className="success-pass-badge">
                                    <span>VIP FREE SITE VISIT PASS ACTIVATED</span>
                                </div>
                                <p>
                                    Your request has been received for <strong>{propertyType}</strong> in <strong>{locality}</strong>. Our Jaipur Property Manager will call you on <strong>+91 {phone}</strong> within 15 minutes to confirm your cab pickup time.
                                </p>
                                <button
                                    type="button"
                                    className="banner-success-close-btn"
                                    onClick={handleClose}
                                >
                                    Explore Properties Now →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
