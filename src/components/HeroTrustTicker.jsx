import { ShieldCheck, Car, Zap, Award, Star } from "lucide-react";

export default function HeroTrustTicker() {
    return (
        <div className="hero-trust-ticker-wrap">
            <div className="container">
                <div className="hero-trust-ticker-inner">
                    <div className="trust-ticker-item">
                        <ShieldCheck size={16} color="#15803d" />
                        <span>100% RERA & JDA Verified</span>
                    </div>
                    <span className="ticker-divider">•</span>

                    <div className="trust-ticker-item">
                        <Car size={16} color="#ec268f" />
                        <span>Free Cab For Site Visits</span>
                    </div>
                    <span className="ticker-divider">•</span>

                    <div className="trust-ticker-item">
                        <Zap size={16} color="#ea580c" />
                        <span>0% Brokerage Direct Owner Deals</span>
                    </div>
                    <span className="ticker-divider">•</span>

                    <div className="trust-ticker-item">
                        <Star size={16} fill="#f59e0b" color="#f59e0b" />
                        <span>4.9★ Rated by 10k+ Families</span>
                    </div>
                    <span className="ticker-divider">•</span>

                    <div className="trust-ticker-item">
                        <Award size={16} color="#1e3a8a" />
                        <span>Jaipur's #1 Property Network</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
