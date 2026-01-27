import { cn } from "@/lib/utils";

const StatCard = ({ label, value, color = "primary", small = false }) => {
  const colorClasses = {
    primary: "text-primary",
    accent: "text-accent",
    easy: "text-accent",
    medium: "text-gold",
    hard: "text-destructive",
  };

  return (
    <div className={cn("text-center", small ? "px-2" : "px-4")}>
      <p className={cn(
        "font-mono font-bold",
        colorClasses[color],
        small ? "text-lg" : "text-2xl"
      )}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className={cn(
        "text-muted-foreground uppercase tracking-wide",
        small ? "text-[10px]" : "text-xs"
      )}>
        {label}
      </p>
    </div>
  );
};

export default StatCard;
