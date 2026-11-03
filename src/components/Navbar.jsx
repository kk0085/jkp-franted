import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, X, ChevronDown, Menu, PlusCircle, ShieldCheck } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, openLoginModal, siteSettings } = useProperty();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState(null);

    const hoverTimeoutRef = useRef(null);

    // Close overlays on route change
    useEffect(() => {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
    }, [location.pathname, location.search]);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseEnter = (menuName) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setActiveDropdown(menuName);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150);
    };

    const handleBuyClick = (e) => {
        e.preventDefault();
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
        navigate("/properties?category=sale");
    };

    const handleRentClick = (e) => {
        e.preventDefault();
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
        navigate("/rent");
    };

    const handleSellClick = (e) => {
        e.preventDefault();
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
        navigate("/post-property");
    };

    const handleCommercialClick = (e) => {
        e.preventDefault();
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
        navigate("/commercial");
    };

    const handlePlansClick = (e) => {
        e.preventDefault();
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
        if (location.pathname === "/") {
            const el = document.getElementById("plans");
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                return;
            }
        }
        navigate("/#plans");
    };

    const toggleMobileSection = (section) => {
        setMobileExpanded((prev) => (prev === section ? null : section));
    };

    // Route active checks
    const isHomeActive = location.pathname === "/" && !location.hash;
    const isBuyActive = location.pathname === "/properties" && location.search.includes("category=sale");
    const isRentActive =
        location.pathname === "/rent" ||
        (location.pathname === "/properties" && !location.search.includes("category=sale") && !location.search.includes("type=commercial"));
    const isCommercialActive = location.pathname.startsWith("/commercial");
    const isSellActive = location.pathname === "/post-property";

    // Gmail initial avatar logo (e.g. 'K' for kkbagda73@gmail.com)
    const gmailInitial = user?.email
        ? user.email.trim().charAt(0).toUpperCase()
        : user?.name
        ? user.name.trim().charAt(0).toUpperCase()
        : "U";

    return (
        <>
            {siteSettings?.announcement?.enabled && siteSettings.announcement.text && (
                <div
                    style={{
                        background: "linear-gradient(90deg, #be185d, #ec268f)",
                        color: "#ffffff",
                        padding: "7px 16px",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        letterSpacing: "0.2px",
                        position: "relative",
                        zIndex: 1001,
                    }}
                >
                    <span>{siteSettings.announcement.text}</span>
                    {siteSettings.announcement.link && (
                        <Link
                            to={siteSettings.announcement.link}
                            style={{
                                color: "#fef08a",
                                textDecoration: "underline",
                                fontWeight: 700,
                                fontSize: "12px",
                            }}
                        >
                            Explore &rarr;
                        </Link>
                    )}
                </div>
            )}
            <header className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
            <div className="container nav-inner">
                {/* 1. BRAND LOGO */}
                <div className="nav-brand">
                    <Link to="/" className="logo">
                        <img src="/logo.png" alt="Jaipur Ki Property" className="logo-img" />
                    </Link>
                </div>

                {/* 2. CENTER NAVIGATION LINKS */}
                <nav className="nav-center-links">
                    {/* HOME */}
                    <Link
                        to="/"
                        className={`nav-item-link ${isHomeActive ? "active" : ""}`}
                    >
                        <span>Home</span>
                    </Link>

                    {/* BUY DROPDOWN */}
                    <div
                        className={`nav-dropdown-wrapper ${activeDropdown === "buy" ? "open" : ""}`}
                        onMouseEnter={() => handleMouseEnter("buy")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            type="button"
                            className={`nav-item-link ${activeDropdown === "buy" || isBuyActive ? "active" : ""}`}
                            onClick={handleBuyClick}
                        >
                            <span>Buy</span>
                            <ChevronDown size={14} strokeWidth={2.4} className="nav-chevron" />
                        </button>
                        {activeDropdown === "buy" && (
                            <div className="dropdown-menu">
                                <Link to="/properties?category=sale" onClick={() => setActiveDropdown(null)}>
                                    All Properties to Buy
                                </Link>
                                <Link to="/properties?category=sale&type=flat" onClick={() => setActiveDropdown(null)}>
                                    Flats for Sale in Jaipur
                                </Link>
                                <Link to="/properties?category=sale&type=villa" onClick={() => setActiveDropdown(null)}>
                                    Independent Villas for Sale
                                </Link>
                                <Link to="/properties?category=sale&type=house" onClick={() => setActiveDropdown(null)}>
                                    Houses & Duplexes for Sale
                                </Link>
                                <Link to="/properties?category=sale&type=commercial" onClick={() => setActiveDropdown(null)}>
                                    Commercial Offices for Sale
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* SELL DROPDOWN */}
                    <div
                        className={`nav-dropdown-wrapper ${activeDropdown === "sell" ? "open" : ""}`}
                        onMouseEnter={() => handleMouseEnter("sell")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            type="button"
                            className={`nav-item-link ${activeDropdown === "sell" || isSellActive ? "active" : ""}`}
                            onClick={handleSellClick}
                        >
                            <span>Sell</span>
                            <ChevronDown size={14} strokeWidth={2.4} className="nav-chevron" />
                        </button>
                        {activeDropdown === "sell" && (
                            <div className="dropdown-menu">
                                <Link to="/post-property" onClick={() => setActiveDropdown(null)}>
                                    Post Property Free
                                </Link>
                                <a href="#plans" onClick={handlePlansClick}>
                                    Owner Listing Plans
                                </a>
                                <Link to={user ? "/profile" : "/login"} onClick={() => setActiveDropdown(null)}>
                                    Owner Dashboard
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* RENT DROPDOWN */}
                    <div
                        className={`nav-dropdown-wrapper ${activeDropdown === "rent" ? "open" : ""}`}
                        onMouseEnter={() => handleMouseEnter("rent")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            type="button"
                            className={`nav-item-link ${activeDropdown === "rent" || isRentActive ? "active" : ""}`}
                            onClick={handleRentClick}
                        >
                            <span>Rent</span>
                            <ChevronDown size={14} strokeWidth={2.4} className="nav-chevron" />
                        </button>
                        {activeDropdown === "rent" && (
                            <div className="dropdown-menu">
                                <Link to="/rent" onClick={() => setActiveDropdown(null)}>
                                    All Properties for Rent
                                </Link>
                                <Link to="/rent?type=flat" onClick={() => setActiveDropdown(null)}>
                                    Rent Flats in Jaipur
                                </Link>
                                <Link to="/rent?type=house" onClick={() => setActiveDropdown(null)}>
                                    Rent Independent Houses
                                </Link>
                                <Link to="/rent?type=villa" onClick={() => setActiveDropdown(null)}>
                                    Rent Luxury Villas
                                </Link>
                                <Link to="/commercial?category=rent" onClick={() => setActiveDropdown(null)}>
                                    Commercial Offices for Rent
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* COMMERCIAL OFFICE DROPDOWN */}
                    <div
                        className={`nav-dropdown-wrapper ${activeDropdown === "commercial" ? "open" : ""}`}
                        onMouseEnter={() => handleMouseEnter("commercial")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            type="button"
                            className={`nav-item-link ${activeDropdown === "commercial" || isCommercialActive ? "active" : ""}`}
                            onClick={handleCommercialClick}
                        >
                            <span>Commercial Office</span>
                            <ChevronDown size={14} strokeWidth={2.4} className="nav-chevron" />
                        </button>
                        {activeDropdown === "commercial" && (
                            <div className="dropdown-menu">
                                <Link to="/commercial" onClick={() => setActiveDropdown(null)}>
                                    All Commercial Offices
                                </Link>
                                <Link to="/commercial?category=rent" onClick={() => setActiveDropdown(null)}>
                                    Offices for Rent in Jaipur
                                </Link>
                                <Link to="/commercial?category=sale" onClick={() => setActiveDropdown(null)}>
                                    Offices for Sale in Jaipur
                                </Link>
                                <Link to="/commercial?search=Malviya%20Nagar" onClick={() => setActiveDropdown(null)}>
                                    Offices in Malviya Nagar
                                </Link>
                                <Link to="/commercial?search=Sitapura" onClick={() => setActiveDropdown(null)}>
                                    IT Spaces in Sitapura RIICO
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* 3. RIGHT SECTION: POST PROPERTY + GMAIL AVATAR LOGO */}
                <div className="nav-right">
                    {/* POST PROPERTY FREE BUTTON */}
                    <Link className="post-btn" to="/post-property">
                        <PlusCircle size={15} />
                        <span>Post Property</span>
                        <span className="free-badge">FREE</span>
                    </Link>

                    {/* GMAIL AVATAR LOGO WITH HOVER-ONLY LOGOUT */}
                    {user ? (
                        <div
                            className={`nav-dropdown-wrapper ${activeDropdown === "user" ? "open" : ""}`}
                            onMouseEnter={() => handleMouseEnter("user")}
                            onMouseLeave={handleMouseLeave}
                            style={{ position: "relative" }}
                        >
                            <Link to="/profile" className="nav-user-avatar-btn" title="View Profile">
                                <span className="nav-user-avatar-initial">{gmailInitial}</span>
                                <span className="nav-avatar-google-badge" title="Verified Gmail">
                                    <svg viewBox="0 0 24 24" width="10" height="10">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                </span>
                            </Link>

                            {/* HOVER LOGOUT MENU (ONLY SHOWS ON HOVER OVER USER AVATAR) */}
                            {activeDropdown === "user" && (
                                <div
                                    className="dropdown-menu dropdown-menu-right nav-user-hover-card"
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 6px)",
                                        right: 0,
                                        left: "auto",
                                        transform: "none",
                                        minWidth: "190px",
                                        padding: "10px",
                                        background: "#ffffff",
                                        borderRadius: "14px",
                                        border: "1.5px solid #fecaca",
                                        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.14)",
                                        zIndex: 1200,
                                    }}
                                >
                                    {user.email && (
                                        <div
                                            style={{
                                                fontSize: "11.5px",
                                                color: "#64748b",
                                                fontWeight: 600,
                                                padding: "2px 6px 8px",
                                                borderBottom: "1px solid #f1f5f9",
                                                marginBottom: "8px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                textAlign: "left",
                                            }}
                                            title={user.email}
                                        >
                                            {user.email}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveDropdown(null);
                                            logout();
                                        }}
                                        className="nav-hover-logout-action"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            padding: "9px 14px",
                                            background: "#fef2f2",
                                            color: "#e11d48",
                                            border: "1px solid #fecaca",
                                            borderRadius: "9999px",
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            transition: "all 0.15s ease",
                                        }}
                                    >
                                        <LogOut size={15} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="nav-login-btn"
                            onClick={openLoginModal}
                        >
                            <User size={15} />
                            <span className="desktop-login-label">Login / Register</span>
                            <span className="mobile-login-label">Login</span>
                        </button>
                    )}

                    {/* MOBILE HAMBURGER BUTTON */}
                    <button
                        type="button"
                        className="mobile-nav-toggle"
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* MOBILE DRAWER NAVIGATION */}
            {isMobileMenuOpen && (
                <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
                        <Link
                            to="/"
                            className={`mobile-nav-item ${isHomeActive ? "active" : ""}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>

                        {/* Mobile Buy */}
                        <div>
                            <button
                                type="button"
                                className={`mobile-nav-item ${isBuyActive ? "active" : ""}`}
                                onClick={() => toggleMobileSection("buy")}
                            >
                                <span>Buy</span>
                                <ChevronDown
                                    size={15}
                                    style={{
                                        transform: mobileExpanded === "buy" ? "rotate(180deg)" : "none",
                                        transition: "transform 0.2s",
                                    }}
                                />
                            </button>
                            {mobileExpanded === "buy" && (
                                <div className="mobile-dropdown-items">
                                    <Link to="/properties?category=sale" onClick={() => setIsMobileMenuOpen(false)}>
                                        All Properties to Buy
                                    </Link>
                                    <Link to="/properties?category=sale&type=flat" onClick={() => setIsMobileMenuOpen(false)}>
                                        Flats for Sale
                                    </Link>
                                    <Link to="/properties?category=sale&type=villa" onClick={() => setIsMobileMenuOpen(false)}>
                                        Independent Villas
                                    </Link>
                                    <Link to="/properties?category=sale&type=house" onClick={() => setIsMobileMenuOpen(false)}>
                                        Houses & Duplexes
                                    </Link>
                                    <Link to="/properties?category=sale&type=commercial" onClick={() => setIsMobileMenuOpen(false)}>
                                        Commercial Offices for Sale
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Sell */}
                        <div>
                            <button
                                type="button"
                                className={`mobile-nav-item ${isSellActive ? "active" : ""}`}
                                onClick={() => toggleMobileSection("sell")}
                            >
                                <span>Sell</span>
                                <ChevronDown
                                    size={15}
                                    style={{
                                        transform: mobileExpanded === "sell" ? "rotate(180deg)" : "none",
                                        transition: "transform 0.2s",
                                    }}
                                />
                            </button>
                            {mobileExpanded === "sell" && (
                                <div className="mobile-dropdown-items">
                                    <Link to="/post-property" onClick={() => setIsMobileMenuOpen(false)}>
                                        Post Property Free
                                    </Link>
                                    <a href="#plans" onClick={handlePlansClick}>
                                        Owner Listing Plans
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Mobile Rent */}
                        <div>
                            <button
                                type="button"
                                className={`mobile-nav-item ${isRentActive ? "active" : ""}`}
                                onClick={() => toggleMobileSection("rent")}
                            >
                                <span>Rent</span>
                                <ChevronDown
                                    size={15}
                                    style={{
                                        transform: mobileExpanded === "rent" ? "rotate(180deg)" : "none",
                                        transition: "transform 0.2s",
                                    }}
                                />
                            </button>
                            {mobileExpanded === "rent" && (
                                <div className="mobile-dropdown-items">
                                    <Link to="/rent" onClick={() => setIsMobileMenuOpen(false)}>
                                        All Properties for Rent
                                    </Link>
                                    <Link to="/rent?type=flat" onClick={() => setIsMobileMenuOpen(false)}>
                                        Rent Flats
                                    </Link>
                                    <Link to="/rent?type=house" onClick={() => setIsMobileMenuOpen(false)}>
                                        Rent Independent Houses
                                    </Link>
                                    <Link to="/rent?type=villa" onClick={() => setIsMobileMenuOpen(false)}>
                                        Rent Luxury Villas
                                    </Link>
                                    <Link to="/commercial?category=rent" onClick={() => setIsMobileMenuOpen(false)}>
                                        Commercial Offices for Rent
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Commercial */}
                        <div>
                            <button
                                type="button"
                                className={`mobile-nav-item ${isCommercialActive ? "active" : ""}`}
                                onClick={() => toggleMobileSection("commercial")}
                            >
                                <span>Commercial Office</span>
                                <ChevronDown
                                    size={15}
                                    style={{
                                        transform: mobileExpanded === "commercial" ? "rotate(180deg)" : "none",
                                        transition: "transform 0.2s",
                                    }}
                                />
                            </button>
                            {mobileExpanded === "commercial" && (
                                <div className="mobile-dropdown-items">
                                    <Link to="/commercial" onClick={() => setIsMobileMenuOpen(false)}>
                                        All Commercial Offices
                                    </Link>
                                    <Link to="/commercial?category=rent" onClick={() => setIsMobileMenuOpen(false)}>
                                        Offices for Rent
                                    </Link>
                                    <Link to="/commercial?category=sale" onClick={() => setIsMobileMenuOpen(false)}>
                                        Offices for Sale
                                    </Link>
                                    <Link to="/commercial?category=furnished" onClick={() => setIsMobileMenuOpen(false)}>
                                        Furnished Offices
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="mobile-drawer-footer" style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Link
                                className="mobile-drawer-post-btn"
                                to="/post-property"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <PlusCircle size={16} />
                                <span>Post Property</span>
                                <span className="free-badge">FREE</span>
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        className="mobile-drawer-user-btn"
                                        to="/profile"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="nav-user-avatar-mini">{gmailInitial}</span>
                                        <span style={{ fontWeight: 700 }}>My Profile</span>
                                    </Link>
                                    <button
                                        type="button"
                                        className="mobile-drawer-logout-btn"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            logout();
                                        }}
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="mobile-drawer-login-btn"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openLoginModal();
                                    }}
                                >
                                    <User size={16} />
                                    <span>Login / Register with Gmail</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    </>
    );
}
