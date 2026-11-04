import { MapPin, ArrowRight, Sparkles } from "lucide-react";

export const jaipurLocalitiesList = [
    {
        id: "mansarovar",
        name: "Mansarovar",
        tag: "Metro Connected",
        accent: "#15803d",
        tagline: "Asia's Largest Colony • City Park & Markets",
        avgRent: "₹12,000 - ₹25,000 / mo",
        count: "120+ Deals",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "jagatpura",
        name: "Jagatpura",
        tag: "IT & University Hub",
        accent: "#ec268f",
        tagline: "Modern High-Rise Gated Societies",
        avgRent: "₹14,000 - ₹35,000 / mo",
        count: "95+ Deals",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "vaishali-nagar",
        name: "Vaishali Nagar",
        tag: "Posh & Luxury Living",
        accent: "#ea580c",
        tagline: "Amrapali Circle • High-End Cafes & Villas",
        avgRent: "₹18,000 - ₹50,000 / mo",
        count: "80+ Deals",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "malviya-nagar",
        name: "Malviya Nagar",
        tag: "Near Airport & WTP",
        accent: "#1e3a8a",
        tagline: "Central Jaipur • WTP Mall & Green Living",
        avgRent: "₹16,000 - ₹40,000 / mo",
        count: "75+ Deals",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "ajmer-road",
        name: "Ajmer Road",
        tag: "Gated Townships",
        accent: "#0284c7",
        tagline: "Mahindra SEZ • Highway Gated Duplexes",
        avgRent: "₹10,000 - ₹25,000 / mo",
        count: "65+ Deals",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "tonk-road",
        name: "Tonk Road",
        tag: "Airport Growth Corridor",
        accent: "#7c3aed",
        tagline: "Sitapura Tech Hub • Chokhi Dhani Area",
        avgRent: "₹12,000 - ₹30,000 / mo",
        count: "55+ Deals",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "patrakar-colony",
        name: "Patrakar Colony",
        tag: "Peaceful Residential",
        accent: "#0d9488",
        tagline: "Adjacent to Mansarovar • Wide Peaceful Roads",
        avgRent: "₹10,000 - ₹22,000 / mo",
        count: "45+ Deals",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80",
    },
    {
        id: "c-scheme",
        name: "C Scheme",
        tag: "Elite VIP Zone",
        accent: "#b45309",
        tagline: "Heart of Jaipur • High Profile Living",
        avgRent: "₹25,000 - ₹75,000 / mo",
        count: "40+ Deals",
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&auto=format&fit=crop&q=80",
    },
];

export default function TopLocalitiesSection({ selectedLocality, onSelectLocality }) {
    const handleLocalityClick = (locName) => {
        if (onSelectLocality) {
            onSelectLocality(locName);
        }
        const elem = document.getElementById("locality-projects");
        if (elem) {
            elem.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="top-localities-section" id="top-localities" aria-label="Explore Top Jaipur Localities">
            <div className="container">
                {/* SECTION HEADER */}
                <div className="top-localities-header">
                    <div className="localities-title-wrap">
                        <div className="localities-badge">
                            <Sparkles size={14} color="#ec268f" />
                            <span>Explore Jaipur by Area</span>
                        </div>
                        <h2 className="localities-main-title">
                            Top <span className="highlight-text">Jaipur Localities</span> to Live & Invest
                        </h2>
                        <p className="localities-subtitle">
                            Discover verified flats, independent houses and villas across Jaipur's most sought-after prime neighborhoods.
                        </p>
                    </div>

                    <div className="localities-header-action">
                        <span className="locality-hint-pill">
                            <MapPin size={13} color="#ec268f" />
                            <span>Click any locality to view properties</span>
                        </span>
                    </div>
                </div>

                {/* LOCALITIES VISUAL CARDS GRID */}
                <div className="localities-cards-grid">
                    {jaipurLocalitiesList.map((loc) => {
                        const isSelected = selectedLocality && selectedLocality.toLowerCase() === loc.name.toLowerCase();

                        return (
                            <div
                                key={loc.id}
                                className={`locality-visual-card ${isSelected ? "is-selected" : ""}`}
                                onClick={() => handleLocalityClick(loc.name)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        handleLocalityClick(loc.name);
                                    }
                                }}
                            >
                                {/* CARD BACKGROUND IMAGE */}
                                <div className="locality-card-img-wrap">
                                    <img
                                        src={loc.image}
                                        alt={`Properties in ${loc.name}, Jaipur`}
                                        loading="lazy"
                                        className="locality-card-img"
                                    />
                                    <div className="locality-card-gradient"></div>
                                </div>

                                {/* CARD CONTENT OVERLAY */}
                                <div className="locality-card-content">
                                    {/* TOP TAGS */}
                                    <div className="locality-top-row">
                                        <span
                                            className="locality-tag-pill"
                                            style={{ backgroundColor: `${loc.accent}20`, borderColor: `${loc.accent}55`, color: loc.accent }}
                                        >
                                            {loc.tag}
                                        </span>
                                        <span className="locality-deals-count">
                                            {loc.count}
                                        </span>
                                    </div>

                                    {/* BOTTOM INFO */}
                                    <div className="locality-bottom-info">
                                        <h3 className="locality-name">
                                            <MapPin size={16} className="loc-pin-icon" />
                                            <span>{loc.name}</span>
                                        </h3>

                                        <p className="locality-tagline">{loc.tagline}</p>

                                        <div className="locality-price-row">
                                            <span className="locality-avg-rent">
                                                {loc.avgRent}
                                            </span>
                                            <span className="locality-explore-btn">
                                                <span>View Deals</span>
                                                <ArrowRight size={13} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
