import type { Metadata } from "next";
import LandingView from "@/module/site/views/LandingView";

export const metadata: Metadata = {
  title: "hallelx2 labs — building the products healthcare, education and the AI ecosystem need",
  description: "hallelx2 labs builds the products healthcare, education and the AI ecosystem need — six of them, on three open-source libraries we wrote and released, with every claim measured in public.",
};

export default function Page() {
  return <LandingView />;
}
