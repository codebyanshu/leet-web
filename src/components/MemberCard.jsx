import React from "react";
import { Link } from "react-router-dom";
import { Flame, Star, Trash2 } from "lucide-react";
import RankBadge from "./RankBadge";
import StatCard from "./StatCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MemberCard = ({ member, rank, onRemove, showDelete = false }) => {
  const isTopThree = rank <= 3;

  return (
    <div
      className={cn(
        "gradient-border rounded-xl p-4 md:p-6 bg-card transition-all duration-300 hover:scale-[1.02] animate-fade-in group",
        isTopThree && "ring-1 ring-primary/20"
      )}
      style={{ animationDelay: `${rank * 0.05}s` }}
    >
      <div className="flex items-center gap-4">
        {/* Rank Badge - Now positioned left of avatar */}
        <RankBadge rank={rank} />

        {/* Avatar & Username - Clickable */}
        <Link 
          to={`/member/${member.username}`}
          className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
        >
          <img
            src={member.avatar}
            alt={member.username}
            className="w-12 h-12 rounded-full border-2 border-border bg-secondary"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate hover:text-primary transition-colors">
              {member.username}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">Rank #{member.ranking.toLocaleString()}</span>
              {member.streak > 0 && (
                <span className="flex items-center gap-1 text-gold">
                  <Flame className="w-3 h-3" />
                  {member.streak} day streak
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Stats Grid */}
        <div className="hidden md:flex items-center gap-4 border-l border-border pl-4">
          <StatCard label="Total" value={member.totalSolved} color="primary" />
          <div className="flex gap-2">
            <StatCard label="Easy" value={member.easySolved} color="easy" small />
            <StatCard label="Med" value={member.mediumSolved} color="medium" small />
            <StatCard label="Hard" value={member.hardSolved} color="hard" small />
          </div>
        </div>

        {/* Contest Rating */}
        <div className="hidden lg:flex items-center gap-2 border-l border-border pl-4">
          <Star className="w-4 h-4 text-gold" />
          <div>
            <p className="font-mono font-bold text-foreground">{member.contestRating}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Rating</p>
          </div>
        </div>

        {/* Remove Button - Only visible for admin */}
        {showDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              onRemove(member.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Mobile Stats */}
      <div className="flex md:hidden items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex gap-4">
          <StatCard label="Total" value={member.totalSolved} color="primary" small />
          <StatCard label="Easy" value={member.easySolved} color="easy" small />
          <StatCard label="Med" value={member.mediumSolved} color="medium" small />
          <StatCard label="Hard" value={member.hardSolved} color="hard" small />
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-gold" />
          <span className="font-mono text-sm font-bold">{member.contestRating}</span>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
