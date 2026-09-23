import type { Metadata } from "next";
import StackGoView from "@/module/site/views/StackGoView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Go — hallelx2 labs",
  description: "Go across the Vectorless retrieval engine, pdfgrab and LLMGate — why a library other people compile into their own programs is a different engineering problem from a service you run yourself.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/stack/go"} title={metadata.title as string} description={metadata.description as string} />
      <StackGoView />
    </>
  );
}
