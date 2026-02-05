import { ReactNode } from "react";

interface TerminalProps {
  children: ReactNode;
}

export function Terminal({ children }: TerminalProps) {
  return (
    <span className="block bg-zinc-950 rounded-lg p-4 font-mono text-sm text-zinc-300 mb-6 overflow-x-auto">
      {children}
    </span>
  );
}

interface TerminalLineProps {
  type?: "user" | "agent" | "system";
  children: ReactNode;
}

export function TerminalLine({ type = "system", children }: TerminalLineProps) {
  const colors = {
    user: "text-green-400",
    agent: "text-blue-400",
    system: "text-zinc-400",
  };

  const labels = {
    user: "User:",
    agent: "Agent:",
    system: "",
  };

  return (
    <span className="block mb-2">
      {labels[type] && (
        <span className={`${colors[type]} font-semibold`}>{labels[type]} </span>
      )}
      {children}
    </span>
  );
}

interface TerminalBlockProps {
  highlight?: boolean;
  children: ReactNode;
}

export function TerminalBlock({ highlight, children }: TerminalBlockProps) {
  return (
    <span
      className={`block pl-4 border-l-2 ${
        highlight ? "border-green-800" : "border-zinc-800"
      } mb-4`}
    >
      {children}
    </span>
  );
}
