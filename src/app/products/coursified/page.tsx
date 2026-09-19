import type { Metadata } from "next";
import CoursifiedProductView from "@/module/site/views/CoursifiedProductView";

export const metadata: Metadata = {
  title: "Coursified — hallelx2 labs",
  description: "Coursified turns free YouTube teaching into a structured course with graded labs — working code, a spreadsheet that reconciles, a deck that passes checks — and a certificate backed by what you actually produced.",
};

export default function Page() {
  return <CoursifiedProductView />;
}
