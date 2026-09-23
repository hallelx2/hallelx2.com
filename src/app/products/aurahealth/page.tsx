import type { Metadata } from "next";
import AurahealthProductView from "@/module/site/views/AurahealthProductView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "AuraHealth — hallelx2 labs",
  description: "AuraHealth is an early-stage hallelx2 labs healthcare product, in design and being prepared to pitch to a clinical team.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/products/aurahealth"} title={metadata.title as string} description={metadata.description as string} />
      <AurahealthProductView />
    </>
  );
}
