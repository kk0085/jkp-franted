import { useState } from "react";
import { X, Check, ShieldCheck, Sparkles, MessageCircle, Phone, User, Zap, Building } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function PlanActivationModal({ isOpen, onClose, plan }) {
    const { addBuyerLead, user, siteSettings } = useProperty();
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [propertyTitle, setPropertyTitle] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen || !plan) return null;

    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            alert("Please enter your name and WhatsApp contact number.");
            return;
        }

        if (addBuyerLead) {
            addBuyerLead({
                name: name.trim(),
                phone: phone.trim(),
                propertyTitle: propertyTitle.trim() || `${plan.title} Package`,
                propertyPrice: plan.price || "Listing Plan",
                message: `💼 OWNER PACKAGE ACTIVATION [${plan.title} - ${plan.price}]: Property: ${propertyTitle || "Not specified"}. Name: ${name}, Phone: ${phone}`,
            });
        }

        setIsSuccess(true);
    };

    const whatsappUrl = () => {
        const msg = encodeURIComponent(
            `Hello Jaipur Ki Property! I want to activate the *${plan.title}* package (${plan.price}) for my property in Jaipur.\n\n*Owner Name:* ${name}\n*Phone:* ${phone}\n*Property:* ${propertyTitle || "My Property"}\n\nPlease guide me with the activation process!`
        );
        return `https://wa.me/${waNumber}?text=${msg}`;
    };

    return (
        <div className="plan-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="plan-modal-card" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="plan-modal-close" onClick={onClose} aria-label="Close modal">
                    <X size={18} />
                </button>

                {isSuccess ? (
                    <div className="plan-modal-success">
                        <div className="plan-success-icon-box">
                            <Check size={40} color="#16a34a" />
                        </div>
                        <h3>Request Received!</h3>
                        <p>
                            Thank you, <strong>{name}</strong>! Your upgrade request for <strong>{plan.title} ({plan.price})</strong> has been recorded.
                        </p>
                        <div className="plan-success-box">
                            <div className="plan-success-row">
                                <span>Package:</span>
                                <strong>{plan.title}</strong>
                            </div>
                            <div className="plan-success-row">
                                <span>Pricing:</span>
                                <strong style={{ color: "#ec268f" }}>{plan.price}</strong>
                            </div>
                            <div className="plan-success-row">
                                <span>Activation Time:</span>
                                <strong style={{ color: "#16a34a" }}>Within 15 Minutes</strong>
                            </div>
                        </div>

                        <a
                            href={whatsappUrl()}
                            target="_blank"
                            rel="noreferrer"
                            className="plan-wa-action-btn"
                        >
                            <MessageCircle size={18} />
                            <span>Instant WhatsApp Activation</span>
                        </a>

                        <button type="button" className="plan-done-btn" onClick={onClose}>
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="plan-modal-form">
                        <div className="plan-modal-header">
                            <div className="plan-modal-badge">{plan.price}</div>
                            <h3>{plan.title}</h3>
                            <p>{plan.text}</p>
                        </div>

                        <div className="plan-input-group">
                            <label>
                                <User size={14} color="#ec268f" />
                                <span>Your Full Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter owner name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="plan-input-group">
                            <label>
                                <Phone size={14} color="#ec268f" />
                                <span>WhatsApp Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="Enter 10-digit mobile number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="plan-input-group">
                            <label>
                                <Building size={14} color="#ec268f" />
                                <span>Property Details & Locality in Jaipur</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 3 BHK Flat in Mansarovar, or Villa in Jagatpura"
                                value={propertyTitle}
                                onChange={(e) => setPropertyTitle(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="plan-modal-submit-btn">
                            <Zap size={16} />
                            <span>Proceed to Activate ({plan.price})</span>
                        </button>

                        <div className="plan-modal-footer-trust">
                            <span><ShieldCheck size={13} color="#16a34a" /> 100% Verified Owner Service</span>
                            <span>•</span>
                            <span><Sparkles size={13} color="#ec268f" /> 0% Brokerage</span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
