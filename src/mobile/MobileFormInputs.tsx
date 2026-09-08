'use client';

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

/**
 * Touch-optimized text input for mobile
 * Larger touch targets, optimized keyboard behavior
 */
export function MobileTextInput(
  props: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
) {
  const { label, error, className, ...inputProps } = props;

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-ink block">{label}</label>}
      <input
        {...inputProps}
        className={`
          w-full px-4 py-3 rounded border-2 text-base
          bg-surface border-line text-ink placeholder-ink-soft
          focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20
          transition-colors
          ${error ? 'border-red-500 focus:border-red-500' : ''}
          ${className || ''}
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Touch-optimized date picker for mobile
 */
export function MobileDateInput(
  props: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
) {
  const { label, error, className, ...inputProps } = props;

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-ink block">{label}</label>}
      <input
        type="date"
        {...inputProps}
        className={`
          w-full px-4 py-3 rounded border-2 text-base
          bg-surface border-line text-ink
          focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20
          transition-colors
          ${error ? 'border-red-500 focus:border-red-500' : ''}
          ${className || ''}
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Touch-optimized time picker for mobile
 */
export function MobileTimeInput(
  props: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
) {
  const { label, error, className, ...inputProps } = props;

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-ink block">{label}</label>}
      <input
        type="time"
        {...inputProps}
        className={`
          w-full px-4 py-3 rounded border-2 text-base
          bg-surface border-line text-ink
          focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20
          transition-colors
          ${error ? 'border-red-500 focus:border-red-500' : ''}
          ${className || ''}
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Touch-optimized select dropdown for mobile
 */
export function MobileSelect(
  props: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; options?: { value: string; label: string }[] }
) {
  const { label, error, className, options, ...selectProps } = props;

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-ink block">{label}</label>}
      <select
        {...selectProps}
        className={`
          w-full px-4 py-3 rounded border-2 text-base
          bg-surface border-line text-ink
          focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20
          transition-colors appearance-none cursor-pointer
          ${error ? 'border-red-500 focus:border-red-500' : ''}
          ${className || ''}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M0 3l6 6 6-6z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
          paddingRight: '2.5rem',
        }}
      >
        {options?.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Touch-optimized textarea for mobile
 */
export function MobileTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }
) {
  const { label, error, className, ...textareaProps } = props;

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-semibold text-ink block">{label}</label>}
      <textarea
        {...textareaProps}
        className={`
          w-full px-4 py-3 rounded border-2 text-base
          bg-surface border-line text-ink placeholder-ink-soft
          focus:outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20
          transition-colors resize-none
          ${error ? 'border-red-500 focus:border-red-500' : ''}
          ${className || ''}
        `}
        rows={4}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Touch-optimized checkbox for mobile
 */
export function MobileCheckbox(
  props: InputHTMLAttributes<HTMLInputElement> & { label?: string }
) {
  const { label, className, ...inputProps } = props;

  return (
    <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-surface/50 rounded transition-colors">
      <input
        type="checkbox"
        {...inputProps}
        className={`
          w-5 h-5 rounded accent-saffron cursor-pointer
          ${className || ''}
        `}
      />
      {label && <span className="text-sm text-ink font-medium">{label}</span>}
    </label>
  );
}

/**
 * Touch-optimized radio button for mobile
 */
export function MobileRadio(
  props: InputHTMLAttributes<HTMLInputElement> & { label?: string }
) {
  const { label, className, ...inputProps } = props;

  return (
    <label className="flex items-center gap-3 cursor-pointer p-3 hover:bg-surface/50 rounded transition-colors">
      <input
        type="radio"
        {...inputProps}
        className={`
          w-5 h-5 accent-saffron cursor-pointer
          ${className || ''}
        `}
      />
      {label && <span className="text-sm text-ink font-medium">{label}</span>}
    </label>
  );
}

/**
 * Touch-optimized button for mobile
 */
export function MobileButton({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className,
  ...buttonProps
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
}) {
  const variants = {
    primary: 'bg-saffron text-ink hover:bg-saffron/90',
    secondary: 'bg-surface border border-line text-ink hover:bg-line',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg',
  };

  return (
    <button
      {...buttonProps}
      disabled={disabled}
      className={`
        font-semibold rounded transition-all
        active:scale-95 active:shadow-inner
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className || ''}
      `}
    >
      {children}
    </button>
  );
}

/**
 * Form group for organized mobile forms
 */
export function MobileFormGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-3 ${className || ''}`}>
      {children}
    </div>
  );
}
