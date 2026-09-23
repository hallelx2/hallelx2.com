import type { Metadata } from "next";
import StackPythonView from "@/module/site/views/StackPythonView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Python — hallelx2 labs",
  description: "Python where the work is numbers, models or a script that has to be readable a year later — MB3 Prepbot serving real students, pyzheimer inside Voxtar, and two packages on PyPI.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/stack/python"} title={metadata.title as string} description={metadata.description as string} />
      <StackPythonView />
    </>
  );
}
