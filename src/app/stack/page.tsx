import type { Metadata } from "next";
import StackView from "@/module/site/views/StackView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "My stack — hallelx2 labs",
  description: "Nine stacks and the shipped thing each one is answerable for — Bun, Go, Java 21 with Spring AI, Next.js, Expo, Cloudflare Durable Objects, Python, Postgres and the agent layer — read out of the repositories they name.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/stack"} title={metadata.title as string} description={metadata.description as string} />
      <StackView />
    </>
  );
}
