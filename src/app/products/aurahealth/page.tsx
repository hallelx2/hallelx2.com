import type { Metadata } from "next";
import AurahealthProductView from "@/module/site/views/AurahealthProductView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "AuraHealth — hallelx2 labs",
  description: "AuraHealth is a hallelx2 labs healthcare product: voice triage and escrowed payment, built and running on Interswitch’s sandbox and being prepared to pitch to a hospital. No hospital uses it yet.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/products/aurahealth"} title={metadata.title as string} description={metadata.description as string} />
      <AurahealthProductView />
    </>
  );
}
