import { cn } from "@/lib/utils";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-accent text-background hover:bg-accent/90":
            variant === "primary",
          "border border-border bg-background-secondary text-foreground hover:bg-border":
            variant === "secondary",
          "text-foreground hover:bg-border/50": variant === "ghost",
          "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30":
            variant === "danger",
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    />
  );
}
