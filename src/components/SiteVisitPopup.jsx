import { useState, useEffect } from "react";
import { X, Building2, CheckCircle2, ShieldCheck, Calendar, User, Phone, MapPin, MessageCircle } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function SiteVisitPopup() {
    const { siteSettings, addBuyerLead, isSiteVisitOpen, openSiteVisit, closeSiteVisit, user } = useProperty();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [visitLocation, setVisitLocation] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    // Pre-fill user details if logged in
    useEffect(() => {
        if (user?.name) setName(user.name);
        else if (user?.email) setName(user.email.split("@")[0]);
        if (user?.phone) setPhone(user.phone.replace(/\D/g, "").slice(0, 10));
    }, [user]);

    const handleOpen = () => {
        setSubmitted(false);
        if (openSiteVisit) openSiteVisit();
    };

    const handleClose = () => {
        if (closeSiteVisit) closeSiteVisit();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanPhone = phone.replace(/\D/g, "");

        if (!name.trim()) {
            alert("Kripya apna poora naam enter karein.");
            return;
        }

        if (cleanPhone.length !== 10) {
            alert("Mobile number theek 10 digit ka hona chahiye.");
            return;
        }

        if (!visitLocation.trim()) {
            alert("Kripya visit ki location enter karein.");
            return;
        }

        if (addBuyerLead) {
            addBuyerLead({
                name: name.trim(),
                phone: `+91 ${cleanPhone}`,
                propertyTitle: `Property Visit: ${visitLocation.trim()}`,
                propertyPrice: "Visit Scheduled",
                message: `📍 PROPERTY VISIT REQUEST: Location: ${visitLocation.trim()}, Name: ${name.trim()}, Mobile: +91 ${cleanPhone}`,
            });
        }

        setSubmitted(true);

        const waText = encodeURIComponent(
            `Hello Jaipur Ki Property! I want to schedule a Property Visit.\n\n*Name:* ${name.trim()}\n*Mobile:* +91 ${cleanPhone}\n*Visit Location:* ${visitLocation.trim()}\n\nPlease confirm my visit time!`
        );
        setTimeout(() => {
            window.open(`https://wa.me/${waNumber}?text=${waText}`, "_blank");
        }, 1000);
    };

    const whatsappDirectUrl = () => {
        const cleanPhone = phone.replace(/\D/g, "");
        const waText = encodeURIComponent(
            `Hello Jaipur Ki Property! I want to schedule a Property Visit.\n\n*Name:* ${name.trim()}\n*Mobile:* +91 ${cleanPhone}\n*Visit Location:* ${visitLocation.trim()}\n\nPlease confirm my visit time!`
        );
        return `https://wa.me/${waNumber}?text=${waText}`;
    };

    return (
        <>
            {/* FLOATING TRIGGER PILL: JAIPUR KI PROPERTY + 360° AUTO-ROTATING VISIT BADGE */}
            {!isSiteVisitOpen && (
                <button
                    type="button"
                    className="site-visit-floating-pill"
                    onClick={handleOpen}
                    title="Jaipur Ki Property - Book Property Visit"
                >
                    <Building2 size={16} className="pill-car-icon" />
                    <span>Jaipur Ki Property</span>
                    <span className="pill-badge-3d-wrap" aria-hidden="true">
                        <span className="pill-badge-3d-inner">
                            <span className="pill-badge-side pill-badge-front">VISIT</span>
                            <span className="pill-badge-side pill-badge-back">VISIT</span>
                        </span>
                    </span>
                </button>
            )}

            {/* POPUP MODAL (VISIT PAR CLICK KARNE PAR OPEN HOTA HAI) */}
            {isSiteVisitOpen && (
                <div className="site-visit-modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
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
                                        <span>Jaipur Ki Property • Verified Visit</span>
                                    </div>
                                    <h3 className="site-visit-title">
                                        Schedule A <span className="highlight-text">Property Visit</span>
                                    </h3>
                                    <p className="site-visit-desc">
                                        Enter your details to schedule a verified property visit in Jaipur. 100% genuine assistance & zero hidden charges.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="site-visit-form">
                                    {/* 1. NAME */}
                                    <div className="site-visit-input-group">
                                        <label>
                                            <User size={14} color="#ec268f" />
                                            <span>Full Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    {/* 2. MOBILE NUMBER (STRICTLY 10 DIGITS) */}
                                    <div className="site-visit-input-group">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <label>
                                                <Phone size={14} color="#ec268f" />
                                                <span>Mobile Number (10 Digits)</span>
                                            </label>
                                            <span style={{ fontSize: "11px", fontWeight: 700, color: phone.length === 10 ? "#16a34a" : "#64748b" }}>
                                                {phone.length}/10 Digits
                                            </span>
                                        </div>
                                        <div className="phone-input-wrap">
                                            <span className="phone-prefix">+91</span>
                                            <input
                                                type="tel"
                                                inputMode="numeric"
                                                placeholder="Enter 10-digit mobile number"
                                                value={phone}
                                                maxLength={10}
                                                pattern="[0-9]{10}"
                                                onChange={(e) => {
                                                    const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                    setPhone(clean);
                                                }}
                                                required
                                            />
                                        </div>
                                        {phone && phone.length < 10 && (
                                            <span style={{ fontSize: "11px", color: "#e11d48", fontWeight: 600, marginTop: "2px" }}>
                                                Mobile number 10 digits ka hona chahiye
                                            </span>
                                        )}
                                    </div>

                                    {/* 3. VISIT KI LOCATION */}
                                    <div className="site-visit-input-group">
                                        <label>
                                            <MapPin size={14} color="#ec268f" />
                                            <span>Visit Ki Location (Jaipur)</span>
                                        </label>
                                        <input
                                            type="text"
                                            list="jaipur-locations-datalist"
                                            placeholder="e.g. Mansarovar, Jagatpura, Vaishali Nagar..."
                                            value={visitLocation}
                                            onChange={(e) => setVisitLocation(e.target.value)}
                                            required
                                        />
                                        <datalist id="jaipur-locations-datalist">
                                            <option value="Mansarovar, Jaipur" />
                                            <option value="Jagatpura, Jaipur" />
                                            <option value="Vaishali Nagar, Jaipur" />
                                            <option value="Patrakar Colony, Jaipur" />
                                            <option value="Malviya Nagar, Jaipur" />
                                            <option value="Tonk Road, Jaipur" />
                                            <option value="Ajmer Road, Jaipur" />
                                            <option value="Sitapura, Jaipur" />
                                            <option value="C Scheme, Jaipur" />
                                            <option value="Raja Park, Jaipur" />
                                            <option value="Gopalpura Bypass, Jaipur" />
                                            <option value="Pratap Nagar, Jaipur" />
                                            <option value="Kalwar Road, Jaipur" />
                                            <option value="Sirsi Road, Jaipur" />
                                            <option value="Durgapura, Jaipur" />
                                        </datalist>
                                    </div>

                                    <button type="submit" className="site-visit-submit-btn">
                                        <Calendar size={16} />
                                        <span>Confirm Property Visit</span>
                                    </button>
                                </form>

                                <div className="site-visit-footer-note">
                                    <ShieldCheck size={14} color="#15803d" />
                                    <span>100% Free Service • Direct Owner Visit • Immediate Callback</span>
                                </div>
                            </>
                        ) : (
                            <div className="site-visit-success-state">
                                <div className="success-icon-wrap">
                                    <CheckCircle2 size={48} color="#15803d" />
                                </div>
                                <h3>Visit Request Received!</h3>
                                <p>
                                    Thank you <strong>{name}</strong>! Your property visit for <strong>{visitLocation}</strong> has been received. Our Jaipur property advisor will call you within 15 minutes on <strong>+91 {phone}</strong>.
                                </p>

                                <a
                                    href={whatsappDirectUrl()}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="site-visit-wa-btn"
                                >
                                    <MessageCircle size={17} />
                                    <span>Instant WhatsApp Confirmation</span>
                                </a>

                                <div className="success-actions" style={{ marginTop: "12px" }}>
                                    <button
                                        type="button"
                                        className="success-done-btn"
                                        onClick={handleClose}
                                    >
                                        Done
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
