import type { Metadata } from "next";
import LorxView from "@/module/site/views/LorxView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Lorx — hallelx2 labs",
  description: "A git-compatible code forge in Rust: git hosting, change requests and a workflow engine in one lorx serve process, with the bit command line as a superset of git. Live at lorx.space.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/projects/lorx"} title={metadata.title as string} description={metadata.description as string} />
      <LorxView />
    </>
  );
}
