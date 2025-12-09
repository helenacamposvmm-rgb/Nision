import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"
import { LucideIcon } from "lucide-react"

interface DockProps {
  className?: string
  items: {
    icon: LucideIcon
    label: string
    onClick?: () => void
  }[]
}

interface DockIconButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  className?: string
}

const DockIconButton = React.forwardRef<HTMLButtonElement, DockIconButtonProps>(
  ({ icon: Icon, label, onClick, className }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "relative group p-3 rounded-lg flex-shrink-0",
          "hover:bg-secondary transition-colors",
          className
        )}
      >
        <Icon className="w-5 h-5 text-foreground" />
        {/* Tooltip label (hidden on touch usually, but kept for logic) */}
        <span className={cn(
          "absolute -top-10 left-1/2 -translate-x-1/2",
          "px-2 py-1 rounded text-xs",
          "bg-popover text-popover-foreground border shadow-sm",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity whitespace-nowrap pointer-events-none hidden sm:block"
        )}>
          {label}
        </span>
      </motion.button>
    )
  }
)
DockIconButton.displayName = "DockIconButton"

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ items, className }, ref) => {
    return (
      <div ref={ref} className={cn("w-full flex items-center justify-center", className)}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "flex items-center gap-1 p-2 rounded-2xl",
            "backdrop-blur-xl border shadow-2xl",
            "bg-background/80 border-white/10 dark:border-white/5",
            "overflow-x-auto no-scrollbar max-w-full"
          )}
        >
          {items.map((item) => (
            <DockIconButton key={item.label} {...item} />
          ))}
        </motion.div>
      </div>
    )
  }
)
Dock.displayName = "Dock"

export { Dock }