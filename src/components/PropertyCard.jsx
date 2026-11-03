import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Share2, Check } from "lucide-react";

const SECONDARY_IMAGES_MAP = [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80"
];

const getSecondaryImage = (prop) => {
    if (!prop) return SECONDARY_IMAGES_MAP[0];
    if (prop.secondaryImage) return prop.secondaryImage;
    if (prop.gallery && prop.gallery.length > 1) return prop.gallery[1];
    const index = Math.abs((Number(prop.id) || 1) - 1) % SECONDARY_IMAGES_MAP.length;
    return SECONDARY_IMAGES_MAP[index];
};

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

    const secondaryImg = getSecondaryImage(property);

    return (
        <article className="property-card">
            <div className="property-image-link">
                <div className="property-image">
                    <img
                        src={property.image}
                        alt={property.title}
                        loading="lazy"
                        className="prop-card-img prop-img-primary"
                    />
                    <img
                        src={secondaryImg}
                        alt={`${property.title} view 2`}
                        loading="lazy"
                        className="prop-card-img prop-img-secondary"
                    />

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
