import { Link } from "react-router-dom";
import { Sparkles, Car, ShieldCheck, Zap, Phone, PlusCircle, ArrowRight, Award } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function HomePromoBanner({ onOpenSiteVisit }) {
    const { siteSettings } = useProperty();
    const phone = siteSettings?.phone || "+91 70230 77367";
    const rawPhone = siteSettings?.rawPhone || "917023077367";

    return (
        <section className="home-promo-banner-section" aria-label="Jaipur Real Estate Special Offer Banner">
            <div className="container">
                <div className="home-promo-banner-card">
                    {/* Background glow orbs */}
                    <div className="promo-glow-orb promo-glow-1"></div>
                    <div className="promo-glow-orb promo-glow-2"></div>

                    <div className="promo-banner-content">
                        {/* LEFT: TEXT CONTENT & ACTIONS */}
                        <div className="promo-banner-main">
                            <div className="promo-top-badge">
                                <Sparkles size={14} className="promo-sparkle-icon" />
                                <span>Jaipur Ki Property • Verified Real Estate Network</span>
                            </div>

                            <h2 className="promo-banner-title">
                                Looking to Buy, Rent or Sell Property in <span className="highlight-text">Jaipur</span>?
                            </h2>

                            <p className="promo-banner-desc">
                                Get direct owner deals with zero brokerage, 100% verified documents, and free assisted cab for site visits across Mansarovar, Jagatpura, Vaishali Nagar, and all prime localities.
                            </p>

                            {/* FEATURE BADGES */}
                            <div className="promo-features-grid">
                                <div className="promo-feature-pill">
                                    <Car size={15} color="#ec268f" />
                                    <span>Free Cab for Site Visits</span>
                                </div>
                                <div className="promo-feature-pill">
                                    <ShieldCheck size={15} color="#15803d" />
                                    <span>RERA & JDA Verified Deals</span>
                                </div>
                                <div className="promo-feature-pill">
                                    <Zap size={15} color="#ea580c" />
                                    <span>Zero Brokerage Options</span>
                                </div>
                                <div className="promo-feature-pill">
                                    <Award size={15} color="#ec268f" />
                                    <span>Direct Owner Connect</span>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="promo-banner-actions">
                                <button
                                    type="button"
                                    className="promo-btn-primary"
                                    onClick={onOpenSiteVisit}
                                >
                                    <Car size={16} />
                                    <span>Book Free Site Visit</span>
                                    <ArrowRight size={15} />
                                </button>

                                <Link to="/post-property" className="promo-btn-secondary">
                                    <PlusCircle size={16} />
                                    <span>Post Property Free</span>
                                </Link>

                                <a href={`tel:${rawPhone}`} className="promo-btn-call">
                                    <Phone size={15} />
                                    <span>Call: {phone}</span>
                                </a>
                            </div>
                        </div>

                        {/* RIGHT: REAL ESTATE STATS CARD */}
                        <div className="promo-banner-stats-box">
                            <div className="stats-box-header">
                                <span className="stats-city-tag">📍 Jaipur Real Estate Highlights</span>
                            </div>

                            <div className="stats-box-grid">
                                <div className="stat-box-item">
                                    <div className="stat-number">500+</div>
                                    <div className="stat-label">Verified Listings</div>
                                </div>
                                <div className="stat-box-item">
                                    <div className="stat-number">10k+</div>
                                    <div className="stat-label">Happy Families</div>
                                </div>
                                <div className="stat-box-item">
                                    <div className="stat-number">0%</div>
                                    <div className="stat-label">Brokerage Deals</div>
                                </div>
                                <div className="stat-box-item">
                                    <div className="stat-number">4.9 ★</div>
                                    <div className="stat-label">Jaipur Rating</div>
                                </div>
                            </div>

                            <div className="stats-guarantee-note">
                                <ShieldCheck size={14} color="#15803d" />
                                <span>100% Privacy Protected & No Spam Calls Guaranteed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

