import type { Metadata } from "next";
import WritingView from "@/module/site/views/WritingView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Writing — hallelx2 labs",
  description: "Ten long-form articles published on X — why I wrote a PDF engine in Go, why an MCP server beats an admin dashboard, why choosing a language stopped mattering, T3 Code, and the case for Cloudflare.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/writing"} title={"Writing — hallelx2 labs"} description={"Ten long-form articles published on X — why I wrote a PDF engine in Go, why an MCP server beats an admin dashboard, why choosing a language stopped mattering, T3 Code, and the case for Cloudflare."} />
      <WritingView />
    </>
  );
}
