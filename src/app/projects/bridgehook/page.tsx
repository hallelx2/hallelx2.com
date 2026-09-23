import type { Metadata } from "next";
import BridgehookView from "@/module/site/views/BridgehookView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "BridgeHook — hallelx2 labs",
  description: "Webhook observability with nothing installed: a public URL forwards Stripe or GitHub to your localhost because the browser tab is the tunnel agent, with the stream held in a Cloudflare Durable Object.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/projects/bridgehook"} title={"BridgeHook — hallelx2 labs"} description={"Webhook observability with nothing installed: a public URL forwards Stripe or GitHub to your localhost because the browser tab is the tunnel agent, with the stream held in a Cloudflare Durable Object."} />
      <BridgehookView />
    </>
  );
}
