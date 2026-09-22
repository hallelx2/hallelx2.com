import type { Metadata } from "next";
import StackAgentsView from "@/module/site/views/StackAgentsView";

export const metadata: Metadata = {
  title: "Agents, MCP and the design loop — hallelx2 labs",
  description: "How AI sits inside the work: models behind a gateway rather than one vendor, MCP servers I write rather than only consume, standing skills instead of prompts, and why the OpenDesign flow beats the Claude Design one for this site.",
};

export default function Page() {
  return <StackAgentsView />;
}
