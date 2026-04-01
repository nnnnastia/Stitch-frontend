import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function AccountInput({
    name,
    label,
    placeholder,
    type = 'text',
    value,
    onChange,
    disabled = false,
    showToggle = false,
    autoComplete,
}) {
    const inputId = useId();
    const isPasswordField = type === 'password' && showToggle;
    const [showPassword, setShowPassword] = useState(false);

    const inputType = isPasswordField && showPassword ? 'text' : type;

    return (
        <div className="account-input">
            <label htmlFor={inputId} className="account-input__label">
                {label}
            </label>

            <div className="account-input__wrapper">
                <input
                    id={inputId}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    onChange={(e) => onChange && onChange(e.target.value)}
                    className="account-input__field"
                />

                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                        className="account-input__toggle"
                    >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
}