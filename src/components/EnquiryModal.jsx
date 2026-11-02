import { useState } from "react";
import { X, MessageCircle, Phone, CheckCircle, Send } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function EnquiryModal({ property, onClose }) {
    const { siteSettings, addBuyerLead } = useProperty();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("I am interested in this property. Please contact me.");
    const [submitted, setSubmitted] = useState(false);

    if (!property) return null;

    const contactPhone = siteSettings?.phone || "+91 70230 77367";
    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    const whatsappMessage = encodeURIComponent(
        `Hello Jaipur Ki Property! I am interested in "${property.title}" in ${property.location} (Rent: Rs ${property.price?.toLocaleString("en-IN")}/month). Please share more details.`
    );
    const whatsappUrl = `https://wa.me/${waNumber}?text=${whatsappMessage}`;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (addBuyerLead) {
            addBuyerLead({
                name: name.trim() || "Website Buyer",
                phone: phone.trim() || "N/A",
                propertyTitle: property.title,
                propertyPrice: `Rs ${Number(property.price).toLocaleString("en-IN")}/month`,
                message: message.trim(),
            });
        }
        setSubmitted(true);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Close">
                    <X size={18} />
                </button>

                <div className="modal-header">
                    <div className="modal-prop-thumb">
                        <img src={property.image} alt={property.title} />
                    </div>
                    <div className="modal-prop-info">
                        <span className="modal-badge">{property.badge}</span>
                        <h3>{property.title}</h3>
                        <p className="modal-loc">{property.location}</p>
                        <p className="modal-price">
                            Rs {Number(property.price).toLocaleString("en-IN")}
                            <small> / month</small>
                        </p>
                    </div>
                </div>

                <div className="modal-quick-actions">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="modal-wa-btn"
                    >
                        <MessageCircle size={16} />
                        <span>Chat on WhatsApp</span>
                    </a>

                    <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className="modal-call-btn">
                        <Phone size={16} />
                        <span>Call Owner</span>
                    </a>
                </div>

                <div className="modal-divider">
                    <span>or send inquiry directly</span>
                </div>

                {submitted ? (
                    <div className="modal-success-msg">
                        <CheckCircle size={32} color="#15803d" />
                        <h4>Enquiry Sent Successfully!</h4>
                        <p>Our verified owner / property team will call you at <strong>{phone}</strong> shortly.</p>
                        <button className="primary-btn" onClick={onClose} style={{ marginTop: "14px" }}>
                            Done
                        </button>
                    </div>
                ) : (
                    <form className="modal-form" onSubmit={handleSubmit}>
                        <div>
                            <label>Your Name</label>
                            <input
                                required
                                placeholder="Enter full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Phone Number (10 digits)</label>
                            <input
                                required
                                type="tel"
                                pattern="[0-9]{10}"
                                placeholder="e.g. 9829012345"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Message</label>
                            <textarea
                                rows="2"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="modal-submit-btn">
                            <Send size={15} />
                            <span>Send Free Enquiry</span>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

