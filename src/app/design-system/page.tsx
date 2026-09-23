import type { Metadata } from "next";
import DesignSystemView from "@/module/site/views/DesignSystemView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "hallelx2 labs — design system v10",
  description: "The living gallery for the hallelx2 labs design system: tokens, contrast, type, components.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/design-system"} title={"hallelx2 labs — design system v10"} description={"The living gallery for the hallelx2 labs design system: tokens, contrast, type, components."} />
      <DesignSystemView />
    </>
  );
}
