import { useState } from "react";
import { CheckCircle, Upload, ShieldCheck } from "lucide-react";

export default function PostProperty() {
    const [form, setForm] = useState({
        title: "",
        propertyType: "flat",
        location: "",
        price: "",
        bhk: "2 BHK",
        bathrooms: "2",
        furnishing: "Semi-Furnished",
        description: "",
        ownerName: "",
        ownerPhone: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="page container">
            <div className="property-form-wrapper">
                {submitted ? (
                    <div className="post-success-card">
                        <CheckCircle size={48} color="#15803d" />
                        <h2>Property Submitted for Free Verification!</h2>
                        <p>
                            Thank you <strong>{form.ownerName || "Property Owner"}</strong>! Our Jaipur verification team
                            will review your listing details and verify the property within 2-4 hours.
                        </p>
                        <button
                            className="primary-btn"
                            onClick={() => {
                                setSubmitted(false);
                                setForm({
                                    title: "",
                                    propertyType: "flat",
                                    location: "",
                                    price: "",
                                    bhk: "2 BHK",
                                    bathrooms: "2",
                                    furnishing: "Semi-Furnished",
                                    description: "",
                                    ownerName: "",
                                    ownerPhone: "",
                                });
                            }}
                        >
                            Post Another Property
                        </button>
                    </div>
                ) : (
                    <form className="property-form" onSubmit={submit}>
                        <div className="form-heading">
                            <div className="form-badge">
                                <ShieldCheck size={16} /> 100% Free Owner Listing
                            </div>
                            <h1>Post Your Property on Jaipur Ki Property</h1>
                            <p>
                                Connect directly with thousands of genuine tenants in Jaipur. Zero broker interference, zero commission.
                            </p>
                        </div>

                        <div className="form-section-title">1. Basic Property Details</div>
                        <div className="form-grid">
                            <div>
                                <label>Property Title *</label>
                                <input
                                    required
                                    name="title"
                                    value={form.title}
                                    onChange={change}
                                    placeholder="e.g. 2 BHK Spacious Flat Near WTP"
                                />
                            </div>

                            <div>
                                <label>Property Type *</label>
                                <select
                                    name="propertyType"
                                    value={form.propertyType}
                                    onChange={change}
                                >
                                    <option value="flat">Flat / Apartment</option>
                                    <option value="house">Independent House</option>
                                    <option value="villa">Luxury Villa</option>
                                    <option value="commercial">Commercial Office</option>
                                </select>
                            </div>

                            <div>
                                <label>Jaipur Locality *</label>
                                <input
                                    required
                                    name="location"
                                    value={form.location}
                                    onChange={change}
                                    placeholder="e.g. Malviya Nagar, Vaishali Nagar, Jagatpura"
                                />
                            </div>

                            <div>
                                <label>Expected Monthly Rent (₹) *</label>
                                <input
                                    required
                                    name="price"
                                    type="number"
                                    value={form.price}
                                    onChange={change}
                                    placeholder="e.g. 25000"
                                />
                            </div>

                            <div>
                                <label>Bedrooms (BHK) *</label>
                                <select name="bhk" value={form.bhk} onChange={change}>
                                    <option value="1 BHK">1 BHK</option>
                                    <option value="2 BHK">2 BHK</option>
                                    <option value="3 BHK">3 BHK</option>
                                    <option value="4 BHK">4+ BHK</option>
                                </select>
                            </div>

                            <div>
                                <label>Furnishing Status</label>
                                <select
                                    name="furnishing"
                                    value={form.furnishing}
                                    onChange={change}
                                >
                                    <option value="Semi-Furnished">Semi-Furnished</option>
                                    <option value="Fully Furnished">Fully Furnished</option>
                                    <option value="Unfurnished">Unfurnished</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-section-title" style={{ marginTop: "24px" }}>
                            2. Description & Images
                        </div>

                        <label>Property Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={change}
                            rows="4"
                            placeholder="Mention floor number, nearby landmarks (metro, schools, hospital), water supply, and parking details..."
                        />

                        <label>Upload Property Photos</label>
                        <div className="file-upload-box">
                            <Upload size={28} color="#8c1658" />
                            <p><strong>Click to browse</strong> or drag & drop property photos</p>
                            <span>PNG, JPG, JPEG up to 10MB</span>
                            <input type="file" multiple className="file-hidden-input" />
                        </div>

                        <div className="form-section-title" style={{ marginTop: "24px" }}>
                            3. Owner Contact Details
                        </div>
                        <div className="form-grid">
                            <div>
                                <label>Your Name *</label>
                                <input
                                    required
                                    name="ownerName"
                                    value={form.ownerName}
                                    onChange={change}
                                    placeholder="e.g. Rajesh Sharma"
                                />
                            </div>

                            <div>
                                <label>Mobile / WhatsApp Number *</label>
                                <input
                                    required
                                    type="tel"
                                    pattern="[0-9]{10}"
                                    name="ownerPhone"
                                    value={form.ownerPhone}
                                    onChange={change}
                                    placeholder="e.g. 9829012345"
                                />
                            </div>
                        </div>

                        <button type="submit" className="primary-btn submit-post-btn">
                            Post Property Now - It's Free
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
