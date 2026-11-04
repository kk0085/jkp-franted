import { Link } from "react-router-dom";
import { Sparkles, Building2, ShieldCheck, Zap, Phone, PlusCircle, ArrowRight, Award, Users, BadgePercent, CheckCircle2 } from "lucide-react";
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

                        {/* RIGHT: 3 DISTINCT PROPER STAT CARDS (10k+, 0%, 100%) */}
                        <div className="promo-stats-showcase">
                            {/* 1. 10k+ HAPPY FAMILIES */}
                            <div className="promo-stat-card stat-card-pink">
                                <div className="stat-card-icon icon-pink">
                                    <Users size={22} />
                                </div>
                                <div className="stat-card-num-box">
                                    <span className="stat-card-number num-pink">10k+</span>
                                </div>
                                <div className="stat-card-content">
                                    <div className="stat-card-title-row">
                                        <h4 className="stat-card-heading">Happy Families</h4>
                                        <span className="stat-chip chip-pink">★ 4.9/5</span>
                                    </div>
                                    <p className="stat-card-sub">Trusted buyers & tenants in Jaipur</p>
                                </div>
                            </div>

                            {/* 2. 0% BROKERAGE */}
                            <div className="promo-stat-card stat-card-green">
                                <div className="stat-card-icon icon-green">
                                    <BadgePercent size={22} />
                                </div>
                                <div className="stat-card-num-box">
                                    <span className="stat-card-number num-green">0%</span>
                                </div>
                                <div className="stat-card-content">
                                    <div className="stat-card-title-row">
                                        <h4 className="stat-card-heading">Brokerage on Deals</h4>
                                        <span className="stat-chip chip-green">Zero Fee</span>
                                    </div>
                                    <p className="stat-card-sub">Direct owner connect, save brokerage</p>
                                </div>
                            </div>

                            {/* 3. 100% VERIFIED PAPERWORK */}
                            <div className="promo-stat-card stat-card-blue">
                                <div className="stat-card-icon icon-blue">
                                    <ShieldCheck size={22} />
                                </div>
                                <div className="stat-card-num-box">
                                    <span className="stat-card-number num-blue">100%</span>
                                </div>
                                <div className="stat-card-content">
                                    <div className="stat-card-title-row">
                                        <h4 className="stat-card-heading">Verified Paperwork</h4>
                                        <span className="stat-chip chip-blue">RERA & JDA</span>
                                    </div>
                                    <p className="stat-card-sub">Assisted legal verification check</p>
                                </div>
                            </div>

                            {/* TRUST FOOTER NOTE */}
                            <div className="promo-stats-bottom-note">
                                <CheckCircle2 size={15} color="#22c55e" />
                                <span>Assisted Property Visits across 15+ Jaipur Localities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
