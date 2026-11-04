import { useState, useEffect } from "react";
import { Car, Calendar, Clock, MapPin, X, Check, ShieldCheck, Sparkles, MessageCircle, Phone, User, CheckCircle2 } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function ScheduleCabModal() {
    const { cabProperty, closeScheduleCab, addBuyerLead, user, siteSettings } = useProperty();

    const [selectedDate, setSelectedDate] = useState("Tomorrow");
    const [selectedSlot, setSelectedSlot] = useState("Morning (10:00 AM - 12:00 PM)");
    const [pickupAddress, setPickupAddress] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [bookingId, setBookingId] = useState("");

    useEffect(() => {
        if (cabProperty) {
            setIsConfirmed(false);
            setBookingId(`JKP-CAB-${Math.floor(1000 + Math.random() * 9000)}`);
            setSelectedDate("Tomorrow");
            setSelectedSlot("Morning (10:00 AM - 12:00 PM)");
            setPickupAddress("");
            if (user?.name) setName(user.name);
            else if (user?.email) setName(user.email.split("@")[0]);
        }
    }, [cabProperty, user]);

    if (!cabProperty) return null;

    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            alert("Please enter your name and phone number for the cab dispatch.");
            return;
        }

        // Save lead to CRM in PropertyContext
        if (addBuyerLead) {
            addBuyerLead({
                name: name.trim(),
                phone: phone.trim(),
                propertyTitle: cabProperty.title,
                propertyPrice: `Rs ${Number(cabProperty.price).toLocaleString("en-IN")}${cabProperty.category === "rent" ? "/mo" : ""}`,
                message: `🚖 FREE CAB SITE VISIT BOOKING [${bookingId}]: Date: ${selectedDate}, Slot: ${selectedSlot}, Pickup Location: ${pickupAddress || "Jaipur City Center / Home Address"}. Property: ${cabProperty.title} in ${cabProperty.location}`,
            });
        }

        setIsConfirmed(true);
    };

    const whatsappConfirmationUrl = () => {
        const msg = encodeURIComponent(
            `Hello Jaipur Ki Property! I have scheduled a *Free Site Visit Cab*.\n\n*Booking ID:* ${bookingId}\n*Property:* ${cabProperty.title} (${cabProperty.location})\n*Date:* ${selectedDate}\n*Time Slot:* ${selectedSlot}\n*Pickup Address:* ${pickupAddress || "Not specified yet"}\n*Passenger Name:* ${name}\n*Phone:* ${phone}\n\nPlease confirm cab dispatch details!`
        );
        return `https://wa.me/${waNumber}?text=${msg}`;
    };

    const dateOptions = ["Today", "Tomorrow", "Sunday (Weekend)", "Monday"];
    const timeSlots = [
        { label: "Morning", time: "10:00 AM - 12:00 PM" },
        { label: "Afternoon", time: "01:00 PM - 03:00 PM" },
        { label: "Evening", time: "04:00 PM - 06:30 PM" },
    ];
    const popularPickups = ["Mansarovar Metro", "WTP Mall / Malviya Nagar", "Railway Station", "Vaishali Nagar"];

    return (
        <div className="cab-modal-overlay" onClick={closeScheduleCab} role="dialog" aria-modal="true">
            <div className="cab-modal-card" onClick={(e) => e.stopPropagation()}>
                {/* CLOSE BUTTON */}
                <button
                    type="button"
                    className="cab-modal-close-btn"
                    onClick={closeScheduleCab}
                    aria-label="Close modal"
                >
                    <X size={18} />
                </button>

                {isConfirmed ? (
                    /* ------------------ SUCCESS CONFIRMATION SCREEN ------------------ */
                    <div className="cab-success-view">
                        <div className="cab-success-badge-box">
                            <CheckCircle2 size={54} color="#16a34a" />
                        </div>
                        <span className="cab-confirmed-pill">100% Free Site Visit Cab Booked</span>
                        <h2 className="cab-success-title">Booking Confirmed!</h2>
                        <div className="cab-booking-id-row">
                            <span>Booking ID:</span>
                            <strong>{bookingId}</strong>
                        </div>

                        <div className="cab-confirmation-details-box">
                            <div className="cab-detail-row">
                                <span className="cab-detail-label">Property:</span>
                                <span className="cab-detail-val">{cabProperty.title} ({cabProperty.location})</span>
                            </div>
                            <div className="cab-detail-row">
                                <span className="cab-detail-label">Schedule:</span>
                                <span className="cab-detail-val">{selectedDate} • {selectedSlot}</span>
                            </div>
                            <div className="cab-detail-row">
                                <span className="cab-detail-label">Pickup Point:</span>
                                <span className="cab-detail-val">{pickupAddress || "Pickup coordinator will call to confirm"}</span>
                            </div>
                            <div className="cab-detail-row">
                                <span className="cab-detail-label">Passenger:</span>
                                <span className="cab-detail-val">{name} ({phone})</span>
                            </div>
                        </div>

                        <div className="cab-driver-promise-box">
                            <Car size={18} color="#ec268f" style={{ flexShrink: 0 }} />
                            <p>
                                Sanitized AC Cab & Verified Property Manager will pick you up. <strong>0% Brokerage • 100% Free Service.</strong>
                            </p>
                        </div>

                        <div className="cab-success-actions">
                            <a
                                href={whatsappConfirmationUrl()}
                                target="_blank"
                                rel="noreferrer"
                                className="cab-wa-confirm-btn"
                            >
                                <MessageCircle size={18} />
                                <span>Get Cab Details on WhatsApp</span>
                            </a>

                            <button
                                type="button"
                                className="cab-done-btn"
                                onClick={closeScheduleCab}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ------------------ CAB BOOKING FORM ------------------ */
                    <form onSubmit={handleSubmit} className="cab-form-view">
                        {/* MODAL HEADER */}
                        <div className="cab-modal-header">
                            <div className="cab-header-icon-box">
                                <Car size={22} color="#ec268f" />
                            </div>
                            <div>
                                <h3 className="cab-modal-title">Book Free Site Visit Cab</h3>
                                <p className="cab-modal-subtitle">
                                    Free AC Cab Pickup & Drop across Jaipur with Verified Property Advisor
                                </p>
                            </div>
                        </div>

                        {/* PROPERTY STRIP */}
                        <div className="cab-prop-strip">
                            <img src={cabProperty.image} alt={cabProperty.title} className="cab-prop-img" />
                            <div className="cab-prop-info">
                                <span className="cab-prop-badge">{cabProperty.badge || "Verified"}</span>
                                <h4 className="cab-prop-title">{cabProperty.title}</h4>
                                <p className="cab-prop-loc">
                                    <MapPin size={12} color="#ec268f" />
                                    <span>{cabProperty.location}</span>
                                </p>
                                <span className="cab-prop-price">
                                    Rs {Number(cabProperty.price).toLocaleString("en-IN")}
                                    {cabProperty.category === "rent" && <small> / month</small>}
                                </span>
                            </div>
                        </div>

                        {/* 1. SELECT DATE */}
                        <div className="cab-form-section">
                            <label className="cab-field-label">
                                <Calendar size={14} color="#ec268f" />
                                <span>1. Select Visit Date</span>
                            </label>
                            <div className="cab-pills-row">
                                {dateOptions.map((date) => (
                                    <button
                                        key={date}
                                        type="button"
                                        className={`cab-pill-btn ${selectedDate === date ? "active" : ""}`}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        {date}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. SELECT TIME SLOT */}
                        <div className="cab-form-section">
                            <label className="cab-field-label">
                                <Clock size={14} color="#ec268f" />
                                <span>2. Preferred Time Slot</span>
                            </label>
                            <div className="cab-slots-grid">
                                {timeSlots.map((slot) => {
                                    const isSlotActive = selectedSlot.includes(slot.label);
                                    return (
                                        <button
                                            key={slot.label}
                                            type="button"
                                            className={`cab-slot-card ${isSlotActive ? "active" : ""}`}
                                            onClick={() => setSelectedSlot(`${slot.label} (${slot.time})`)}
                                        >
                                            <span className="cab-slot-name">{slot.label}</span>
                                            <span className="cab-slot-time">{slot.time}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. PICKUP LOCATION */}
                        <div className="cab-form-section">
                            <label className="cab-field-label">
                                <MapPin size={14} color="#ec268f" />
                                <span>3. Pickup Address / Landmark in Jaipur</span>
                            </label>
                            <input
                                type="text"
                                className="cab-text-input"
                                placeholder="Enter home address, hotel, or landmark in Jaipur..."
                                value={pickupAddress}
                                onChange={(e) => setPickupAddress(e.target.value)}
                            />
                            <div className="cab-quick-pickups-row">
                                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>Quick:</span>
                                {popularPickups.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        className="cab-pickup-chip"
                                        onClick={() => setPickupAddress(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. PASSENGER CONTACT */}
                        <div className="cab-form-row">
                            <div style={{ flex: 1 }}>
                                <label className="cab-field-label">
                                    <User size={14} color="#ec268f" />
                                    <span>Your Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="cab-text-input"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="cab-field-label">
                                    <Phone size={14} color="#ec268f" />
                                    <span>Phone Number</span>
                                </label>
                                <input
                                    type="tel"
                                    className="cab-text-input"
                                    placeholder="WhatsApp Mobile Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button type="submit" className="cab-submit-btn">
                            <Car size={18} />
                            <span>Confirm Free Cab Booking</span>
                        </button>

                        <div className="cab-trust-footer">
                            <span className="cab-trust-badge">
                                <ShieldCheck size={13} color="#16a34a" /> 100% Free
                            </span>
                            <span className="cab-trust-divider">•</span>
                            <span className="cab-trust-badge">
                                <Sparkles size={13} color="#ec268f" /> AC Cab & Driver
                            </span>
                            <span className="cab-trust-divider">•</span>
                            <span className="cab-trust-badge">
                                <Check size={13} color="#1e3a8a" /> 0% Brokerage
                            </span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

