import { useState, useEffect } from "react";
import { X, Building2, CheckCircle2, ShieldCheck, Calendar, User, Phone, MapPin, MessageCircle, Sparkles, Clock, Check } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

const POPULAR_LOCALITIES = [
    "Mansarovar",
    "Jagatpura",
    "Vaishali Nagar",
    "Patrakar Colony",
    "Malviya Nagar",
    "Tonk Road",
    "Ajmer Road",
];

export default function SiteVisitPopup() {
    const { siteSettings, addBuyerLead, isSiteVisitOpen, openSiteVisit, closeSiteVisit, user } = useProperty();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [visitLocation, setVisitLocation] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const waNumber = siteSettings?.whatsappNumber || "917023077367";

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
    };

    const whatsappDirectUrl = () => {
        const cleanPhone = phone.replace(/\D/g, "");
        const waText = encodeURIComponent(
            `Hello Jaipur Ki Property! I want to schedule a Property Visit.\n\n*Name:* ${name.trim()}\n*Mobile:* +91 ${cleanPhone}\n*Visit Location:* ${visitLocation.trim()}\n\nPlease confirm my visit schedule!`
        );
        return `https://wa.me/${waNumber}?text=${waText}`;
    };

    return (
        <>
            {/* FLOATING TRIGGER PILL */}
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
                            aria-label="Close modal"
                        >
                            <X size={18} />
                        </button>

                        {!submitted ? (
                            <>
                                <div className="site-visit-header">
                                    <div className="site-visit-badge">
                                        <Building2 size={13} color="#ec268f" />
                                        <span>Jaipur Ki Property • Verified Visit</span>
                                    </div>
                                    <h3 className="site-visit-title">
                                        Schedule A <span className="highlight-text">Property Visit</span>
                                    </h3>
                                    <p className="site-visit-desc">
                                        Fill in your details below to schedule a verified property visit in Jaipur. 100% free service with zero brokerage.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="site-visit-form">
                                    {/* 1. FULL NAME */}
                                    <div className="site-visit-input-group">
                                        <label htmlFor="visit-name">
                                            <User size={14} color="#ec268f" />
                                            <span>Full Name</span>
                                        </label>
                                        <div className="site-visit-input-wrap">
                                            <input
                                                id="visit-name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {/* 2. MOBILE NUMBER (STRICTLY 10 DIGITS) */}
                                    <div className="site-visit-input-group">
                                        <div className="site-visit-label-row">
                                            <label htmlFor="visit-phone">
                                                <Phone size={14} color="#ec268f" />
                                                <span>Mobile Number (10 Digits)</span>
                                            </label>
                                            <span className={`phone-digit-badge ${phone.length === 10 ? "complete" : ""}`}>
                                                {phone.length === 10 ? <Check size={11} strokeWidth={3} /> : null}
                                                <span>{phone.length}/10 Digits</span>
                                            </span>
                                        </div>
                                        <div className={`site-visit-input-wrap phone-wrap ${phone.length === 10 ? "valid" : ""}`}>
                                            <span className="phone-prefix">+91</span>
                                            <input
                                                id="visit-phone"
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
                                            <span className="site-visit-field-hint">
                                                Please enter remaining {10 - phone.length} digit{10 - phone.length > 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </div>

                                    {/* 3. VISIT KI LOCATION */}
                                    <div className="site-visit-input-group">
                                        <label htmlFor="visit-location">
                                            <MapPin size={14} color="#ec268f" />
                                            <span>Visit Ki Location in Jaipur</span>
                                        </label>
                                        <div className="site-visit-input-wrap">
                                            <input
                                                id="visit-location"
                                                type="text"
                                                list="jaipur-locations-datalist"
                                                placeholder="e.g. Mansarovar, Jagatpura, Vaishali Nagar..."
                                                value={visitLocation}
                                                onChange={(e) => setVisitLocation(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {/* QUICK LOCATION CHIPS */}
                                        <div className="quick-location-chips">
                                            <span className="chips-label">Popular:</span>
                                            {POPULAR_LOCALITIES.slice(0, 4).map((loc) => (
                                                <button
                                                    key={loc}
                                                    type="button"
                                                    className={`location-chip ${visitLocation.includes(loc) ? "active" : ""}`}
                                                    onClick={() => setVisitLocation(`${loc}, Jaipur`)}
                                                >
                                                    {loc}
                                                </button>
                                            ))}
                                        </div>

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

                                    {/* SUBMIT BUTTON */}
                                    <button type="submit" className="site-visit-submit-btn">
                                        <Calendar size={17} />
                                        <span>Confirm Property Visit</span>
                                    </button>
                                </form>

                                <div className="site-visit-footer-note">
                                    <div className="trust-note-item">
                                        <ShieldCheck size={14} color="#16a34a" />
                                        <span>100% Free Service</span>
                                    </div>
                                    <span className="trust-dot">•</span>
                                    <div className="trust-note-item">
                                        <Sparkles size={14} color="#ec268f" />
                                        <span>Zero Brokerage</span>
                                    </div>
                                    <span className="trust-dot">•</span>
                                    <div className="trust-note-item">
                                        <Clock size={14} color="#ea580c" />
                                        <span>Fast 15-Min Callback</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="site-visit-success-state">
                                <div className="success-icon-wrap">
                                    <CheckCircle2 size={54} color="#16a34a" />
                                </div>
                                <h3>Visit Request Received!</h3>
                                <p className="success-sub">
                                    Thank you <strong>{name}</strong>! Your visit request for <strong>{visitLocation}</strong> has been registered.
                                </p>

                                <div className="success-summary-box">
                                    <div className="summary-row">
                                        <span>Name:</span>
                                        <strong>{name}</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>Mobile:</span>
                                        <strong>+91 {phone}</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>Location:</span>
                                        <strong>{visitLocation}</strong>
                                    </div>
                                    <div className="summary-row">
                                        <span>Response Time:</span>
                                        <strong style={{ color: "#16a34a" }}>Within 15 Minutes</strong>
                                    </div>
                                </div>

                                <a
                                    href={whatsappDirectUrl()}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="site-visit-wa-btn"
                                >
                                    <MessageCircle size={18} />
                                    <span>Instant WhatsApp Confirmation</span>
                                </a>

                                <button
                                    type="button"
                                    className="success-done-btn"
                                    onClick={handleClose}
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
