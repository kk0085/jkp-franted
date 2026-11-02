import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertySection from "../components/PropertySection";
import WhyChooseUs from "../components/WhyChooseUs";
import SearchFilterRentals from "../components/SearchFilterRentals";
import { useProperty } from "../context/PropertyContext";
import { Building2, Home as HomeIcon, Sparkles } from "lucide-react";

export default function Rent() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, openEnquiry } = useProperty();

    const initialType = searchParams.get("type") || "all";
    const [activeTab, setActiveTab] = useState(initialType);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [budgetLimit, setBudgetLimit] = useState(200000);
    const [sortBy, setSortBy] = useState("recommended");

    useEffect(() => {
        const typeParam = searchParams.get("type") || "all";
        const queryParam = searchParams.get("search") || "";
        setActiveTab(typeParam);
        setSearch(queryParam);
    }, [searchParams]);

    useEffect(() => {
        document.title = "Jaipur ki Property - Flats & Rentals";
    }, []);

    const handleResetAll = () => {
        setSearch("");
        setBudgetLimit(200000);
        setSortBy("recommended");
        setActiveTab("all");
        setSearchParams({});
    };

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
    const rentHouses = filtered.filter((p) => p.type === "house" || p.type === "villa");

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
                                setSearchParams({});
                            }}
                        >
                            All Rentals
                        </button>
                        <button
                            className={`rent-tab-btn ${activeTab === "flat" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("flat");
                                setSearchParams({ type: "flat" });
                            }}
                        >
                            <Building2 size={15} /> Flat Homes
                        </button>
                        <button
                            className={`rent-tab-btn ${activeTab === "house" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("house");
                                setSearchParams({ type: "house" });
                            }}
                        >
                            <HomeIcon size={15} /> Independent Houses
                        </button>
                        <button
                            className={`rent-tab-btn ${activeTab === "villa" ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab("villa");
                                setSearchParams({ type: "villa" });
                            }}
                        >
                            Luxury Villas
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN 2-COLUMN LAYOUT: SIDEBAR WIDGET + LISTINGS */}
            <div className="container rent-layout-container">
                {/* LEFT SIDEBAR: EXACT "Search and Filter Rentals" CARD */}
                <div className="rent-sidebar-col">
                    <SearchFilterRentals
                        search={search}
                        setSearch={setSearch}
                        budgetLimit={budgetLimit}
                        setBudgetLimit={setBudgetLimit}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        onReset={handleResetAll}
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
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                                    <div>
                                        <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", margin: 0 }}>
                                            Properties & Projects in {search}
                                        </h3>
                                        <p style={{ fontSize: "13px", color: "#6b7280", margin: "4px 0 0" }}>
                                            Showing <strong>{filtered.length}</strong> verified properties matching "{search}"
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="clear-search-pill"
                                        onClick={handleResetAll}
                                    >
                                        Clear Search
                                    </button>
                                </div>

                                {filtered.length > 0 ? (
                                    <div className="property-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
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
                                        <p>Try moving the budget limit slider or clearing search terms.</p>
                                        <button
                                            className="primary-btn"
                                            onClick={handleResetAll}
                                            style={{ marginTop: "12px" }}
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === "all" ? (
                            <>
                                <PropertySection
                                    title="Flat Homes"
                                    subtitle="Verified deal for family and working professionals."
                                    properties={rentFlats}
                                    moreLink="/rent?type=flat"
                                    onEnquiry={openEnquiry}
                                />

                                <div style={{ marginTop: "28px" }}>
                                    <PropertySection
                                        title="Independent Houses"
                                        subtitle="Private houses and villas with more space."
                                        properties={rentHouses}
                                        moreLink="/rent?type=house"
                                        onEnquiry={openEnquiry}
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <div className="property-section-header">
                                    <div>
                                        <h3 className="property-section-title">
                                            {activeTab === "flat"
                                                ? "Flat Homes for Rent"
                                                : activeTab === "house"
                                                ? "Independent Houses for Rent"
                                                : "Luxury Villas for Rent"}
                                        </h3>
                                        <p className="property-section-subtitle">
                                            Showing {filtered.length} verified listings in Jaipur
                                        </p>
                                    </div>
                                </div>

                                {filtered.length > 0 ? (
                                    <div className="property-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
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
                                        <p>Try moving the budget limit slider or clearing search terms.</p>
                                        <button
                                            className="primary-btn"
                                            onClick={handleResetAll}
                                            style={{ marginTop: "12px" }}
                                        >
                                            Reset Filters
                                        </button>
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
