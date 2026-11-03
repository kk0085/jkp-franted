import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import PropertySection from "../components/PropertySection";
import WhyChooseUs from "../components/WhyChooseUs";
import SearchFilterRentals from "../components/SearchFilterRentals";
import { useProperty } from "../context/PropertyContext";
import { Building2, Briefcase, Sparkles } from "lucide-react";

export default function Commercial() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, openEnquiry } = useProperty();

    const initialTab = searchParams.get("category") || searchParams.get("tab") || "all";
    const [activeTab, setActiveTab] = useState(initialTab);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [budgetLimitRent, setBudgetLimitRent] = useState(200000); // Up to 2 Lakh for Rent
    const [budgetLimitSale, setBudgetLimitSale] = useState(50000000); // Up to 5 Cr for Sale
    const [sortBy, setSortBy] = useState("recommended");

    useEffect(() => {
        const catParam = searchParams.get("category") || searchParams.get("tab") || "all";
        const queryParam = searchParams.get("search") || "";
        setActiveTab(catParam);
        setSearch(queryParam);
    }, [searchParams]);

    useEffect(() => {
        document.title = "Jaipur ki Property - Commercial Offices & Spaces";
    }, []);

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
                    </div>
                </div>
            </div>

            {/* MAIN 2-COLUMN LAYOUT: SIDEBAR WIDGET + LISTINGS */}
            <div className="container rent-layout-container">
                {/* LEFT SIDEBAR: EXACT "Search and Filter" CARD AS SCREENSHOT (ALWAYS VISIBLE) */}
                <div className="rent-sidebar-col">
                    <SearchFilterRentals
                        title="Search and Filter Commercial"
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
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

