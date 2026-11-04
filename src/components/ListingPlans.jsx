import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, ShieldCheck, Zap, ArrowRight, Star, Flame, Award } from "lucide-react";
import { useProperty } from "../context/PropertyContext";
import PlanActivationModal from "./PlanActivationModal";

const defaultPlans = [
    {
        id: "basic",
        number: "1.",
        title: "BASIC LISTING",
        price: "FREE",
        tag: null,
        accentColor: "#16a34a",
        text: "One active free property listing per owner at a time, subject to eligibility and verification. Ideal for individual homeowners.",
        features: [
            "1 Active Free Property Listing",
            "30 Days Live Visibility in Jaipur Search",
            "Direct Buyer & Tenant WhatsApp Inquiries",
            "Verified Owner Tag on Property",
        ],
        ctaText: "Post Property Free",
        ctaType: "link",
    },
    {
        id: "credits",
        number: "2.",
        title: "LISTING CREDITS",
        price: "₹499",
        tag: "MOST POPULAR",
        accentColor: "#ea580c",
        text: "Paid credits for additional property listings or renewals beyond the free tier. Best for owners & multiple properties.",
        features: [
            "Up to 3 Additional Property Listings",
            "60 Days Extended Search Validity",
            "Verified Owner Trust Badge 🛡️",
            "3x Higher Search Ranking & Visibility",
            "Direct WhatsApp Leads Forwarding",
        ],
        ctaText: "Choose Plan (₹499)",
        ctaType: "modal",
    },
    {
        id: "sponsored",
        number: "3.",
        title: "SPONSORED / TOP FEED",
        price: "₹1,499",
        tag: "MAXIMUM REACH",
        accentColor: "#1e3a8a",
        text: "Paid promotional placements on website homepage top carousel and official social media handles. Maximum buyer reach.",
        features: [
            "Homepage Top Sticky Carousel (10x Views) 🚀",
            "Official Social Media & WhatsApp Broadcast",
            "Glowing VIP Featured Golden Badge",
            "Dedicated Relationship Manager Assistance",
            "Priority Legal & Registry Document Guidance",
        ],
        ctaText: "Boost to Top Feed 🚀",
        ctaType: "modal",
    },
];

export default function ListingPlans() {
    const { siteSettings } = useProperty();
    const [activePlanModal, setActivePlanModal] = useState(null);

    // Merge custom siteSettings plans if any exist while preserving features and CTA
    const plans = siteSettings?.plans && siteSettings.plans.length > 0
        ? defaultPlans.map((defPlan, idx) => {
            const custom = siteSettings.plans[idx];
            if (!custom) return defPlan;
            return {
                ...defPlan,
                ...custom,
                features: custom.features && custom.features.length > 0 ? custom.features : defPlan.features,
            };
        })
        : defaultPlans;

    return (
        <section className="plans-wrapper container" id="plans">
            <div className="plans-header">
                <span className="plans-eyebrow">
                    <Sparkles size={13} />
                    PROPERTY OWNER & LANDLORD PACKAGES
                </span>
                <h2>Choose The Right Plan To Sell Or Rent Faster</h2>
                <p>Direct inquiries from verified buyers across Jaipur. Zero hidden charges, 100% transparency.</p>
            </div>

            <div className="plans">
                {plans.map((plan, index) => {
                    const isPopular = plan.tag === "MOST POPULAR";
                    const isSponsored = plan.tag === "MAXIMUM REACH";

                    return (
                        <div
                            className={`plan-card plan-${index + 1} ${isPopular ? "plan-card-popular" : ""} ${isSponsored ? "plan-card-sponsored" : ""}`}
                            key={plan.title || index}
                        >
                            {plan.tag && (
                                <div className={`plan-popular-pill ${isSponsored ? "pill-sponsored" : "pill-popular"}`}>
                                    {isSponsored ? <Flame size={12} /> : <Star size={12} />}
                                    <span>{plan.tag}</span>
                                </div>
                            )}

                            <div className="plan-card-top">
                                <h3 className="plan-card-title">
                                    {plan.number} {plan.title}
                                </h3>
                                {plan.price && (
                                    <span className="plan-price-pill">
                                        {plan.price}
                                    </span>
                                )}
                            </div>

                            <p className="plan-card-desc">{plan.text}</p>

                            <ul className="plan-features-list">
                                {plan.features.map((feat, fIdx) => (
                                    <li key={fIdx} className="plan-feature-item">
                                        <div
                                            className="plan-feature-check"
                                            style={{
                                                background: index === 0 ? "#f0fdf4" : index === 1 ? "#fff7ed" : "#eff6ff",
                                                color: plan.accentColor,
                                            }}
                                        >
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* 360 DEGREE ROTATING ACTION BUTTON (TEXT NEVER ULTA) */}
                            <div className="plan-card-action">
                                {plan.ctaType === "link" ? (
                                    <Link to="/post-property" className="plan-card-btn plan-btn-basic">
                                        <div className={`plan-btn-3d-inner anim-delay-${index}`}>
                                            <div className="plan-btn-side plan-btn-front">
                                                <span>{plan.ctaText}</span>
                                                <ArrowRight size={15} />
                                            </div>
                                            <div className="plan-btn-side plan-btn-back">
                                                <span>{plan.ctaText}</span>
                                                <ArrowRight size={15} />
                                            </div>
                                        </div>
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setActivePlanModal(plan)}
                                        className={`plan-card-btn ${index === 1 ? "plan-btn-credits" : "plan-btn-sponsored"}`}
                                    >
                                        <div className={`plan-btn-3d-inner anim-delay-${index}`}>
                                            <div className="plan-btn-side plan-btn-front">
                                                <span>{plan.ctaText}</span>
                                                <Zap size={15} />
                                            </div>
                                            <div className="plan-btn-side plan-btn-back">
                                                <span>{plan.ctaText}</span>
                                                <Zap size={15} />
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* TRUST & BENEFITS STRIP */}
            <div className="plans-trust-strip">
                <div className="plans-trust-item">
                    <div className="plans-trust-icon-box" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <strong>100% Direct Owners</strong>
                        <p>Zero brokerage, genuine direct buyer inquiries</p>
                    </div>
                </div>

                <div className="plans-trust-item">
                    <div className="plans-trust-icon-box" style={{ background: "#fff7ed", color: "#ea580c" }}>
                        <Zap size={22} />
                    </div>
                    <div>
                        <strong>15-Minute Fast Activation</strong>
                        <p>Instant phone verification & live website placement</p>
                    </div>
                </div>

                <div className="plans-trust-item">
                    <div className="plans-trust-icon-box" style={{ background: "#eff6ff", color: "#1e3a8a" }}>
                        <Award size={22} />
                    </div>
                    <div>
                        <strong>Dedicated Landlord Support</strong>
                        <p>24/7 WhatsApp guidance from Jaipur property experts</p>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE ACTIVATION MODAL */}
            {activePlanModal && (
                <PlanActivationModal
                    isOpen={Boolean(activePlanModal)}
                    onClose={() => setActivePlanModal(null)}
                    plan={activePlanModal}
                />
            )}
        </section>
    );
}
