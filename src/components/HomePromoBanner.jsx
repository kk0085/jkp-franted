import { Link } from "react-router-dom";
import { Sparkles, Building2, ShieldCheck, Zap, Phone, PlusCircle, ArrowRight, Award, Star, CheckCircle2 } from "lucide-react";
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
                                <Sparkles size={13} className="promo-sparkle-icon" />
                                <span>JAIPUR'S TRUSTED PROPERTY NETWORK</span>
                            </div>

                            <h2 className="promo-banner-title">
                                Planning To Buy, Sell Or Rent In <span className="highlight-text">Jaipur</span>?
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
                                    <ShieldCheck size={15} color="#22c55e" />
                                    <span>RERA & JDA Verified Deals</span>
                                </div>
                                <div className="promo-feature-pill">
                                    <Zap size={15} color="#f59e0b" />
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
                                    title="Book Verified Property Visit"
                                >
                                    <Building2 size={16} />
                                    <span>Book Property Visit</span>
                                    <ArrowRight size={15} />
                                </button>

                                <Link to="/post-property" className="promo-btn-secondary" title="Post Property Free in Jaipur">
                                    <PlusCircle size={16} />
                                    <span>Post Property Free</span>
                                </Link>

                                <a href={`tel:${rawPhone}`} className="promo-btn-call" title="Call Jaipur Ki Property">
                                    <Phone size={14} />
                                    <span>Call: {phone}</span>
                                </a>
                            </div>
                        </div>

                        {/* RIGHT: PREMIUM GLASS STATS & TRUST SHOWCASE */}
                        <div className="promo-banner-stats-box">
                            <div className="stats-box-header">
                                <span className="stats-city-tag">
                                    <Star size={12} fill="#ec268f" color="#ec268f" />
                                    <span>Jaipur Verified Platform</span>
                                </span>
                                <h4 className="stats-box-title">Why 10,000+ Trust Us</h4>
                            </div>

                            <div className="stats-box-grid">
                                <div className="stat-box-item">
                                    <span className="stat-number">10k+</span>
                                    <span className="stat-label">Happy Families in Jaipur</span>
                                    <span className="stat-subtag">★ 4.9/5 Rating</span>
                                </div>

                                <div className="stat-box-item">
                                    <span className="stat-number">0%</span>
                                    <span className="stat-label">Brokerage on Owner Deals</span>
                                    <span className="stat-subtag">Direct Connect</span>
                                </div>

                                <div className="stat-box-item stat-box-full">
                                    <span className="stat-number">100%</span>
                                    <span className="stat-label">Verified Paperwork & JDA/RERA Assistance</span>
                                    <span className="stat-subtag">Legal Checked</span>
                                </div>
                            </div>

                            <div className="stats-guarantee-note">
                                <CheckCircle2 size={15} color="#22c55e" />
                                <span>Assisted Property Visits across 15+ Jaipur Zones</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
