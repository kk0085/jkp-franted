import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";

export default function PropertySection({
    title,
    subtitle,
    properties,
    moreLink = "/properties",
    moreText = "More",
    onEnquiry,
    columns = 3,
}) {
    return (
        <div className="property-subsection">
            <div className="subsection-header">
                <div>
                    <h3 className="subsection-title">{title}</h3>
                    <p className="subsection-subtitle">{subtitle}</p>
                </div>

                <Link to={moreLink} className="subsection-more">{moreText}</Link>
            </div>

            <div className={`property-grid cols-${columns}`}>
                {properties.map((property) => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        onEnquiry={onEnquiry}
                    />
                ))}
            </div>
        </div>
    );
}
