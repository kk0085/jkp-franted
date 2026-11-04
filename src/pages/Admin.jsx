import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProperty } from "../context/PropertyContext";
import {
    LayoutDashboard,
    Building2,
    Users,
    PhoneCall,
    Image as ImageIcon,
    CreditCard,
    Settings,
    Search,
    PlusCircle,
    Edit3,
    Trash2,
    ExternalLink,
    Eye,
    LogOut,
    MapPin,
    Save,
    RotateCcw,
    Lock,
    Unlock,
    ShieldCheck,
    ShieldAlert,
    CheckCircle2,
    MessageCircle,
    Check,
    X,
    ChevronRight,
    TrendingUp,
    Grid,
    List,
    Download,
    Phone,
    Mail,
    Clock,
    Sparkles,
    Calendar,
    ArrowUpRight,
    Menu,
    Sliders,
    Filter,
    Home,
} from "lucide-react";

// Curated high-resolution Jaipur real-estate photo presets
const IMAGE_PRESETS = [
    { label: "Modern Luxury Villa", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80" },
    { label: "Independent House with Lawn", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&auto=format&fit=crop&q=80" },
    { label: "Luxury High-Rise Apartment", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop&q=80" },
    { label: "Contemporary Interior Flat", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&auto=format&fit=crop&q=80" },
    { label: "Commercial Corporate Office", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80" },
    { label: "Premium Duplex Villa", url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&auto=format&fit=crop&q=80" },
];

export default function Admin() {
    const navigate = useNavigate();
    const {
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        resetPropertiesToDefault,
        siteSettings,
        updateSiteSettings,
        buyerLeads,
        addBuyerLead,
        deleteBuyerLead,
        updateBuyerLeadStatus,
        user,
    } = useProperty();

    // STRICT ADMIN PERMISSIONS CHECK:
    // Auto-authorize if user is logged in as kkbagda73@gmail.com or previously verified
    const [isAdminAuthorized, setIsAdminAuthorized] = useState(() => {
        if (typeof window !== "undefined") {
            const savedAuth = localStorage.getItem("jkp_admin_authorized");
            if (savedAuth === "true") return true;
            try {
                const savedUser = localStorage.getItem("jkp_user");
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    if (parsed?.email?.trim().toLowerCase() === "kkbagda73@gmail.com") {
                        return true;
                    }
                }
            } catch {}
        }
        return false;
    });

    const [adminEmailInput, setAdminEmailInput] = useState(() => user?.email || "kkbagda73@gmail.com");
    const [passkeyInput, setPasskeyInput] = useState("");
    const [permissionError, setPermissionError] = useState("");

    // Active Admin Navigation Tab
    const [activeTab, setActiveTab] = useState("dashboard");

    // Responsive Mobile Drawer Toggle
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // View Mode for Properties: "table" | "grid"
    const [propertyViewMode, setPropertyViewMode] = useState("table");

    // Filter & Search
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [bhkFilter, setBhkFilter] = useState("all");
    const [leadStatusFilter, setLeadStatusFilter] = useState("all");

    // Toast Notification
    const [toastMessage, setToastMessage] = useState("");
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(""), 3500);
    };

    // Live Clock
    const [currentTime, setCurrentTime] = useState("");
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) +
                    " • " +
                    now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
            );
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // -------------------------------------------------------------
    // PROPERTY EDIT / ADD MODAL STATE
    // -------------------------------------------------------------
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPropertyId, setEditingPropertyId] = useState(null);

    const initialForm = {
        title: "",
        location: "Mansarovar, Jaipur",
        price: "",
        category: "rent",
        type: "flat",
        bhk: "2 BHK",
        bathrooms: 2,
        area: "1250 sq.ft.",
        furnishing: "Semi-Furnished",
        image: IMAGE_PRESETS[0].url,
        badge: "Verified",
        ownerName: "Verified Owner",
        ownerPhone: siteSettings?.phone || "+91 70230 77367",
        description: "Spacious, well-ventilated property in prime Jaipur locality with 24/7 security and parking.",
    };
    const [formData, setFormData] = useState(initialForm);

    // Quick inline price editor
    const [quickEditId, setQuickEditId] = useState(null);
    const [quickPriceVal, setQuickPriceVal] = useState("");

    // -------------------------------------------------------------
    // CONTACT & HELPLINE SETTINGS STATE
    // -------------------------------------------------------------
    const [contactForm, setContactForm] = useState({
        phone: siteSettings?.phone || "+91 70230 77367",
        whatsappNumber: siteSettings?.whatsappNumber || "917023077367",
        email: siteSettings?.email || "support@jaipurkiproperty.com",
        address: siteSettings?.address || "Jaipur, Rajasthan, IN",
    });


    // -------------------------------------------------------------
    // HERO SLIDES STATE
    // -------------------------------------------------------------
    const [heroSlides, setHeroSlides] = useState(() => {
        return siteSettings?.heroSlides && siteSettings.heroSlides.length > 0
            ? siteSettings.heroSlides
            : [
                  {
                      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80",
                      title: "Find Your Best Home & Villa in Jaipur",
                      description: "Explore verified residential plots, luxury villas, and rental apartments across Jaipur",
                  },
                  {
                      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80",
                      title: "Modern 2 & 3 BHK Flats For Rent",
                      description: "Furnished and semi-furnished apartments in Mansarovar, Malviya Nagar & Vaishali Nagar",
                  },
                  {
                      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&auto=format&fit=crop&q=80",
                      title: "Spacious Independent Houses & Duplexes",
                      description: "Private family residences with personal car parking, open terraces, and quiet neighborhoods",
                  },
              ];
    });

    // -------------------------------------------------------------
    // OWNER PLANS STATE
    // -------------------------------------------------------------
    const [plansList, setPlansList] = useState(() => {
        return siteSettings?.plans && siteSettings.plans.length > 0
            ? siteSettings.plans
            : [
                  {
                      number: "1.",
                      title: "BASIC LISTING",
                      price: "FREE",
                      text: "One active free property listing per owner at a time, subject to eligibility and verification. Define expiry and renewal rules.",
                  },
                  {
                      number: "2.",
                      title: "LISTING CREDITS",
                      price: "₹499",
                      text: "Paid credits for additional property listings or renewals beyond the included free listing.",
                  },
                  {
                      number: "3.",
                      title: "SPONSORED / TOP FEED",
                      price: "₹1,499",
                      text: "Paid promotional placements on the website and official social media handles. Maximum buyer reach.",
                  },
              ];
    });

    // STRICT PERMISSION VERIFICATION
    const handleAdminLogin = (e) => {
        e.preventDefault();
        setPermissionError("");
        const cleanEmail = adminEmailInput.trim().toLowerCase();
        const cleanKey = passkeyInput.trim();

        const isAuthorizedEmail =
            cleanEmail === "kkbagda73@gmail.com" ||
            cleanEmail === "admin@jaipurkiproperty.com" ||
            cleanEmail === "admin";

        const isValidPasskey =
            cleanKey === "1234" ||
            cleanKey === "admin123" ||
            cleanKey === "7023077367";

        if (!isAuthorizedEmail || !isValidPasskey) {
            setPermissionError(
                "Access Denied: Only authorized platform owners (kkbagda73@gmail.com) have permission to enter this console."
            );
            return;
        }

        setIsAdminAuthorized(true);
        localStorage.setItem("jkp_admin_authorized", "true");
        setPermissionError("");
    };

    const handleAdminLogout = () => {
        setIsAdminAuthorized(false);
        localStorage.removeItem("jkp_admin_authorized");
        setPasskeyInput("");
    };

    // Open Add Modal
    const handleOpenAddModal = () => {
        setEditingPropertyId(null);
        setFormData(initialForm);
        setIsModalOpen(true);
    };

    // Open Edit Modal
    const handleOpenEditModal = (property) => {
        setEditingPropertyId(property.id);
        setFormData({
            title: property.title || "",
            location: property.location || "Jaipur, Rajasthan",
            price: property.price || "",
            category: property.category || "rent",
            type: property.type || "flat",
            bhk: property.bhk || "2 BHK",
            bathrooms: property.bathrooms || 2,
            area: property.area || "1250 sq.ft.",
            furnishing: property.furnishing || "Semi-Furnished",
            image: property.image || IMAGE_PRESETS[0].url,
            badge: property.badge || "Verified",
            ownerName: property.ownerName || "Verified Owner",
            ownerPhone: property.ownerPhone || siteSettings?.phone || "+91 70230 77367",
            description: property.description || "",
        });
        setIsModalOpen(true);
    };

    // Save Property (Add or Edit)
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert("Please enter a property title.");
            return;
        }
        if (!formData.price) {
            alert("Please enter a price.");
            return;
        }

        if (editingPropertyId) {
            updateProperty(editingPropertyId, {
                ...formData,
                price: Number(formData.price),
            });
            showToast(`Property "${formData.title}" updated successfully!`);
        } else {
            addProperty({
                ...formData,
                price: Number(formData.price),
                propertyType: formData.type,
            });
            showToast(`New property "${formData.title}" added successfully!`);
        }

        setIsModalOpen(false);
    };

    // Quick inline price save
    const handleQuickPriceSave = (propertyId) => {
        if (!quickPriceVal || isNaN(quickPriceVal)) {
            setQuickEditId(null);
            return;
        }
        updateProperty(propertyId, { price: Number(quickPriceVal) });
        showToast("Price updated successfully!");
        setQuickEditId(null);
    };

    // Delete confirmation
    const handleDelete = (property) => {
        if (window.confirm(`Are you sure you want to delete "${property.title}"?`)) {
            deleteProperty(property.id);
            showToast(`Property "${property.title}" deleted.`);
        }
    };

    // Save Contact & Helplines
    const handleSaveContact = (e) => {
        e.preventDefault();
        const rawPhone = contactForm.phone.replace(/\D/g, "");
        const cleanWa = contactForm.whatsappNumber.replace(/\D/g, "");
        updateSiteSettings({
            phone: contactForm.phone,
            rawPhone: rawPhone,
            whatsappNumber: cleanWa,
            email: contactForm.email,
            address: contactForm.address,
        });
        showToast("Contact details & helplines updated live across the entire website!");
    };


    // Save Hero Slides
    const handleSaveHeroSlides = () => {
        updateSiteSettings({
            heroSlides: heroSlides,
        });
        showToast("Homepage Hero slider banners updated successfully!");
    };

    const handleAddSlide = () => {
        setHeroSlides((prev) => [
            ...prev,
            {
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80",
                title: "New Featured Listing in Jaipur",
                description: "Verified direct from owner with genuine leads and best amenities",
            },
        ]);
    };

    const handleRemoveSlide = (idx) => {
        if (heroSlides.length <= 1) {
            alert("At least 1 slide is required for the hero banner.");
            return;
        }
        setHeroSlides((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSlideChange = (idx, field, value) => {
        setHeroSlides((prev) =>
            prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s))
        );
    };

    // Save Plans
    const handleSavePlans = () => {
        updateSiteSettings({
            plans: plansList,
        });
        showToast("Owner listing plans & pricing updated successfully!");
    };

    const handlePlanChange = (idx, field, value) => {
        setPlansList((prev) =>
            prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
        );
    };

    // Filtered properties
    const filteredProperties = useMemo(() => {
        return properties.filter((p) => {
            const matchesSearch =
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.location.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (categoryFilter === "rent" && p.category !== "rent") return false;
            if (categoryFilter === "sale" && p.category !== "sale") return false;
            if (categoryFilter === "commercial" && p.type !== "commercial") return false;
            if (categoryFilter === "flat" && p.type !== "flat") return false;
            if (categoryFilter === "villa" && p.type !== "villa" && p.type !== "house") return false;

            if (bhkFilter !== "all" && p.bhk !== bhkFilter) return false;

            return true;
        });
    }, [properties, searchQuery, categoryFilter, bhkFilter]);

    // Filtered Leads
    const filteredLeads = useMemo(() => {
        if (!buyerLeads) return [];
        return buyerLeads.filter((l) => {
            if (leadStatusFilter !== "all" && l.status !== leadStatusFilter) return false;
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (
                l.name?.toLowerCase().includes(q) ||
                l.phone?.toLowerCase().includes(q) ||
                l.propertyTitle?.toLowerCase().includes(q)
            );
        });
    }, [buyerLeads, leadStatusFilter, searchQuery]);

    // Counts
    const rentCount = properties.filter((p) => p.category === "rent").length;
    const saleCount = properties.filter((p) => p.category === "sale").length;
    const commercialCount = properties.filter((p) => p.type === "commercial").length;
    const newLeadsCount = buyerLeads ? buyerLeads.filter((l) => l.status === "New").length : 0;

    // Export Backup JSON
    const handleExportBackup = () => {
        const backupData = {
            exportDate: new Date().toISOString(),
            platform: "Jaipur Ki Property",
            properties: properties,
            buyerLeads: buyerLeads,
            siteSettings: siteSettings,
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `jaipurkiproperty_backup_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast("Backup exported successfully as JSON!");
    };

    // ============================================================
    // 1. STANDALONE RESTRICTED GATEWAY (CLEAN & ISOLATED SCREEN)
    // ============================================================
    if (!isAdminAuthorized) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 60%, #020617 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px 16px",
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                }}
            >
                <div
                    style={{
                        maxWidth: "460px",
                        width: "100%",
                        background: "rgba(15, 23, 42, 0.85)",
                        backdropFilter: "blur(16px)",
                        borderRadius: "28px",
                        padding: "44px 36px",
                        boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        textAlign: "center",
                        color: "#f8fafc",
                    }}
                >
                    <div
                        style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "22px",
                            background: "linear-gradient(135deg, rgba(236, 38, 143, 0.2), rgba(190, 24, 93, 0.05))",
                            color: "#ec268f",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                            border: "1.5px solid rgba(236, 38, 143, 0.4)",
                            boxShadow: "0 0 30px rgba(236, 38, 143, 0.25)",
                        }}
                    >
                        <Lock size={34} />
                    </div>

                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(236, 38, 143, 0.15)", color: "#f472b6", fontSize: "11px", fontWeight: 800, padding: "4px 12px", borderRadius: "999px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px", border: "1px solid rgba(236, 38, 143, 0.3)" }}>
                        <ShieldCheck size={13} />
                        <span>Restricted Portal</span>
                    </div>

                    <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                        Jaipur Ki Property Studio
                    </h1>
                    <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: "0 0 28px", lineHeight: 1.5 }}>
                        This workspace is restricted strictly to authorized platform administrators. Public visitors do not have access.
                    </p>

                    {permissionError && (
                        <div
                            style={{
                                background: "rgba(239, 68, 68, 0.15)",
                                color: "#fca5a5",
                                padding: "12px 14px",
                                borderRadius: "12px",
                                fontSize: "12.5px",
                                fontWeight: 600,
                                marginBottom: "22px",
                                border: "1px solid rgba(239, 68, 68, 0.3)",
                                textAlign: "left",
                                display: "flex",
                                gap: "10px",
                                alignItems: "flex-start",
                            }}
                        >
                            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                            <span>{permissionError}</span>
                        </div>
                    )}

                    <form onSubmit={handleAdminLogin} style={{ textAlign: "left" }}>
                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}>
                                Administrator ID / Email
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="kkbagda73@gmail.com"
                                value={adminEmailInput}
                                onChange={(e) => setAdminEmailInput(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    background: "rgba(30, 41, 59, 0.7)",
                                    color: "#ffffff",
                                    fontSize: "14px",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#cbd5e1", marginBottom: "6px" }}>
                                Passkey
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="Enter admin passkey (1234)"
                                value={passkeyInput}
                                onChange={(e) => setPasskeyInput(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    background: "rgba(30, 41, 59, 0.7)",
                                    color: "#ffffff",
                                    fontSize: "14px",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                height: "48px",
                                background: "linear-gradient(135deg, #ec268f, #be185d)",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "14.5px",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                boxShadow: "0 8px 24px rgba(236, 38, 143, 0.4)",
                                transition: "all 0.2s",
                            }}
                        >
                            <Unlock size={17} />
                            <span>Unlock Admin Console</span>
                        </button>
                    </form>

                    <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
                        <Link
                            to="/"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#94a3b8",
                                textDecoration: "none",
                            }}
                        >
                            &larr; Return to public website
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    
    // 2. ENTERPRISE ADMIN APP SHELL (NO NAVBAR / FOOTER, DEDICATED)
   
    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f1f5f9",
                color: "#0f172a",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                position: "relative",
            }}
        >
            {/* FLOATING TOAST NOTIFICATION */}
            {toastMessage && (
                <div
                    style={{
                        position: "fixed",
                        top: "24px",
                        right: "24px",
                        zIndex: 999999,
                        background: "#0f172a",
                        color: "#ffffff",
                        padding: "14px 22px",
                        borderRadius: "14px",
                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "14px",
                        fontWeight: 600,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                >
                    <CheckCircle2 size={18} color="#22c55e" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* MOBILE BACKDROP OVERLAY */}
            {isMobileSidebarOpen && (
                <div
                    onClick={() => setIsMobileSidebarOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(15,23,42,0.6)",
                        backdropFilter: "blur(4px)",
                        zIndex: 99,
                    }}
                />
            )}

        
            {/* 2A. LEFT SIDEBAR NAVIGATION                           */}
        
            <aside
                style={{
                    width: "275px",
                    background: "#0f172a",
                    color: "#94a3b8",
                    display: "flex",
                    flexDirection: "column",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    flexShrink: 0,
                    borderRight: "1px solid #1e293b",
                    boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    transition: "transform 0.25s ease",
                }}
                className={`admin-sidebar ${isMobileSidebarOpen ? "open" : ""}`}
            >
                {/* BRAND HEADER */}
                <div style={{ padding: "24px 22px 18px", borderBottom: "1px solid #1e293b" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                            style={{
                                width: "42px",
                                height: "38px",
                                borderRadius: "10px",
                                background: "linear-gradient(135deg, #ec268f, #be185d)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                fontWeight: 900,
                                fontSize: "14.5px",
                                letterSpacing: "-0.3px",
                                boxShadow: "0 4px 12px rgba(236,38,143,0.35)",
                                flexShrink: 0,
                            }}
                        >
                            JKP
                        </div>
                        <div>
                            <div style={{ fontSize: "14.5px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.2px" }}>
                                JAIPUR KI PROPERTY
                            </div>
                            <div style={{ fontSize: "11px", color: "#ec268f", fontWeight: 700, letterSpacing: "0.5px" }}>
                                ADMIN STUDIO v2.0
                            </div>
                        </div>
                    </div>

                    {/* ADMIN USER IDENTITY CHIP */}
                    <div
                        style={{
                            marginTop: "16px",
                            padding: "10px 12px",
                            borderRadius: "12px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: "#ec268f",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 800,
                                fontSize: "13px",
                                flexShrink: 0,
                            }}
                        >
                            K
                        </div>
                        <div style={{ overflow: "hidden" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                kkbagda73@gmail.com
                            </div>
                            <div style={{ fontSize: "10.5px", color: "#22c55e", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
                                Super Administrator
                            </div>
                        </div>
                    </div>
                </div>

                {/* SIDEBAR NAVIGATION ITEMS */}
                <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#475569", letterSpacing: "0.8px", padding: "0 10px 8px", textTransform: "uppercase" }}>
                        Overview & Metrics
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("dashboard");
                            setIsMobileSidebarOpen(false);
                        }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "none",
                            background: activeTab === "dashboard" ? "linear-gradient(90deg, #ec268f, #be185d)" : "transparent",
                            color: activeTab === "dashboard" ? "#ffffff" : "#94a3b8",
                            fontSize: "13.5px",
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: "4px",
                            transition: "all 0.15s",
                            textAlign: "left",
                        }}
                    >
                        <LayoutDashboard size={17} />
                        <span>Dashboard</span>
                    </button>

                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#475569", letterSpacing: "0.8px", padding: "16px 10px 8px", textTransform: "uppercase" }}>
                        Inventory & CRM
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("properties");
                            setIsMobileSidebarOpen(false);
                        }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "none",
                            background: activeTab === "properties" ? "linear-gradient(90deg, #ec268f, #be185d)" : "transparent",
                            color: activeTab === "properties" ? "#ffffff" : "#94a3b8",
                            fontSize: "13.5px",
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: "4px",
                            textAlign: "left",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Building2 size={17} />
                            <span>Properties & Pricing</span>
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 800, padding: "2px 8px", borderRadius: "999px", background: activeTab === "properties" ? "rgba(255,255,255,0.25)" : "#1e293b", color: activeTab === "properties" ? "#ffffff" : "#cbd5e1" }}>
                            {properties.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("leads");
                            setIsMobileSidebarOpen(false);
                        }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "none",
                            background: activeTab === "leads" ? "linear-gradient(90deg, #ec268f, #be185d)" : "transparent",
                            color: activeTab === "leads" ? "#ffffff" : "#94a3b8",
                            fontSize: "13.5px",
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: "4px",
                            textAlign: "left",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Users size={17} />
                            <span>Buyer Inquiries CRM</span>
                        </div>
                        {newLeadsCount > 0 && (
                            <span style={{ fontSize: "10.5px", fontWeight: 800, padding: "2px 7px", borderRadius: "999px", background: "#22c55e", color: "#ffffff" }}>
                                {newLeadsCount} New
                            </span>
                        )}
                    </button>

                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#475569", letterSpacing: "0.8px", padding: "16px 10px 8px", textTransform: "uppercase" }}>
                        Website Control
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("contact");
                            setIsMobileSidebarOpen(false);
                        }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "none",
                            background: activeTab === "contact" ? "linear-gradient(90deg, #ec268f, #be185d)" : "transparent",
                            color: activeTab === "contact" ? "#ffffff" : "#94a3b8",
                            fontSize: "13.5px",
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: "4px",
                            textAlign: "left",
                        }}
                    >
                        <PhoneCall size={17} />
                        <span>Helplines & Contact Info</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("hero");
                            setIsMobileSidebarOpen(false);
                        }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "none",
                            background: activeTab === "hero" ? "linear-gradient(90deg, #ec268f, #be185d)" : "transparent",
                            color: activeTab === "hero" ? "#ffffff" : "#94a3b8",
                            fontSize: "13.5px",
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: "4px",
                            textAlign: "left",
                        }}
                    >
                        <ImageIcon size={17} />
                        <span>Hero Slider Banners</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("plans");
                            setIsMobileSidebarOpen(false);
                        }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "none",
                            background: activeTab === "plans" ? "linear-gradient(90deg, #ec268f, #be185d)" : "transparent",
                            color: activeTab === "plans" ? "#ffffff" : "#94a3b8",
                            fontSize: "13.5px",
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: "4px",
                            textAlign: "left",
                        }}
                    >
                        <CreditCard size={17} />
                        <span>Owner Listing Plans</span>
                    </button>


                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#475569", letterSpacing: "0.8px", padding: "16px 10px 8px", textTransform: "uppercase" }}>
                        Data & Maintenance
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("system");
                            setIsMobileSidebarOpen(false);
                        }}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "none",
                            background: activeTab === "system" ? "linear-gradient(90deg, #ec268f, #be185d)" : "transparent",
                            color: activeTab === "system" ? "#ffffff" : "#94a3b8",
                            fontSize: "13.5px",
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: "4px",
                            textAlign: "left",
                        }}
                    >
                        <Settings size={17} />
                        <span>Backup & System Data</span>
                    </button>
                </div>

                {/* SIDEBAR FOOTER ACTIONS */}
                <div style={{ padding: "16px 14px", borderTop: "1px solid #1e293b", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Link
                        to="/"
                        target="_blank"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.06)",
                            color: "#cbd5e1",
                            fontSize: "13px",
                            fontWeight: 600,
                            textDecoration: "none",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        <Eye size={15} />
                        <span>View Live Website</span>
                        <ArrowUpRight size={13} style={{ marginLeft: "auto" }} />
                    </Link>

                    <button
                        type="button"
                        onClick={handleAdminLogout}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            padding: "9px 12px",
                            borderRadius: "10px",
                            background: "rgba(239, 68, 68, 0.12)",
                            color: "#f87171",
                            fontSize: "13px",
                            fontWeight: 700,
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            cursor: "pointer",
                        }}
                    >
                        <LogOut size={15} />
                        <span>Sign Out Admin</span>
                    </button>
                </div>
            </aside>

            

            <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
                {/* TOP BAR */}
                <header
                    style={{
                        height: "68px",
                        background: "#ffffff",
                        borderBottom: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 28px",
                        position: "sticky",
                        top: 0,
                        zIndex: 90,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* MOBILE DRAWER TOGGLE BUTTON */}
                        <button
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            style={{
                                display: "none",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                padding: "6px",
                                cursor: "pointer",
                                color: "#0f172a",
                            }}
                            className="admin-mobile-menu-btn"
                        >
                            <Menu size={20} />
                        </button>

                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Admin Studio &gt;
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                            {activeTab === "dashboard" && "Dashboard Overview"}
                            {activeTab === "properties" && "Properties & Pricing Manager"}
                            {activeTab === "leads" && "Buyer Inquiries & Leads CRM"}
                            {activeTab === "contact" && "Helplines & Site-Wide Contact Info"}
                            {activeTab === "hero" && "Hero Slider Banners"}
                            {activeTab === "plans" && "Owner Listing Plans & Pricing"}
                            {activeTab === "system" && "Backup & System Diagnostics"}
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {/* LIVE TIME */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 600, color: "#64748b", background: "#f8fafc", padding: "6px 14px", borderRadius: "999px", border: "1px solid #e2e8f0" }}>
                            <Clock size={13} color="#ec268f" />
                            <span>{currentTime}</span>
                        </div>

                        {/* QUICK ACTION BUTTON */}
                        <button
                            type="button"
                            onClick={handleOpenAddModal}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "linear-gradient(135deg, #ec268f, #be185d)",
                                color: "#ffffff",
                                padding: "8px 18px",
                                borderRadius: "9999px",
                                fontSize: "13px",
                                fontWeight: 700,
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 4px 12px rgba(236, 38, 143, 0.3)",
                            }}
                        >
                            <PlusCircle size={15} />
                            <span>Add Property</span>
                        </button>
                    </div>
                </header>

                {/* STAGE CANVAS */}
                <div style={{ padding: "28px 30px 80px", maxWidth: "1320px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
                   
                    {/* VIEW 1: DASHBOARD OVERVIEW                                 */}
                  
                    {activeTab === "dashboard" && (
                        <div>
                            {/* TOP 4 STATISTIC KPI CARDS */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px", marginBottom: "26px" }}>
                                <div style={{ background: "#ffffff", padding: "22px 24px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Total Properties</span>
                                        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#fdf2f8", color: "#ec268f", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Building2 size={19} />
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", marginTop: "8px" }}>
                                        {properties.length}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
                                        <strong style={{ color: "#2563eb" }}>{rentCount}</strong> Rentals • <strong style={{ color: "#16a34a" }}>{saleCount}</strong> For Sale • <strong style={{ color: "#9333ea" }}>{commercialCount}</strong> Comm.
                                    </div>
                                </div>

                                <div style={{ background: "#ffffff", padding: "22px 24px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Buyer Inquiries</span>
                                        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Users size={19} />
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "32px", fontWeight: 900, color: "#0f172a", marginTop: "8px" }}>
                                        {buyerLeads?.length || 0}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "6px" }}>
                                        <strong style={{ color: "#22c55e" }}>{newLeadsCount} New leads</strong> awaiting response
                                    </div>
                                </div>

                                <div style={{ background: "#ffffff", padding: "22px 24px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Live Helpline</span>
                                        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <PhoneCall size={19} />
                                        </div>
                                    </div>
                                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginTop: "14px" }}>
                                        {siteSettings?.phone || "+91 70230 77367"}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#16a34a", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                                        <Check size={13} /> Active across all web pages
                                    </div>
                                </div>

                                
                            </div>

                            {/* TWO-COLUMN GRID: RECENT LEADS & QUICK ACTIONS */}
                            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "22px" }}>
                                {/* RECENT INQUIRIES WIDGET */}
                                <div style={{ background: "#ffffff", borderRadius: "20px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                        <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                                            Recent Buyer Inquiries & CRM
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("leads")}
                                            style={{ background: "none", border: "none", color: "#ec268f", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                                        >
                                            View All Leads &rarr;
                                        </button>
                                    </div>

                                    {!buyerLeads || buyerLeads.length === 0 ? (
                                        <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                                            No inquiries submitted yet.
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                            {buyerLeads.slice(0, 4).map((lead) => {
                                                const cleanPhone = lead.phone?.replace(/\D/g, "");
                                                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                                    `Hello ${lead.name}, regarding your inquiry for ${lead.propertyTitle} on Jaipur Ki Property.`
                                                )}`;
                                                return (
                                                    <div
                                                        key={lead.id}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                            padding: "12px 16px",
                                                            borderRadius: "14px",
                                                            background: "#f8fafc",
                                                            border: "1px solid #f1f5f9",
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                <strong style={{ fontSize: "14px", color: "#0f172a" }}>{lead.name}</strong>
                                                                <span
                                                                    style={{
                                                                        fontSize: "10.5px",
                                                                        fontWeight: 800,
                                                                        padding: "2px 8px",
                                                                        borderRadius: "999px",
                                                                        background: lead.status === "New" ? "#dcfce7" : "#f1f5f9",
                                                                        color: lead.status === "New" ? "#15803d" : "#475569",
                                                                    }}
                                                                >
                                                                    {lead.status || "New"}
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                                                                {lead.propertyTitle} • <span style={{ color: "#ec268f", fontWeight: 700 }}>{lead.propertyPrice}</span>
                                                            </div>
                                                        </div>

                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <a
                                                                href={waUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title="Chat with buyer on WhatsApp"
                                                                style={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "4px",
                                                                    background: "#22c55e",
                                                                    color: "#ffffff",
                                                                    padding: "6px 12px",
                                                                    borderRadius: "8px",
                                                                    fontSize: "12px",
                                                                    fontWeight: 700,
                                                                    textDecoration: "none",
                                                                }}
                                                            >
                                                                <MessageCircle size={13} />
                                                                <span>WhatsApp</span>
                                                            </a>

                                                            <a
                                                                href={`tel:${cleanPhone}`}
                                                                title="Call buyer"
                                                                style={{
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    width: "30px",
                                                                    height: "30px",
                                                                    borderRadius: "8px",
                                                                    background: "#eff6ff",
                                                                    color: "#2563eb",
                                                                    border: "1px solid #bfdbfe",
                                                                    textDecoration: "none",
                                                                }}
                                                            >
                                                                <Phone size={13} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* QUICK PLATFORM ACTIONS */}
                                <div style={{ background: "#ffffff", borderRadius: "20px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", gap: "14px" }}>
                                    <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                                        Quick Studio Actions
                                    </h3>

                                    <button
                                        type="button"
                                        onClick={handleOpenAddModal}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "12px 16px",
                                            borderRadius: "12px",
                                            background: "#fdf2f8",
                                            border: "1px solid #fbcfe8",
                                            color: "#be185d",
                                            fontSize: "13.5px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <PlusCircle size={18} />
                                        <span>Add New Property Listing</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("contact")}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "12px 16px",
                                            borderRadius: "12px",
                                            background: "#f0fdf4",
                                            border: "1px solid #bbf7d0",
                                            color: "#15803d",
                                            fontSize: "13.5px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <PhoneCall size={18} />
                                        <span>Update Phone / WhatsApp Helplines</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("hero")}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "12px 16px",
                                            borderRadius: "12px",
                                            background: "#eff6ff",
                                            border: "1px solid #bfdbfe",
                                            color: "#1d4ed8",
                                            fontSize: "13.5px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <ImageIcon size={18} />
                                        <span>Edit Homepage Hero Slides</span>
                                    </button>

                                    

                                    <button
                                        type="button"
                                        onClick={handleExportBackup}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            padding: "12px 16px",
                                            borderRadius: "12px",
                                            background: "#f8fafc",
                                            border: "1px solid #e2e8f0",
                                            color: "#475569",
                                            fontSize: "13.5px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <Download size={18} />
                                        <span>Download Full System Backup</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================== */}
                    {/* VIEW 2: PROPERTIES & PRICING MANAGER                       */}
                    {/* ========================================================== */}
                    {activeTab === "properties" && (
                        <div>
                            {/* SEARCH, FILTER, AND VIEW TOGGLE */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "12px",
                                    marginBottom: "18px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        background: "#ffffff",
                                        border: "1.5px solid #cbd5e1",
                                        borderRadius: "9999px",
                                        padding: "8px 18px",
                                        width: "100%",
                                        maxWidth: "380px",
                                    }}
                                >
                                    <Search size={16} color="#94a3b8" />
                                    <input
                                        type="text"
                                        placeholder="Search by property title, area, locality..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            border: "none",
                                            outline: "none",
                                            width: "100%",
                                            fontSize: "13.5px",
                                            background: "transparent",
                                        }}
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery("")}
                                            style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        style={{
                                            padding: "8px 14px",
                                            borderRadius: "9999px",
                                            border: "1.5px solid #cbd5e1",
                                            background: "#ffffff",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "#334155",
                                        }}
                                    >
                                        <option value="all">All Properties ({properties.length})</option>
                                        <option value="rent">Rentals ({rentCount})</option>
                                        <option value="sale">For Sale ({saleCount})</option>
                                        <option value="flat">Flats</option>
                                        <option value="villa">Villas & Houses</option>
                                        <option value="commercial">Commercial ({commercialCount})</option>
                                    </select>

                                    <select
                                        value={bhkFilter}
                                        onChange={(e) => setBhkFilter(e.target.value)}
                                        style={{
                                            padding: "8px 14px",
                                            borderRadius: "9999px",
                                            border: "1.5px solid #cbd5e1",
                                            background: "#ffffff",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "#334155",
                                        }}
                                    >
                                        <option value="all">All BHKs</option>
                                        <option value="1 BHK">1 BHK</option>
                                        <option value="2 BHK">2 BHK</option>
                                        <option value="3 BHK">3 BHK</option>
                                        <option value="4 BHK">4 BHK</option>
                                        <option value="5+ BHK">5+ BHK</option>
                                    </select>

                                    {/* VIEW SWITCHER */}
                                    <div style={{ display: "flex", background: "#e2e8f0", padding: "3px", borderRadius: "999px" }}>
                                        <button
                                            type="button"
                                            onClick={() => setPropertyViewMode("table")}
                                            style={{
                                                border: "none",
                                                background: propertyViewMode === "table" ? "#ffffff" : "transparent",
                                                color: propertyViewMode === "table" ? "#0f172a" : "#64748b",
                                                borderRadius: "999px",
                                                padding: "5px 12px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                            }}
                                        >
                                            <List size={14} /> Table
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPropertyViewMode("grid")}
                                            style={{
                                                border: "none",
                                                background: propertyViewMode === "grid" ? "#ffffff" : "transparent",
                                                color: propertyViewMode === "grid" ? "#0f172a" : "#64748b",
                                                borderRadius: "999px",
                                                padding: "5px 12px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                fontSize: "12px",
                                                fontWeight: 700,
                                            }}
                                        >
                                            <Grid size={14} /> Grid
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleOpenAddModal}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            background: "linear-gradient(135deg, #ec268f, #be185d)",
                                            color: "#ffffff",
                                            padding: "9px 18px",
                                            borderRadius: "9999px",
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            border: "none",
                                            cursor: "pointer",
                                            boxShadow: "0 4px 12px rgba(236, 38, 143, 0.3)",
                                        }}
                                    >
                                        <PlusCircle size={15} />
                                        <span>Add Property</span>
                                    </button>
                                </div>
                            </div>

                            {/* TABLE VIEW */}
                            {propertyViewMode === "table" ? (
                                <div
                                    style={{
                                        background: "#ffffff",
                                        borderRadius: "20px",
                                        border: "1px solid #e2e8f0",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
                                            <thead>
                                                <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", color: "#475569", fontWeight: 700, fontSize: "12.5px" }}>
                                                    <th style={{ padding: "14px 20px" }}>Property Listing</th>
                                                    <th style={{ padding: "14px 16px" }}>Type & Config</th>
                                                    <th style={{ padding: "14px 16px" }}>Locality</th>
                                                    <th style={{ padding: "14px 16px" }}>Price (Click to edit)</th>
                                                    <th style={{ padding: "14px 16px" }}>Category</th>
                                                    <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredProperties.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} style={{ padding: "48px 16px", textAlign: "center", color: "#94a3b8" }}>
                                                            No properties found matching your search.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredProperties.map((prop) => (
                                                        <tr key={prop.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                            <td style={{ padding: "12px 20px" }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                                    <img
                                                                        src={prop.image}
                                                                        alt={prop.title}
                                                                        style={{
                                                                            width: "52px",
                                                                            height: "52px",
                                                                            borderRadius: "10px",
                                                                            objectFit: "cover",
                                                                            flexShrink: 0,
                                                                            border: "1px solid #e2e8f0",
                                                                        }}
                                                                    />
                                                                    <div>
                                                                        <div style={{ fontWeight: 700, color: "#0f172a", maxWidth: "290px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                                            {prop.title}
                                                                        </div>
                                                                        <div style={{ fontSize: "11.5px", color: "#64748b" }}>
                                                                            ID: #{prop.id} • {prop.area || "Area N/A"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                                                                <span style={{ background: "#fdf2f8", color: "#ec268f", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, fontSize: "11.5px" }}>
                                                                    {prop.bhk || prop.badge || "Flat"}
                                                                </span>
                                                                <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: "3px" }}>
                                                                    {prop.furnishing || "Semi-Furnished"}
                                                                </div>
                                                            </td>

                                                            <td style={{ padding: "12px 16px", color: "#475569", whiteSpace: "nowrap" }}>
                                                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                                    <MapPin size={13} color="#ec268f" />
                                                                    <span>{prop.location}</span>
                                                                </div>
                                                            </td>

                                                            {/* 1-CLICK INLINE PRICE UPDATE */}
                                                            <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                                                                {quickEditId === prop.id ? (
                                                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                                        <input
                                                                            type="number"
                                                                            value={quickPriceVal}
                                                                            onChange={(e) => setQuickPriceVal(e.target.value)}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === "Enter") handleQuickPriceSave(prop.id);
                                                                                if (e.key === "Escape") setQuickEditId(null);
                                                                            }}
                                                                            style={{ width: "100px", padding: "5px 8px", borderRadius: "8px", border: "2px solid #ec268f", fontSize: "13.5px", fontWeight: 800, outline: "none" }}
                                                                            autoFocus
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleQuickPriceSave(prop.id)}
                                                                            style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 8px", cursor: "pointer", fontSize: "11px", fontWeight: 700 }}
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setQuickEditId(null)}
                                                                            style={{ background: "#94a3b8", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 7px", cursor: "pointer", fontSize: "11px" }}
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        onClick={() => {
                                                                            setQuickEditId(prop.id);
                                                                            setQuickPriceVal(prop.price);
                                                                        }}
                                                                        title="Click to directly edit price"
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            display: "inline-flex",
                                                                            alignItems: "center",
                                                                            gap: "6px",
                                                                            background: "#f8fafc",
                                                                            padding: "4px 10px",
                                                                            borderRadius: "8px",
                                                                            border: "1px dashed #cbd5e1",
                                                                        }}
                                                                    >
                                                                        <strong style={{ color: "#0f172a", fontSize: "14px" }}>
                                                                            ₹{Number(prop.price).toLocaleString("en-IN")}
                                                                        </strong>
                                                                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                                                                            {prop.category === "rent" ? "/mo" : ""}
                                                                        </span>
                                                                        <Edit3 size={11} color="#94a3b8" />
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                                                                <span
                                                                    style={{
                                                                        padding: "3px 9px",
                                                                        borderRadius: "999px",
                                                                        fontSize: "11px",
                                                                        fontWeight: 800,
                                                                        textTransform: "uppercase",
                                                                        background: prop.category === "rent" ? "#eff6ff" : "#f0fdf4",
                                                                        color: prop.category === "rent" ? "#2563eb" : "#16a34a",
                                                                    }}
                                                                >
                                                                    {prop.category || "Rent"}
                                                                </span>
                                                            </td>

                                                            <td style={{ padding: "12px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                                                                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleOpenEditModal(prop)}
                                                                        title="Edit Details & Price"
                                                                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#fdf2f8", color: "#ec268f", border: "1px solid #fbcfe8", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                                                                    >
                                                                        <Edit3 size={13} /> Edit
                                                                    </button>

                                                                    <Link
                                                                        to={`/properties/${prop.id}`}
                                                                        target="_blank"
                                                                        title="Open listing on live website"
                                                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", color: "#475569", textDecoration: "none" }}
                                                                    >
                                                                        <ExternalLink size={14} />
                                                                    </Link>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDelete(prop)}
                                                                        title="Delete Property"
                                                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", cursor: "pointer" }}
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                /* GRID VIEW */
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                                    {filteredProperties.map((prop) => (
                                        <div
                                            key={prop.id}
                                            style={{
                                                background: "#ffffff",
                                                borderRadius: "20px",
                                                overflow: "hidden",
                                                border: "1px solid #e2e8f0",
                                                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <div style={{ position: "relative", height: "160px" }}>
                                                <img
                                                    src={prop.image}
                                                    alt={prop.title}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                                <span style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(15,23,42,0.85)", color: "#ffffff", fontSize: "11px", fontWeight: 800, padding: "3px 8px", borderRadius: "6px" }}>
                                                    {prop.bhk || prop.badge}
                                                </span>
                                                <span style={{ position: "absolute", top: "10px", right: "10px", background: prop.category === "rent" ? "#2563eb" : "#16a34a", color: "#ffffff", fontSize: "10.5px", fontWeight: 800, padding: "3px 8px", borderRadius: "999px", textTransform: "uppercase" }}>
                                                    {prop.category}
                                                </span>
                                            </div>

                                            <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                                                <h4 style={{ fontSize: "15px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {prop.title}
                                                </h4>
                                                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#64748b", marginBottom: "12px" }}>
                                                    <MapPin size={12} color="#ec268f" />
                                                    <span>{prop.location}</span>
                                                </div>

                                                <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                                                    <strong style={{ fontSize: "16px", color: "#ec268f" }}>
                                                        ₹{Number(prop.price).toLocaleString("en-IN")}
                                                        <small style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>{prop.category === "rent" ? "/mo" : ""}</small>
                                                    </strong>

                                                    <div style={{ display: "flex", gap: "6px" }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEditModal(prop)}
                                                            style={{ background: "#fdf2f8", color: "#ec268f", border: "1px solid #fbcfe8", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: 700 }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(prop)}
                                                            style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "8px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ========================================================== */}
                    {/* VIEW 3: BUYER LEADS & CRM                                  */}
                    {/* ========================================================== */}
                    {activeTab === "leads" && (
                        <div>
                            {/* FILTER & ACTIONS BAR */}
                            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "20px 24px", border: "1px solid #e2e8f0", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>Filter Status:</span>
                                    <button
                                        type="button"
                                        onClick={() => setLeadStatusFilter("all")}
                                        style={{ padding: "6px 14px", borderRadius: "999px", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: leadStatusFilter === "all" ? "#0f172a" : "#f1f5f9", color: leadStatusFilter === "all" ? "#fff" : "#475569" }}
                                    >
                                        All ({buyerLeads?.length || 0})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLeadStatusFilter("New")}
                                        style={{ padding: "6px 14px", borderRadius: "999px", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: leadStatusFilter === "New" ? "#16a34a" : "#f1f5f9", color: leadStatusFilter === "New" ? "#fff" : "#475569" }}
                                    >
                                        New Leads ({newLeadsCount})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLeadStatusFilter("Contacted")}
                                        style={{ padding: "6px 14px", borderRadius: "999px", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: leadStatusFilter === "Contacted" ? "#d97706" : "#f1f5f9", color: leadStatusFilter === "Contacted" ? "#fff" : "#475569" }}
                                    >
                                        Contacted
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLeadStatusFilter("Closed")}
                                        style={{ padding: "6px 14px", borderRadius: "999px", border: "none", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: leadStatusFilter === "Closed" ? "#475569" : "#f1f5f9", color: leadStatusFilter === "Closed" ? "#fff" : "#475569" }}
                                    >
                                        Closed
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        addBuyerLead({
                                            name: "Jaipur Buyer " + Math.floor(Math.random() * 900 + 100),
                                            phone: "+91 98290 " + Math.floor(Math.random() * 90000 + 10000),
                                            propertyTitle: "Luxury Villa in Jagatpura",
                                            propertyPrice: "₹45,000 / month",
                                            message: "Interested in scheduling a site visit tomorrow.",
                                        });
                                        showToast("Test buyer inquiry registered!");
                                    }}
                                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "8px 16px", borderRadius: "9999px", fontSize: "12.5px", fontWeight: 700, cursor: "pointer" }}
                                >
                                    <PlusCircle size={14} /> Add Test Inquiry
                                </button>
                            </div>

                            {/* LEADS TABLE */}
                            <div style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
                                        <thead>
                                            <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0", color: "#475569", fontWeight: 700, fontSize: "12.5px" }}>
                                                <th style={{ padding: "14px 20px" }}>Buyer Name & Phone</th>
                                                <th style={{ padding: "14px 16px" }}>Interested Property</th>
                                                <th style={{ padding: "14px 16px" }}>Message</th>
                                                <th style={{ padding: "14px 16px" }}>Date</th>
                                                <th style={{ padding: "14px 16px" }}>Lead Status</th>
                                                <th style={{ padding: "14px 20px", textAlign: "right" }}>Direct Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredLeads.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} style={{ padding: "48px 16px", textAlign: "center", color: "#94a3b8" }}>
                                                        No buyer inquiries match this filter.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredLeads.map((lead) => {
                                                    const cleanPhone = lead.phone?.replace(/\D/g, "");
                                                    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                                        `Hello ${lead.name}, regarding your inquiry for ${lead.propertyTitle} on Jaipur Ki Property.`
                                                    )}`;

                                                    return (
                                                        <tr key={lead.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                                            <td style={{ padding: "14px 20px" }}>
                                                                <div style={{ fontWeight: 800, color: "#0f172a" }}>{lead.name}</div>
                                                                <div style={{ fontSize: "12px", color: "#2563eb", fontWeight: 700 }}>
                                                                    {lead.phone}
                                                                </div>
                                                            </td>

                                                            <td style={{ padding: "14px 16px" }}>
                                                                <div style={{ fontWeight: 700, color: "#0f172a" }}>{lead.propertyTitle}</div>
                                                                <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: 700 }}>
                                                                    {lead.propertyPrice}
                                                                </div>
                                                            </td>

                                                            <td style={{ padding: "14px 16px", maxWidth: "260px" }}>
                                                                <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: 1.4 }}>
                                                                    "{lead.message}"
                                                                </p>
                                                            </td>

                                                            <td style={{ padding: "14px 16px", color: "#64748b", fontSize: "12px", whiteSpace: "nowrap" }}>
                                                                {lead.date}
                                                            </td>

                                                            <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                                                                <select
                                                                    value={lead.status || "New"}
                                                                    onChange={(e) => {
                                                                        updateBuyerLeadStatus(lead.id, e.target.value);
                                                                        showToast(`Status updated to ${e.target.value}`);
                                                                    }}
                                                                    style={{
                                                                        padding: "5px 10px",
                                                                        borderRadius: "999px",
                                                                        fontSize: "12px",
                                                                        fontWeight: 700,
                                                                        border: "1px solid #cbd5e1",
                                                                        background:
                                                                            lead.status === "Closed"
                                                                                ? "#f1f5f9"
                                                                                : lead.status === "Contacted"
                                                                                ? "#fef3c7"
                                                                                : "#dcfce7",
                                                                        color:
                                                                            lead.status === "Closed"
                                                                                ? "#64748b"
                                                                                : lead.status === "Contacted"
                                                                                ? "#b45309"
                                                                                : "#15803d",
                                                                    }}
                                                                >
                                                                    <option value="New">● New Lead</option>
                                                                    <option value="Contacted">● Contacted</option>
                                                                    <option value="Closed">● Closed</option>
                                                                </select>
                                                            </td>

                                                            <td style={{ padding: "14px 20px", textAlign: "right", whiteSpace: "nowrap" }}>
                                                                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                                                    <a
                                                                        href={waUrl}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#22c55e", color: "#ffffff", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}
                                                                    >
                                                                        <MessageCircle size={13} /> WhatsApp
                                                                    </a>

                                                                    <a
                                                                        href={`tel:${cleanPhone}`}
                                                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", textDecoration: "none" }}
                                                                    >
                                                                        <Phone size={13} />
                                                                    </a>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            if (window.confirm(`Delete inquiry from ${lead.name}?`)) {
                                                                                deleteBuyerLead(lead.id);
                                                                                showToast("Inquiry deleted.");
                                                                            }
                                                                        }}
                                                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "8px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", cursor: "pointer" }}
                                                                    >
                                                                        <Trash2 size={13} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================== */}
                    {/* VIEW 4: HELPLINES & CONTACT INFO SETTINGS                  */}
                    {/* ========================================================== */}
                    {activeTab === "contact" && (
                        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
                            <div style={{ background: "#ffffff", borderRadius: "24px", padding: "36px 32px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                                <div style={{ marginBottom: "24px" }}>
                                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                                        Site-Wide Helpline & Contact Settings
                                    </h2>
                                    <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                                        Any changes saved here instantly update across the website: Navbar, Footer, Floating WhatsApp button, Enquiry Modal, and Details pages.
                                    </p>
                                </div>

                                <form onSubmit={handleSaveContact}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                        <div>
                                            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                                                <Phone size={14} color="#ec268f" />
                                                <span>Official Helpline Phone Number</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={contactForm.phone}
                                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                                placeholder="+91 70230 77367"
                                                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "14px" }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                                                <MessageCircle size={14} color="#16a34a" />
                                                <span>Official WhatsApp Support Number (e.g. 917023077367)</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={contactForm.whatsappNumber}
                                                onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                                                placeholder="917023077367"
                                                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "14px" }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                                                <Mail size={14} color="#2563eb" />
                                                <span>Official Support Email</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                placeholder="support@jaipurkiproperty.com"
                                                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "14px" }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                                                <MapPin size={14} color="#ec268f" />
                                                <span>Office / Platform Location</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={contactForm.address}
                                                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                                                placeholder="Jaipur, Rajasthan, IN"
                                                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "14px" }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" }}>
                                        <button
                                            type="submit"
                                            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #ec268f, #be185d)", color: "#ffffff", border: "none", borderRadius: "9999px", padding: "12px 30px", fontSize: "14.5px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(236, 38, 143, 0.35)" }}
                                        >
                                            <Save size={16} />
                                            <span>Save & Publish Live Contacts</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ========================================================== */}
                    {/* VIEW 5: HERO SLIDER BANNERS                                */}
                    {/* ========================================================== */}
                    {activeTab === "hero" && (
                        <div>
                            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "20px 24px", border: "1px solid #e2e8f0", marginBottom: "22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                                <div>
                                    <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
                                        Homepage Hero Slider Banners
                                    </h2>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                                        Manage top animated slider banners, photos, titles, and descriptions shown to every visitor.
                                    </p>
                                </div>

                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        type="button"
                                        onClick={handleAddSlide}
                                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "9px 16px", borderRadius: "9999px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                                    >
                                        <PlusCircle size={15} /> Add New Slide
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleSaveHeroSlides}
                                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg, #ec268f, #be185d)", color: "#ffffff", border: "none", padding: "9px 22px", borderRadius: "9999px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(236,38,143,0.3)" }}
                                    >
                                        <Save size={15} /> Save All Slides
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                                {heroSlides.map((slide, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            background: "#ffffff",
                                            borderRadius: "20px",
                                            padding: "22px",
                                            border: "1px solid #e2e8f0",
                                            display: "grid",
                                            gridTemplateColumns: "200px 1fr 40px",
                                            gap: "20px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#64748b", marginBottom: "6px" }}>
                                                Slide #{idx + 1} Preview
                                            </div>
                                            <img
                                                src={slide.image}
                                                alt={slide.title}
                                                style={{ width: "100%", height: "115px", borderRadius: "12px", objectFit: "cover", border: "1px solid #cbd5e1" }}
                                            />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "3px" }}>
                                                    Headline Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={slide.title}
                                                    onChange={(e) => handleSlideChange(idx, "title", e.target.value)}
                                                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13.5px", fontWeight: 700 }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "3px" }}>
                                                    Subtitle / Description
                                                </label>
                                                <input
                                                    type="text"
                                                    value={slide.description}
                                                    onChange={(e) => handleSlideChange(idx, "description", e.target.value)}
                                                    style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px" }}
                                                />
                                            </div>

                                            <div>
                                                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "3px" }}>
                                                    Image URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={slide.image}
                                                    onChange={(e) => handleSlideChange(idx, "image", e.target.value)}
                                                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "12px", fontFamily: "monospace" }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSlide(idx)}
                                                title="Delete Slide"
                                                style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ========================================================== */}
                    {/* VIEW 6: OWNER LISTING PLANS & PRICING                      */}
                    {/* ========================================================== */}
                    {activeTab === "plans" && (
                        <div>
                            <div style={{ background: "#ffffff", borderRadius: "20px", padding: "20px 24px", border: "1px solid #e2e8f0", marginBottom: "22px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                                <div>
                                    <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
                                        Owner Listing Packages & Pricing
                                    </h2>
                                    <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                                        Manage the 3 listing tiers displayed on the homepage under "Owner Listing Plans".
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSavePlans}
                                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg, #ec268f, #be185d)", color: "#ffffff", border: "none", padding: "9px 22px", borderRadius: "9999px", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(236,38,143,0.3)" }}
                                >
                                    <Save size={15} /> Save Packages Live
                                </button>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                                {plansList.map((plan, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            background: "#ffffff",
                                            borderRadius: "20px",
                                            padding: "26px 22px",
                                            border: "1.5px solid #e2e8f0",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "14px",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: "12px", fontWeight: 800, color: "#ec268f", textTransform: "uppercase" }}>
                                                Tier #{idx + 1}
                                            </span>
                                        </div>

                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                                Plan Title
                                            </label>
                                            <input
                                                type="text"
                                                value={plan.title}
                                                onChange={(e) => handlePlanChange(idx, "title", e.target.value)}
                                                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "14px", fontWeight: 700 }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                                Price Tag Badge
                                            </label>
                                            <input
                                                type="text"
                                                value={plan.price}
                                                placeholder="FREE or ₹499"
                                                onChange={(e) => handlePlanChange(idx, "price", e.target.value)}
                                                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "14px", fontWeight: 800, color: "#ec268f" }}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                                Description & Terms
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={plan.text}
                                                onChange={(e) => handlePlanChange(idx, "text", e.target.value)}
                                                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #cbd5e1", fontSize: "13px", resize: "vertical" }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* ========================================================== */}
                    {/* VIEW 8: BACKUP & SYSTEM DIAGNOSTICS                        */}
                    {/* ========================================================== */}
                    {activeTab === "system" && (
                        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
                            <div style={{ background: "#ffffff", borderRadius: "24px", padding: "36px 32px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "24px" }}>
                                <div>
                                    <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                                        Backup & System Diagnostics
                                    </h2>
                                    <p style={{ fontSize: "13.5px", color: "#64748b", margin: 0 }}>
                                        Export full website data backups, inspect storage health, or restore listings to factory defaults.
                                    </p>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderRadius: "16px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                    <div>
                                        <strong style={{ fontSize: "14px", color: "#0f172a" }}>Full System JSON Backup</strong>
                                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                                            Includes all properties, buyer inquiries CRM, and global site settings.
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleExportBackup}
                                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#0f172a", color: "#ffffff", padding: "10px 18px", borderRadius: "9999px", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
                                    >
                                        <Download size={15} /> Export Backup
                                    </button>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderRadius: "16px", background: "#fef2f2", border: "1px solid #fecaca" }}>
                                    <div>
                                        <strong style={{ fontSize: "14px", color: "#dc2626" }}>Reset Properties to Factory Defaults</strong>
                                        <div style={{ fontSize: "12px", color: "#991b1b", marginTop: "2px" }}>
                                            Clears custom property modifications and reloads the default Jaipur mock listings.
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (window.confirm("Are you sure you want to reset all properties to factory defaults?")) {
                                                resetPropertiesToDefault();
                                                showToast("Properties reset to defaults!");
                                            }
                                        }}
                                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#dc2626", color: "#ffffff", padding: "10px 18px", borderRadius: "9999px", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
                                    >
                                        <RotateCcw size={15} /> Reset Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ====================================================== */}
            {/* ADD / EDIT PROPERTY MODAL                              */}
            {/* ====================================================== */}
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 999999,
                        background: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(6px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                    }}
                >
                    <div
                        style={{
                            background: "#ffffff",
                            borderRadius: "24px",
                            maxWidth: "640px",
                            width: "100%",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            padding: "32px 28px",
                            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                            position: "relative",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                position: "absolute",
                                top: "20px",
                                right: "20px",
                                background: "#f1f5f9",
                                border: "none",
                                width: "34px",
                                height: "34px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: "#64748b",
                            }}
                        >
                            <X size={17} />
                        </button>

                        <div style={{ marginBottom: "22px" }}>
                            <h2 style={{ fontSize: "21px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
                                {editingPropertyId ? "Edit Property Details & Price" : "Add New Property Listing"}
                            </h2>
                            <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
                                Live updates sync directly across all pages of Jaipur Ki Property.
                            </p>
                        </div>

                        <form onSubmit={handleFormSubmit}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                        Property Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 3 BHK Luxury Villa in Jagatpura"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13.5px" }}
                                    />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                            Price in INR (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="e.g. 25000"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13.5px" }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13.5px", background: "#fff" }}
                                        >
                                            <option value="rent">For Rent (Monthly)</option>
                                            <option value="sale">For Sale (Full Price)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                        Location / Locality in Jaipur *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Vaishali Nagar, Jaipur"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13.5px" }}
                                    />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                            Property Type
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            style={{ width: "100%", padding: "10px 10px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                                        >
                                            <option value="flat">Flat / Apartment</option>
                                            <option value="villa">Independent Villa</option>
                                            <option value="house">House / Duplex</option>
                                            <option value="commercial">Commercial Office</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                            BHK Config
                                        </label>
                                        <select
                                            value={formData.bhk}
                                            onChange={(e) => setFormData({ ...formData, bhk: e.target.value, badge: e.target.value })}
                                            style={{ width: "100%", padding: "10px 10px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                                        >
                                            <option value="1 BHK">1 BHK</option>
                                            <option value="2 BHK">2 BHK</option>
                                            <option value="3 BHK">3 BHK</option>
                                            <option value="4 BHK">4 BHK</option>
                                            <option value="5+ BHK">5+ BHK</option>
                                            <option value="Office">Commercial Office</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                            Furnishing
                                        </label>
                                        <select
                                            value={formData.furnishing}
                                            onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                                            style={{ width: "100%", padding: "10px 10px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13px", background: "#fff" }}
                                        >
                                            <option value="Furnished">Furnished</option>
                                            <option value="Semi-Furnished">Semi-Furnished</option>
                                            <option value="Unfurnished">Unfurnished</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                        Property Image URL
                                    </label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "12.5px", fontFamily: "monospace" }}
                                    />
                                    <div style={{ marginTop: "8px" }}>
                                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Quick Preset Photos:</span>
                                        <div style={{ display: "flex", gap: "6px", marginTop: "4px", overflowX: "auto" }}>
                                            {IMAGE_PRESETS.map((p, i) => (
                                                <img
                                                    key={i}
                                                    src={p.url}
                                                    alt={p.label}
                                                    title={p.label}
                                                    onClick={() => setFormData({ ...formData, image: p.url })}
                                                    style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover", cursor: "pointer", border: formData.image === p.url ? "2px solid #ec268f" : "1px solid #e2e8f0" }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                        Owner / Helpline Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ownerPhone}
                                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                                        style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13.5px" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                                        Description & Key Highlights
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13px", resize: "vertical" }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px", borderTop: "1px solid #f1f5f9", paddingTop: "18px" }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: "10px 20px", borderRadius: "9999px", background: "#f1f5f9", color: "#64748b", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "13.5px" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 26px", borderRadius: "9999px", background: "linear-gradient(135deg, #ec268f, #be185d)", color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 14px rgba(236, 38, 143, 0.35)" }}
                                >
                                    <Save size={16} />
                                    <span>{editingPropertyId ? "Save Changes" : "Create Listing"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
