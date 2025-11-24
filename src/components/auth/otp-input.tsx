"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { cx } from "@/utils/cx";

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    isInvalid?: boolean;
    isDisabled?: boolean;
}

export function OTPInput({ length = 6, value, onChange, isInvalid, isDisabled }: OTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [focused, setFocused] = useState<number | null>(null);

    const handleChange = (index: number, inputValue: string) => {
        // Only allow digits
        const digit = inputValue.replace(/\D/g, "").slice(-1);

        const newValue = value.split("");
        newValue[index] = digit;
        const updatedValue = newValue.join("").slice(0, length);

        onChange(updatedValue);

        // Move to next input if digit was entered
        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (!value[index] && index > 0) {
                // If current input is empty, move to previous and clear it
                const newValue = value.split("");
                newValue[index - 1] = "";
                onChange(newValue.join(""));
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newValue = value.split("");
                newValue[index] = "";
                onChange(newValue.join(""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        onChange(pastedData);

        // Focus the next empty input or the last input
        const nextIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    return (
        <div className="flex gap-2">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => setFocused(index)}
                    onBlur={() => setFocused(null)}
                    disabled={isDisabled}
                    className={cx(
                        "flex size-12 items-center justify-center rounded-lg border bg-primary text-center text-xl font-semibold text-primary shadow-xs transition-all duration-100 outline-brand focus:outline-2 focus:outline-offset-2",
                        focused === index && !isDisabled && !isInvalid && "border-brand-solid ring-2 ring-brand-solid",
                        isInvalid && "border-error-solid ring-2 ring-error-solid",
                        isDisabled && "cursor-not-allowed bg-disabled_subtle text-disabled",
                        !isInvalid && !isDisabled && focused !== index && "border-primary",
                    )}
                    aria-label={`Digit ${index + 1} of ${length}`}
                />
            ))}
        </div>
    );
}
