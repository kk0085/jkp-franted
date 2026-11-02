import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

const slides = [
    {
        image:
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80",
        title: "Find Your Best Home & Villa in Jaipur",
        description:
            "Explore verified residential plots, luxury villas, and rental apartments across Jaipur",
    },
    {
        image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80",
        title: "Modern 2 & 3 BHK Flats For Rent",
        description:
            "Furnished and semi-furnished apartments in Mansarovar, Malviya Nagar & Vaishali Nagar",
    },
    {
        image:
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&auto=format&fit=crop&q=80",
        title: "Spacious Independent Houses & Duplexes",
        description:
            "Private family residences with personal car parking, open terraces, and quiet neighborhoods",
    },
    {
        image:
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&auto=format&fit=crop&q=80",
        title: "Verified Rental Deals Direct From Owners",
        description:
            "100% verified property listings with zero brokerage and direct owner contact",
    },
    {
        image:
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1600&auto=format&fit=crop&q=80",
        title: "Exclusive Luxury Villas in Jagatpura",
        description:
            "Gated society luxury villas featuring private gardens, clubhouses, and 24/7 security",
    },
    {
        image:
            "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=80",
        title: "Post Your Property Free in Jaipur",
        description:
            "Connect with thousands of genuine tenants and buyers looking for homes today",
    },
];

export default function HeroSlider() {
    const { siteSettings } = useProperty();
    const activeSlides =
        siteSettings?.heroSlides && siteSettings.heroSlides.length > 0
            ? siteSettings.heroSlides
            : slides;

    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-scroll slider every 3.5 seconds (pauses on hover)
    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % activeSlides.length);
        }, 3500);

        return () => clearInterval(timer);
    }, [isHovered, activeSlides.length]);

    const next = () => {
        setCurrent((prev) => (prev + 1) % activeSlides.length);
    };

    const previous = () => {
        setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    };

    const currentSlide = activeSlides[current % activeSlides.length] || activeSlides[0];

    return (
        <section
            className="hero"
            style={{
                backgroundImage: `url(${currentSlide.image})`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="hero-overlay" />

            <button className="slider-arrow left" onClick={previous} aria-label="Previous slide">
                <ChevronLeft size={22} />
            </button>

            <div className="hero-content container" key={current}>
                <h1>{currentSlide.title}</h1>
                <p>{currentSlide.description}</p>
            </div>

            <button className="slider-arrow right" onClick={next} aria-label="Next slide">
                <ChevronRight size={22} />
            </button>

            <div className="slider-dots">
                {activeSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={index === (current % activeSlides.length) ? "active" : ""}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
