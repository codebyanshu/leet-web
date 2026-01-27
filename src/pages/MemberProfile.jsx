import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Flame, Star, Target, TrendingUp, Award } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const MemberProfile = () => {
  const { username } = useParams();

  const { data: member, isLoading, error } = useQuery({
    queryKey: ["member", username],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Member not found");
      
      return {
        id: data.id,
        username: data.username,
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        ranking: data.ranking || 0,
        totalSolved: data.total_solved || 0,
        easySolved: data.easy_solved || 0,
        mediumSolved: data.medium_solved || 0,
        hardSolved: data.hard_solved || 0,
        contestRating: data.contest_rating || 0,
        contestRanking: data.contest_ranking || 0,
        streak: data.streak || 0,
        reputation: data.reputation || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Member not found</h2>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leaderboard
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const pieData = [
    { name: "Easy", value: member.easySolved, color: "hsl(var(--easy))" },
    { name: "Medium", value: member.mediumSolved, color: "hsl(var(--medium))" },
    { name: "Hard", value: member.hardSolved, color: "hsl(var(--hard))" },
  ];

  const barData = [
    { name: "Easy", solved: member.easySolved, fill: "hsl(var(--easy))" },
    { name: "Medium", solved: member.mediumSolved, fill: "hsl(var(--medium))" },
    { name: "Hard", solved: member.hardSolved, fill: "hsl(var(--hard))" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-block mb-6">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Leaderboard
            </Button>
          </Link>

          {/* Profile Header */}
          <div className="gradient-border rounded-xl p-6 bg-card mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={member.avatar}
                alt={member.username}
                className="w-24 h-24 rounded-full border-4 border-primary/20"
              />
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-foreground">{member.username}</h1>
                <p className="text-muted-foreground font-mono">
                  Global Rank: #{member.ranking.toLocaleString()}
                </p>
              </div>
              <a
                href={`https://leetcode.com/${member.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">View on LeetCode</Button>
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatBox
              icon={<Trophy className="w-5 h-5" />}
              label="Total Solved"
              value={member.totalSolved}
              color="primary"
            />
            <StatBox
              icon={<Flame className="w-5 h-5" />}
              label="Day Streak"
              value={member.streak}
              color="gold"
            />
            <StatBox
              icon={<Star className="w-5 h-5" />}
              label="Contest Rating"
              value={member.contestRating}
              color="primary"
            />
            <StatBox
              icon={<Award className="w-5 h-5" />}
              label="Reputation"
              value={member.reputation}
              color="primary"
            />
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="gradient-border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Problem Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="gradient-border rounded-xl p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Problems by Difficulty
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="gradient-border rounded-xl p-6 bg-card mt-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailRow label="Easy Solved" value={member.easySolved} color="easy" />
              <DetailRow label="Medium Solved" value={member.mediumSolved} color="medium" />
              <DetailRow label="Hard Solved" value={member.hardSolved} color="hard" />
              <DetailRow label="Contest Ranking" value={`#${member.contestRanking.toLocaleString()}`} />
              <DetailRow label="Contest Rating" value={member.contestRating} />
              <DetailRow label="Global Ranking" value={`#${member.ranking.toLocaleString()}`} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const StatBox = ({ icon, label, value, color = "primary" }) => (
  <div className="gradient-border rounded-xl p-4 bg-card text-center">
    <div className={`inline-flex p-2 rounded-lg bg-${color}/10 text-${color} mb-2`}>
      {icon}
    </div>
    <p className="text-2xl font-bold font-mono text-foreground">{value.toLocaleString()}</p>
    <p className="text-xs text-muted-foreground uppercase">{label}</p>
  </div>
);

const DetailRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
    <span className="text-muted-foreground text-sm">{label}</span>
    <span className={`font-mono font-bold ${color ? `text-${color}` : "text-foreground"}`}>
      {typeof value === "number" ? value.toLocaleString() : value}
    </span>
  </div>
);

export default MemberProfile;