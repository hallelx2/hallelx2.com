import type { Metadata } from "next";
import StackBunView from "@/module/site/views/StackBunView";

export const metadata: Metadata = {
  title: "Bun — hallelx2 labs",
  description: "How Tether's API runs on Bun with an empty dependency block: Bun.serve, bun:sqlite, argon2id through Bun.password, one compiled executable, and the event-loop-lag metric that makes a synchronous database safe.",
};

export default function Page() {
  return <StackBunView />;
}
