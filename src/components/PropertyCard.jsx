import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Share2, Check } from "lucide-react";

export default function PropertyCard({ property, onEnquiry }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}/properties/${property.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.title,
                    text: `${property.title} in ${property.location} (Rs ${property.price}/month) - Jaipur Ki Property`,
                    url,
                });
                return;
            } catch {
                // fall through to clipboard copy
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            alert(`Property Link: ${url}`);
        }
    };

    const handleEnquiryClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEnquiry) {
            onEnquiry(property);
        }
    };

    return (
        <article className="property-card">
            <div className="property-image-link">
                <div className="property-image">
                    <img src={property.image} alt={property.title} loading="lazy" />

                    <span className="property-badge">
                        {property.badge}
                    </span>
                </div>
            </div>

            <div className="property-info">
                <h4 className="property-card-title">{property.title}</h4>

                <p className="property-location">
                    <MapPin size={12} className="location-pin" />
                    <span>{property.location}</span>
                </p>

                <div className="property-price">
                    Rs {Number(property.price).toLocaleString("en-IN")}
                    <span className="per-month"> / month</span>
                </div>

                <div className="property-actions">
                    <div className="property-actions-left">
                        <button className="enquiry-btn" onClick={handleEnquiryClick}>
                            Enquiry
                        </button>

                        <button
                            className={`share-btn ${copied ? "copied" : ""}`}
                            onClick={handleShare}
                            title={copied ? "Copied!" : "Share Property"}
                            aria-label="Share property"
                        >
                            {copied ? <Check size={13} color="#15803d" /> : <Share2 size={13} />}
                        </button>
                    </div>

                    {/* BOTTOM-RIGHT CORNER OF CARD */}
                    <Link to={`/properties/${property.id}`} className="card-corner-view-btn" title="View Property Details">
                        <span>View Details</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}
