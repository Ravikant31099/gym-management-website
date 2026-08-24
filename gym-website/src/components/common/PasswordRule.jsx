import {CheckCircle2, Circle}  from "lucide-react";

export default function PasswordRule({ valid, text }) {
    return (
        <div className="password-rule">{valid ? <CheckCircle2 size={16} color="#16a34a" /> : <Circle size={16} color="#94a3b8" />}
            <span className={valid ? "rule-valid" : "rule-invalid"}>{text}
            </span>
        </div>
    );
}