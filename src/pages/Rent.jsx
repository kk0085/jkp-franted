import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertySection from "../components/PropertySection";
import WhyChooseUs from "../components/WhyChooseUs";
import SearchFilterRentals from "../components/SearchFilterRentals";
import MobileStickySearchBar from "../components/MobileStickySearchBar";
import { useProperty } from "../context/PropertyContext";
import { Building2, Home as HomeIcon, Sparkles, Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export default function Rent() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, openEnquiry } = useProperty();

    const initialType = searchParams.get("type") || "all";
    const [activeTab, setActiveTab] = useState(initialType);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [budgetLimit, setBudgetLimit] = useState(200000);
    const [sortBy, setSortBy] = useState("recommended");
    const [bhkFilter, setBhkFilter] = useState("all");
    const [furnishingFilter, setFurnishingFilter] = useState("all");
    const [verifiedOnly, setVerifiedOnly] = useState(false);

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

            // BHK filter
            let matchesBhk = true;
            if (bhkFilter !== "all") {
                if (bhkFilter === "4+ BHK") {
                    matchesBhk = prop.bhk && (prop.bhk.includes("4 BHK") || prop.bhk.includes("5 BHK"));
                } else {
                    matchesBhk = prop.bhk && prop.bhk.toLowerCase().includes(bhkFilter.toLowerCase());
                }
            }

            // Furnishing filter
            let matchesFurnishing = true;
            if (furnishingFilter !== "all") {
                const f = furnishingFilter.toLowerCase();
                matchesFurnishing =
                    (prop.furnishing && prop.furnishing.toLowerCase().includes(f)) ||
                    (prop.description && prop.description.toLowerCase().includes(f));
            }

            // Verified filter
            const matchesVerified = !verifiedOnly || prop.verified === true;

            return matchesTab && matchesSearch && matchesBudget && matchesBhk && matchesFurnishing && matchesVerified;
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
    }, [properties, activeTab, search, budgetLimit, sortBy, bhkFilter, furnishingFilter, verifiedOnly]);

    const rentFlats = filtered.filter((p) => p.type === "flat");
    const rentHouses = filtered.filter((p) => p.type === "house");
    const rentVillas = filtered.filter((p) => p.type === "villa");

    const isFilterActive = Boolean(
        search.trim() ||
        budgetLimit < 200000 ||
        sortBy !== "recommended" ||
        activeTab !== "all" ||
        bhkFilter !== "all" ||
        furnishingFilter !== "all" ||
        verifiedOnly
    );

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
                    </div>
                </div>
            </div>

            {/* MOBILE ONLY STICKY SEARCH BAR (SAME AS HOME PAGE ON SCROLL) */}
            <MobileStickySearchBar
                search={search}
                setSearch={(val) => {
                    setSearch(val);
                    setSearchParams(activeTab !== "all" ? (val ? { type: activeTab, search: val } : { type: activeTab }) : (val ? { search: val } : {}));
                }}
                placeholder="Search flat, house, villa in Jaipur..."
            />

            {/* MAIN 2-COLUMN LAYOUT: SIDEBAR WIDGET + LISTINGS */}
            <div className="container rent-layout-container">
                {/* LEFT SIDEBAR: EXACT "Search and Filter Rentals" CARD AS SCREENSHOT (SCROLLS WITH PAGE) */}
                <div className="rent-sidebar-col">
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
                        matchCount={filtered.length}
                        bhkFilter={bhkFilter}
                        setBhkFilter={setBhkFilter}
                        furnishingFilter={furnishingFilter}
                        setFurnishingFilter={setFurnishingFilter}
                        verifiedOnly={verifiedOnly}
                        setVerifiedOnly={setVerifiedOnly}
                        filterCategory="rent"
                        onReset={() => {
                            setActiveTab("all");
                            setSearch("");
                            setBudgetLimit(200000);
                            setSortBy("recommended");
                            setBhkFilter("all");
                            setFurnishingFilter("all");
                            setVerifiedOnly(false);
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

                        {isFilterActive ? (
                            <div>
                                {/* ACTIVE FILTER PILLS */}
                                <div className="active-filters-bar" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
                                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>Active Filters:</span>
                                    {search.trim() && (
                                        <span className="filter-pill-tag">
                                            "{search}"
                                            <button type="button" onClick={() => {
                                                setSearch("");
                                                setSearchParams(activeTab !== "all" ? { type: activeTab } : {});
                                            }}><X size={12} /></button>
                                        </span>
                                    )}
                                    {budgetLimit < 200000 && (
                                        <span className="filter-pill-tag">
                                            Up to ₹{budgetLimit.toLocaleString("en-IN")}
                                            <button type="button" onClick={() => setBudgetLimit(200000)}><X size={12} /></button>
                                        </span>
                                    )}
                                    {bhkFilter !== "all" && (
                                        <span className="filter-pill-tag">
                                            {bhkFilter}
                                            <button type="button" onClick={() => setBhkFilter("all")}><X size={12} /></button>
                                        </span>
                                    )}
                                    {furnishingFilter !== "all" && (
                                        <span className="filter-pill-tag">
                                            {furnishingFilter}
                                            <button type="button" onClick={() => setFurnishingFilter("all")}><X size={12} /></button>
                                        </span>
                                    )}
                                    {verifiedOnly && (
                                        <span className="filter-pill-tag">
                                            100% Verified Only
                                            <button type="button" onClick={() => setVerifiedOnly(false)}><X size={12} /></button>
                                        </span>
                                    )}
                                    {sortBy !== "recommended" && (
                                        <span className="filter-pill-tag">
                                            {sortBy === "price-low" ? "Price: Low to High" : sortBy === "price-high" ? "Price: High to Low" : "Newest"}
                                            <button type="button" onClick={() => setSortBy("recommended")}><X size={12} /></button>
                                        </span>
                                    )}
                                    {activeTab !== "all" && (
                                        <span className="filter-pill-tag">
                                            {activeTab === "flat" ? "Flats" : activeTab === "house" ? "Houses" : "Villas"}
                                            <button type="button" onClick={() => {
                                                setActiveTab("all");
                                                setSearchParams(search ? { search } : {});
                                            }}><X size={12} /></button>
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setBudgetLimit(200000);
                                            setSortBy("recommended");
                                            setBhkFilter("all");
                                            setFurnishingFilter("all");
                                            setVerifiedOnly(false);
                                            setActiveTab("all");
                                            setSearchParams({});
                                        }}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#ec268f",
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            marginLeft: "4px",
                                        }}
                                    >
                                        Clear All
                                    </button>
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
                                        <h3>No properties match your filter criteria</h3>
                                        <p>Try adjusting your search terms or increasing the budget limit slider.</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch("");
                                                setBudgetLimit(200000);
                                                setSortBy("recommended");
                                                setActiveTab("all");
                                                setSearchParams({});
                                            }}
                                            style={{
                                                marginTop: "12px",
                                                background: "#ec268f",
                                                color: "#ffffff",
                                                border: "none",
                                                padding: "8px 20px",
                                                borderRadius: "9999px",
                                                fontWeight: 700,
                                                fontSize: "13px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Reset All Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
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
