import type { Metadata } from "next";
import ActivityView from "@/module/site/views/ActivityView";

export const metadata: Metadata = {
  title: "Activity — hallelx2 labs",
  description: "What I have shipped and when, generated from GitHub, PyPI, npm and the Go module proxy. 58 releases across 8 packages.",
};

export default function Page() {
  return <ActivityView />;
}
