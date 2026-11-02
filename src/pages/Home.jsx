import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import ListingPlans from "../components/ListingPlans";
import PropertySection from "../components/PropertySection";
import PropertyCard from "../components/PropertyCard";
import WhyChooseUs from "../components/WhyChooseUs";
import { useProperty } from "../context/PropertyContext";
import { popularLocations } from "../data/popularLocationsData";
import { MapPin, Search, X, Building2, Sparkles, SlidersHorizontal } from "lucide-react";

export default function Home() {
    const { properties, openEnquiry } = useProperty();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlSearchQuery = searchParams.get("search") || "";

    const [searchInput, setSearchInput] = useState(urlSearchQuery);
    const [selectedLocality, setSelectedLocality] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const searchContainerRef = useRef(null);

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

    // Sync input with urlSearchQuery if url changes
    useEffect(() => {
        if (urlSearchQuery) {
            setSearchInput(urlSearchQuery);
            setSelectedLocality(urlSearchQuery);
        }
    }, [urlSearchQuery]);

    // Real-time matching locations as user types letters/words
    const matchedLocations = useMemo(() => {
        if (!searchInput.trim()) return [];
        const clean = searchInput.trim().toLowerCase();
        return popularLocations.filter((loc) =>
            loc.name.toLowerCase().includes(clean)
        );
    }, [searchInput]);

    const handleSelectSuggestion = (locName) => {
        setSearchInput(locName);
        setSelectedLocality(locName);
        setShowSuggestions(false);
        setSearchParams({ search: locName });
    };

    useEffect(() => {
        document.title = urlSearchQuery || selectedLocality !== "all"
            ? `Jaipur ki Property - ${selectedLocality !== "all" ? selectedLocality : urlSearchQuery}`
            : "Jaipur ki Property - Verified Flats, Houses & Villas";
    }, [urlSearchQuery, selectedLocality]);

    // Handle smooth scrolling when navigated to #plans, #for-rent, etc.
    useEffect(() => {
        if (location.hash) {
            const targetId = location.hash.replace("#", "");
            const element = document.getElementById(targetId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        }
    }, [location]);

    // Filter projects based on selected locality, search input, and category
    const displayedProjects = useMemo(() => {
        return properties.filter((p) => {
            // Locality filter
            if (selectedLocality !== "all") {
                const locMatch = p.location.toLowerCase().includes(selectedLocality.toLowerCase()) ||
                    p.title.toLowerCase().includes(selectedLocality.toLowerCase()) ||
                    p.description.toLowerCase().includes(selectedLocality.toLowerCase());
                if (!locMatch) return false;
            }

            // Keyword search filter
            if (searchInput.trim()) {
                const clean = searchInput.trim().toLowerCase();
                const textMatch = p.title.toLowerCase().includes(clean) ||
                    p.location.toLowerCase().includes(clean) ||
                    p.description.toLowerCase().includes(clean) ||
                    p.type.toLowerCase().includes(clean);
                if (!textMatch) return false;
            }

            // Category filter
            if (selectedCategory === "flat") return p.type === "flat" && p.category === "rent";
            if (selectedCategory === "house") return (p.type === "house" || p.type === "villa") && p.category === "rent";
            if (selectedCategory === "sale") return p.category === "sale";
            if (selectedCategory === "commercial") return p.type === "commercial";

            return true;
        });
    }, [properties, selectedLocality, searchInput, selectedCategory]);

    const handleLocalityClick = (locName) => {
        if (selectedLocality === locName) {
            setSelectedLocality("all");
            setSearchInput("");
            setSearchParams({});
        } else {
            setSelectedLocality(locName);
            setSearchInput("");
            setSearchParams({ search: locName });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ search: searchInput.trim() });
        } else {
            setSearchParams({});
        }
    };

    const handleClearAllFilters = () => {
        setSelectedLocality("all");
        setSelectedCategory("all");
        setSearchInput("");
        setSearchParams({});
    };

    const rentProperties = properties.filter((p) => p.type === "flat").slice(0, 4);
    const houseProperties = properties.filter((p) => p.type === "house" || p.type === "villa").slice(0, 4);

    return (
        <div className="home-page">
            <HeroSlider />

            {/* PROMINENT SEARCH BAR RIGHT BELOW HERO */}
            <section className="container" style={{ margin: "-28px auto 32px" }}>
                <div className="home-search-hero-bar" ref={searchContainerRef}>
                    <form onSubmit={handleSearchSubmit} className="home-search-input-row">
                        <div className="home-search-input-box">
                            <Search size={18} color="#ec268f" style={{ flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder="Search locality (e.g. Mansarovar, Jagatpura, C Scheme, Vaishali Nagar)..."
                                value={searchInput}
                                onChange={(e) => {
                                    setSearchInput(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => {
                                    if (searchInput.trim()) setShowSuggestions(true);
                                }}
                            />
                            {searchInput && (
                                <X
                                    size={16}
                                    style={{ cursor: "pointer", color: "#94a3b8" }}
                                    onClick={() => {
                                        setSearchInput("");
                                        setShowSuggestions(false);
                                        setSelectedLocality("all");
                                        setSearchParams({});
                                    }}
                                />
                            )}
                        </div>
                        <button type="submit" className="home-search-btn">
                            <Search size={16} /> Search
                        </button>
                    </form>

                    {/* AUTOCOMPLETE LOCATION SUGGESTIONS (WORD DALTE HI LOCATION SHOW HONI CHAHIYE) */}
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
            </section>

            {/* FEATURED PROJECTS BY LOCALITY SHOWCASE SECTION */}
            <section className="container" style={{ margin: "28px auto 40px" }} id="locality-projects">
                <div className="home-section-header">
                    <div className="home-section-title-wrap">
                        <h2>
                            <Building2 size={24} color="#ec268f" />
                            {selectedLocality !== "all" ? (
                                <>Projects & Properties in {selectedLocality}</>
                            ) : (
                                <>Projects Across Jaipur Localities</>
                            )}
                        </h2>
                        <p>
                            {selectedLocality !== "all"
                                ? `Verified projects in ${selectedLocality} (Flats, Villas, Houses & Commercial)`
                                : `Browse verified projects across Jaipur's prime localities.`}
                        </p>
                    </div>

                    {/* CATEGORY SWITCHER TABS */}
                    <div className="home-cat-tabs">
                        <button
                            type="button"
                            className={`home-cat-tab-btn ${selectedCategory === "all" ? "active" : ""}`}
                            onClick={() => setSelectedCategory("all")}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            className={`home-cat-tab-btn ${selectedCategory === "flat" ? "active" : ""}`}
                            onClick={() => setSelectedCategory("flat")}
                        >
                            Flats
                        </button>
                        <button
                            type="button"
                            className={`home-cat-tab-btn ${selectedCategory === "house" ? "active" : ""}`}
                            onClick={() => setSelectedCategory("house")}
                        >
                            Houses & Villas
                        </button>
                        <button
                            type="button"
                            className={`home-cat-tab-btn ${selectedCategory === "sale" ? "active" : ""}`}
                            onClick={() => setSelectedCategory("sale")}
                        >
                            For Sale
                        </button>
                        <button
                            type="button"
                            className={`home-cat-tab-btn ${selectedCategory === "commercial" ? "active" : ""}`}
                            onClick={() => setSelectedCategory("commercial")}
                        >
                            Commercial
                        </button>
                    </div>
                </div>

                {/* PROPERTY CARDS GRID */}
                {displayedProjects.length > 0 ? (
                    <div
                        className="property-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {displayedProjects.map((p) => (
                            <PropertyCard key={p.id} property={p} onEnquiry={openEnquiry} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results-box" style={{ textAlign: "center", padding: "40px 20px", background: "#f8fafc", borderRadius: "14px" }}>
                        <Building2 size={36} color="#94a3b8" style={{ margin: "0 auto 10px" }} />
                        <h3 style={{ fontSize: "17px", color: "#1e293b", margin: 0 }}>
                            No properties found in "{selectedLocality !== "all" ? selectedLocality : searchInput}"
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>
                            Try selecting another locality or reset filters to see all Jaipur properties.
                        </p>
                        <button
                            className="primary-btn"
                            onClick={handleClearAllFilters}
                            style={{ marginTop: "14px", padding: "8px 20px", fontSize: "13px" }}
                        >
                            Show All Projects
                        </button>
                    </div>
                )}
            </section>

            {/* LISTING PLANS */}
            <div id="plans">
                <ListingPlans />
            </div>

            {/* DEFAULT FOR RENT SECTIONS */}
            <section className="for-rent-container container" id="for-rent" style={{ marginTop: "36px" }}>
                <h2 className="for-rent-heading">Popular Rental Categories</h2>

                <div id="flat-homes">
                    <PropertySection
                        title="Flat Homes"
                        subtitle="Verified deals for families and working professionals."
                        properties={rentProperties}
                        moreLink="/properties?type=flat"
                        onEnquiry={openEnquiry}
                    />
                </div>

                <div id="independent-houses" style={{ marginTop: "36px" }}>
                    <PropertySection
                        title="Independent Houses & Luxury Villas"
                        subtitle="Private houses and villas with personal lawns and car parking."
                        properties={houseProperties}
                        moreLink="/properties?type=house"
                        onEnquiry={openEnquiry}
                    />
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <div className="container" style={{ marginTop: "36px" }}>
                <WhyChooseUs />
            </div>
        </div>
    );
}
