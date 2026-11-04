import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Filter, X, SlidersHorizontal, ChevronDown, ChevronUp, MapPin, ShieldCheck } from "lucide-react";
import { popularLocations } from "../data/popularLocationsData";

const topQuickLocalities = [
    "Mansarovar",
    "Jagatpura",
    "Vaishali Nagar",
    "Malviya Nagar",
    "Tonk Road",
    "Ajmer Road",
];

export default function SearchFilterRentals({
    title = "Search and Filter Rentals",
    search = "",
    setSearch,
    budgetLimit = 200000,
    setBudgetLimit,
    sortBy = "recommended",
    setSortBy,
    bhkFilter = "all",
    setBhkFilter,
    furnishingFilter = "all",
    setFurnishingFilter,
    verifiedOnly = false,
    setVerifiedOnly,
    minVal = 10000,
    maxVal = 200000,
    step = 2000,
    rateLabel = "Rent Rate",
    placeholder = "Search by title or location",
    onReset,
    matchCount,
    filterCategory = "rent", // "rent" | "commercial" | "sale"
}) {
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [localQuery, setLocalQuery] = useState(search);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Fallbacks if not controlled
    const [internalBhk, setInternalBhk] = useState(bhkFilter || "all");
    const [internalFurnishing, setInternalFurnishing] = useState(furnishingFilter || "all");
    const [internalVerified, setInternalVerified] = useState(verifiedOnly || false);

    const currentBhk = setBhkFilter ? bhkFilter : internalBhk;
    const handleBhkChange = (val) => {
        if (setBhkFilter) setBhkFilter(val);
        else setInternalBhk(val);
    };

    const currentFurnishing = setFurnishingFilter ? furnishingFilter : internalFurnishing;
    const handleFurnishingChange = (val) => {
        if (setFurnishingFilter) setFurnishingFilter(val);
        else setInternalFurnishing(val);
    };

    const currentVerified = setVerifiedOnly ? verifiedOnly : internalVerified;
    const handleVerifiedChange = (val) => {
        if (setVerifiedOnly) setVerifiedOnly(val);
        else setInternalVerified(val);
    };

    const searchContainerRef = useRef(null);

    useEffect(() => {
        setLocalQuery(search);
    }, [search]);

    const hasActiveFilters = Boolean(
        (localQuery && localQuery.trim()) ||
        budgetLimit < maxVal ||
        sortBy !== "recommended" ||
        currentBhk !== "all" ||
        currentFurnishing !== "all" ||
        currentVerified
    );

    // Click / touch outside listener for suggestions
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        const handleScroll = () => {
            setShowSuggestions(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside, { passive: true });
        document.addEventListener("pointerdown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("pointerdown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Real-time matching locations as user types or popular locations on click
    const matchedLocations = useMemo(() => {
        if (!localQuery.trim()) return popularLocations.slice(0, 8);
        const clean = localQuery.trim().toLowerCase();
        return popularLocations.filter((loc) =>
            loc.name.toLowerCase().includes(clean)
        );
    }, [localQuery]);

    const percentage = Math.min(100, Math.max(0, ((budgetLimit - minVal) / (maxVal - minVal)) * 100));

    const formattedBudget = Number(budgetLimit).toLocaleString("en-IN");

    const handleFormSubmit = (e) => {
        if (e) e.preventDefault();
        setShowSuggestions(false);
        if (setSearch) setSearch(localQuery.trim());
    };

    const handleSelectSuggestion = (locName) => {
        setLocalQuery(locName);
        setShowSuggestions(false);
        if (setSearch) setSearch(locName);
    };

    const handleClear = () => {
        setLocalQuery("");
        setShowSuggestions(false);
        if (setSearch) setSearch("");
    };

    const handleResetFilters = () => {
        setLocalQuery("");
        setShowSuggestions(false);
        if (setSearch) setSearch("");
        if (setBudgetLimit) setBudgetLimit(maxVal);
        if (setSortBy) setSortBy("recommended");
        handleBhkChange("all");
        handleFurnishingChange("all");
        handleVerifiedChange(false);
        if (onReset) onReset();
    };

    // Budget presets according to category
    const budgetPresets = useMemo(() => {
        if (filterCategory === "commercial") {
            if (maxVal > 500000) {
                // Commercial Sale
                return [
                    { label: "Under ₹50L", value: 5000000 },
                    { label: "₹1 Cr", value: 10000000 },
                    { label: "₹2 Cr", value: 20000000 },
                    { label: "Any Budget", value: maxVal },
                ];
            }
            // Commercial Rent
            return [
                { label: "Under ₹30k", value: 30000 },
                { label: "₹60k", value: 60000 },
                { label: "₹1 Lakh", value: 100000 },
                { label: "Any Budget", value: maxVal },
            ];
        } else if (filterCategory === "sale" || maxVal > 500000) {
            // Residential Sale
            return [
                { label: "Under ₹50L", value: 5000000 },
                { label: "₹1 Cr", value: 10000000 },
                { label: "₹2 Cr", value: 20000000 },
                { label: "Any Budget", value: maxVal },
            ];
        }
        // Residential Rent default
        return [
            { label: "Under ₹15k", value: 15000 },
            { label: "₹25k", value: 25000 },
            { label: "₹40k", value: 40000 },
            { label: "Any Budget", value: maxVal },
        ];
    }, [filterCategory, maxVal]);

    // Space / BHK options
    const spaceOptions = useMemo(() => {
        if (filterCategory === "commercial") {
            return [
                { label: "All Spaces", value: "all" },
                { label: "🏢 Office", value: "Office" },
                { label: "🛍️ Showroom", value: "Showroom" },
                { label: "💼 Co-Working", value: "Coworking" },
            ];
        }
        return [
            { label: "All BHK", value: "all" },
            { label: "2 BHK", value: "2 BHK" },
            { label: "3 BHK", value: "3 BHK" },
            { label: "4+ BHK", value: "4+ BHK" },
        ];
    }, [filterCategory]);

    return (
        <aside className="filter-card-widget">
            {/* HEADER */}
            <div className="filter-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Filter size={18} className="filter-header-icon" />
                    <h3>{title}</h3>
                </div>

                {/* Mobile Toggle Button */}
                <button
                    type="button"
                    className="mobile-filter-expand-btn"
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    aria-label="Toggle filters"
                >
                    <SlidersHorizontal size={13} />
                    <span>{mobileFilterOpen ? "Close Filters" : "Filters & Sort"}</span>
                    {hasActiveFilters && (
                        <span
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "#ec268f",
                                display: "inline-block",
                            }}
                        />
                    )}
                    {mobileFilterOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
            </div>

            {/* SEARCH INPUT FORM WITH ICON & AUTOCOMPLETE */}
            <div ref={searchContainerRef} style={{ position: "relative", marginBottom: "12px" }}>
                <form onSubmit={handleFormSubmit} className="filter-search-form">
                    <div className="filter-input-wrap" style={{ marginBottom: 0 }}>
                        <Search size={18} className="filter-search-icon" />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={localQuery}
                            onChange={(e) => {
                                const val = e.target.value;
                                setLocalQuery(val);
                                setShowSuggestions(true);
                                if (setSearch) setSearch(val);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onClick={() => setShowSuggestions(true)}
                        />
                        {localQuery && (
                            <button
                                type="button"
                                className="filter-search-clear-btn"
                                onClick={handleClear}
                                aria-label="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>
                </form>

                {/* AUTOCOMPLETE LOCATION SUGGESTIONS */}
                {showSuggestions && (
                    <div className="home-search-suggestions-dropdown" style={{ top: "calc(100% + 4px)" }}>
                        {matchedLocations.length > 0 ? (
                            <div className="home-suggestions-list">
                                {matchedLocations.map((loc) => (
                                    <button
                                        key={loc.id}
                                        type="button"
                                        className="home-suggestion-item"
                                        onClick={() => handleSelectSuggestion(loc.name)}
                                    >
                                        <MapPin size={15} className="suggestion-pin-icon" />
                                        <span className="suggestion-name">{loc.name}</span>
                                        <span className="suggestion-tag">Jaipur</span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="home-suggestion-no-match">
                                <span>Press Enter to search for <strong>"{localQuery}"</strong></span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 📍 POPULAR LOCALITIES QUICK CHIPS (1-TAP AREA FILTER) */}
            <div className="filter-quick-chips-wrap">
                <span className="filter-quick-chips-label">Popular Localities:</span>
                <div className="filter-quick-chips-list">
                    {topQuickLocalities.map((loc) => {
                        const isLocActive = localQuery.toLowerCase() === loc.toLowerCase();
                        return (
                            <button
                                key={loc}
                                type="button"
                                className={`filter-quick-chip-btn ${isLocActive ? "active" : ""}`}
                                onClick={() => {
                                    const next = isLocActive ? "" : loc;
                                    setLocalQuery(next);
                                    if (setSearch) setSearch(next);
                                }}
                            >
                                <MapPin size={11} />
                                <span>{loc}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* COLLAPSIBLE BODY FOR BUDGET, CONFIGURATION & SORT */}
            <div className={`filter-collapsible-body ${mobileFilterOpen ? "mobile-open" : ""}`}>
                {/* RENT / PRICE RATE ROW */}
                <div className="filter-rate-row">
                    <span className="filter-label">{rateLabel}</span>
                    <span className="filter-rate-val">
                        <span className="rupee-glyph" style={{ color: "#c2185b" }}>₹</span> Up to Rs {formattedBudget}
                    </span>
                </div>

                {/* BUDGET LIMIT ROW */}
                <div className="filter-budget-row">
                    <span className="filter-label">Budget Limit</span>
                    <span className="filter-budget-val" style={{ color: "#c2185b" }}>Rs {formattedBudget}</span>
                </div>

                {/* RANGE SLIDER */}
                <div className="filter-slider-container">
                    <input
                        type="range"
                        min={minVal}
                        max={maxVal}
                        step={step}
                        value={budgetLimit}
                        onChange={(e) => setBudgetLimit && setBudgetLimit(Number(e.target.value))}
                        className="pink-range-slider"
                        style={{
                            background: `linear-gradient(to right, #c2185b 0%, #c2185b ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
                        }}
                    />
                </div>

                {/* ⚡ 1-TAP QUICK BUDGET PRESET PILLS */}
                <div className="filter-budget-presets-row">
                    {budgetPresets.map((preset) => (
                        <button
                            key={preset.label}
                            type="button"
                            className={`filter-budget-preset-pill ${budgetLimit === preset.value ? "active" : ""}`}
                            onClick={() => setBudgetLimit && setBudgetLimit(preset.value)}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                {/* 🏢 BHK / SPACE TYPE SELECTOR */}
                <div className="filter-subgroup">
                    <span className="filter-subgroup-label">
                        {filterCategory === "commercial" ? "Space / Office Type" : "BHK Configuration"}
                    </span>
                    <div className="filter-pills-selector">
                        {spaceOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`filter-selector-btn ${currentBhk === opt.value ? "active" : ""}`}
                                onClick={() => handleBhkChange(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🛋️ FURNISHING STATUS SELECTOR */}
                <div className="filter-subgroup">
                    <span className="filter-subgroup-label">Furnishing Status</span>
                    <div className="filter-pills-selector">
                        {[
                            { label: "All", value: "all" },
                            { label: "🛋️ Furnished", value: "Furnished" },
                            { label: "🪑 Semi-Furnished", value: "Semi-Furnished" },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                className={`filter-selector-btn ${currentFurnishing === opt.value ? "active" : ""}`}
                                onClick={() => handleFurnishingChange(opt.value)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🛡️ 100% VERIFIED ONLY TOGGLE */}
                <div
                    className="filter-verified-toggle-box"
                    onClick={() => handleVerifiedChange(!currentVerified)}
                >
                    <div className="filter-verified-label-content">
                        <input
                            type="checkbox"
                            checked={currentVerified}
                            onChange={(e) => handleVerifiedChange(e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <ShieldCheck size={16} color="#16a34a" />
                        <span>100% Verified Only</span>
                    </div>
                    <span className="filter-verified-pill-tag">Verified</span>
                </div>

                {/* RESET FILTERS BUTTON */}
                <div style={{ display: "flex", justifyContent: "flex-end", margin: "14px 0 16px" }}>
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        style={{
                            background: "#c2185b",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "9999px",
                            padding: "8px 22px",
                            fontSize: "14px",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            boxShadow: "0 2px 6px rgba(194, 24, 91, 0.25)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#ad1457";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#c2185b";
                        }}
                    >
                        Reset Filters
                    </button>
                </div>

                {/* DIVIDER */}
                <div className="filter-card-divider" />

                {/* SORT SECTION */}
                <div className="filter-sort-section">
                    <label className="filter-sort-label">Sort</label>
                    <div className="filter-select-wrapper">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy && setSortBy(e.target.value)}
                            className="filter-sort-select"
                        >
                            <option value="recommended">Recommended</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>
                </div>
            </div>
        </aside>
    );
}
