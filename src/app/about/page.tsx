import type { Metadata } from "next";
import AboutView from "@/module/site/views/AboutView";

export const metadata: Metadata = {
  title: "Halleluyah Oludele — hallelx2 labs",
  description: "Halleluyah Oludele — final-year medical student at the University of Ibadan, and the person behind the six products, three open-source libraries and the training arm at hallelx2 labs.",
};

export default function Page() {
  return <AboutView />;
}
