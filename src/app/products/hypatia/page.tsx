import type { Metadata } from "next";
import HypatiaProductView from "@/module/site/views/HypatiaProductView";

export const metadata: Metadata = {
  title: "Hypatia — hallelx2 labs",
  description: "Hypatia teaches a new domain by mapping it onto one the learner already knows, then teaching exactly where that mapping breaks.",
};

export default function Page() {
  return <HypatiaProductView />;
}
