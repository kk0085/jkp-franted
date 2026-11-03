import { useNavigate } from "react-router-dom";
import { useProperty } from "../context/PropertyContext";
import { LogOut, User, CheckCircle2 } from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout, openLoginModal } = useProperty();

    if (!user) {
        return (
            <div className="page container" style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ maxWidth: "420px", margin: "0 auto", background: "#fff", padding: "40px 28px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fdf2f8", color: "#ec268f", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <User size={32} />
                    </div>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Please Login</h2>
                    <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
                        Login with your Gmail to access your account.
                    </p>
                    <button
                        type="button"
                        className="primary-btn"
                        onClick={openLoginModal}
                        style={{ width: "100%", justifyContent: "center", height: "46px", borderRadius: "9999px", fontSize: "15px", fontWeight: 700 }}
                    >
                        Login with Gmail OTP
                    </button>
                </div>
            </div>
        );
    }

    const gmailInitial = user?.email
        ? user.email.trim().charAt(0).toUpperCase()
        : "K";

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="page container" style={{ padding: "40px 16px 80px", maxWidth: "520px" }}>
            <div
                style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    border: "1px solid #e2e8f0",
                    padding: "36px 24px",
                    boxShadow: "0 8px 30px rgba(15, 23, 42, 0.06)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                }}
            >
                {/* AVATAR WITH GOOGLE BADGE */}
                <div style={{ position: "relative", width: "76px", height: "76px", margin: "0 auto" }}>
                    <div
                        style={{
                            width: "76px",
                            height: "76px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #ec268f, #be185d)",
                            color: "#ffffff",
                            fontSize: "30px",
                            fontWeight: 800,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 6px 18px rgba(236, 38, 143, 0.35)",
                        }}
                    >
                        {gmailInitial}
                    </div>
                    <span
                        style={{
                            position: "absolute",
                            bottom: "0px",
                            right: "0px",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        }}
                        title="Verified Gmail"
                    >
                        <svg viewBox="0 0 24 24" width="15" height="15">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                    </span>
                </div>

                <div>
                    <h2 style={{ fontSize: "19px", fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                        {user.email || "Verified User"}
                    </h2>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "#16a34a", fontSize: "12.5px", fontWeight: 600, background: "#f0fdf4", padding: "4px 14px", borderRadius: "9999px", border: "1px solid #bbf7d0" }}>
                        <CheckCircle2 size={14} />
                        <span>Logged in with Gmail</span>
                    </div>
                </div>

                {/* ONLY FOR LOGOUT BUTTON */}
                <div style={{ width: "100%", maxWidth: "260px", marginTop: "14px" }}>
                    <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            height: "46px",
                            borderRadius: "9999px",
                            border: "1.5px solid #fecaca",
                            background: "#fef2f2",
                            color: "#e11d48",
                            fontSize: "14.5px",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            boxShadow: "0 2px 8px rgba(225, 29, 72, 0.08)",
                        }}
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
