import React from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AddMemberForm from "@/components/AddMemberForm";
import Leaderboard from "@/components/Leaderboard";
import Footer from "@/components/Footer";
import { useMembers } from "@/hooks/useMembers";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { members, isLoading, addMember, removeMember, refreshAllStats, isRefreshing } = useMembers();
  const { isAdmin } = useAuth();

  const handleAddMember = (username) => {
    addMember.mutate(username);
  };

  const handleRemoveMember = (id) => {
    removeMember.mutate(id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AddMemberForm 
          onAddMember={handleAddMember} 
          isLoading={addMember.isPending}
        />
        <Leaderboard 
          members={members} 
          onRemoveMember={handleRemoveMember}
          isLoading={isLoading}
          isAdmin={isAdmin}
          onRefreshStats={refreshAllStats}
          isRefreshing={isRefreshing}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
