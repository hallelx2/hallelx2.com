import type { Metadata } from "next";
import VectorlessProductView from "@/module/site/views/VectorlessProductView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Vectorless — hallelx2 labs",
  description: "Vectorless is an open-source retrieval engine from hallelx2 labs. It rebuilds a document&rsquo;s structure from where the ink sits on the page, then navigates to the exact section — tables included. No vector database.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/products/vectorless"} title={"Vectorless — hallelx2 labs"} description={"Vectorless is an open-source retrieval engine from hallelx2 labs. It rebuilds a document&rsquo;s structure from where the ink sits on the page, then navigates to the exact section — tables included. No vector database."} />
      <VectorlessProductView />
    </>
  );
}
