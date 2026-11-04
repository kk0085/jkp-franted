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
            <div className="property-card-inner">
                {/* 1. FRONT FACE (0 DEGREE) */}
                <div className="property-card-front">
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
                            {property.category === "rent" && (
                                <span className="per-month"> / month</span>
                            )}
                        </div>

                        <div className="property-actions">
                            <div className="property-actions-left">
                                <button className="enquiry-btn" onClick={handleEnquiryClick}>
                                    Enquiry
                                </button>
                            </div>

                            {/* BOTTOM-RIGHT CORNER OF CARD */}
                            <Link to={`/properties/${property.id}`} className="card-corner-view-btn" title="View Property Details">
                                <span>View Details</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 2. BACK FACE (180 DEGREE FLIP) - Share button + 360° 3D rotating "SHARE" text (Never ulta) */}
                <div className="property-card-back">
                    <div className="card-back-header">
                        <div className="card-back-price">
                            Rs {Number(property.price).toLocaleString("en-IN")}
                            {property.category === "rent" && <small> / month</small>}
                        </div>

                        {/* SHARE BUTTON WITH GAP & 360° 3D ROTATING TEXT (NEVER ULTA) */}
                        <div className="card-back-share-wrap">
                            <button
                                type="button"
                                className={`share-btn-3d ${copied ? "copied" : ""}`}
                                onClick={handleShare}
                                title={copied ? "Copied!" : "Share Property"}
                                aria-label="Share property"
                            >
                                {copied ? <Check size={14} color="#ffffff" /> : <Share2 size={14} />}
                            </button>

                            {/* 360° 3D DOUBLE-SIDED BADGE (NEVER MIRRORED / ULTA) */}
                            <div className="share-360-badge" aria-hidden="true">
                                <div className="share-360-inner">
                                    <span className="share-360-side share-360-front">
                                        {copied ? "Copied!" : "Share"}
                                    </span>
                                    <span className="share-360-side share-360-back">
                                        {copied ? "Copied!" : "Share"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-back-body">
                        <h4 className="card-back-title">{property.title}</h4>
                        <p className="property-location" style={{ marginBottom: "6px" }}>
                            <MapPin size={12} className="location-pin" />
                            <span>{property.location}</span>
                        </p>

                        <div className="card-back-specs">
                            {property.bhk && <span className="spec-pill">{property.bhk}</span>}
                            {property.area && <span className="spec-pill">{property.area}</span>}
                            {property.furnishing && <span className="spec-pill">{property.furnishing}</span>}
                        </div>

                        {property.description && (
                            <p className="card-back-desc">
                                {property.description.slice(0, 110)}...
                            </p>
                        )}
                    </div>

                    <div className="card-back-actions">
                        <button className="card-back-enquiry" onClick={handleEnquiryClick}>
                            Enquiry
                        </button>
                        <Link to={`/properties/${property.id}`} className="card-back-view">
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
