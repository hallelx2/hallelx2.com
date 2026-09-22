import type { Metadata } from "next";
import StackView from "@/module/site/views/StackView";

export const metadata: Metadata = {
  title: "My stack — hallelx2 labs",
  description: "Seven stacks and the shipped thing each one is answerable for — Bun, Go, Java 21 with Spring AI, Next.js, Expo, Cloudflare Durable Objects and Python — read out of the repositories they name.",
};

export default function Page() {
  return <StackView />;
}
