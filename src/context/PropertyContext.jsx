import { createContext, useContext, useState, useEffect } from "react";
import { propertiesData as defaultData } from "../data/propertiesData";
import { markEmailAsVerified } from "../services/emailService";

const PropertyContext = createContext();

export const defaultSiteSettings = {
    phone: "+91 70230 77367",
    rawPhone: "917023077367",
    whatsappNumber: "917023077367",
    email: "support@jaipurkiproperty.com",
    address: "Jaipur, Rajasthan, IN",
    announcement: {
        enabled: true,
        text: "🎉 Exclusive Zero Brokerage Verified Properties Across Prime Jaipur Localities! Call +91 70230 77367",
        link: "/properties",
    },
    heroSlides: [
        {
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80",
            title: "Find Your Best Home & Villa in Jaipur",
            description: "Explore verified residential plots, luxury villas, and rental apartments across Jaipur",
        },
        {
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80",
            title: "Modern 2 & 3 BHK Flats For Rent",
            description: "Furnished and semi-furnished apartments in Mansarovar, Malviya Nagar & Vaishali Nagar",
        },
        {
            image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1600&auto=format&fit=crop&q=80",
            title: "Spacious Independent Houses & Duplexes",
            description: "Private family residences with personal car parking, open terraces, and quiet neighborhoods",
        },
    ],
    plans: [
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
            text: "Paid promotional placements on the website and official social media handles. Maximum buyer reach.",
        },
    ],
};

const defaultLeads = [
    {
        id: 1,
        name: "Amit Sharma",
        phone: "+91 98290 12345",
        propertyTitle: "2 BHK Flat in Mansarovar",
        propertyPrice: "₹18,000 / month",
        message: "Interested in visiting tomorrow evening. Please share exact location.",
        date: "Today, 11:30 AM",
        status: "New",
    },
    {
        id: 2,
        name: "Pooja Verma",
        phone: "+91 94140 67890",
        propertyTitle: "3 BHK Luxury Villa in Jagatpura",
        propertyPrice: "₹42,000 / month",
        message: "Is the price negotiable for immediate move-in?",
        date: "Yesterday, 4:15 PM",
        status: "Contacted",
    },
];

export function PropertyProvider({ children }) {
    const [properties, setProperties] = useState(() => {
        try {
            const savedAll = localStorage.getItem("jkp_all_properties");
            if (savedAll) {
                const parsedAll = JSON.parse(savedAll);
                if (Array.isArray(parsedAll) && parsedAll.length > 0) {
                    return parsedAll;
                }
            }

            const saved = localStorage.getItem("jkp_custom_properties");
            if (saved) {
                const parsed = JSON.parse(saved);
                // Keep unique items only - no duplicates
                const customOnly = parsed.filter(
                    (p) => !defaultData.some((d) => d.id === p.id)
                );
                const all = [...customOnly, ...defaultData];
                const seen = new Set();
                return all.filter((item) => {
                    if (seen.has(item.id)) return false;
                    seen.add(item.id);
                    return true;
                });
            }
        } catch {
            // fallback
        }
        return defaultData;
    });

    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("jkp_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Auto open login modal when website opens if user is not logged in
    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => {
                setIsLoginModalOpen(true);
            }, 450);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const [enquiryProperty, setEnquiryProperty] = useState(null);

    const openEnquiry = (property) => {
        setEnquiryProperty(property);
    };

    const closeEnquiry = () => {
        setEnquiryProperty(null);
    };

    const addProperty = (newProp) => {
        const fullProperty = {
            id: Date.now(),
            title: newProp.title || "Independent Property in Jaipur",
            location: newProp.location || "Jaipur, Rajasthan",
            price: Number(newProp.price) || 25000,
            badge:
                newProp.propertyType === "flat"
                    ? (newProp.bhk || "Flat")
                    : (newProp.propertyType === "villa" ? "Villa" : "House"),
            type: newProp.propertyType || "flat",
            bhk: newProp.bhk || "2 BHK",
            bathrooms: Number(newProp.bathrooms) || 2,
            area: newProp.area || "1400 sq.ft.",
            furnishing: newProp.furnishing || "Semi-Furnished",
            image:
                newProp.image ||
                (newProp.propertyType === "villa"
                    ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80"
                    : newProp.propertyType === "house"
                    ? "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80"
                    : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80"),
            description: newProp.description || "Spacious, verified property for rent in prime Jaipur locality.",
            features: [
                newProp.bhk || "2 BHK",
                `${newProp.bathrooms || 2} Bathrooms`,
                newProp.furnishing || "Semi-Furnished",
                "24/7 Water Supply",
                "Covered Parking",
                "Verified Owner",
            ],
            ownerName: newProp.ownerName || "Property Owner",
            ownerPhone: newProp.ownerPhone || "+917023077367",
            verified: true,
            category: "rent",
            createdAt: new Date().toISOString(),
        };

        setProperties((prev) => {
            const updated = [fullProperty, ...prev];
            try {
                localStorage.setItem("jkp_all_properties", JSON.stringify(updated));
                localStorage.setItem("jkp_custom_properties", JSON.stringify(updated));
            } catch {
                // ignore
            }
            return updated;
        });

        return fullProperty;
    };

    const updateProperty = (propertyId, updatedData) => {
        setProperties((prev) => {
            const updated = prev.map((p) => {
                if (p.id === propertyId || String(p.id) === String(propertyId)) {
                    return {
                        ...p,
                        ...updatedData,
                        price: updatedData.price !== undefined ? Number(updatedData.price) : p.price,
                        updatedAt: new Date().toISOString(),
                    };
                }
                return p;
            });
            try {
                localStorage.setItem("jkp_all_properties", JSON.stringify(updated));
                localStorage.setItem("jkp_custom_properties", JSON.stringify(updated));
            } catch {
                // ignore
            }
            return updated;
        });
    };

    const deleteProperty = (propertyId) => {
        setProperties((prev) => {
            const updated = prev.filter((p) => p.id !== propertyId && String(p.id) !== String(propertyId));
            try {
                localStorage.setItem("jkp_all_properties", JSON.stringify(updated));
                localStorage.setItem("jkp_custom_properties", JSON.stringify(updated));
            } catch {
                // ignore
            }
            return updated;
        });
    };

    const resetPropertiesToDefault = () => {
        try {
            localStorage.removeItem("jkp_all_properties");
            localStorage.removeItem("jkp_custom_properties");
        } catch {}
        setProperties(defaultData);
    };

    const login = (userData) => {
        if (userData?.email) {
            markEmailAsVerified(userData.email);
        }
        setUser(userData);
        setIsLoginModalOpen(false);
        try {
            localStorage.setItem("jkp_user", JSON.stringify(userData));
        } catch {
            // ignore
        }
    };

    const logout = () => {
        if (user?.email) {
            markEmailAsVerified(user.email);
        }
        setUser(null);
        try {
            localStorage.removeItem("jkp_user");
        } catch {
            // ignore
        }
    };

    // GLOBAL SITE SETTINGS (HANDLES ENTIRE WEBSITE VIA ADMIN PANEL)
    const [siteSettings, setSiteSettings] = useState(() => {
        try {
            const saved = localStorage.getItem("jkp_site_settings");
            if (saved) return { ...defaultSiteSettings, ...JSON.parse(saved) };
        } catch {}
        return defaultSiteSettings;
    });

    const updateSiteSettings = (newSettings) => {
        setSiteSettings((prev) => {
            const updated = { ...prev, ...newSettings };
            try {
                localStorage.setItem("jkp_site_settings", JSON.stringify(updated));
            } catch {}
            return updated;
        });
    };

    // BUYER INQUIRIES & LEADS CRM
    const [buyerLeads, setBuyerLeads] = useState(() => {
        try {
            const saved = localStorage.getItem("jkp_buyer_leads");
            if (saved) return JSON.parse(saved);
        } catch {}
        return defaultLeads;
    });

    const addBuyerLead = (lead) => {
        const fullLead = {
            id: Date.now(),
            name: lead.name || "Buyer",
            phone: lead.phone || "+91 98290 00000",
            propertyTitle: lead.propertyTitle || "Jaipur Property",
            propertyPrice: lead.propertyPrice || "Rent",
            message: lead.message || "Interested in this property.",
            date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
            status: "New",
        };
        setBuyerLeads((prev) => {
            const updated = [fullLead, ...prev];
            try {
                localStorage.setItem("jkp_buyer_leads", JSON.stringify(updated));
            } catch {}
            return updated;
        });
        return fullLead;
    };

    const deleteBuyerLead = (leadId) => {
        setBuyerLeads((prev) => {
            const updated = prev.filter((l) => l.id !== leadId);
            try {
                localStorage.setItem("jkp_buyer_leads", JSON.stringify(updated));
            } catch {}
            return updated;
        });
    };

    const updateBuyerLeadStatus = (leadId, status) => {
        setBuyerLeads((prev) => {
            const updated = prev.map((l) => (l.id === leadId ? { ...l, status } : l));
            try {
                localStorage.setItem("jkp_buyer_leads", JSON.stringify(updated));
            } catch {}
            return updated;
        });
    };

    return (
        <PropertyContext.Provider
            value={{
                properties,
                addProperty,
                updateProperty,
                deleteProperty,
                resetPropertiesToDefault,
                siteSettings,
                updateSiteSettings,
                buyerLeads,
                addBuyerLead,
                deleteBuyerLead,
                updateBuyerLeadStatus,
                user,
                login,
                logout,
                isLoginModalOpen,
                openLoginModal,
                closeLoginModal,
                enquiryProperty,
                openEnquiry,
                closeEnquiry,
            }}
        >
            {children}
        </PropertyContext.Provider>
    );
}

export function useProperty() {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error("useProperty must be used within a PropertyProvider");
    }
    return context;
}

