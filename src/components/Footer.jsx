import { Code2, Heart } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-4 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Code2 className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm">LCBoard</span>
        </div>
        
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Made for competitive coders
        </p>
        
        <p className="text-xs text-muted-foreground font-mono">
          © {new Date().getFullYear()} All rights reserved
        </p>
        <p className="text-xs text-muted-foreground font-mono">
          
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
        <a
      href="https://github.com/codebyanshu"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#999",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <FaGithub size={32} />
    </a>
    Made by Anshu
    </p>
      </div>
    </footer>
  );
};

export default Footer;
