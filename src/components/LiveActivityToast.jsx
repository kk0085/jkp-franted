import { useState, useEffect } from "react";
import { CheckCircle2, Car, Sparkles, Building, Key, X } from "lucide-react";

const activities = [
    {
        id: 1,
        title: "Free Site Visit Booked!",
        desc: "Rohit S. from Mansarovar booked a free cab site visit",
        time: "Just now",
        icon: Car,
        accent: "#ec268f",
        tag: "Mansarovar",
    },
    {
        id: 2,
        title: "Direct Owner Deal Claimed!",
        desc: "Pooja V. connected with 3 BHK owner in Jagatpura",
        time: "3 mins ago",
        icon: Key,
        accent: "#15803d",
        tag: "Jagatpura",
    },
    {
        id: 3,
        title: "Zero Brokerage Pass Claimed!",
        desc: "Ankit M. from Vaishali Nagar claimed the VIP Pass",
        time: "7 mins ago",
        icon: Sparkles,
        accent: "#ea580c",
        tag: "Vaishali Nagar",
    },
    {
        id: 4,
        title: "Property Inquiry Sent!",
        desc: "New inquiry on 2 BHK Luxury Flat near WTP Mall",
        time: "12 mins ago",
        icon: Building,
        accent: "#1e3a8a",
        tag: "Malviya Nagar",
    },
    {
        id: 5,
        title: "Free Cab Dispatched!",
        desc: "Family from Tonk Road visiting gated villa project",
        time: "15 mins ago",
        icon: Car,
        accent: "#ec268f",
        tag: "Tonk Road",
    },
];

export default function LiveActivityToast() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        if (isDismissed) return;

        // Start showing toast after 4 seconds of page load
        const initialTimer = setTimeout(() => {
            setIsVisible(true);
        }, 4000);

        // Interval to cycle through activities: show for 4.5s, hide for 6s
        const interval = setInterval(() => {
            setIsVisible(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % activities.length);
                setIsVisible(true);
            }, 6000);
        }, 11000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, [isDismissed]);

    if (isDismissed || !isVisible) return null;

    const current = activities[currentIndex];
    const IconComponent = current.icon;

    return (
        <aside className="live-activity-toast" aria-live="polite" aria-label="Recent user activity in Jaipur">
            <div className="activity-icon-wrap" style={{ backgroundColor: `${current.accent}15`, color: current.accent }}>
                <IconComponent size={18} />
                <span className="live-pulse-dot" style={{ backgroundColor: current.accent }}></span>
            </div>

            <div className="activity-details">
                <div className="activity-header-row">
                    <span className="activity-tag">{current.tag}</span>
                    <span className="activity-time">{current.time}</span>
                </div>
                <h5 className="activity-title">{current.title}</h5>
                <p className="activity-desc">{current.desc}</p>
            </div>

            <button
                type="button"
                className="activity-close-btn"
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss notification"
            >
                <X size={13} />
            </button>
        </aside>
    );
}
