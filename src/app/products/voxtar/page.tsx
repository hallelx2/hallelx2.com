import type { Metadata } from "next";
import VoxtarProductView from "@/module/site/views/VoxtarProductView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Voxtar — hallelx2 labs",
  description: "Voxtar is a clinical voice-biomarker platform from hallelx2 labs. Patients record short daily tasks in their own language; pyzheimer turns each one into acoustic measurements, builds a personal baseline, and flags drift from it.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/products/voxtar"} title={"Voxtar — hallelx2 labs"} description={"Voxtar is a clinical voice-biomarker platform from hallelx2 labs. Patients record short daily tasks in their own language; pyzheimer turns each one into acoustic measurements, builds a personal baseline, and flags drift from it."} />
      <VoxtarProductView />
    </>
  );
}
