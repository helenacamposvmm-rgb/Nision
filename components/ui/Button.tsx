import * as React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import { ShimmerButton } from "./shimmer-button";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    
    // Mapping size props to internal padding/size classes
    const sizeClasses = cn(
      size === "default" && "h-10 px-4 py-2",
      size === "sm" && "h-9 rounded-md px-3 text-xs",
      size === "lg" && "h-11 rounded-md px-8",
      size === "icon" && "h-10 w-10 p-2 flex items-center justify-center"
    );

    // Determine background and text colors based on variant
    // ShimmerButton uses specific props for background and defaults text color.
    // We override these defaults to match our theme.

    let background = "hsl(var(--primary))";
    let shimmerColor = "rgba(255, 255, 255, 0.2)";
    // We construct a specific text class to override ShimmerButton's default `text-white dark:text-black`
    // Using `!text-...` or specific classes to ensure we get what we want.
    // Standard shadcn button text colors:
    let textColorClass = "text-primary-foreground dark:text-primary-foreground";

    if (variant === "secondary") {
        background = "hsl(var(--secondary))";
        textColorClass = "text-secondary-foreground dark:text-secondary-foreground";
    } else if (variant === "destructive") {
        background = "hsl(var(--destructive))";
        textColorClass = "text-destructive-foreground dark:text-destructive-foreground";
    } else if (variant === "outline") {
        background = "transparent";
        textColorClass = "text-foreground dark:text-foreground";
        shimmerColor = "hsl(var(--primary))"; // Give outline a primary colored shimmer? Or Keep white.
    } else if (variant === "ghost") {
        background = "transparent";
        textColorClass = "text-foreground dark:text-foreground";
        shimmerColor = "transparent"; // Reduce shimmer visibility for ghost
    } else if (variant === "link") {
        background = "transparent";
        textColorClass = "text-primary dark:text-primary underline-offset-4 hover:underline";
        shimmerColor = "transparent";
    }

    return (
      <ShimmerButton
        ref={ref}
        background={background}
        shimmerColor={shimmerColor}
        disabled={isLoading || props.disabled}
        // borderRadius matches theme radius (0.75rem approx 12px)
        borderRadius="0.75rem"
        className={cn(
          // Reset text color to apply our variant-specific one
          "!text-current", 
          textColorClass,
          sizeClasses,
          variant === "outline" && "border border-input",
          (variant === "ghost" || variant === "link") && "border-transparent shadow-none",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </ShimmerButton>
    );
  }
);
Button.displayName = "Button";

export { Button };