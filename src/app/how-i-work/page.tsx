import type { Metadata } from "next";
import HowIWorkView from "@/module/site/views/HowIWorkView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "How I work — hallelx2 labs",
  description: "The loop I ship every change through, where AI sits inside it, the stack I reach for, and what that produced — measured from the commit history.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/how-i-work"} title={"How I work — hallelx2 labs"} description={"The loop I ship every change through, where AI sits inside it, the stack I reach for, and what that produced — measured from the commit history."} />
      <HowIWorkView />
    </>
  );
}
