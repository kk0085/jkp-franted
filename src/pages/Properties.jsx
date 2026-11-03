import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import SearchFilterRentals from "../components/SearchFilterRentals";
import MobileStickySearchBar from "../components/MobileStickySearchBar";
import { useProperty } from "../context/PropertyContext";
import { MapPin } from "lucide-react";

export default function Properties() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, openEnquiry } = useProperty();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
    const [category, setCategory] = useState(searchParams.get("category") || "all");
    const [budgetLimit, setBudgetLimit] = useState(
        searchParams.get("category") === "sale" || searchParams.get("type") === "commercial" ? 30000000 : 200000
    );
    const [sortBy, setSortBy] = useState("recommended");

    // Sync from URL query params
    useEffect(() => {
        const queryParam = searchParams.get("search") || "";
        const typeParam = searchParams.get("type") || "all";
        const catParam = searchParams.get("category") || "all";
        setSearch(queryParam);
        setTypeFilter(typeParam);
        setCategory(catParam);
        if (catParam === "sale" || typeParam === "commercial") {
            setBudgetLimit(30000000);
        } else {
            setBudgetLimit(200000);
        }
    }, [searchParams]);

    useEffect(() => {
        const titlePrefix =
            typeFilter === "commercial"
                ? "Commercial Offices"
                : category === "sale"
                ? "Properties for Sale"
                : "Properties";
        document.title = search
            ? `Jaipur ki Property - ${titlePrefix} in ${search}`
            : `Jaipur ki Property - ${titlePrefix} in Jaipur`;
    }, [search, typeFilter, category]);

    const updateParams = (newParams) => {
        const current = {};
        if (newParams.search !== undefined) {
            if (newParams.search) current.search = newParams.search;
        } else if (search) {
            current.search = search;
        }

        if (newParams.type !== undefined) {
            if (newParams.type !== "all") current.type = newParams.type;
        } else if (typeFilter !== "all") {
            current.type = typeFilter;
        }

        if (newParams.category !== undefined) {
            if (newParams.category !== "all") current.category = newParams.category;
        } else if (category !== "all") {
            current.category = category;
        }

        setSearchParams(current);
    };

    const filtered = useMemo(() => {
        let result = properties.filter((property) => {
            const cleanSearch = search.trim().toLowerCase();
            const matchesSearch =
                !cleanSearch ||
                property.title.toLowerCase().includes(cleanSearch) ||
                property.location.toLowerCase().includes(cleanSearch) ||
                property.description.toLowerCase().includes(cleanSearch);

            const matchesType =
                typeFilter === "all" ||
                property.type.toLowerCase() === typeFilter.toLowerCase();

            const matchesCategory =
                category === "all" ||
                (category === "sale" && property.category === "sale") ||
                (category === "rent" && property.category === "rent");

            const matchesBudget = Number(property.price) <= budgetLimit;

            return matchesSearch && matchesType && matchesCategory && matchesBudget;
        });

        // Ensure single unique items only (no duplicates)
        const seen = new Set();
        result = result.filter((p) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        });

        if (sortBy === "price-low") {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortBy === "newest") {
            result = [...result].sort((a, b) => b.id - a.id);
        }

        return result;
    }, [properties, search, typeFilter, category, budgetLimit, sortBy]);

    return (
        <div className="page container properties-page-wrapper">
            {/* TOP COMPACT UNIFIED CATEGORY BAR */}
            <div className="prop-unified-header">
                {/* 1. HORIZONTALLY SCROLLABLE CATEGORY TABS (NO MULTI-LINE BREAKING) */}
                <div className="prop-categories-scroll-row">
                    <button
                        type="button"
                        className={`prop-cat-chip ${typeFilter === "all" && category === "all" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("all");
                            setCategory("all");
                            updateParams({ type: "all", category: "all" });
                        }}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`prop-cat-chip ${category === "sale" && typeFilter !== "commercial" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("all");
                            setCategory("sale");
                            updateParams({ type: "all", category: "sale" });
                        }}
                    >
                        Buy (For Sale)
                    </button>
                    <button
                        type="button"
                        className={`prop-cat-chip ${typeFilter === "flat" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("flat");
                            setCategory("all");
                            updateParams({ type: "flat", category: "all" });
                        }}
                    >
                        Flats
                    </button>
                    <button
                        type="button"
                        className={`prop-cat-chip ${typeFilter === "house" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("house");
                            setCategory("all");
                            updateParams({ type: "house", category: "all" });
                        }}
                    >
                        Houses & Villas
                    </button>
                    <button
                        type="button"
                        className={`prop-cat-chip ${typeFilter === "commercial" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("commercial");
                            setCategory("all");
                            updateParams({ type: "commercial", category: "all" });
                        }}
                    >
                        Commercial Office
                    </button>
                    <button
                        type="button"
                        className={`prop-cat-chip ${category === "rent" && typeFilter !== "commercial" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("all");
                            setCategory("rent");
                            updateParams({ type: "all", category: "rent" });
                        }}
                    >
                        Rentals
                    </button>
                </div>

                {/* 2. COMPACT PAGE TITLE & VERIFIED RESULT COUNT */}
                <div className="prop-result-headline-row">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <MapPin size={18} color="#ec268f" style={{ flexShrink: 0 }} />
                        <h2 className="prop-result-title">
                            {typeFilter === "commercial"
                                ? (search ? `Commercial Offices in ${search}` : "Commercial Offices in Jaipur")
                                : category === "sale"
                                ? (search ? `Properties for Sale in ${search}` : "Properties for Sale in Jaipur")
                                : (search ? `Properties in ${search}` : "Properties in Jaipur")}
                        </h2>
                    </div>
                    <span className="prop-result-count-badge">
                        <strong>{filtered.length}</strong> {filtered.length === 1 ? "Property" : "Properties"} Verified
                    </span>
                </div>
            </div>

            {/* MOBILE ONLY STICKY SEARCH BAR (SAME AS HOME PAGE ON SCROLL) */}
            <MobileStickySearchBar
                search={search}
                setSearch={(val) => {
                    setSearch(val);
                    updateParams({ search: val });
                }}
                placeholder={
                    category === "sale"
                        ? "Search property for sale in Jaipur..."
                        : typeFilter === "commercial"
                        ? "Search office, commercial space in Jaipur..."
                        : "Search locality, flat, area in Jaipur..."
                }
            />

            {/* DESKTOP 2-COLUMN & MOBILE 1-COLUMN LISTINGS LAYOUT */}
            <div className="rent-layout-container prop-layout-container">
                {/* LEFT SIDEBAR: ALWAYS VISIBLE (SCROLLS WITH PAGE) */}
                <div className="rent-sidebar-col">
                    <SearchFilterRentals
                        title={
                            category === "sale"
                                ? "Search & Filter Buy / Sale"
                                : typeFilter === "commercial"
                                ? "Search & Filter Commercial"
                                : "Search and Filter Properties"
                        }
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
                            updateParams({ search: val });
                        }}
                        budgetLimit={budgetLimit}
                        setBudgetLimit={setBudgetLimit}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        minVal={category === "sale" || typeFilter === "commercial" ? 500000 : 10000}
                        maxVal={category === "sale" || typeFilter === "commercial" ? 50000000 : 200000}
                        step={category === "sale" || typeFilter === "commercial" ? 500000 : 2000}
                        rateLabel={category === "sale" || typeFilter === "commercial" ? "Price Limit" : "Rent Rate"}
                        placeholder={category === "sale" ? "Search property for sale..." : "Search by title or location"}
                        onReset={() => {
                            setTypeFilter("all");
                            setCategory("all");
                            setSearch("");
                            setBudgetLimit(category === "sale" || typeFilter === "commercial" ? 50000000 : 200000);
                            setSortBy("recommended");
                            updateParams({ type: "all", category: "all", search: "" });
                        }}
                    />
                </div>

                {/* RIGHT COLUMN: PROPERTY CARDS GRID */}
                <div className="rent-main-col prop-cards-main-col">
                    {filtered.length > 0 ? (
                        <div className="property-grid cols-3">
                            {filtered.map((property) => (
                                <PropertyCard
                                    property={property}
                                    key={property.id}
                                    onEnquiry={openEnquiry}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results-box">
                            <h3>No properties match your filter criteria {search ? `in "${search}"` : ""}</h3>
                            <p>Try adjusting your search terms or moving the budget limit.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
