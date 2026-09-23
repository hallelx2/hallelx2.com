import type { Metadata } from "next";
import StackExpoView from "@/module/site/views/StackExpoView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Expo and React Native — hallelx2 labs",
  description: "Two Expo apps — Tether and Coursified — on React 19 and React Native 0.86, both reading one shared design-token package so the phone and the web stay the same product.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/stack/expo"} title={metadata.title as string} description={metadata.description as string} />
      <StackExpoView />
    </>
  );
}
