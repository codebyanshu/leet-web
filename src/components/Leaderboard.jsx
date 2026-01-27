import React from "react";
import { Trophy, Loader2, RefreshCw } from "lucide-react";
import MemberCard from "./MemberCard";
import { Button } from "@/components/ui/button";

const Leaderboard = ({ 
  members, 
  onRemoveMember, 
  isLoading = false, 
  isAdmin = false,
  onRefreshStats,
  isRefreshing = false,
}) => {
  // Sort by total solved (descending)
  const sortedMembers = [...members].sort((a, b) => b.totalSolved - a.totalSolved);

  const renderMemberList = () => {
    if (isLoading) {
      return (
        <div className="gradient-border rounded-xl p-12 bg-card text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      );
    }

    if (members.length === 0) {
      return (
        <div className="gradient-border rounded-xl p-12 bg-card text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No members yet</h3>
          <p className="text-muted-foreground text-sm">
            Add LeetCode usernames above to start tracking scores
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {sortedMembers.map((member, index) => (
          <MemberCard
            key={member.id}
            member={member}
            rank={index + 1}
            onRemove={onRemoveMember}
            showDelete={isAdmin}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <span>Leaderboard</span>
          </h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshStats}
              disabled={isRefreshing || members.length === 0}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Stats"}
            </Button>
            <span className="text-sm font-mono text-muted-foreground">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {renderMemberList()}
      </div>
    </section>
  );
};

export default Leaderboard;
