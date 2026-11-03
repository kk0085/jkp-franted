import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import SearchFilterRentals from "../components/SearchFilterRentals";
import { useProperty } from "../context/PropertyContext";
import { popularLocations } from "../data/popularLocationsData";
import { MapPin, Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export default function Properties() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { properties, openEnquiry } = useProperty();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
    const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all");
    const [category, setCategory] = useState(searchParams.get("category") || "all");
    const [budgetLimit, setBudgetLimit] = useState(
        searchParams.get("category") === "sale" || searchParams.get("type") === "commercial" ? 30000000 : 200000
    );
    const [sortBy, setSortBy] = useState("recommended");
    const [showMobileFilterPanel, setShowMobileFilterPanel] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const searchContainerRef = useRef(null);

    // Track scroll for sticky search bar elevation
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
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

    // Sync from URL query params
    useEffect(() => {
        const queryParam = searchParams.get("search") || "";
        const typeParam = searchParams.get("type") || "all";
        const catParam = searchParams.get("category") || "all";
        setSearch(queryParam);
        setSearchInput(queryParam);
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

    // Real-time matching locations as user types letters/words (SAME AS HOME PAGE)
    const matchedLocations = useMemo(() => {
        if (!searchInput.trim()) return [];
        const clean = searchInput.trim().toLowerCase();
        return popularLocations.filter((loc) =>
            loc.name.toLowerCase().includes(clean)
        );
    }, [searchInput]);

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

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setShowSuggestions(false);
        const trimmed = searchInput.trim();
        setSearch(trimmed);
        updateParams({ search: trimmed });
    };

    const handleSelectSuggestion = (locName) => {
        setSearchInput(locName);
        setSearch(locName);
        setShowSuggestions(false);
        updateParams({ search: locName });
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
            {/* TOP COMPACT UNIFIED SEARCH BAR & FILTERS HEADER (STICKY ON SCROLL) */}
            <div className={`prop-unified-header ${isScrolled ? "is-sticky" : ""}`}>
                {/* 1. SEARCH INPUT ROW WITH EXACT SAME DESIGN & AUTOCOMPLETE AS HOME PAGE */}
                <div className="home-search-hero-bar" ref={searchContainerRef} style={{ width: "100%", margin: "0 0 14px" }}>
                    <form onSubmit={handleSearchSubmit} className="home-search-input-row">
                        <div className="home-search-input-box">
                            <Search size={18} color="#ec268f" style={{ flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder="Search locality, flat, area in Jaipur..."
                                value={searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => {
                                    if (searchInput.trim()) setShowSuggestions(true);
                                }}
                                aria-label="Search properties"
                            />
                            {searchInput && (
                                <X
                                    size={16}
                                    style={{ cursor: "pointer", color: "#94a3b8" }}
                                    onClick={() => {
                                        setSearchInput("");
                                        setSearch("");
                                        setShowSuggestions(false);
                                        updateParams({ search: "" });
                                    }}
                                />
                            )}
                        </div>
                        <button type="submit" className="home-search-btn">
                            <Search size={16} /> <span>Search</span>
                        </button>
                    </form>

                    {/* AUTOCOMPLETE LOCATION SUGGESTIONS (WORD DALTE HI LOCATION SHOW HONI CHAHIYE - SAME AS HOME) */}
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
                                    <span>Press Enter to search all properties for <strong>"{searchInput}"</strong></span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. HORIZONTALLY SCROLLABLE CATEGORY TABS (NO MULTI-LINE BREAKING) */}
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
                        className={`prop-cat-chip ${category === "rent" && typeFilter !== "commercial" ? "active" : ""}`}
                        onClick={() => {
                            setTypeFilter("all");
                            setCategory("rent");
                            updateParams({ type: "all", category: "rent" });
                        }}
                    >
                        Rentals
                    </button>

                    {/* MOBILE FILTER TOGGLE BUTTON */}
                    <button
                        type="button"
                        className={`prop-cat-chip mobile-filter-toggle-pill ${showMobileFilterPanel ? "active" : ""}`}
                        onClick={() => setShowMobileFilterPanel(!showMobileFilterPanel)}
                    >
                        <SlidersHorizontal size={13} />
                        <span>Filter & Budget</span>
                        {showMobileFilterPanel ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                </div>

                {/* MOBILE COLLAPSIBLE FILTER ACCORDION (BUDGET SLIDER & SORT) */}
                {showMobileFilterPanel && (
                    <div className="prop-mobile-filter-drawer">
                        <div className="prop-drawer-header">
                            <h4>Budget Limit & Sorting</h4>
                            <button
                                type="button"
                                className="prop-drawer-close"
                                onClick={() => setShowMobileFilterPanel(false)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="prop-drawer-body">
                            <div className="prop-drawer-budget-row">
                                <span>Max Budget:</span>
                                <strong>Rs {Number(budgetLimit).toLocaleString("en-IN")}</strong>
                            </div>
                            <input
                                type="range"
                                min={10000}
                                max={category === "sale" || typeFilter === "commercial" ? 50000000 : 200000}
                                step={5000}
                                value={budgetLimit}
                                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                                className="pink-range-slider"
                            />
                            <div className="prop-drawer-sort-row">
                                <label>Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="filter-sort-select"
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
                                    onClick={() => setShowMobileFilterPanel(false)}
                                >
                                    Apply & View {filtered.length} Properties
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. COMPACT PAGE TITLE & VERIFIED RESULT COUNT */}
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

            {/* DESKTOP 2-COLUMN & MOBILE 1-COLUMN LISTINGS LAYOUT */}
            <div className="rent-layout-container prop-layout-container">
                {/* LEFT SIDEBAR: ALWAYS VISIBLE */}
                <div className="rent-sidebar-col">
                    <SearchFilterRentals
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
                            setSearchInput(val);
                            updateParams({ search: val });
                        }}
                        budgetLimit={budgetLimit}
                        setBudgetLimit={setBudgetLimit}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
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
