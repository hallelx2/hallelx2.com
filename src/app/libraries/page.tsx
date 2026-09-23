import type { Metadata } from "next";
import LibrariesView from "@/module/site/views/LibrariesView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Libraries — hallelx2 labs",
  description: "Nine open-source packages on PyPI, npm and the Go module proxy. Each one was built because I needed it and could not install it.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/libraries"} title={"Libraries — hallelx2 labs"} description={"Nine open-source packages on PyPI, npm and the Go module proxy. Each one was built because I needed it and could not install it."} />
      <LibrariesView />
    </>
  );
}
