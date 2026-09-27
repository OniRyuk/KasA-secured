import React, { useMemo } from "react";

export interface KasaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  shine?: boolean;
  shineDelay?: number;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  download?: string;
  target?: string;
}

export const KasaButton: React.FC<KasaButtonProps> = ({
  variant = "secondary",
  size = "md",
  shine = true,
  shineDelay,
  className = "",
  icon,
  children,
  href,
  download,
  target,
  disabled,
  onClick,
  ...rest
}) => {
  // Pick a pseudo-random shine class (1 to 5) so different buttons on the screen gleam asynchronously
  const randomShineClass = useMemo(() => {
    const classes = [
      "shine-random-1",
      "shine-random-2",
      "shine-random-3",
      "shine-random-4",
      "shine-random-5"
    ];
    return classes[Math.floor(Math.random() * classes.length)];
  }, []);

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-xs sm:text-sm gap-2",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5"
  }[size];

  const variantClasses = {
    primary: "kasa-btn-primary shadow-red-950/60",
    secondary: "kasa-btn-secondary",
    danger: "kasa-btn-danger shadow-red-950/80",
    outline: "bg-transparent text-red-300 border border-red-800/80 hover:bg-red-950/30 hover:border-red-500"
  }[variant];

  const baseClasses = `kasa-btn relative inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`;

  const content = (
    <>
      {/* Randomized Luminous Shine Beam */}
      {shine && !disabled && (
        <span
          className={`kasa-btn-shine-beam ${randomShineClass}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="relative z-20 shrink-0">{icon}</span>}
      <span className="relative z-20 whitespace-nowrap flex items-center gap-1.5">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        download={download}
        target={target}
        className={baseClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={baseClasses}
      {...rest}
    >
      {content}
    </button>
  );
};
