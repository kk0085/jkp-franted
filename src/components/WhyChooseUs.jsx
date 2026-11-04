import {
    ShieldCheck,
    Phone,
    IndianRupee,
    MapPin,
} from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Listings",
        description:
            "Every property is verified by our team. No fake listings, no misleading photos. Trust what you see.",
        iconBg: "#dcfce7",
        iconColor: "#16a34a",
    },
    {
        icon: Phone,
        title: "Direct Owner Contact",
        description:
            "Connect directly with property owners via WhatsApp or call with complete transparency and verified details.",
        iconBg: "#ffe4e6",
        iconColor: "#e11d48",
    },
    {
        icon: IndianRupee,
        title: "Transparent Pricing",
        description:
            "Clear rent, maintenance, and deposit details upfront. No hidden charges, no surprises ever.",
        iconBg: "#e0f2fe",
        iconColor: "#0284c7",
    },
    {
        icon: MapPin,
        title: "All Localities Covered",
        description:
            "Vaishali Nagar, Mansarovar, Malviya Nagar, Jagatpura, Tonk Road - rentals across every Jaipur locality.",
        iconBg: "#f3e8ff",
        iconColor: "#9333ea",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="why-section">
            <div className="why-heading">
                <h2>
                    Why Choose <span className="why-highlight">Jaipur Ki Property?</span>
                </h2>
                <p>
                    Jaipur's most trusted rental platform helping thousands of families and
                    verified properties with direct owner contact - 100% genuine clients, no hidden charges.
                </p>
            </div>

            <div className="why-grid">
                {features.map(({ icon: Icon, title, description, iconBg, iconColor }) => (
                    <div className="why-card" key={title}>
                        <div
                            className="why-icon-badge"
                            style={{ backgroundColor: iconBg, color: iconColor }}
                        >
                            <Icon size={18} />
                        </div>

                        <div>
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
