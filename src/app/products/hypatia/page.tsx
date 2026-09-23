import type { Metadata } from "next";
import HypatiaProductView from "@/module/site/views/HypatiaProductView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Hypatia — hallelx2 labs",
  description: "Hypatia teaches a new domain by mapping it onto one the learner already knows, then teaching exactly where that mapping breaks.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/products/hypatia"} title={"Hypatia — hallelx2 labs"} description={"Hypatia teaches a new domain by mapping it onto one the learner already knows, then teaching exactly where that mapping breaks."} />
      <HypatiaProductView />
    </>
  );
}
