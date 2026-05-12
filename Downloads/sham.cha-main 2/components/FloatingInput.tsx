'use client';

import { useState, useRef, TextareaHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

interface BaseProps {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

interface InputProps extends BaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  multiline?: false;
}

interface TextareaProps extends BaseProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  multiline: true;
  rows?: number;
}

type FloatingInputProps = InputProps | TextareaProps;

export default function FloatingInput(props: FloatingInputProps) {
  const { label, error, icon, rightElement, multiline, ...rest } = props;
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  const value = (rest as InputHTMLAttributes<HTMLInputElement>).value ?? '';
  const hasValue = String(value).length > 0;
  const isFloating = focused || hasValue;

  const baseInputClass = `
    w-full bg-[#020617] rounded-xl pt-6 pb-2 px-4 text-white outline-none transition-all duration-200
    border-2 placeholder-transparent text-sm sm:text-base
    ${icon ? 'pl-11' : ''}
    ${rightElement ? 'pr-11' : ''}
    ${error
      ? 'border-red-500 focus:border-red-400 shadow-lg shadow-red-500/20'
      : focused
        ? 'border-blue-500 shadow-lg shadow-blue-500/20'
        : 'border-[#1a2e4a] hover:border-[#2a3e5a]'
    }
  `.trim();

  return (
    <div className="relative w-full" onClick={() => inputRef.current?.focus()}>
      {/* Floating label */}
      <label
        className={`
          absolute pointer-events-none transition-all duration-200 font-medium
          ${rightElement ? 'right-12' : 'right-4'}
          ${isFloating
            ? 'top-1.5 text-xs text-blue-400'
            : multiline
              ? 'top-4 text-sm text-gray-400'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
          }
          ${error && isFloating ? 'text-red-400' : ''}
        `}
        style={{ zIndex: 1 }}
      >
        {label}
      </label>

      {/* Left icon */}
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" style={{ zIndex: 1 }}>
          {icon}
        </span>
      )}

      {/* Right element (e.g. eye button) */}
      {rightElement && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ zIndex: 2 }}>
          {rightElement}
        </span>
      )}

      {/* Input or Textarea */}
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          rows={(rest as TextareaProps).rows ?? 3}
          onFocus={(e) => {
            setFocused(true);
            (rest as TextareaProps).onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            (rest as TextareaProps).onBlur?.(e);
          }}
          placeholder=" "
          className={`${baseInputClass} resize-none`}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          onFocus={(e) => {
            setFocused(true);
            (rest as InputProps).onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            (rest as InputProps).onBlur?.(e);
          }}
          placeholder=" "
          className={baseInputClass}
        />
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-400 text-xs mt-1.5 text-right font-medium">{error}</p>
      )}
    </div>
  );
}
