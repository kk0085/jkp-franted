import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, MapPin } from "lucide-react";
import { popularLocations } from "../data/popularLocationsData";

export default function MobileStickySearchBar({
    search = "",
    setSearch,
    placeholder = "Search locality, flat, area in Jaipur...",
    onSubmit,
}) {
    const [searchInput, setSearchInput] = useState(search);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const searchContainerRef = useRef(null);

    // Keep internal input in sync with external search prop
    useEffect(() => {
        setSearchInput(search || "");
    }, [search]);

    // Sticky shadow when page is scrolled & close open dropdown on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
            setShowSuggestions(false);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close suggestions on outside click / touch / scroll
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside, { passive: true });
        document.addEventListener("pointerdown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, []);

    // Filter matched locations as user types
    const matchedLocations = useMemo(() => {
        if (!searchInput.trim()) return [];
        const clean = searchInput.trim().toLowerCase();
        return popularLocations.filter((loc) =>
            loc.name.toLowerCase().includes(clean)
        );
    }, [searchInput]);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setShowSuggestions(false);
        const trimmed = searchInput.trim();
        if (setSearch) setSearch(trimmed);
        if (onSubmit) onSubmit(trimmed);
    };

    const handleSelectSuggestion = (locName) => {
        setSearchInput(locName);
        setShowSuggestions(false);
        if (setSearch) setSearch(locName);
        if (onSubmit) onSubmit(locName);
    };

    const handleClear = () => {
        setSearchInput("");
        setShowSuggestions(false);
        if (setSearch) setSearch("");
        if (onSubmit) onSubmit("");
    };

    return (
        <div className={`rent-search-sticky-wrap mobile-only-sticky-search ${isScrolled ? "is-sticky" : ""}`}>
            <div className="container">
                <div className="home-search-hero-bar" ref={searchContainerRef}>
                    <form onSubmit={handleSearchSubmit} className="home-search-input-row">
                        <div className="home-search-input-box">
                            <Search size={18} color="#ec268f" style={{ flexShrink: 0 }} />
                            <input
                                type="text"
                                placeholder={placeholder}
                                value={searchInput}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchInput(val);
                                    setShowSuggestions(true);
                                    if (setSearch) setSearch(val);
                                }}
                                onFocus={() => {
                                    if (searchInput.trim()) setShowSuggestions(true);
                                }}
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        color: "#94a3b8",
                                    }}
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <button type="submit" className="home-search-btn">
                            <Search size={16} /> <span>Search</span>
                        </button>
                    </form>

                    {/* AUTOCOMPLETE LOCATION SUGGESTIONS */}
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
                                    <span>Press Enter to search for <strong>"{searchInput}"</strong></span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

