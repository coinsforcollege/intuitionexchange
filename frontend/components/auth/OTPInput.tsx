/**
 * OTP Input Component
 * Beautiful 6-digit OTP input with auto-focus
 */

import React, { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { theme } from 'antd';
import { fontWeights } from '@/theme/themeConfig';

const { useToken } = theme;

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
  autoFocus = true,
}: OTPInputProps) {
  const { token } = useToken();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Split value into array
  const valueArray = value.split('').slice(0, length);
  while (valueArray.length < length) {
    valueArray.push('');
  }

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return; // Only allow digits

    const newValue = valueArray.slice();
    newValue[index] = digit.slice(-1); // Only take last digit
    onChange(newValue.join(''));

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!valueArray[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pastedData);
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: token.marginSM,
    justifyContent: 'center',
  };

  const getInputStyle = (index: number): React.CSSProperties => ({
    width: 48,
    height: 56,
    textAlign: 'center',
    fontSize: token.fontSizeHeading3,
    fontWeight: fontWeights.bold,
    borderRadius: token.borderRadius,
    border: `2px solid ${
      error
        ? token.colorError
        : focusedIndex === index
        ? token.colorPrimary
        : valueArray[index]
        ? token.colorPrimaryBorder
        : token.colorBorder
    }`,
    backgroundColor: disabled ? token.colorBgContainerDisabled : token.colorBgContainer,
    color: token.colorText,
    outline: 'none',
    transition: 'all 0.2s ease',
    caretColor: 'transparent',
  });

  return (
    <div style={containerStyle}>
      {valueArray.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          disabled={disabled}
          style={getInputStyle(index)}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
}

