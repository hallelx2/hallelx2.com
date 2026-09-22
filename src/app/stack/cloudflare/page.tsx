import type { Metadata } from "next";
import StackCloudflareView from "@/module/site/views/StackCloudflareView";

export const metadata: Metadata = {
  title: "Cloudflare Workers and Durable Objects — hallelx2 labs",
  description: "BridgeHook's relay on Cloudflare: why the SSE stream lives in a per-channel Durable Object rather than a Worker, what hibernation buys, and where the free tier stops being free.",
};

export default function Page() {
  return <StackCloudflareView />;
}
