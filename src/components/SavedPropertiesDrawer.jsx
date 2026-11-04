import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, X, Trash2, MessageCircle, MapPin, ExternalLink, ArrowRight, Sparkles } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function SavedPropertiesDrawer() {
    const {
        isSavedDrawerOpen,
        closeSavedDrawer,
        savedProperties,
        toggleSaveProperty,
        clearSavedProperties,
        openEnquiry,
        siteSettings,
    } = useProperty();

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isSavedDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSavedDrawerOpen]);

    if (!isSavedDrawerOpen) return null;

    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    // Generate WhatsApp text with all shortlisted properties
    const generateWhatsAppUrl = () => {
        if (!savedProperties || savedProperties.length === 0) return "#";
        const propListText = savedProperties
            .map(
                (p, idx) =>
                    `${idx + 1}. *${p.title}* (${p.location}) - Rs ${Number(p.price).toLocaleString("en-IN")}${p.category === "rent" ? "/mo" : ""}`
            )
            .join("\n");

        const msg = encodeURIComponent(
            `Hello Jaipur Ki Property! I have shortlisted these *${savedProperties.length} properties* from your website:\n\n${propListText}\n\nPlease share further details and arrange site visit!`
        );
        return `https://wa.me/${waNumber}?text=${msg}`;
    };

    return (
        <div className="saved-drawer-overlay" onClick={closeSavedDrawer} aria-modal="true" role="dialog">
            <aside
                className="saved-drawer-content"
                onClick={(e) => e.stopPropagation()}
                aria-label="Shortlisted properties drawer"
            >
                {/* DRAWER HEADER */}
                <div className="saved-drawer-header">
                    <div className="saved-header-left">
                        <div className="saved-heart-icon-box">
                            <Heart size={20} fill="#ec268f" color="#ec268f" />
                        </div>
                        <div>
                            <h3 className="saved-drawer-title">Shortlisted Homes</h3>
                            <span className="saved-drawer-subtitle">
                                {savedProperties.length} {savedProperties.length === 1 ? "Property" : "Properties"} Saved
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="saved-drawer-close-btn"
                        onClick={closeSavedDrawer}
                        aria-label="Close drawer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* DRAWER BODY */}
                <div className="saved-drawer-body">
                    {savedProperties.length === 0 ? (
                        <div className="saved-empty-state">
                            <div className="saved-empty-icon-box">
                                <Heart size={36} color="#cbd5e1" />
                            </div>
                            <h4>Your Shortlist is Empty</h4>
                            <p>
                                Tap the heart ❤️ icon on any property card to save your favorite flats, villas, or offices here!
                            </p>
                            <Link
                                to="/properties"
                                className="saved-explore-btn"
                                onClick={closeSavedDrawer}
                            >
                                <span>Browse Jaipur Properties</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="saved-items-list">
                            {savedProperties.map((prop) => (
                                <article key={prop.id} className="saved-item-card">
                                    <div className="saved-item-thumb">
                                        <img src={prop.image} alt={prop.title} loading="lazy" />
                                        {prop.badge && <span className="saved-item-badge">{prop.badge}</span>}
                                    </div>

                                    <div className="saved-item-info">
                                        <h4 className="saved-item-title">{prop.title}</h4>
                                        <p className="saved-item-loc">
                                            <MapPin size={12} color="#ec268f" />
                                            <span>{prop.location}</span>
                                        </p>
                                        <div className="saved-item-price">
                                            Rs {Number(prop.price).toLocaleString("en-IN")}
                                            {prop.category === "rent" && <small> / mo</small>}
                                        </div>

                                        <div className="saved-item-actions">
                                            <button
                                                type="button"
                                                className="saved-item-enquiry-btn"
                                                onClick={() => {
                                                    closeSavedDrawer();
                                                    openEnquiry(prop);
                                                }}
                                            >
                                                Enquiry
                                            </button>

                                            <Link
                                                to={`/properties/${prop.id}`}
                                                className="saved-item-view-btn"
                                                onClick={closeSavedDrawer}
                                            >
                                                <span>View</span>
                                                <ExternalLink size={12} />
                                            </Link>

                                            <button
                                                type="button"
                                                className="saved-item-remove-btn"
                                                onClick={() => toggleSaveProperty(prop.id)}
                                                title="Remove from shortlist"
                                                aria-label="Remove property"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                {/* DRAWER FOOTER (ACTIONS) */}
                {savedProperties.length > 0 && (
                    <div className="saved-drawer-footer">
                        <a
                            href={generateWhatsAppUrl()}
                            target="_blank"
                            rel="noreferrer"
                            className="saved-wa-all-btn"
                        >
                            <MessageCircle size={18} />
                            <span>WhatsApp All ({savedProperties.length}) Properties</span>
                        </a>

                        <div className="saved-footer-subactions">
                            <button
                                type="button"
                                className="saved-clear-all-btn"
                                onClick={clearSavedProperties}
                            >
                                Clear Shortlist
                            </button>
                            <span className="saved-footer-hint">
                                <Sparkles size={13} color="#ec268f" /> 100% Free Consultation
                            </span>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
}
