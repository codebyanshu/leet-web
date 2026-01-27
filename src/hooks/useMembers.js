import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

// Convert database row to member object
const mapDbToMember = (row) => ({
  id: row.id,
  username: row.username,
  avatar: row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.username}`,
  ranking: row.ranking || 0,
  totalSolved: row.total_solved || 0,
  easySolved: row.easy_solved || 0,
  mediumSolved: row.medium_solved || 0,
  hardSolved: row.hard_solved || 0,
  contestRating: row.contest_rating || 0,
  contestRanking: row.contest_ranking || 0,
  streak: row.streak || 0,
  reputation: row.reputation || 0,
});

export const useMembers = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch all members
  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("total_solved", { ascending: false });

      if (error) throw error;
      return data.map(mapDbToMember);
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("members-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "members",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          queryClient.invalidateQueries({ queryKey: ["members"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Refresh all members' stats
  const refreshAllStats = async () => {
    if (members.length === 0) {
      toast({
        title: "No members",
        description: "Add some members first to refresh their stats",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const member of members) {
        try {
          const { data: statsData, error: statsError } = await supabase.functions.invoke(
            "fetch-leetcode-stats",
            { body: { username: member.username } }
          );

          if (statsError || statsData.error) {
            console.error(`Failed to refresh ${member.username}:`, statsError || statsData.error);
            failCount++;
            continue;
          }

          const { error: updateError } = await supabase
            .from("members")
            .update({
              ranking: statsData.ranking,
              total_solved: statsData.totalSolved,
              easy_solved: statsData.easySolved,
              medium_solved: statsData.mediumSolved,
              hard_solved: statsData.hardSolved,
              contest_rating: statsData.contestRating,
              contest_ranking: statsData.contestRanking,
              streak: statsData.streak,
              reputation: statsData.reputation,
            })
            .eq("id", member.id);

          if (updateError) {
            console.error(`Failed to update ${member.username}:`, updateError);
            failCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`Error refreshing ${member.username}:`, err);
          failCount++;
        }
      }

      queryClient.invalidateQueries({ queryKey: ["members"] });

      if (successCount > 0) {
        toast({
          title: "Stats refreshed!",
          description: `Updated ${successCount} member${successCount > 1 ? "s" : ""}${failCount > 0 ? `, ${failCount} failed` : ""}`,
        });
      } else {
        toast({
          title: "Refresh failed",
          description: "Could not update any member stats",
          variant: "destructive",
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Add member mutation - fetches real LeetCode data
  const addMember = useMutation({
    mutationFn: async (username) => {
      // First check if user already exists
      const { data: existingMember } = await supabase
        .from("members")
        .select("id")
        .eq("username", username)
        .single();

      if (existingMember) {
        throw new Error("This user is already on the leaderboard");
      }

      // Fetch real LeetCode stats from our edge function
      const { data: statsData, error: statsError } = await supabase.functions.invoke(
        "fetch-leetcode-stats",
        {
          body: { username },
        }
      );

      if (statsError) {
        console.error("Edge function error:", statsError);
        throw new Error("Failed to fetch LeetCode stats");
      }

      if (statsData.error) {
        throw new Error(statsData.error);
      }

      // Use fallback avatar if LeetCode avatar doesn't work
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${statsData.username}`;

      const newMember = {
        username: statsData.username,
        avatar: avatar,
        ranking: statsData.ranking,
        total_solved: statsData.totalSolved,
        easy_solved: statsData.easySolved,
        medium_solved: statsData.mediumSolved,
        hard_solved: statsData.hardSolved,
        contest_rating: statsData.contestRating,
        contest_ranking: statsData.contestRanking,
        streak: statsData.streak,
        reputation: statsData.reputation,
      };

      const { error } = await supabase.from("members").insert(newMember);

      if (error) {
        if (error.code === "23505") {
          throw new Error("This user is already on the leaderboard");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Member added!",
        description: "Real LeetCode stats have been fetched and added to the leaderboard",
      });
    },
    onError: (error) => {
      // Map errors to user-friendly messages
      const userMessage = error.message.includes('already on the leaderboard')
        ? error.message
        : error.message.includes('not found')
        ? 'User not found on LeetCode'
        : 'Failed to add member. Please try again.';
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive",
      });
    },
  });

  // Remove member mutation
  const removeMember = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) {
        if (error.code === "42501") {
          throw new Error("Only admin can delete members");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Member removed",
        description: "The member has been removed from the leaderboard",
      });
    },
    onError: (error) => {
      // Map errors to user-friendly messages
      const userMessage = error.message.includes('admin')
        ? error.message
        : 'Failed to remove member. Please try again.';
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive",
      });
    },
  });

  return {
    members,
    isLoading,
    error,
    addMember,
    removeMember,
    refreshAllStats,
    isRefreshing,
  };
};
