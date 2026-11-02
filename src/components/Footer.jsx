import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, ShieldCheck, MessageCircle, PhoneCall } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function Footer() {
    const { siteSettings } = useProperty();
    const [isDisclaimerExpanded, setIsDisclaimerExpanded] = useState(false);

    const email = siteSettings?.email || "support@jaipurkiproperty.com";
    const address = siteSettings?.address || "Jaipur, Rajasthan, IN";
    const phone = siteSettings?.phone || "+91 70230 77367";
    const rawPhone = siteSettings?.rawPhone || phone.replace(/\D/g, "");
    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    return (
        <footer className="footer">
            <div className="container footer-grid">
                <div className="footer-brand-col">
                    <div className="footer-logo">
                        <img src="/logo.png" alt="Jaipur Ki Property" className="footer-logo-img" />
                    </div>

                    <p className="footer-desc">
                        Verified rental listings in Jaipur — flats,
                        independent houses, sharing rooms, and commercial spaces.
                    </p>

                    <span className="secure-badge">
                        ● Secure & Verified
                    </span>
                </div>

                <div>
                    <h4 className="footer-col-title">QUICK LINKS</h4>
                    <div className="footer-links-list">
                        <Link to="/">Home</Link>
                        <Link to="/properties">All Rentals</Link>
                        <Link to="/post-property">Post Property Free</Link>
                        <Link to="/properties?category=flat">Flat</Link>
                        <Link to="/properties?category=house">Independent House</Link>
                        <Link to="/properties?category=commercial">Commercial Office</Link>
                    </div>
                </div>

                <div>
                    <h4 className="footer-col-title">FOR TENANTS</h4>
                    <p className="footer-tenants-text">
                        Browse verified properties, send an inquiry, and connect directly with us.
                    </p>
                    <div className="footer-trust-tag">
                        <ShieldCheck size={14} className="trust-icon" />
                        <span>Trusted by tenants across Jaipur</span>
                    </div>
                </div>

                <div>
                    <h4 className="footer-col-title">GET IN TOUCH</h4>
                    <div className="footer-contact-info">
                        <p className="contact-line">
                            <Mail size={13} />
                            <span>{email}</span>
                        </p>
                        <p className="contact-line">
                            <MapPin size={13} />
                            <span>{address}</span>
                        </p>
                    </div>

                    <div className="footer-buttons">
                        <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Hello Jaipur Ki Property, I have an enquiry.")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="footer-wa-btn"
                        >
                            <MessageCircle size={13} />
                            <span>WhatsApp</span>
                        </a>
                        <a href={`tel:${rawPhone}`} className="footer-call-btn">
                            <PhoneCall size={13} />
                            <span>Call {phone}</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* DISCLAIMER BAR (ABOVE COPYRIGHT) */}
            <div className="footer-disclaimer-bar">
                <div className="container disclaimer-inner">
                    <p className="disclaimer-text">
                        <span className="disclaimer-title">Disclaimer:</span> <span className="disclaimer-brand">Jaipur Ki Property</span> is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the offers and discounts on this Website have been extended by{" "}
                        {isDisclaimerExpanded ? (
                            <>
                                various builders, developers, and sellers who have advertised their products. Jaipur Ki Property is only communicating these offers and listings and does not guarantee or warrant the accuracy, title, or validity of any property. Users are advised to exercise discretion and independently verify all details before making any commitment.{" "}
                                <button
                                    type="button"
                                    className="disclaimer-read-more"
                                    onClick={() => setIsDisclaimerExpanded(false)}
                                >
                                    Read less
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="disclaimer-read-more"
                                onClick={() => setIsDisclaimerExpanded(true)}
                            >
                                Read more
                            </button>
                        )}
                    </p>
                </div>
            </div>

            {/* COPYRIGHT LINE AT THE VERY BOTTOM */}
            <div className="copyright container">
                © 2026 Jaipur Ki Property. All rights reserved.
            </div>
        </footer>
    );
}
