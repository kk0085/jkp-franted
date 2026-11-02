import { useState, useEffect, useRef } from "react";
import { X, Mail, Sparkles, ArrowRight, CheckCircle2, RotateCcw, ShieldCheck, Edit3, Link2, Zap } from "lucide-react";
import { useProperty } from "../context/PropertyContext";
import {
    sendOtpToGmail,
    getGoogleScriptUrl,
    saveGoogleScriptUrl,
    isEmailPreVerified,
    markEmailAsVerified,
    getVerifiedEmails,
} from "../services/emailService";

export default function EmailOtpLoginModal() {
    const { isLoginModalOpen, closeLoginModal, login, user } = useProperty();

    const [step, setStep] = useState("email"); // "email" | "otp" | "success"
    const [email, setEmail] = useState("");
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [resendTimer, setResendTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Google Script URL state
    const [scriptUrlInput, setScriptUrlInput] = useState(() => getGoogleScriptUrl() || "");
    const [showUrlConfig, setShowUrlConfig] = useState(false);

    const emailInputRef = useRef(null);
    const digitRefs = useRef([]);

    const verifiedList = getVerifiedEmails();

    // Focus email input when modal opens
    useEffect(() => {
        if (isLoginModalOpen && step === "email") {
            setTimeout(() => {
                emailInputRef.current?.focus();
            }, 150);
        }
    }, [isLoginModalOpen, step]);

    // Resend countdown timer
    useEffect(() => {
        let interval = null;
        if (step === "otp" && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [step, resendTimer]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isLoginModalOpen) {
                closeLoginModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isLoginModalOpen, closeLoginModal]);

    if (!isLoginModalOpen || user) return null;

    // Instant Login for emails previously verified on this device (No OTP needed!)
    const handleInstantLogin = (targetEmail) => {
        const cleanEmail = targetEmail.trim().toLowerCase();
        setIsLoading(true);
        setError("");

        const rawName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
        const formattedName = rawName
            .split(" ")
            .filter(Boolean)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ") || "User";

        const loggedInUser = {
            email: cleanEmail,
            name: formattedName,
            role: "user",
            verified: true,
            token: "jkp_token_" + Date.now(),
            loginTime: new Date().toISOString(),
        };

        setStep("success");
        setTimeout(() => {
            login(loggedInUser);
            setIsLoading(false);
            setStep("email");
            setEmail("");
        }, 500);
    };

    // Send OTP to Gmail, or Instant Login if already verified on this device
    const handleSendOtp = async (e) => {
        e?.preventDefault();
        setError("");
        const cleanEmail = email.trim().toLowerCase();

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!cleanEmail || !emailRegex.test(cleanEmail)) {
            setError("Please enter a valid Gmail / Email address (e.g. name@gmail.com)");
            return;
        }

        // ============================================================
        // PRE-VERIFIED EMAIL CHECK:
        // If this email was already verified on this browser/device,
        // DO NOT send OTP! Log in immediately upon email submission.
        // ============================================================
        if (isEmailPreVerified(cleanEmail)) {
            handleInstantLogin(cleanEmail);
            return;
        }

        const currentScriptUrl = getGoogleScriptUrl();
        if (!currentScriptUrl || currentScriptUrl.includes("YOUR_SCRIPT_ID")) {
            setShowUrlConfig(true);
            setError("Please configure the Google Apps Script Web App URL to dispatch the OTP.");
            return;
        }

        setIsLoading(true);

        // Generate dynamic 6-digit OTP code
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(randomCode);
        setOtpDigits(["", "", "", "", "", ""]);
        setResendTimer(30);

        try {
            const sendResult = await sendOtpToGmail(cleanEmail, randomCode);
            setIsLoading(false);

            if (sendResult.deliveredToGmail) {
                // Email dispatched successfully to recipient's Gmail inbox
                setStep("otp");
                setShowUrlConfig(false);
                setTimeout(() => {
                    digitRefs.current[0]?.focus();
                }, 150);
            } else if (sendResult.needsUrl) {
                setShowUrlConfig(true);
                setError("Please configure the Google Apps Script Web App URL.");
            } else {
                setError(`Failed to send verification code: ${sendResult.error}`);
            }
        } catch (err) {
            setIsLoading(false);
            setError(`Error: ${err.message}`);
        }
    };

    // Save custom Google Script URL
    const handleSaveScriptUrl = (e) => {
        e.preventDefault();
        if (!scriptUrlInput.trim().startsWith("https://script.google.com/macros/s/")) {
            setError("Please enter a valid Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec)");
            return;
        }
        saveGoogleScriptUrl(scriptUrlInput);
        setError("");
        setShowUrlConfig(false);
        handleSendOtp();
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setError("");
        setIsLoading(true);

        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newCode);
        setOtpDigits(["", "", "", "", "", ""]);
        setResendTimer(30);

        try {
            const sendResult = await sendOtpToGmail(email.trim().toLowerCase(), newCode);
            setIsLoading(false);

            if (sendResult.deliveredToGmail) {
                digitRefs.current[0]?.focus();
            } else {
                setError(`Resend failed: ${sendResult.error}`);
            }
        } catch (err) {
            setIsLoading(false);
            setError(`Resend error: ${err.message}`);
        }
    };

    // Handle single OTP digit input
    const handleDigitChange = (index, value) => {
        setError("");
        const cleanVal = value.replace(/\D/g, "");
        if (!cleanVal) {
            const updated = [...otpDigits];
            updated[index] = "";
            setOtpDigits(updated);
            return;
        }

        const char = cleanVal.slice(-1);
        const updated = [...otpDigits];
        updated[index] = char;
        setOtpDigits(updated);

        // Move to next input box if available
        if (index < 5) {
            digitRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace navigation in OTP inputs
    const handleDigitKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (!otpDigits[index] && index > 0) {
                digitRefs.current[index - 1]?.focus();
            }
        }
    };

    // Handle paste in OTP input
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length > 0) {
            const updated = ["", "", "", "", "", ""];
            for (let i = 0; i < pasted.length; i++) {
                updated[i] = pasted[i];
            }
            setOtpDigits(updated);
            const nextFocus = Math.min(pasted.length, 5);
            digitRefs.current[nextFocus]?.focus();
        }
    };

    // Verify OTP & Login - ONLY succeeds when exact OTP is entered from Gmail
    const handleVerifyOtp = (e) => {
        e?.preventDefault();
        setError("");
        const enteredOtp = otpDigits.join("");

        if (enteredOtp.length < 6) {
            setError("Please enter the complete 6-digit verification code received on your email.");
            return;
        }

        // STRICT VERIFICATION: ONLY ALLOW LOGIN IF EXACT OTP MATCHES FROM GMAIL
        if (enteredOtp !== generatedOtp) {
            setError("Invalid OTP code! Please check your Gmail (Inbox / Spam) and enter the correct code.");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setStep("success");

            // Mark this email as permanently verified on this device
            markEmailAsVerified(email.trim().toLowerCase());

            const rawName = email.split("@")[0].replace(/[._-]/g, " ");
            const formattedName = rawName
                .split(" ")
                .filter(Boolean)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ") || "User";

            const loggedInUser = {
                email: email.trim().toLowerCase(),
                name: formattedName,
                role: "user",
                verified: true,
                token: "jkp_token_" + Date.now(),
                loginTime: new Date().toISOString(),
            };

            setTimeout(() => {
                login(loggedInUser);
                setStep("email");
                setEmail("");
                setOtpDigits(["", "", "", "", "", ""]);
            }, 850);
        }, 400);
    };

    return (
        <div className="otp-modal-backdrop" onClick={closeLoginModal}>
            <div className="otp-modal-box" onClick={(e) => e.stopPropagation()}>
                {/* CLOSE BUTTON */}
                <button
                    type="button"
                    className="otp-modal-close-btn"
                    onClick={closeLoginModal}
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                {/* STEP 1: EMAIL INPUT */}
                {step === "email" && (
                    <div className="otp-step-content">
                        <div className="otp-brand-header">
                            <div className="otp-logo-row">
                                <img src="/logo.png" alt="Jaipur Ki Property" className="otp-brand-logo" />
                            </div>
                            <span className="otp-badge-pill">
                                <Sparkles size={13} color="#ec268f" />
                                Login with Gmail OTP
                            </span>
                            <h2>Welcome to Jaipur Ki Property</h2>
                            <p>Enter your Gmail address below to receive an instant 6-digit verification code directly in your inbox.</p>
                        </div>

                        {error && <div className="otp-error-alert">{error}</div>}

                        {/* GOOGLE SCRIPT URL SETUP (IF NOT CONFIGURED YET) */}
                        {showUrlConfig && (
                            <form onSubmit={handleSaveScriptUrl} style={{
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: "12px 14px",
                                marginBottom: "16px",
                                textAlign: "left",
                                fontSize: "12px",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
                                    <Link2 size={15} color="#ec268f" />
                                    <span>Google Apps Script Web App URL</span>
                                </div>
                                <p style={{ margin: "2px 0 8px", color: "#64748b" }}>
                                    Paste your Web App URL from script.google.com here:
                                </p>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                                    value={scriptUrlInput}
                                    onChange={(e) => setScriptUrlInput(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "8px 10px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "12px",
                                        marginBottom: "8px",
                                        fontFamily: "monospace",
                                    }}
                                />
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <button
                                        type="submit"
                                        style={{
                                            background: "#ec268f",
                                            color: "#fff",
                                            border: "none",
                                            padding: "6px 14px",
                                            borderRadius: "6px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Save & Send OTP
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowUrlConfig(false)}
                                        style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "12px" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* PRE-VERIFIED ACCOUNT QUICK LOGIN */}
                        {verifiedList.length > 0 && !email && (
                            <div style={{
                                background: "#fdf2f8",
                                border: "1.5px solid #fbcfe8",
                                borderRadius: "12px",
                                padding: "10px 14px",
                                marginBottom: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "10px",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                                    <span style={{
                                        width: "28px",
                                        height: "28px",
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #ec268f, #be185d)",
                                        color: "#ffffff",
                                        fontWeight: 800,
                                        fontSize: "13px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}>
                                        {verifiedList[0].charAt(0).toUpperCase()}
                                    </span>
                                    <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>
                                            {verifiedList[0]}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "#16a34a", fontWeight: 600 }}>
                                            Verified on this device (No OTP needed)
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleInstantLogin(verifiedList[0])}
                                    style={{
                                        background: "#ec268f",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "6px 12px",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        boxShadow: "0 2px 6px rgba(236,38,143,0.3)",
                                    }}
                                >
                                    Login ⚡
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSendOtp} className="otp-form">
                            <label className="otp-input-label">Email / Gmail Address</label>
                            <div className="otp-input-wrapper">
                                <Mail size={18} className="otp-field-icon" />
                                <input
                                    ref={emailInputRef}
                                    type="email"
                                    required
                                    placeholder="e.g. yourname@gmail.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    className="otp-email-input"
                                />
                            </div>

                            <button
                                type="submit"
                                className="otp-submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span>{isEmailPreVerified(email.trim().toLowerCase()) ? "Logging you in..." : "Sending verification code..."}</span>
                                ) : isEmailPreVerified(email.trim().toLowerCase()) ? (
                                    <>
                                        <Zap size={17} color="#fff" />
                                        <span>Instant Login (No OTP Needed)</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send OTP to Gmail</span>
                                        <ArrowRight size={17} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* TRUST PILLS */}
                        <div className="otp-trust-strip">
                            <div className="otp-trust-item">
                                <ShieldCheck size={14} color="#16a34a" />
                                <span>100% Free & Secure</span>
                            </div>
                            <div className="otp-trust-dot">•</div>
                            <div className="otp-trust-item">
                                <Sparkles size={14} color="#ec268f" />
                                <span>Instant Email Verification</span>
                            </div>
                        </div>

                        {/* SKIP FOR NOW */}
                        <div className="otp-footer-action">
                            <button
                                type="button"
                                className="otp-skip-link"
                                onClick={closeLoginModal}
                            >
                                Skip for now & browse properties
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: OTP VERIFICATION (STRICT CLEAN SCREEN - NO ON-SCREEN CODES) */}
                {step === "otp" && (
                    <div className="otp-step-content">
                        <div className="otp-brand-header">
                            <div className="otp-icon-circle">
                                <Mail size={26} color="#ec268f" />
                            </div>
                            <h2>Verify Your Email</h2>
                            <p>Enter the 6-digit verification code sent to:</p>
                            <div className="otp-email-chip">
                                <strong>{email}</strong>
                                <button
                                    type="button"
                                    className="otp-change-email-btn"
                                    onClick={() => {
                                        setStep("email");
                                        setError("");
                                    }}
                                    title="Change Email"
                                >
                                    <Edit3 size={13} /> Change
                                </button>
                            </div>
                        </div>

                        {/* CLEAN GMAIL CONFIRMATION BANNER */}
                        <div style={{
                            background: "#fdf2f8",
                            border: "1px solid #fbcfe8",
                            borderRadius: "12px",
                            padding: "10px 14px",
                            margin: "10px 0 16px",
                            fontSize: "12.5px",
                            color: "#9d174d",
                            textAlign: "center",
                            fontWeight: 600,
                        }}>
                            ✉️ A 6-digit verification code has been sent to your Gmail inbox from Jaipur Ki Property.
                        </div>

                        {error && <div className="otp-error-alert">{error}</div>}

                        <form onSubmit={handleVerifyOtp} className="otp-form">
                            <label className="otp-input-label" style={{ textAlign: "center", display: "block" }}>
                                Enter 6-Digit OTP Code
                            </label>

                            {/* 6 DIGIT PIN BOXES */}
                            <div className="otp-digits-row" onPaste={handleOtpPaste}>
                                {otpDigits.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => (digitRefs.current[idx] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                                        onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                                        className={`otp-digit-box ${digit ? "filled" : ""}`}
                                        autoFocus={idx === 0}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="otp-submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span>Verifying code...</span>
                                ) : (
                                    <>
                                        <span>Verify OTP & Login</span>
                                        <CheckCircle2 size={17} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* RESEND OTP SECTION */}
                        <div className="otp-resend-row">
                            {resendTimer > 0 ? (
                                <span className="otp-timer-text">
                                    Resend code in <strong>00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}s</strong>
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    className="otp-resend-btn"
                                    onClick={handleResendOtp}
                                >
                                    <RotateCcw size={14} /> Resend OTP to Gmail
                                </button>
                            )}
                        </div>

                        {/* SKIP / CANCEL */}
                        <div className="otp-footer-action">
                            <button
                                type="button"
                                className="otp-skip-link"
                                onClick={closeLoginModal}
                            >
                                Cancel & browse as guest
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: SUCCESS ANIMATION */}
                {step === "success" && (
                    <div className="otp-step-content otp-success-view">
                        <div className="otp-success-icon-wrap">
                            <CheckCircle2 size={64} color="#16a34a" strokeWidth={2.4} />
                        </div>
                        <h2>Login Successful!</h2>
                        <p>Welcome back to Jaipur Ki Property.</p>
                        <div className="otp-success-badge">
                            <ShieldCheck size={16} color="#16a34a" />
                            <span>Logged in as <strong>Verified Owner</strong></span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
