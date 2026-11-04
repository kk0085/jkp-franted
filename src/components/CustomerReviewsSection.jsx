import { useState } from "react";
import { Star, CheckCircle2, ShieldCheck, ThumbsUp, Quote, Award, Sparkles } from "lucide-react";

const allReviews = [
    {
        id: 1,
        name: "Rahul Sharma",
        location: "Mansarovar, Jaipur",
        category: "flat",
        role: "Verified Tenant • 3 BHK Flat",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        date: "3 days ago",
        title: "Saved ₹22,000 Brokerage & Moved in within 24 Hours!",
        comment:
            "Found a 3 BHK semi-furnished flat near City Park within 24 hours. The direct owner contact without any brokers saved me over ₹22,000 in brokerage. The free cab visit was a huge plus!",
        verifiedBadge: "Verified Tenant",
    },
    {
        id: 2,
        name: "Dr. Preeti Meena",
        location: "Jagatpura, Jaipur",
        category: "villa",
        role: "Home Buyer • Luxury Villa",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        date: "1 week ago",
        title: "100% JDA Verified & Free Cab Site Visit!",
        comment:
            "Booked a free site visit cab through their banner. The villa was 100% JDA approved and legal document verification was handled smoothly. Jaipur Ki Property made buying our dream home stress-free!",
        verifiedBadge: "Verified Buyer",
    },
    {
        id: 3,
        name: "Vikram Singh Rathore",
        location: "Vaishali Nagar, Jaipur",
        category: "owner",
        role: "Property Landlord • 3 BHK Flat",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        date: "2 weeks ago",
        title: "Zero Brokerage & Rented Out to a Bank Manager in 3 Days!",
        comment:
            "Listed my property for free and received calls from genuine families within 48 hours. Agreement was done smoothly. Highly recommended for all Jaipur landlords who want zero broker hassle.",
        verifiedBadge: "Verified Landlord",
    },
    {
        id: 4,
        name: "Ananya Joshi",
        location: "Malviya Nagar, Jaipur",
        category: "flat",
        role: "Working Professional • 2 BHK Apartment",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        date: "2 weeks ago",
        title: "Real Photos, No Fake Listings near WTP Mall",
        comment:
            "Super convenient for professionals moving to Jaipur. Near WTP Mall, clean societies, and exact same photos as shown on the website. Zero hidden charges and friendly support team!",
        verifiedBadge: "Verified Tenant",
    },
    {
        id: 5,
        name: "Harish Khandelwal",
        location: "Ajmer Road, Jaipur",
        category: "villa",
        role: "Property Investor • Gated Township",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        date: "3 weeks ago",
        title: "Best Guidance for High-Growth Jaipur Corridors",
        comment:
            "Best portal for property investment in Jaipur. Clear guidance on Mahindra SEZ corridor and upcoming township projects. Saved a lot of time visiting multiple sites.",
        verifiedBadge: "Verified Investor",
    },
    {
        id: 6,
        name: "Sunita & Rajesh Agarwal",
        location: "Tonk Road, Jaipur",
        category: "owner",
        role: "Family Residence • Independent Duplex",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        rating: 5,
        date: "1 month ago",
        title: "Peaceful Neighborhood & Direct Owner Deal",
        comment:
            "We were looking for a peaceful family house with car parking. Found the perfect deal on Tonk Road with direct landlord contact. Excellent customer care and transparent paperwork!",
        verifiedBadge: "Verified Buyer",
    },
];

export default function CustomerReviewsSection() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredReviews =
        selectedCategory === "all"
            ? allReviews
            : allReviews.filter((r) => r.category === selectedCategory);

    return (
        <section className="customer-reviews-section" id="customer-reviews" aria-label="Customer Reviews and Star Ratings">
            <div className="container">
                {/* SECTION HEADER */}
                <div className="reviews-header">
                    <div className="reviews-badge">
                        <Sparkles size={14} color="#f59e0b" />
                        <span>⭐ 4.9 / 5.0 Star Rated on Google & Trustpilot</span>
                    </div>

                    <h2 className="reviews-main-title">
                        Jaipur Ke Happy Customers Ka <span className="highlight-gold">Asli Bharosa</span>
                    </h2>

                    <p className="reviews-subtitle">
                        Over 10,000+ families and property owners trust Jaipur Ki Property for zero brokerage deals, free site visits and verified paperwork across Jaipur.
                    </p>
                </div>

                {/* TRUST SCORECARD STATS ROW */}
                <div className="reviews-scorecard-grid">
                    <div className="scorecard-item">
                        <div className="scorecard-big-num">
                            <span>4.9</span>
                            <div className="scorecard-stars-row">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                                ))}
                            </div>
                        </div>
                        <div className="scorecard-label">Over 1,280+ Verified Ratings</div>
                        <div className="scorecard-sub">Jaipur's Top Rated Property Portal</div>
                    </div>

                    <div className="scorecard-item">
                        <div className="scorecard-big-num">
                            <span className="gold-text">₹2.8 Cr+</span>
                        </div>
                        <div className="scorecard-label">Brokerage Saved in Jaipur</div>
                        <div className="scorecard-sub">Zero commission directly to owners</div>
                    </div>

                    <div className="scorecard-item">
                        <div className="scorecard-big-num">
                            <span className="green-text">&lt; 48 Hrs</span>
                        </div>
                        <div className="scorecard-label">Fastest Turnaround</div>
                        <div className="scorecard-sub">Average time to find tenant or home</div>
                    </div>
                </div>

                {/* CATEGORY FILTER TABS */}
                <div className="reviews-category-tabs">
                    <button
                        type="button"
                        className={`review-tab-btn ${selectedCategory === "all" ? "active" : ""}`}
                        onClick={() => setSelectedCategory("all")}
                    >
                        All Stories (6)
                    </button>
                    <button
                        type="button"
                        className={`review-tab-btn ${selectedCategory === "flat" ? "active" : ""}`}
                        onClick={() => setSelectedCategory("flat")}
                    >
                        Flat Rentals (2)
                    </button>
                    <button
                        type="button"
                        className={`review-tab-btn ${selectedCategory === "villa" ? "active" : ""}`}
                        onClick={() => setSelectedCategory("villa")}
                    >
                        Villas & Houses (2)
                    </button>
                    <button
                        type="button"
                        className={`review-tab-btn ${selectedCategory === "owner" ? "active" : ""}`}
                        onClick={() => setSelectedCategory("owner")}
                    >
                        Property Owners (2)
                    </button>
                </div>

                {/* REVIEWS CARDS GRID */}
                <div className="reviews-cards-grid">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="customer-review-card">
                            {/* TOP ROW: STARS & VERIFIED TICK */}
                            <div className="review-card-top">
                                <div className="review-stars-wrap">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                                    ))}
                                    <span className="review-rating-val">{review.rating}.0</span>
                                </div>
                                <span className="review-verified-pill">
                                    <CheckCircle2 size={13} color="#15803d" />
                                    <span>{review.verifiedBadge}</span>
                                </span>
                            </div>

                            {/* REVIEW TITLE & COMMENT */}
                            <h4 className="review-title">"{review.title}"</h4>
                            <p className="review-comment">{review.comment}</p>

                            {/* REVIEWER PROFILE FOOTER */}
                            <div className="review-author-footer">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="review-avatar"
                                    loading="lazy"
                                />
                                <div className="review-author-info">
                                    <h5 className="review-author-name">{review.name}</h5>
                                    <p className="review-author-role">{review.role}</p>
                                    <span className="review-loc-date">{review.location} • {review.date}</span>
                                </div>
                                <Quote size={24} className="review-quote-watermark" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOTTOM TRUST GUARANTEES BAR */}
                <div className="reviews-trust-guarantees-bar">
                    <div className="guarantee-pill">
                        <ShieldCheck size={16} color="#15803d" />
                        <span>100% RERA & JDA Verified Deals</span>
                    </div>
                    <div className="guarantee-pill">
                        <Award size={16} color="#f59e0b" />
                        <span>Zero Brokerage Guaranteed</span>
                    </div>
                    <div className="guarantee-pill">
                        <ThumbsUp size={16} color="#ec268f" />
                        <span>Free Cab for Property Site Visits</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
