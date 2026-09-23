import type { Metadata } from "next";
import TrainingView from "@/module/site/views/TrainingView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Training — hallelx2 labs",
  description: "The hallelx2 labs training arm. Programmes for researchers and clinicians, with the attendance published for each one.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/training"} title={metadata.title as string} description={metadata.description as string} />
      <TrainingView />
    </>
  );
}
