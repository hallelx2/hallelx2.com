import type { Metadata } from "next";
import TrainingView from "@/module/site/views/TrainingView";

export const metadata: Metadata = {
  title: "Training — hallelx2 labs",
  description: "The hallelx2 labs training arm. Programmes for researchers and clinicians, with the attendance published for each one.",
};

export default function Page() {
  return <TrainingView />;
}
