import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertySection from "../components/PropertySection";
import WhyChooseUs from "../components/WhyChooseUs";
import SearchFilterRentals from "../components/SearchFilterRentals";
import { useProperty } from "../context/PropertyContext";
import { popularLocations } from "../data/popularLocationsData";
import { Building2, Briefcase, Sparkles, Search, X, MapPin, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export default function Commercial() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, openEnquiry } = useProperty();

    const initialTab = searchParams.get("category") || searchParams.get("tab") || "all";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
    const [budgetLimitRent, setBudgetLimitRent] = useState(200000); // Up to 2 Lakh for Rent
    const [budgetLimitSale, setBudgetLimitSale] = useState(50000000); // Up to 5 Cr for Sale
    const [sortBy, setSortBy] = useState("recommended");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const searchContainerRef = useRef(null);

    // Track scroll for sticky search bar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Click outside listener for search suggestions
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const catParam = searchParams.get("category") || searchParams.get("tab") || "all";
        const queryParam = searchParams.get("search") || "";
        setActiveTab(catParam);
        setSearch(queryParam);
        setSearchInput(queryParam);
    }, [searchParams]);

    useEffect(() => {
        document.title = "Jaipur ki Property - Commercial Offices & Spaces";
    }, []);

    // Real-time matching locations as user types (SAME AS HOME PAGE)
    const matchedLocations = useMemo(() => {
        if (!searchInput.trim()) return [];
        const clean = searchInput.trim().toLowerCase();
        return popularLocations.filter((loc) =>
            loc.name.toLowerCase().includes(clean)
        );
    }, [searchInput]);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setShowSuggestions(false);
        const trimmed = searchInput.trim();
        setSearch(trimmed);
        const nextParams = {};
        if (activeTab !== "all") nextParams.category = activeTab;
        if (trimmed) nextParams.search = trimmed;
        setSearchParams(nextParams);
    };

    const handleSelectSuggestion = (locName) => {
        setSearchInput(locName);
        setSearch(locName);
        setShowSuggestions(false);
        const nextParams = {};
        if (activeTab !== "all") nextParams.category = activeTab;
        nextParams.search = locName;
        setSearchParams(nextParams);
    };

    // Filter properties for commercial
    const filtered = useMemo(() => {
        let result = properties.filter((prop) => {
            // Must be commercial type or commercial bhk/badge/title
            const isCommercial =
                prop.type === "commercial" ||
                (prop.bhk && prop.bhk.toLowerCase().includes("commercial")) ||
                (prop.badge && prop.badge.toLowerCase().includes("commercial")) ||
                (prop.badge && prop.badge.toLowerCase().includes("office")) ||
                (prop.title && prop.title.toLowerCase().includes("commercial")) ||
                (prop.title && prop.title.toLowerCase().includes("office")) ||
                (prop.title && prop.title.toLowerCase().includes("showroom"));

            if (!isCommercial) return false;

            // Tab filter & Budget matching
            if (activeTab === "rent") {
                if (prop.category !== "rent") return false;
                if (Number(prop.price) > budgetLimitRent) return false;
            } else if (activeTab === "sale") {
                if (prop.category !== "sale") return false;
                if (Number(prop.price) > budgetLimitSale) return false;
            } else if (activeTab === "furnished") {
                const isFurnished =
                    (prop.furnishing && prop.furnishing.toLowerCase().includes("furnished")) ||
                    (prop.description && prop.description.toLowerCase().includes("furnished"));
                if (!isFurnished) return false;
                if (prop.category === "rent" && Number(prop.price) > budgetLimitRent) return false;
                if (prop.category === "sale" && Number(prop.price) > budgetLimitSale) return false;
            } else {
                // activeTab === "all"
                if (prop.category === "rent" && Number(prop.price) > budgetLimitRent) return false;
                if (prop.category === "sale" && Number(prop.price) > budgetLimitSale) return false;
            }

            // Search query filter
            if (search.trim()) {
                const clean = search.toLowerCase();
                const textMatch =
                    `${prop.title} ${prop.location} ${prop.description} ${prop.badge || ""}`
                        .toLowerCase()
                        .includes(clean);
                if (!textMatch) return false;
            }

            return true;
        });

        // Ensure single unique items only (no double)
        const seen = new Set();
        result = result.filter((p) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        });

        // Sorting
        if (sortBy === "price-low") {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortBy === "newest") {
            result = [...result].sort((a, b) => b.id - a.id);
        }

        return result;
    }, [properties, activeTab, search, budgetLimitRent, budgetLimitSale, sortBy]);

    const commercialRentals = filtered.filter((p) => p.category === "rent");
    const commercialSales = filtered.filter((p) => p.category === "sale");
    const furnishedOffices = filtered.filter(
        (p) =>
            (p.furnishing && p.furnishing.toLowerCase().includes("furnished")) ||
            (p.description && p.description.toLowerCase().includes("furnished"))
    );

    return (
        <div className="rent-page commercial-page">
            {/* HERO COMMERCIAL BANNER */}
            <div className="rent-hero-banner">
                <div className="container">
                    <span className="rent-badge">
                        <Building2 size={14} color="#ec268f" /> Verified Commercial Spaces in Jaipur
                    </span>
                    <h1>Find Verified Commercial Office & Spaces</h1>
                    <p>
                        Explore verified corporate office spaces, IT coworking setups, retail shops,
                        and commercial floors across top business hubs in Jaipur with direct owner contact and 0% brokerage.
                    </p>

                    {/* COMMERCIAL CATEGORY FILTER TABS */}
                    <div className="rent-tabs-row">
                        <button
                            className={`rent-tab-btn ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("all");
                                setSearchParams(search ? { search } : {});
                            }}
                        >
                            <Briefcase size={15} /> All Commercial
                        </button>
                        <button
                            className={`rent-tab-btn ${activeTab === "rent" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("rent");
                                setSearchParams(search ? { category: "rent", search } : { category: "rent" });
                            }}
                        >
                            Offices for Rent
                        </button>
                        <button
                            className={`rent-tab-btn ${activeTab === "sale" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("sale");
                                setSearchParams(search ? { category: "sale", search } : { category: "sale" });
                            }}
                        >
                            Offices for Sale
                        </button>
                        <button
                            className={`rent-tab-btn ${activeTab === "furnished" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("furnished");
                                setSearchParams(search ? { category: "furnished", search } : { category: "furnished" });
                            }}
                        >
                            <Building2 size={15} /> Furnished Spaces
                        </button>

                        {/* MOBILE FILTER TOGGLE BUTTON */}
                        <button
                            type="button"
                            className={`rent-tab-btn mobile-filter-toggle-pill ${showMobileFilter ? "active" : ""}`}
                            onClick={() => setShowMobileFilter(!showMobileFilter)}
                        >
                            <SlidersHorizontal size={13} />
                            <span>Filter & Budget</span>
                            {showMobileFilter ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                    </div>

                    {/* MOBILE ACCORDION FILTER DRAWER */}
                    {showMobileFilter && (
                        <div className="prop-mobile-filter-drawer" style={{ marginTop: "14px", maxWidth: "660px", margin: "14px auto 0" }}>
                            <div className="prop-drawer-header">
                                <h4>Filter Commercial by Budget & Sorting</h4>
                                <button
                                    type="button"
                                    className="prop-drawer-close"
                                    onClick={() => setShowMobileFilter(false)}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="prop-drawer-budget-row">
                                <span>{activeTab === "sale" ? "Sale Budget Limit:" : "Rent Budget Limit:"}</span>
                                <strong>Rs {Number(activeTab === "sale" ? budgetLimitSale : budgetLimitRent).toLocaleString("en-IN")}</strong>
                            </div>

                            <input
                                type="range"
                                min={activeTab === "sale" ? 1000000 : 10000}
                                max={activeTab === "sale" ? 50000000 : 200000}
                                step={activeTab === "sale" ? 500000 : 2000}
                                value={activeTab === "sale" ? budgetLimitSale : budgetLimitRent}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (activeTab === "sale") setBudgetLimitSale(val);
                                    else setBudgetLimitRent(val);
                                }}
                                className="pink-range-slider"
                                style={{
                                    background: `linear-gradient(to right, #c2185b 0%, #c2185b ${(((activeTab === "sale" ? budgetLimitSale : budgetLimitRent) - (activeTab === "sale" ? 1000000 : 10000)) / ((activeTab === "sale" ? 50000000 : 200000) - (activeTab === "sale" ? 1000000 : 10000))) * 100}%, #e2e8f0 ${(((activeTab === "sale" ? budgetLimitSale : budgetLimitRent) - (activeTab === "sale" ? 1000000 : 10000)) / ((activeTab === "sale" ? 50000000 : 200000) - (activeTab === "sale" ? 1000000 : 10000))) * 100}%, #e2e8f0 100%)`,
                                }}
                            />

                            <div className="prop-drawer-sort-row">
                                <label style={{ fontWeight: 600, color: "#334155" }}>Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="filter-sort-select"
                                    style={{ height: "36px", padding: "0 10px", fontSize: "13px" }}
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>

                            <div className="prop-drawer-actions">
                                <button
                                    type="button"
                                    className="primary-btn"
                                    style={{ width: "100%", height: "38px" }}
                                    onClick={() => setShowMobileFilter(false)}
                                >
                                    Apply & View {filtered.length} Spaces
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* PROMINENT SEARCH BAR (STICKY ON SCROLL ACROSS ENTIRE PAGE) */}
            <div className={`rent-search-sticky-wrap ${isScrolled ? "is-sticky" : ""}`}>
                <div className="container">
                    <div className="home-search-hero-bar" ref={searchContainerRef}>
                        <form onSubmit={handleSearchSubmit} className="home-search-input-row">
                            <div className="home-search-input-box">
                                <Search size={18} color="#ec268f" style={{ flexShrink: 0 }} />
                                <input
                                    type="text"
                                    placeholder="Search office, locality in Jaipur (e.g. Malviya Nagar, Sitapura)..."
                                    value={searchInput}
                                    onChange={(e) => {
                                        setSearchInput(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => {
                                        if (searchInput.trim()) setShowSuggestions(true);
                                    }}
                                />
                                {searchInput && (
                                    <X
                                        size={16}
                                        style={{ cursor: "pointer", color: "#94a3b8" }}
                                        onClick={() => {
                                            setSearchInput("");
                                            setSearch("");
                                            setShowSuggestions(false);
                                            const nextParams = {};
                                            if (activeTab !== "all") nextParams.category = activeTab;
                                            setSearchParams(nextParams);
                                        }}
                                    />
                                )}
                            </div>
                            <button type="submit" className="home-search-btn">
                                <Search size={16} /> <span>Search</span>
                            </button>
                        </form>

                        {/* AUTOCOMPLETE LOCATION SUGGESTIONS */}
                        {showSuggestions && searchInput.trim() && (
                            <div className="home-search-suggestions-dropdown">
                                {matchedLocations.length > 0 ? (
                                    <div className="home-suggestions-list">
                                        {matchedLocations.map((loc) => (
                                            <button
                                                key={loc.id}
                                                type="button"
                                                className="home-suggestion-item"
                                                onClick={() => handleSelectSuggestion(loc.name)}
                                            >
                                                <MapPin size={16} className="suggestion-pin-icon" />
                                                <span className="suggestion-name">{loc.name}</span>
                                                <span className="suggestion-tag">Jaipur</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="home-suggestion-no-match">
                                        <span>Press Enter to search all commercial properties for <strong>"{searchInput}"</strong></span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN 2-COLUMN LAYOUT: SIDEBAR WIDGET + LISTINGS */}
            <div className="container rent-layout-container">
                {/* LEFT SIDEBAR: EXACT "Search and Filter" CARD AS SCREENSHOT (HIDDEN ON MOBILE SO CARDS SHOW IMMEDIATELY) */}
                <div className="rent-sidebar-col desktop-only-sidebar">
                    <SearchFilterRentals
                        title="Search and Filter Commercial"
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
                            setSearchInput(val);
                            const nextParams = {};
                            if (activeTab !== "all") nextParams.category = activeTab;
                            if (val) nextParams.search = val;
                            setSearchParams(nextParams);
                        }}
                        budgetLimit={activeTab === "sale" ? budgetLimitSale : budgetLimitRent}
                        setBudgetLimit={activeTab === "sale" ? setBudgetLimitSale : setBudgetLimitRent}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        minVal={activeTab === "sale" ? 1000000 : 10000}
                        maxVal={activeTab === "sale" ? 50000000 : 200000}
                        step={activeTab === "sale" ? 500000 : 2000}
                        rateLabel={activeTab === "sale" ? "Sale Price Limit" : "Rent Rate"}
                        placeholder="Search by title or location"
                        onReset={() => {
                            setActiveTab("all");
                            setBudgetLimitRent(200000);
                            setBudgetLimitSale(50000000);
                            setSearchParams({});
                        }}
                    />
                </div>

                {/* RIGHT MAIN COLUMN: COMMERCIAL SECTIONS */}
                <div className="rent-main-col">
                    <section className="for-rent-container" id="commercial-listings" style={{ margin: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <h2 className="for-rent-heading" style={{ margin: 0 }}>
                                Commercial Properties
                            </h2>
                            <span style={{ fontSize: "12.5px", color: "#6b7280" }}>
                                Showing <strong>{filtered.length}</strong> commercial spaces
                            </span>
                        </div>

                        {search.trim() ? (
                            <div>
                                {filtered.length > 0 ? (
                                    <div className="property-grid cols-3">
                                        {filtered.map((property) => (
                                            <PropertyCard
                                                key={property.id}
                                                property={property}
                                                onEnquiry={openEnquiry}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-results-box">
                                        <h3>No commercial properties found in "{search}"</h3>
                                        <p>Try adjusting your search terms or moving the budget limit.</p>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === "all" ? (
                            <>
                                <PropertySection
                                    title="Commercial Offices for Rent"
                                    subtitle="Ready-to-move corporate and IT spaces with zero brokerage."
                                    properties={commercialRentals.slice(0, 3)}
                                    moreLink="/commercial?category=rent"
                                    onEnquiry={openEnquiry}
                                    columns={3}
                                />

                                <div style={{ marginTop: "28px" }}>
                                    <PropertySection
                                        title="Commercial Spaces for Sale"
                                        subtitle="Grade-A commercial floors and showrooms with high rental yield."
                                        properties={commercialSales.slice(0, 3)}
                                        moreLink="/commercial?category=sale"
                                        onEnquiry={openEnquiry}
                                        columns={3}
                                    />
                                </div>

                                <div style={{ marginTop: "28px" }}>
                                    <PropertySection
                                        title="Furnished Executive Offices"
                                        subtitle="Fully equipped setups with cabins, conference rooms, and workstations."
                                        properties={furnishedOffices.slice(0, 3)}
                                        moreLink="/commercial?category=furnished"
                                        onEnquiry={openEnquiry}
                                        columns={3}
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <div className="property-section-header">
                                    <div>
                                        <h3 className="property-section-title">
                                            {activeTab === "rent"
                                                ? "Commercial Offices for Rent"
                                                : activeTab === "sale"
                                                ? "Commercial Spaces for Sale"
                                                : "Furnished Executive Offices"}
                                        </h3>
                                        <p className="property-section-subtitle">
                                            Showing verified commercial spaces matching your selection
                                        </p>
                                    </div>
                                </div>

                                {filtered.length > 0 ? (
                                    <div className="property-grid cols-3">
                                        {filtered.map((property) => (
                                            <PropertyCard
                                                key={property.id}
                                                property={property}
                                                onEnquiry={openEnquiry}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-results-box">
                                        <h3>No commercial properties match your filter</h3>
                                        <p>Try adjusting your filters or moving the budget limit slider.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* WHY CHOOSE US */}
            <div className="container" style={{ marginTop: "44px" }}>
                <WhyChooseUs />
            </div>
        </div>
    );
}

