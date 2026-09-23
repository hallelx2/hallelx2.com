import type { Metadata } from "next";
import TrainingAiInPractice2026View from "@/module/site/views/TrainingAiInPractice2026View";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "AI in Practice, August 2026 — hallelx2 labs",
  description: "AI in Practice, August 2026. 176 people signed up in a fortnight, every evening ran past its scheduled finish, and six in ten were still in the room when the clock said stop.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/training/ai-in-practice-2026"} title={metadata.title as string} description={metadata.description as string} />
      <TrainingAiInPractice2026View />
    </>
  );
}
