import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight, CheckCircle2, RotateCcw, ShieldCheck, Edit3, Link2, Zap } from "lucide-react";
import { useProperty } from "../context/PropertyContext";
import {
    sendOtpToGmail,
    getGoogleScriptUrl,
    saveGoogleScriptUrl,
    isEmailPreVerified,
    markEmailAsVerified,
    getVerifiedEmails,
} from "../services/emailService";

export default function Login() {
    const navigate = useNavigate();
    const { user, login } = useProperty();

    const [step, setStep] = useState("email"); // "email" | "otp"
    const [email, setEmail] = useState("");
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [generatedOtp, setGeneratedOtp] = useState("123456");
    const [resendTimer, setResendTimer] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Google Script URL state
    const [scriptUrlInput, setScriptUrlInput] = useState(() => getGoogleScriptUrl() || "");
    const [showUrlConfig, setShowUrlConfig] = useState(false);

    const digitRefs = useRef([]);

    useEffect(() => {
        if (user) {
            navigate("/profile");
        }
    }, [user, navigate]);

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

    const handleSendOtp = async (e) => {
        e?.preventDefault();
        setError("");
        const cleanEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!cleanEmail || !emailRegex.test(cleanEmail)) {
            setError("Please enter a valid Gmail / Email address.");
            return;
        }

        // ============================================================
        // PRE-VERIFIED EMAIL CHECK:
        // If email was already verified on this device, log in instantly without OTP!
        // ============================================================
        if (isEmailPreVerified(cleanEmail)) {
            setIsLoading(true);
            const rawName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
            const formattedName = rawName
                .split(" ")
                .filter(Boolean)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ") || "User";

            login({
                email: cleanEmail,
                name: formattedName,
                role: "user",
                verified: true,
                token: "jkp_token_" + Date.now(),
                loginTime: new Date().toISOString(),
            });
            navigate("/profile");
            return;
        }

        const currentScriptUrl = getGoogleScriptUrl();
        if (!currentScriptUrl || currentScriptUrl.includes("YOUR_SCRIPT_ID")) {
            setShowUrlConfig(true);
            setError("Please configure the Google Apps Script Web App URL to receive the OTP.");
            return;
        }

        setIsLoading(true);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(code);
        setOtpDigits(["", "", "", "", "", ""]);
        setResendTimer(30);

        try {
            const sendResult = await sendOtpToGmail(cleanEmail, code);
            setIsLoading(false);

            if (sendResult.deliveredToGmail) {
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

        if (index < 5) {
            digitRefs.current[index + 1]?.focus();
        }
    };

    const handleDigitKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (!otpDigits[index] && index > 0) {
                digitRefs.current[index - 1]?.focus();
            }
        }
    };

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

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError("");
        const enteredOtp = otpDigits.join("");

        if (enteredOtp.length < 6) {
            setError("Please enter the complete 6-digit verification code.");
            return;
        }

        // STRICT VERIFICATION: ONLY ALLOW LOGIN IF EXACT OTP MATCHES FROM GMAIL
        if (enteredOtp !== generatedOtp) {
            setError("Invalid OTP code! Please check your Gmail (Inbox / Spam) and enter the correct code.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            // Mark this email as permanently verified on this device
            markEmailAsVerified(email.trim().toLowerCase());

            const rawName = email.split("@")[0].replace(/[._-]/g, " ");
            const formattedName = rawName
                .split(" ")
                .filter(Boolean)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ") || "User";

            login({
                email: email.trim().toLowerCase(),
                name: formattedName,
                role: "user",
                verified: true,
                token: "jkp_token_" + Date.now(),
                loginTime: new Date().toISOString(),
            });
            navigate("/profile");
        }, 500);
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: "460px" }}>
                <div className="auth-brand-header">
                    <img src="/logo.png" alt="Jaipur Ki Property" className="auth-logo" />
                    <h1>{step === "email" ? "Login with Gmail OTP" : "Verify Your Email"}</h1>
                    <p>
                        {step === "email"
                            ? "Enter your email address below to receive an instant verification code"
                            : `Enter the 6-digit verification code sent to ${email}`}
                    </p>
                </div>

                {error && <div className="otp-error-alert" style={{ marginBottom: "16px" }}>{error}</div>}

                {step === "email" ? (
                    <div>
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

                        <form onSubmit={handleSendOtp}>
                            <label>Email / Gmail Address</label>
                            <div className="auth-input-wrapper">
                                <Mail size={16} className="auth-icon" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@gmail.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="primary-btn auth-submit-btn"
                                disabled={isLoading}
                                style={{ width: "100%", justifyContent: "center", marginTop: "20px" }}
                            >
                                {isLoading ? <span>Sending verification code...</span> : (
                                    <>
                                        <span>Send OTP to Gmail</span>
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div style={{
                            background: "#fdf2f8",
                            border: "1px solid #fbcfe8",
                            borderRadius: "12px",
                            padding: "10px 14px",
                            margin: "0 0 16px",
                            fontSize: "12.5px",
                            color: "#9d174d",
                            textAlign: "center",
                            fontWeight: 600,
                        }}>
                            ✉️ A 6-digit verification code has been sent to your Gmail inbox from Jaipur Ki Property.
                        </div>

                        <label style={{ textAlign: "center", display: "block" }}>Enter 6-Digit OTP Code</label>
                        <div className="otp-digits-row" onPaste={handleOtpPaste} style={{ margin: "10px 0 20px" }}>
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
                            className="primary-btn auth-submit-btn"
                            disabled={isLoading}
                            style={{ width: "100%", justifyContent: "center" }}
                        >
                            {isLoading ? <span>Verifying code...</span> : (
                                <>
                                    <span>Verify OTP & Login</span>
                                    <CheckCircle2 size={16} />
                                </>
                            )}
                        </button>

                        <div className="otp-resend-row" style={{ marginTop: "14px", textAlign: "center" }}>
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

                        <div style={{ textAlign: "center", marginTop: "12px" }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep("email");
                                    setError("");
                                }}
                                style={{ background: "none", border: "none", color: "#ec268f", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                            >
                                <Edit3 size={13} style={{ display: "inline", verticalAlign: "middle" }} /> Change Email
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #f1f5f9", textAlign: "center", fontSize: "12.5px", color: "#64748b" }}>
                    <ShieldCheck size={14} color="#16a34a" style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    100% Free & Secure Login by Jaipur Ki Property
                </div>
            </div>
        </div>
    );
}
