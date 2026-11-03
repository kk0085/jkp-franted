import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertySection from "../components/PropertySection";
import WhyChooseUs from "../components/WhyChooseUs";
import SearchFilterRentals from "../components/SearchFilterRentals";
import { useProperty } from "../context/PropertyContext";
import { Building2, Home as HomeIcon, Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export default function Rent() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, openEnquiry } = useProperty();

    const initialType = searchParams.get("type") || "all";
    const [activeTab, setActiveTab] = useState(initialType);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [budgetLimit, setBudgetLimit] = useState(200000);
    const [sortBy, setSortBy] = useState("recommended");
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    useEffect(() => {
        const typeParam = searchParams.get("type") || "all";
        const queryParam = searchParams.get("search") || "";
        setActiveTab(typeParam);
        setSearch(queryParam);
    }, [searchParams]);

    useEffect(() => {
        document.title = "Jaipur ki Property - Flats & Rentals";
    }, []);

    // Filter properties
    const filtered = useMemo(() => {
        let result = properties.filter((prop) => {
            // Category filter
            const matchesTab =
                activeTab === "all" ||
                (activeTab === "flat" && prop.type === "flat") ||
                (activeTab === "house" && (prop.type === "house" || prop.type === "villa")) ||
                (activeTab === "villa" && prop.type === "villa");

            // Search query filter
            const matchesSearch =
                !search.trim() ||
                `${prop.title} ${prop.location} ${prop.description}`
                    .toLowerCase()
                    .includes(search.toLowerCase());

            // Budget slider filter (Price <= budgetLimit)
            const matchesBudget = Number(prop.price) <= budgetLimit;

            return matchesTab && matchesSearch && matchesBudget;
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
    }, [properties, activeTab, search, budgetLimit, sortBy]);

    const rentFlats = filtered.filter((p) => p.type === "flat");
    const rentHouses = filtered.filter((p) => p.type === "house");
    const rentVillas = filtered.filter((p) => p.type === "villa");

    return (
        <div className="rent-page">
            {/* HERO RENT BANNER */}
            <div className="rent-hero-banner">
                <div className="container">
                    <span className="rent-badge">
                        <Sparkles size={14} /> Verified Rentals in Jaipur
                    </span>
                    <h1>Find Your Best Home & Flat For Rent</h1>
                    <p>
                        Explore verified residential flats, duplexes, and luxury villas across
                        Jaipur with direct owner contact and 0% brokerage.
                    </p>

                    {/* CATEGORY FILTER TABS */}
                    <div className="rent-tabs-row">
                        <button
                            className={`rent-tab-btn ${activeTab === "all" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("all");
                                setSearchParams(search ? { search } : {});
                            }}
                        >
                            All Rentals
                        </button>
                        <button
                            className={`rent-tab-btn ${activeTab === "flat" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("flat");
                                setSearchParams(search ? { type: "flat", search } : { type: "flat" });
                            }}
                        >
                            <Building2 size={15} /> Flat Homes
                        </button>
                        <button
                            className={`rent-tab-btn ${activeTab === "house" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("house");
                                setSearchParams(search ? { type: "house", search } : { type: "house" });
                            }}
                        >
                            <HomeIcon size={15} /> Independent Houses
                        </button>
                        <button
                            className={`rent-tab-btn ${activeTab === "villa" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("villa");
                                setSearchParams(search ? { type: "villa", search } : { type: "villa" });
                            }}
                        >
                            Luxury Villas
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
                                <h4>Filter by Budget & Sorting</h4>
                                <button
                                    type="button"
                                    className="prop-drawer-close"
                                    onClick={() => setShowMobileFilter(false)}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* SEARCH BOX IN MOBILE DRAWER */}
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>Search by Title or Locality:</label>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", border: "1.5px solid #fbcfe8", borderRadius: "10px", padding: "7px 12px" }}>
                                    <Search size={16} color="#ec268f" style={{ flexShrink: 0 }} />
                                    <input
                                        type="text"
                                        placeholder="Search locality, flat, area..."
                                        value={search}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSearch(val);
                                            setSearchParams(activeTab !== "all" ? (val ? { type: activeTab, search: val } : { type: activeTab }) : (val ? { search: val } : {}));
                                        }}
                                        style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: "13px" }}
                                    />
                                    {search && (
                                        <X
                                            size={16}
                                            style={{ cursor: "pointer", color: "#94a3b8" }}
                                            onClick={() => {
                                                setSearch("");
                                                setSearchParams(activeTab !== "all" ? { type: activeTab } : {});
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="prop-drawer-budget-row">
                                <span>Budget Limit:</span>
                                <strong>Rs {Number(budgetLimit).toLocaleString("en-IN")}</strong>
                            </div>

                            <input
                                type="range"
                                min={10000}
                                max={200000}
                                step={2000}
                                value={budgetLimit}
                                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                                className="pink-range-slider"
                                style={{
                                    background: `linear-gradient(to right, #c2185b 0%, #c2185b ${((budgetLimit - 10000) / (200000 - 10000)) * 100}%, #e2e8f0 ${((budgetLimit - 10000) / (200000 - 10000)) * 100}%, #e2e8f0 100%)`,
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
                                    Apply & View {filtered.length} Rentals
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN 2-COLUMN LAYOUT: SIDEBAR WIDGET + LISTINGS */}
            <div className="container rent-layout-container">
                {/* LEFT SIDEBAR: EXACT "Search and Filter Rentals" CARD AS SCREENSHOT (HIDDEN ON MOBILE SO CARDS SHOW IMMEDIATELY) */}
                <div className="rent-sidebar-col desktop-only-sidebar">
                    <SearchFilterRentals
                        title="Search and Filter Rentals"
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
                            setSearchParams(activeTab !== "all" ? (val ? { type: activeTab, search: val } : { type: activeTab }) : (val ? { search: val } : {}));
                        }}
                        budgetLimit={budgetLimit}
                        setBudgetLimit={setBudgetLimit}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        placeholder="Search by title or location"
                        onReset={() => {
                            setActiveTab("all");
                            setSearch("");
                            setBudgetLimit(200000);
                            setSortBy("recommended");
                            setSearchParams({});
                        }}
                    />
                </div>

                {/* RIGHT MAIN COLUMN: FOR RENT SECTIONS */}
                <div className="rent-main-col">
                    <section className="for-rent-container" id="for-rent" style={{ margin: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                            <h2 className="for-rent-heading" style={{ margin: 0 }}>
                                For Rent
                            </h2>
                            <span style={{ fontSize: "12.5px", color: "#6b7280" }}>
                                Showing <strong>{filtered.length}</strong> rentals
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
                                        <h3>No properties found in "{search}"</h3>
                                        <p>Try adjusting your search terms or moving the budget limit.</p>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === "all" ? (
                            <>
                                <PropertySection
                                    title="Flat Homes"
                                    subtitle="Verified deal for family and working professionals."
                                    properties={rentFlats.slice(0, 3)}
                                    moreLink="/rent?type=flat"
                                    onEnquiry={openEnquiry}
                                    columns={3}
                                />

                                <div style={{ marginTop: "28px" }}>
                                    <PropertySection
                                        title="Independent Houses"
                                        subtitle="Private houses with more space and parking."
                                        properties={rentHouses.slice(0, 3)}
                                        moreLink="/rent?type=house"
                                        onEnquiry={openEnquiry}
                                        columns={3}
                                    />
                                </div>

                                <div style={{ marginTop: "28px" }}>
                                    <PropertySection
                                        title="Luxury Villas"
                                        subtitle="Exclusive villas and bungalows in prime Jaipur areas."
                                        properties={rentVillas.slice(0, 3)}
                                        moreLink="/rent?type=villa"
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
                                            {activeTab === "flat"
                                                ? "Flat Homes"
                                                : activeTab === "house"
                                                ? "Independent Houses"
                                                : "Luxury Villas"}
                                        </h3>
                                        <p className="property-section-subtitle">
                                            Showing verified properties matching your selection
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
                                        <h3>No properties match your filter</h3>
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
