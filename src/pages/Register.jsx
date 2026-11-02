import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowRight } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("user", JSON.stringify({ name, email, phone }));
        navigate("/profile");
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <div className="auth-brand-header">
                    <img src="/logo.png" alt="Jaipur Ki Property" className="auth-logo" />
                    <h1>Create Free Account</h1>
                    <p>Post properties, receive inquiries & contact verified owners</p>
                </div>

                <label>Full Name</label>
                <div className="auth-input-wrapper">
                    <User size={16} className="auth-icon" />
                    <input
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <label>Mobile Number</label>
                <div className="auth-input-wrapper">
                    <Phone size={16} className="auth-icon" />
                    <input
                        required
                        type="tel"
                        pattern="[0-9]{10}"
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <label>Email Address</label>
                <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-icon" />
                    <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <label>Password</label>
                <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-icon" />
                    <input
                        type="password"
                        required
                        placeholder="Create strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="primary-btn auth-submit-btn">
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                </button>

                <p className="auth-footer-text">
                    Already registered?{" "}
                    <Link to="/login" className="auth-toggle-link">
                        Login Here
                    </Link>
                </p>
            </form>
        </div>
    );
}
