import type { Metadata } from "next";
import StackNextView from "@/module/site/views/StackNextView";

export const metadata: Metadata = {
  title: "Next.js — hallelx2 labs",
  description: "Next.js App Router across this site, Coursified and Voxtar — server-first by default, one deliberate multi-page heresy, and the two hydration mismatches that came out of porting a static design set.",
};

export default function Page() {
  return <StackNextView />;
}
