import type { Metadata } from "next";
import Mb3prepbotProductView from "@/module/site/views/Mb3prepbotProductView";

export const metadata: Metadata = {
  title: "MB3 Prepbot — hallelx2 labs",
  description: "MB3 Prepbot is a daily exam-drill bot for MB BS Part III at UCH Ibadan, with 155 students, 71,377 marked answers and published figures on where it stalls.",
};

export default function Page() {
  return <Mb3prepbotProductView />;
}
