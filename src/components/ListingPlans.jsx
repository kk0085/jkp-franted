import { useProperty } from "../context/PropertyContext";

const defaultPlans = [
    {
        number: "1.",
        title: "BASIC LISTING",
        price: "FREE",
        text: "One active free property listing per owner at a time, subject to eligibility and verification. Define expiry and renewal rules.",
    },
    {
        number: "2.",
        title: "LISTING CREDITS",
        price: "₹499",
        text: "Paid credits for additional property listings or renewals beyond the included free listing.",
    },
    {
        number: "3.",
        title: "SPONSORED / TOP FEED",
        price: "₹1,499",
        text: "Paid promotional placements on the website and official social media handles. Mark promotions clearly.",
    },
];

export default function ListingPlans() {
    const { siteSettings } = useProperty();
    const plans = siteSettings?.plans && siteSettings.plans.length > 0 ? siteSettings.plans : defaultPlans;

    return (
        <section className="plans container" id="plans">
            {plans.map((plan, index) => (
                <div className={`plan-card plan-${index + 1}`} key={plan.title || index}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                        <h3 style={{ margin: 0 }}>
                            {plan.number} {plan.title}
                        </h3>
                        {plan.price && (
                            <span
                                style={{
                                    background: "#fdf2f8",
                                    color: "#ec268f",
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    padding: "2px 8px",
                                    borderRadius: "999px",
                                    border: "1px solid #fbcfe8",
                                }}
                            >
                                {plan.price}
                            </span>
                        )}
                    </div>
                    <p>{plan.text}</p>
                </div>
            ))}
        </section>
    );
}
