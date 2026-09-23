import type { Metadata } from "next";
import TetherView from "@/module/site/views/TetherView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Tether — hallelx2 labs",
  description: "Know where your things are. A Bun backend with zero dependencies, SSE instead of WebSockets, and a compare-and-swap that makes the lost update unexpressible.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/projects/tether"} title={metadata.title as string} description={metadata.description as string} />
      <TetherView />
    </>
  );
}
