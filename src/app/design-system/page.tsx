import type { Metadata } from "next";
import DesignSystemView from "@/module/site/views/DesignSystemView";

export const metadata: Metadata = {
  title: "hallelx2 labs — design system v10",
  description: "The living gallery for the hallelx2 labs design system: tokens, contrast, type, components.",
};

export default function Page() {
  return <DesignSystemView />;
}
