import type { Metadata } from "next";
import NotebookLmView from "@/module/site/views/NotebookLmView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "NotebookLM, self-hosted — hallelx2 labs",
  description: "An open-source, local-first NotebookLM: one Hono app served by both a Next.js deployment and an Electron desktop build, with a seven-step retrieval pipeline and a research agent that critiques itself.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/projects/notebooklm"} title={metadata.title as string} description={metadata.description as string} />
      <NotebookLmView />
    </>
  );
}
