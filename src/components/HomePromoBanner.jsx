import { Link } from "react-router-dom";
import { Sparkles, Building2, ShieldCheck, Zap, Phone, PlusCircle, ArrowRight, Award } from "lucide-react";
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
                            <div className="promo-pill-tag">
                                <Sparkles size={14} />
                                <span>JAIPUR'S TRUSTED PROPERTY NETWORK</span>
                            </div>

                            <h2 className="promo-banner-heading">
                                Planning To Buy, Sell Or Rent In Jaipur?
                            </h2>

                            <p className="promo-banner-desc">
                                Get direct owner deals with zero brokerage, 100% verified documents, and assisted property visits across Mansarovar, Jagatpura, Vaishali Nagar, and all prime localities.
                            </p>

                            {/* FEATURE BADGES */}
                            <div className="promo-features-grid">
                                <div className="promo-feature-pill">
                                    <Building2 size={15} color="#ec268f" />
                                    <span>Assisted Property Visits</span>
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
                                    <Building2 size={16} />
                                    <span>Book Property Visit</span>
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

                        {/* RIGHT: STATS CARD */}
                        <div className="promo-banner-stats-card">
                            <div className="promo-stat-box">
                                <span className="stat-number">10k+</span>
                                <span className="stat-label">Happy Families in Jaipur</span>
                            </div>

                            <div className="promo-stat-divider"></div>

                            <div className="promo-stat-box">
                                <span className="stat-number">0%</span>
                                <span className="stat-label">Brokerage on Owner Deals</span>
                            </div>

                            <div className="promo-stat-divider"></div>

                            <div className="promo-stat-box">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Verified Paperwork Assistance</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
