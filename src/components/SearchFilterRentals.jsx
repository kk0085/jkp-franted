import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Filter, X, SlidersHorizontal, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { popularLocations } from "../data/popularLocationsData";

export default function SearchFilterRentals({
    title = "Search and Filter Rentals",
    search = "",
    setSearch,
    budgetLimit = 200000,
    setBudgetLimit,
    sortBy = "recommended",
    setSortBy,
    minVal = 10000,
    maxVal = 200000,
    step = 2000,
    rateLabel = "Rent Rate",
    placeholder = "Search by title or location",
    onReset,
    matchCount,
}) {
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [localQuery, setLocalQuery] = useState(search);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const hasActiveFilters = Boolean(
        (localQuery && localQuery.trim()) ||
        budgetLimit < maxVal ||
        sortBy !== "recommended"
    );

    const searchContainerRef = useRef(null);

    useEffect(() => {
        setLocalQuery(search);
    }, [search]);

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
        if (onReset) onReset();
    };

    return (
        <aside className="filter-card-widget">
            {/* HEADER - EXACT AS SCREENSHOT */}
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
                    <span>{mobileFilterOpen ? "Close Filters" : "Budget & Sort"}</span>
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

            {/* SEARCH INPUT FORM WITH ICON & AUTOCOMPLETE (EXACT AS SCREENSHOT) */}
            <div ref={searchContainerRef} style={{ position: "relative", marginBottom: "18px" }}>
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

            {/* COLLAPSIBLE BODY FOR BUDGET & SORT */}
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

                {/* RESET FILTERS BUTTON - EXACT AS SCREENSHOT */}
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
