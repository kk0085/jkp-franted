import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProperty } from "../context/PropertyContext";
import {
    LogOut,
    User,
    ShieldCheck,
    MapPin,
    Building2,
    MessageSquare,
    Eye,
    PlusCircle,
    ExternalLink,
    Trash2,
    Phone,
    Calendar,
    HelpCircle,
    Sparkles,
} from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout, properties, deleteProperty, openLoginModal, siteSettings } = useProperty();
    const [activeTab, setActiveTab] = useState("properties"); // "properties" | "enquiries" | "support"

    const phone = siteSettings?.phone || "+91 70230 77367";
    const rawPhone = siteSettings?.rawPhone || phone.replace(/\D/g, "");
    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    if (!user) {
        return (
            <div className="page container" style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ maxWidth: "440px", margin: "0 auto", background: "#fff", padding: "40px 28px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fdf2f8", color: "#ec268f", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <User size={32} />
                    </div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Please Login to View Profile</h2>
                    <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: 1.5 }}>
                        Login to manage your property listings, track views, and view buyer inquiries.
                    </p>
                    <button
                        type="button"
                        className="primary-btn"
                        onClick={openLoginModal}
                        style={{ width: "100%", justifyContent: "center", height: "48px", borderRadius: "9999px", fontSize: "15px", fontWeight: 700 }}
                    >
                        Login with Gmail OTP
                    </button>
                </div>
            </div>
        );
    }

    // User's posted properties
    const userProperties = properties.filter((p) => p.id > 100 || p.ownerEmail === user.email);
    const displayProperties = userProperties.length > 0 ? userProperties : properties.slice(0, 3);

    // Sample inquiries
    const enquiries = [
        {
            id: 1,
            buyerName: "Amit Sharma",
            buyerPhone: "+91 98290 12345",
            propertyTitle: displayProperties[0]?.title || "2 BHK Flat in Mansarovar",
            date: "Today, 11:30 AM",
            message: "Namaste, I am interested in visiting this property tomorrow evening. Please share the exact location.",
        },
        {
            id: 2,
            buyerName: "Pooja Verma",
            buyerPhone: "+91 94140 67890",
            propertyTitle: displayProperties[1]?.title || "3 BHK Luxury Villa in Jagatpura",
            date: "Yesterday, 4:15 PM",
            message: "Is the price slightly negotiable for immediate booking?",
        },
    ];

    // Extract Gmail initial logo (e.g. 'K' for kkbagda73@gmail.com)
    const gmailInitial = user?.email
        ? user.email.trim().charAt(0).toUpperCase()
        : user?.name
        ? user.name.trim().charAt(0).toUpperCase()
        : "K";

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="profile-dashboard">
            {/* TOP PROFILE HEADER CARD (LOGO ICON INSTEAD OF GMAIL ID) */}
            <div className="profile-header-card">
                <div className="profile-user-left">
                    <div className="profile-avatar-large" title="Verified Gmail Owner">
                        <span>{gmailInitial}</span>
                        <span className="profile-avatar-badge" title="Verified Gmail Account">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                        </span>
                    </div>

                    <div className="profile-user-meta">
                        <h1>
                            <span>Verified Property Owner</span>
                            <span className="profile-verified-chip">
                                <ShieldCheck size={13} /> Verified
                            </span>
                        </h1>

                        <div className="profile-detail-line">
                            <div className="profile-detail-item">
                                <Building2 size={14} color="#ec268f" />
                                <span>Jaipur Ki Property Member</span>
                            </div>
                            <div className="profile-detail-item">
                                <MapPin size={14} color="#64748b" />
                                <span>Jaipur, Rajasthan</span>
                            </div>
                            <div className="profile-detail-item">
                                <Sparkles size={14} color="#eab308" />
                                <span>100% ID Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-actions-right">
                    <Link to="/post-property" className="profile-post-btn">
                        <PlusCircle size={16} />
                        <span>Post Property (FREE)</span>
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="profile-logout-btn"
                        title="Logout from account"
                    >
                        <LogOut size={15} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* DASHBOARD STATS GRID */}
            <div className="profile-stats-grid">
                <div className="profile-stat-box">
                    <div className="profile-stat-icon-wrap" style={{ background: "#fdf2f8", color: "#ec268f" }}>
                        <Building2 size={24} />
                    </div>
                    <div>
                        <div className="profile-stat-number">{displayProperties.length}</div>
                        <div className="profile-stat-label">Listed Properties</div>
                    </div>
                </div>

                <div className="profile-stat-box">
                    <div className="profile-stat-icon-wrap" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <div className="profile-stat-number">12</div>
                        <div className="profile-stat-label">Buyer Enquiries</div>
                    </div>
                </div>

                <div className="profile-stat-box">
                    <div className="profile-stat-icon-wrap" style={{ background: "#eff6ff", color: "#2563eb" }}>
                        <Eye size={24} />
                    </div>
                    <div>
                        <div className="profile-stat-number">340+</div>
                        <div className="profile-stat-label">Property Views</div>
                    </div>
                </div>

                <div className="profile-stat-box">
                    <div className="profile-stat-icon-wrap" style={{ background: "#faf5ff", color: "#9333ea" }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <div className="profile-stat-number">100%</div>
                        <div className="profile-stat-label">Verified Account</div>
                    </div>
                </div>
            </div>

            {/* DASHBOARD TABS */}
            <div className="profile-tabs-bar">
                <button
                    type="button"
                    onClick={() => setActiveTab("properties")}
                    className={`profile-tab-item ${activeTab === "properties" ? "active" : ""}`}
                >
                    <Building2 size={16} />
                    <span>My Properties ({displayProperties.length})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("enquiries")}
                    className={`profile-tab-item ${activeTab === "enquiries" ? "active" : ""}`}
                >
                    <MessageSquare size={16} />
                    <span>Buyer Leads / Inquiries (12)</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("support")}
                    className={`profile-tab-item ${activeTab === "support" ? "active" : ""}`}
                >
                    <HelpCircle size={16} />
                    <span>Owner Helpline & Support</span>
                </button>
            </div>

            {/* TAB 1: MY PROPERTIES */}
            {activeTab === "properties" && (
                <div>
                    {displayProperties.length === 0 ? (
                        <div className="profile-empty-state-box">
                            <div className="profile-empty-icon">
                                <Building2 size={32} />
                            </div>
                            <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px", color: "#0f172a" }}>
                                No Properties Listed Yet
                            </h3>
                            <p style={{ color: "#64748b", fontSize: "13.5px", margin: "0 0 20px" }}>
                                Post your first Jaipur property listing for free and start getting buyer inquiries immediately.
                            </p>
                            <Link to="/post-property" className="profile-post-btn">
                                <PlusCircle size={16} /> Post Free Property
                            </Link>
                        </div>
                    ) : (
                        <div className="profile-listings-row">
                            {displayProperties.map((prop) => (
                                <div key={prop.id} className="profile-property-card-item">
                                    <div className="profile-card-img-wrap">
                                        <img src={prop.image} alt={prop.title} className="profile-card-img" />
                                        <span className="profile-badge-overlay">{prop.badge || "Verified"}</span>
                                        <span className="profile-status-overlay">Active</span>
                                    </div>

                                    <div className="profile-card-body">
                                        <h3 className="profile-card-title">{prop.title}</h3>
                                        <div className="profile-card-location">
                                            <MapPin size={13} color="#ec268f" />
                                            <span>{prop.location}</span>
                                        </div>

                                        <div className="profile-card-price">
                                            ₹{prop.price?.toLocaleString("en-IN")}
                                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
                                                {prop.category === "rent" ? " / month" : ""}
                                            </span>
                                        </div>

                                        <div className="profile-card-footer">
                                            <Link
                                                to={`/properties/${prop.id}`}
                                                className="card-corner-view-btn"
                                                title="View Property Details"
                                            >
                                                <span>View Details</span>
                                            </Link>

                                            {prop.id > 100 && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteProperty(prop.id)}
                                                    style={{
                                                        background: "none",
                                                        border: "none",
                                                        color: "#ef4444",
                                                        cursor: "pointer",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    <Trash2 size={13} /> Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: BUYER ENQUIRIES */}
            {activeTab === "enquiries" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {enquiries.map((enq) => (
                        <div
                            key={enq.id}
                            style={{
                                background: "#ffffff",
                                borderRadius: "16px",
                                padding: "20px 24px",
                                border: "1px solid #f1f5f9",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                gap: "16px",
                            }}
                        >
                            <div style={{ maxWidth: "600px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                                        {enq.buyerName}
                                    </h4>
                                    <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Calendar size={12} /> {enq.date}
                                    </span>
                                </div>

                                <div style={{ fontSize: "13px", color: "#ec268f", fontWeight: 600, marginBottom: "8px" }}>
                                    Property: {enq.propertyTitle}
                                </div>

                                <p style={{ margin: 0, fontSize: "13.5px", color: "#475569", lineHeight: 1.5 }}>
                                    &ldquo;{enq.message}&rdquo;
                                </p>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <a
                                    href={`tel:${enq.buyerPhone.replace(/\s+/g, "")}`}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        background: "#f1f5f9",
                                        color: "#334155",
                                        padding: "8px 14px",
                                        borderRadius: "9999px",
                                        fontSize: "12.5px",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                    }}
                                >
                                    <Phone size={13} /> Call
                                </a>

                                <a
                                    href={`https://wa.me/${enq.buyerPhone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(enq.buyerName)},%20thank%20you%20for%20your%20inquiry%20on%20Jaipur%20Ki%20Property.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        background: "#22c55e",
                                        color: "#ffffff",
                                        padding: "8px 16px",
                                        borderRadius: "9999px",
                                        fontSize: "12.5px",
                                        fontWeight: 700,
                                        textDecoration: "none",
                                    }}
                                >
                                    <span>WhatsApp Reply</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TAB 3: HELPLINE & SUPPORT */}
            {activeTab === "support" && (
                <div style={{ background: "#ffffff", borderRadius: "20px", padding: "32px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", maxWidth: "680px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#fdf2f8", color: "#ec268f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 800, color: "#0f172a" }}>Jaipur Ki Property Owner Helpline</h3>
                            <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "13px" }}>24/7 dedicated assistance for verified property owners</p>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Phone size={18} color="#ec268f" />
                                <div>
                                    <div style={{ fontSize: "12px", color: "#64748b" }}>Helpline & Call Support</div>
                                    <strong style={{ fontSize: "14.5px", color: "#0f172a" }}>{phone}</strong>
                                </div>
                            </div>
                            <a
                                href={`tel:${rawPhone}`}
                                style={{ background: "#ec268f", color: "#fff", padding: "7px 16px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}
                            >
                                Call Now
                            </a>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: "12px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <MessageSquare size={18} color="#16a34a" />
                                <div>
                                    <div style={{ fontSize: "12px", color: "#15803d" }}>Instant WhatsApp Support</div>
                                    <strong style={{ fontSize: "14.5px", color: "#166534" }}>{phone}</strong>
                                </div>
                            </div>
                            <a
                                href={`https://wa.me/${waNumber}?text=Namaste%20Jaipur%20Ki%20Property,%20I%20need%20help%20with%20my%20property%20listing.`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ background: "#22c55e", color: "#fff", padding: "7px 16px", borderRadius: "9999px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}
                            >
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
