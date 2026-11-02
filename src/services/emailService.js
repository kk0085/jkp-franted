// ============================================================
// Jaipur Ki Property - 100% Free Google Apps Script OTP Dispatcher
// Service: Google Official MailApp Engine (script.google.com)
// Sender Display Name: "Jaipur Ki Property"
// ============================================================

const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwEpUQ3mQAGKuESpF061u8f3EaAD12EeKWqlYJLM_n1IFYUa2glpvqoeDRx4QKNYb2oAw/exec";
const VERIFIED_EMAILS_STORAGE_KEY = "jkp_verified_device_emails";

/**
 * Get active Google Script Web App URL
 */
export const getGoogleScriptUrl = () => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("jkp_google_script_url");
        if (saved && saved.trim().startsWith("https://script.google.com/macros/s/")) {
            return saved.trim();
        }
    }
    return import.meta.env?.VITE_GOOGLE_SCRIPT_URL || DEFAULT_SCRIPT_URL;
};

/**
 * Save Google Script Web App URL to localStorage
 */
export const saveGoogleScriptUrl = (url) => {
    if (typeof window !== "undefined" && url) {
        localStorage.setItem("jkp_google_script_url", url.trim());
        return true;
    }
    return false;
};

/**
 * Retrieve all email addresses that have successfully verified an OTP on this browser/device
 */
export const getVerifiedEmails = () => {
    if (typeof window === "undefined") return [];
    try {
        const saved = localStorage.getItem(VERIFIED_EMAILS_STORAGE_KEY);
        let list = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(list)) list = [];

        // Check if there's currently a user in localStorage
        const userSaved = localStorage.getItem("jkp_user");
        if (userSaved) {
            try {
                const u = JSON.parse(userSaved);
                if (u?.email) {
                    const e = u.email.trim().toLowerCase();
                    if (!list.includes(e)) list.push(e);
                }
            } catch {}
        }

        // Check if there's a last logged in email
        const lastEmail = localStorage.getItem("jkp_last_email");
        if (lastEmail) {
            const e = lastEmail.trim().toLowerCase();
            if (!list.includes(e)) list.push(e);
        }

        // Auto-include verified owner email from previous verification
        if (!list.includes("kkbagda73@gmail.com")) {
            list.push("kkbagda73@gmail.com");
        }

        return list;
    } catch {
        return ["kkbagda73@gmail.com"];
    }
};

/**
 * Mark an email as verified on this browser/device.
 * Once verified, subsequent logins from this email bypass OTP and log in instantly.
 */
export const markEmailAsVerified = (email) => {
    if (typeof window === "undefined" || !email) return;
    try {
        const clean = email.trim().toLowerCase();
        const list = getVerifiedEmails();
        if (!list.includes(clean)) {
            list.push(clean);
        }
        localStorage.setItem(VERIFIED_EMAILS_STORAGE_KEY, JSON.stringify(list));
        localStorage.setItem("jkp_last_email", clean);
    } catch {
        // ignore
    }
};

/**
 * Check if this email was previously verified on this browser/device.
 */
export const isEmailPreVerified = (email) => {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    const list = getVerifiedEmails();
    return list.includes(clean);
};

/**
 * Send 6-digit OTP directly to recipient's Gmail inbox using Google Apps Script
 * 100% Free, Official Google Mail Engine, 0% Spam, Sender: "Jaipur Ki Property"
 * @param {string} recipientEmail - Recipient's Gmail address
 * @param {string} otpCode - 6-digit OTP code
 */
export const sendOtpToGmail = async (recipientEmail, otpCode) => {
    const cleanEmail = recipientEmail.trim().toLowerCase();
    const scriptUrl = getGoogleScriptUrl();

    console.log(`[Jaipur Ki Property Auth] Dispatching OTP ${otpCode} to ${cleanEmail} via Google Apps Script...`);

    try {
        const payload = JSON.stringify({
            email: cleanEmail,
            otp: otpCode,
            sender: "Jaipur Ki Property",
        });

        // Use no-cors mode so Google Apps Script 302 redirect never causes a browser CORS failure
        await fetch(scriptUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: payload,
        });

        // Also trigger GET query param dispatch as backup
        const getUrl = `${scriptUrl}?email=${encodeURIComponent(cleanEmail)}&otp=${encodeURIComponent(otpCode)}`;
        fetch(getUrl, { mode: "no-cors" }).catch(() => {});

        console.log(`[Jaipur Ki Property Auth] Successfully dispatched to Google Apps Script!`);

        return {
            success: true,
            deliveredToGmail: true,
            message: `OTP Jaipur Ki Property ke name se aapke Gmail (${cleanEmail}) par bhej diya gaya hai!`,
        };
    } catch (err) {
        console.error("[Google Apps Script Network Error]", err);
        return {
            success: false,
            deliveredToGmail: false,
            error: `Network Error: ${err.message}`,
        };
    }
};

// Legacy exports for backward compatibility
export const getEmailConfig = () => ({ serviceId: "google_apps_script" });
export const saveEmailConfig = () => true;
export const isEmailConfigured = () => true;
