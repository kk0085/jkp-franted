import { Search, Filter } from "lucide-react";

const quickLocalities = [
    "Mansarovar",
    "Malviya Nagar",
    "Vaishali Nagar",
    "Jagatpura",
    "C Scheme",
    "Raja Park",
    "Sitapura",
];

export default function SearchFilterRentals({
    search = "",
    setSearch,
    budgetLimit = 200000,
    setBudgetLimit,
    sortBy = "recommended",
    setSortBy,
    onReset,
}) {
    const minVal = 10000;
    const maxVal = 200000;
    const percentage = Math.min(100, Math.max(0, ((budgetLimit - minVal) / (maxVal - minVal)) * 100));

    const formattedBudget = Number(budgetLimit).toLocaleString("en-IN");

    const handleReset = () => {
        if (onReset) {
            onReset();
        } else {
            if (setSearch) setSearch("");
            if (setBudgetLimit) setBudgetLimit(200000);
            if (setSortBy) setSortBy("recommended");
        }
    };

    return (
        <aside className="filter-card-widget">
            {/* HEADER */}
            <div className="filter-card-header">
                <Filter size={18} className="filter-header-icon" />
                <h3>Search and Filter Rentals</h3>
            </div>

            {/* SEARCH INPUT */}
            <div className="filter-input-wrap">
                <Search size={17} className="filter-search-icon" />
                <input
                    type="text"
                    placeholder="Search by title or location"
                    value={search}
                    onChange={(e) => setSearch && setSearch(e.target.value)}
                />
            </div>

            {/* QUICK LOCALITY CHIPS */}
            <div className="quick-localities-chips">
                <span className="quick-loc-title">Quick:</span>
                {quickLocalities.map((loc) => (
                    <button
                        key={loc}
                        type="button"
                        className={`quick-loc-chip ${search === loc ? "active" : ""}`}
                        onClick={() => setSearch && setSearch(loc)}
                    >
                        {loc}
                    </button>
                ))}
            </div>

            {/* RENT RATE ROW */}
            <div className="filter-rate-row">
                <span className="filter-label">Rent Rate</span>
                <span className="filter-rate-val">
                    <span className="rupee-glyph">₹</span> Up to Rs {formattedBudget}
                </span>
            </div>

            {/* BUDGET LIMIT ROW */}
            <div className="filter-budget-row">
                <span className="filter-label">Budget Limit</span>
                <span className="filter-budget-val">Rs {formattedBudget}</span>
            </div>

            {/* RANGE SLIDER */}
            <div className="filter-slider-container">
                <input
                    type="range"
                    min={minVal}
                    max={maxVal}
                    step={2000}
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit && setBudgetLimit(Number(e.target.value))}
                    className="pink-range-slider"
                    style={{
                        background: `linear-gradient(to right, #ec268f 0%, #ec268f ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
                    }}
                />
            </div>

            {/* RESET FILTERS BUTTON (RIGHT ALIGNED) */}
            <div className="filter-reset-wrapper">
                <button
                    type="button"
                    className="filter-reset-btn"
                    onClick={handleReset}
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
        </aside>
    );
}
