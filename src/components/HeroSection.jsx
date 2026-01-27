import { Code2, Trophy, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(174_100%_50%_/_0.1)_0%,_transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50 mb-6 animate-fade-in">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">Track. Compete. Dominate.</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="text-foreground">LeetCode</span>
          <br />
          <span className="text-gradient">Leaderboard</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Add your team members, track their LeetCode progress, and see who dominates the leaderboard. 
          Fuel healthy competition and level up together.
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <span className="font-mono text-sm">Real-time Rankings</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <span className="font-mono text-sm">Team Competition</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
              <Code2 className="w-5 h-5 text-gold" />
            </div>
            <span className="font-mono text-sm">Progress Tracking</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
