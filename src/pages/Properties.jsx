import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import SearchFilterRentals from "../components/SearchFilterRentals";
import { useProperty } from "../context/PropertyContext";
import { MapPin, X } from "lucide-react";

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

    // Sync search from URL query params
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

    const handleReset = () => {
        setSearch("");
        setTypeFilter("all");
        setCategory("all");
        setBudgetLimit(200000);
        setSortBy("recommended");
        setSearchParams({});
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
        <div className="page container">
            <div className="properties-page-header">
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {search && <MapPin size={22} color="#ec268f" />}
                        <h1>
                            {typeFilter === "commercial"
                                ? (search ? `Commercial Offices in ${search}` : "Commercial Offices in Jaipur")
                                : category === "sale"
                                ? (search ? `Properties for Sale in ${search}` : "Properties for Sale in Jaipur")
                                : (search ? `Properties & Projects in ${search}` : "Properties in Jaipur")}
                        </h1>
                    </div>
                    <p className="properties-subtitle">
                        Showing <strong>{filtered.length}</strong> verified{" "}
                        {typeFilter === "commercial"
                            ? "commercial office spaces"
                            : category === "sale"
                            ? "properties for sale"
                            : search
                            ? `properties matching "${search}"`
                            : "properties available for rent & sale"}
                    </p>
                </div>

                {/* QUICK TYPE & CATEGORY CHIPS */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                        type="button"
                        className={`rent-tab-btn ${typeFilter === "all" && category === "all" ? "active" : ""}`}
                        style={{ padding: "6px 14px", fontSize: "12.5px" }}
                        onClick={() => {
                            setTypeFilter("all");
                            setCategory("all");
                            setSearchParams(search ? { search } : {});
                        }}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        className={`rent-tab-btn ${typeFilter === "commercial" ? "active" : ""}`}
                        style={{ padding: "6px 14px", fontSize: "12.5px" }}
                        onClick={() => {
                            setTypeFilter("commercial");
                            setSearchParams(search ? { search, type: "commercial" } : { type: "commercial" });
                        }}
                    >
                        Commercial Office
                    </button>
                    <button
                        type="button"
                        className={`rent-tab-btn ${category === "sale" && typeFilter !== "commercial" ? "active" : ""}`}
                        style={{ padding: "6px 14px", fontSize: "12.5px" }}
                        onClick={() => {
                            setTypeFilter("all");
                            setCategory("sale");
                            setSearchParams(search ? { search, category: "sale" } : { category: "sale" });
                        }}
                    >
                        Buy (For Sale)
                    </button>
                    <button
                        type="button"
                        className={`rent-tab-btn ${category === "rent" && typeFilter !== "commercial" ? "active" : ""}`}
                        style={{ padding: "6px 14px", fontSize: "12.5px" }}
                        onClick={() => {
                            setTypeFilter("all");
                            setCategory("rent");
                            setSearchParams(search ? { search, category: "rent" } : { category: "rent" });
                        }}
                    >
                        Rentals
                    </button>
                    {search && (
                        <button
                            type="button"
                            className="clear-search-pill"
                            onClick={handleReset}
                        >
                            <X size={14} /> Clear Search Filter
                        </button>
                    )}
                </div>
            </div>

            <div className="rent-layout-container">
                {/* LEFT SIDEBAR: Search and Filter Rentals CARD */}
                <div className="rent-sidebar-col">
                    <SearchFilterRentals
                        search={search}
                        setSearch={(val) => {
                            setSearch(val);
                            if (val) {
                                setSearchParams({ search: val });
                            } else {
                                setSearchParams({});
                            }
                        }}
                        budgetLimit={budgetLimit}
                        setBudgetLimit={setBudgetLimit}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        onReset={handleReset}
                    />
                </div>

                {/* RIGHT COLUMN: RESULTS */}
                <div className="rent-main-col">
                    {filtered.length > 0 ? (
                        <div className="property-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
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
                            <h3>No properties match your filter criteria in "{search}"</h3>
                            <p>Try adjusting the budget slider or selecting another locality.</p>
                            <button className="primary-btn" onClick={handleReset} style={{ marginTop: "12px" }}>
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
