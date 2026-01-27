import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const RankBadge = ({ rank }) => {
  const getRankStyles = () => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-gold/20",
          border: "border-gold",
          text: "text-gold",
          glow: "shadow-[0_0_10px_rgba(255,215,0,0.3)]",
          label: "🥇",
          isEmoji: true,
        };
      case 2:
        return {
          bg: "bg-silver/20",
          border: "border-silver",
          text: "text-silver",
          glow: "shadow-[0_0_10px_rgba(192,192,192,0.3)]",
          label: "🥈",
          isEmoji: true,
        };
      case 3:
        return {
          bg: "bg-bronze/20",
          border: "border-bronze",
          text: "text-bronze",
          glow: "shadow-[0_0_10px_rgba(205,127,50,0.3)]",
          label: "🥉",
          isEmoji: true,
        };
      default:
        return {
          bg: "bg-secondary",
          border: "border-border",
          text: "text-muted-foreground",
          glow: "",
          label: `#${rank}`,
          isEmoji: false,
        };
    }
  };

  const styles = getRankStyles();

  return (
    <div
      className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full border font-mono font-bold transition-all",
        styles.bg,
        styles.border,
        styles.text,
        styles.glow
      )}
    >
      {styles.isEmoji ? (
        <span className="text-xl">{styles.label}</span>
      ) : (
        <span className="text-sm">{styles.label}</span>
      )}
    </div>
  );
};

export default RankBadge;
