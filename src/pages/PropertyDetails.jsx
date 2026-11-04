import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, MessageCircle, ShieldCheck, Check, ArrowLeft } from "lucide-react";
import { useProperty } from "../context/PropertyContext";
import { propertiesData } from "../data/propertiesData";
import PropertyCard from "../components/PropertyCard";
import EnquiryModal from "../components/EnquiryModal";

export default function PropertyDetails() {
    const { id } = useParams();
    const { properties, siteSettings } = useProperty();
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

    // Scroll to the very top as soon as details page opens or ID changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const allProps = properties && properties.length > 0 ? properties : propertiesData;
    const property =
        allProps.find((p) => p.id === Number(id)) || allProps[0];

    const relatedProperties = allProps
        .filter((p) => p.id !== property.id && (p.type === property.type || p.location.includes(property.location.split(",")[0])))
        .slice(0, 4);

    const contactPhone = property.ownerPhone || siteSettings?.phone || "+91 70230 77367";
    const rawPhone = siteSettings?.rawPhone || contactPhone.replace(/\D/g, "");
    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    const whatsappMessage = encodeURIComponent(
        `Hello Jaipur Ki Property! I am interested in "${property.title}" in ${property.location} (Rent: Rs ${property.price?.toLocaleString("en-IN")}/month). Please connect me with the owner.`
    );
    const whatsappUrl = `https://wa.me/${waNumber}?text=${whatsappMessage}`;

    return (
        <div className="page container">
            <Link to="/properties" className="back-link">
                <ArrowLeft size={16} /> Back to all listings
            </Link>

            <div className="details-grid">
                <div className="details-image-container">
                    <img
                        className="details-image"
                        src={property.image}
                        alt={property.title}
                    />
                    <span className="details-badge">{property.badge}</span>
                </div>

                <div className="details-content">
                    <div className="verified-tag">
                        <ShieldCheck size={16} />
                        <span>Verified Property Listing</span>
                    </div>

                    <h1>{property.title}</h1>

                    <p className="property-location-detail">
                        <MapPin size={16} className="loc-icon" />
                        <span>{property.location}</span>
                    </p>

                    <div className="details-price-box">
                        <h2>Rs {Number(property.price).toLocaleString("en-IN")}</h2>
                        {property.category === "rent" && (
                            <span className="per-month-tag">/ month</span>
                        )}
                    </div>

                    <div className="details-features">
                        <span>{property.bhk}</span>
                        <span>{property.bathrooms} Bathrooms</span>
                        <span>{property.area}</span>
                        <span>{property.furnishing}</span>
                    </div>

                    <div className="details-desc-box">
                        <h3>About this property</h3>
                        <p>{property.description}</p>
                    </div>

                    <div className="details-amenities">
                        <h3>Key Amenities & Highlights</h3>
                        <ul>
                            {property.features.map((feat, index) => (
                                <li key={index}>
                                    <Check size={14} className="check-icon" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="details-actions">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="details-wa-btn"
                        >
                            <MessageCircle size={17} />
                            <span>WhatsApp Owner</span>
                        </a>

                        <a href={`tel:${rawPhone}`} className="details-call-btn">
                            <Phone size={16} />
                            <span>Call Owner</span>
                        </a>

                        <button
                            className="details-enquiry-btn"
                            onClick={() => setIsEnquiryOpen(true)}
                        >
                            Quick Enquiry
                        </button>


                    </div>
                </div>
            </div>

            {/* SIMILAR PROPERTIES */}
            {relatedProperties.length > 0 && (
                <div className="similar-section">
                    <h2>Similar Properties in Jaipur</h2>
                    <div className="property-grid">
                        {relatedProperties.map((p) => (
                            <PropertyCard key={p.id} property={p} />
                        ))}
                    </div>
                </div>
            )}

            {/* ENQUIRY MODAL */}
            {isEnquiryOpen && (
                <EnquiryModal
                    property={property}
                    onClose={() => setIsEnquiryOpen(false)}
                />
            )}
        </div>
    );
}
