import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, MapPin, ArrowRight } from "lucide-react";
import { popularLocations } from "../data/popularLocationsData";

export default function SearchLocationModal({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSelectLocation = (locationName) => {
        onClose();
        navigate(`/rent?search=${encodeURIComponent(locationName)}`);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onClose();
            navigate(`/rent?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const filteredLocations = popularLocations.filter((loc) =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="search-modal-backdrop" onClick={onClose}>
            <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
                {/* SEARCH INPUT BAR */}
                <form className="search-modal-input-row" onSubmit={handleSearchSubmit}>
                    <Search size={18} className="search-modal-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search locality (e.g. Mansarovar, Malviya Nagar)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="search-clear-btn"
                            onClick={() => setSearchTerm("")}
                            title="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <button type="submit" className="search-submit-btn">
                        Search
                    </button>
                    <button
                        type="button"
                        className="search-modal-close-btn"
                        onClick={onClose}
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                </form>

                {/* SINGLE COLUMN LOCATION LIST - ONLY LOCATION NAME, NO BORDER */}
                <div className="location-cards-grid">
                    {filteredLocations.map((loc) => (
                        <button
                            key={loc.id}
                            type="button"
                            className="loc-clean-name-btn"
                            onClick={() => handleSelectLocation(loc.name)}
                        >
                            {loc.name}
                        </button>
                    ))}
                </div>

                {filteredLocations.length === 0 && (
                    <div className="loc-search-no-match">
                        <p>No exact locality match for "{searchTerm}".</p>
                        <button
                            type="button"
                            className="primary-btn"
                            onClick={handleSearchSubmit}
                            style={{ marginTop: "8px" }}
                        >
                            Search all properties for "{searchTerm}"
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

