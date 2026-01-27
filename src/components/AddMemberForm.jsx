import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddMemberForm = ({ onAddMember, isLoading = false }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      return;
    }

    onAddMember(username.trim());
    setUsername("");
  };

  return (
    <section className="py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="gradient-border rounded-xl p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            <span>Add Member</span>
          </h2>
          
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              type="text"
              placeholder="Enter LeetCode username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" variant="hero" disabled={isLoading || !username.trim()}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add"
              )}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-3 font-mono">
            Enter the exact LeetCode username to add them to your leaderboard
          </p>
        </div>
      </div>
    </section>
  );
};

export default AddMemberForm;
