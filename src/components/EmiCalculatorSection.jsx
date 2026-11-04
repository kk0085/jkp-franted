import { useState, useMemo } from "react";
import { Calculator, Percent, Calendar, IndianRupee, MessageSquare, ShieldCheck } from "lucide-react";
import { useProperty } from "../context/PropertyContext";

export default function EmiCalculatorSection() {
    const { siteSettings } = useProperty();
    const waNumber = siteSettings?.whatsappNumber || "917023077367";

    const [loanAmount, setLoanAmount] = useState(2500000); // Default 25 Lakhs
    const [interestRate, setInterestRate] = useState(8.5); // Default 8.5%
    const [tenureYears, setTenureYears] = useState(20); // Default 20 Years

    // Calculate EMI, Total Interest, Total Payment
    const calculation = useMemo(() => {
        const P = loanAmount;
        const R = interestRate;
        const N = tenureYears * 12;

        if (P <= 0 || R <= 0 || N <= 0) {
            return {
                emi: 0,
                totalPayment: 0,
                totalInterest: 0,
                principalPercent: 100,
                interestPercent: 0,
            };
        }

        const r = R / (12 * 100);
        const emi = Math.round(
            (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1)
        );
        const totalPayment = emi * N;
        const totalInterest = Math.max(0, totalPayment - P);
        const principalPercent = Math.min(100, Math.max(0, Math.round((P / totalPayment) * 100)));
        const interestPercent = 100 - principalPercent;

        return {
            emi,
            totalPayment,
            totalInterest,
            principalPercent,
            interestPercent,
        };
    }, [loanAmount, interestRate, tenureYears]);

    const formatCurrency = (val) => {
        return "₹" + Number(val).toLocaleString("en-IN");
    };

    const loanPresets = [
        { label: "₹15 Lakh", value: 1500000 },
        { label: "₹25 Lakh", value: 2500000 },
        { label: "₹40 Lakh", value: 4000000 },
        { label: "₹60 Lakh", value: 6000000 },
        { label: "₹1 Crore", value: 10000000 },
    ];

    const tenurePresets = [5, 10, 15, 20, 25, 30];

    const handleApplyLoan = () => {
        const msg = encodeURIComponent(
            `Hello Jaipur Ki Property! I calculated Home Loan EMI on your website: Loan Amount: ₹${(loanAmount / 100000).toFixed(1)} Lakhs, Tenure: ${tenureYears} Years @ ${interestRate}%. Please provide bank loan assistance and pre-approved offers in Jaipur.`
        );
        window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
    };

    return (
        <section className="emi-calculator-section" id="emi-calculator" aria-label="Home Loan EMI Calculator">
            <div className="container">
                <div className="emi-section-card">
                    {/* HEADER */}
                    <div className="emi-header">
                        <div className="emi-badge">
                            <Calculator size={14} />
                            <span>Real Estate Finance Tool</span>
                        </div>
                        <h2 className="emi-title">
                            Home Loan <span className="highlight-text">EMI Calculator</span>
                        </h2>
                        <p className="emi-subtitle">
                            Plan your dream home budget in Jaipur. Calculate monthly installments, total interest payout and explore loan offers from top banks.
                        </p>
                    </div>

                    <div className="emi-layout">
                        {/* LEFT: CONTROLS */}
                        <div className="emi-controls">
                            {/* 1. LOAN AMOUNT */}
                            <div className="emi-control-group">
                                <div className="emi-control-label-row">
                                    <label>
                                        <IndianRupee size={15} color="#ec268f" />
                                        <span>Loan Amount</span>
                                    </label>
                                    <span className="emi-val-pill">
                                        {formatCurrency(loanAmount)}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="500000"
                                    max="20000000"
                                    step="100000"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="emi-slider"
                                    aria-label="Loan Amount Slider"
                                />
                                <div className="emi-presets-row">
                                    {loanPresets.map((preset) => (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            className={`emi-preset-chip ${loanAmount === preset.value ? "active" : ""}`}
                                            onClick={() => setLoanAmount(preset.value)}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. INTEREST RATE */}
                            <div className="emi-control-group">
                                <div className="emi-control-label-row">
                                    <label>
                                        <Percent size={15} color="#ec268f" />
                                        <span>Interest Rate (% per annum)</span>
                                    </label>
                                    <span className="emi-val-pill">
                                        {interestRate}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="7"
                                    max="14"
                                    step="0.1"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="emi-slider"
                                    aria-label="Interest Rate Slider"
                                />
                                <div className="emi-presets-row">
                                    {[8.0, 8.5, 9.0, 9.5].map((rate) => (
                                        <button
                                            key={rate}
                                            type="button"
                                            className={`emi-preset-chip ${interestRate === rate ? "active" : ""}`}
                                            onClick={() => setInterestRate(rate)}
                                        >
                                            {rate}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3. LOAN TENURE */}
                            <div className="emi-control-group">
                                <div className="emi-control-label-row">
                                    <label>
                                        <Calendar size={15} color="#ec268f" />
                                        <span>Loan Tenure (Years)</span>
                                    </label>
                                    <span className="emi-val-pill">
                                        {tenureYears} Years ({tenureYears * 12} Months)
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    step="1"
                                    value={tenureYears}
                                    onChange={(e) => setTenureYears(Number(e.target.value))}
                                    className="emi-slider"
                                    aria-label="Tenure in Years Slider"
                                />
                                <div className="emi-presets-row">
                                    {tenurePresets.map((yr) => (
                                        <button
                                            key={yr}
                                            type="button"
                                            className={`emi-preset-chip ${tenureYears === yr ? "active" : ""}`}
                                            onClick={() => setTenureYears(yr)}
                                        >
                                            {yr} Yrs
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: RESULTS DISPLAY */}
                        <div className="emi-results-card">
                            <div className="emi-result-top">
                                <span className="emi-result-caption">Estimated Monthly EMI</span>
                                <div className="emi-result-amount">
                                    {formatCurrency(calculation.emi)}
                                    <small>/month</small>
                                </div>
                            </div>

                            {/* VISUAL BREAKDOWN BAR */}
                            <div className="emi-breakdown-bar-wrap">
                                <div className="emi-bar-container">
                                    <div
                                        className="emi-bar-principal"
                                        style={{ width: `${calculation.principalPercent}%` }}
                                        title={`Principal: ${calculation.principalPercent}%`}
                                    ></div>
                                    <div
                                        className="emi-bar-interest"
                                        style={{ width: `${calculation.interestPercent}%` }}
                                        title={`Interest: ${calculation.interestPercent}%`}
                                    ></div>
                                </div>
                                <div className="emi-bar-legend">
                                    <div className="legend-item">
                                        <span className="legend-dot dot-principal"></span>
                                        <span>Principal ({calculation.principalPercent}%)</span>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-dot dot-interest"></span>
                                        <span>Total Interest ({calculation.interestPercent}%)</span>
                                    </div>
                                </div>
                            </div>

                            {/* SUMMARY NUMBERS */}
                            <div className="emi-summary-list">
                                <div className="emi-summary-row">
                                    <span className="row-label">Principal Loan Amount</span>
                                    <span className="row-val">{formatCurrency(loanAmount)}</span>
                                </div>
                                <div className="emi-summary-row">
                                    <span className="row-label">Total Interest Payable</span>
                                    <span className="row-val highlight-interest">
                                        {formatCurrency(calculation.totalInterest)}
                                    </span>
                                </div>
                                <div className="emi-summary-row total-row">
                                    <span className="row-label">Total Amount Payable</span>
                                    <span className="row-val total-val">
                                        {formatCurrency(calculation.totalPayment)}
                                    </span>
                                </div>
                            </div>

                            {/* ACTION BUTTON */}
                            <div className="emi-action-box">
                                <button
                                    type="button"
                                    className="emi-apply-btn"
                                    onClick={handleApplyLoan}
                                >
                                    <MessageSquare size={16} />
                                    <span>Get Pre-Approved Loan Assistance</span>
                                </button>
                                <div className="bank-partner-tags">
                                    <ShieldCheck size={13} color="#15803d" />
                                    <span>Partner Banks: SBI • HDFC • ICICI • BOB • Axis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
