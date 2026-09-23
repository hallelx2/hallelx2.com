import type { Metadata } from "next";
import ProductsIndexView from "@/module/site/views/ProductsIndexView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Projects — hallelx2 labs",
  description: "Ten projects across healthcare, education and the AI layer underneath them — what each one is, what it runs on, and how it was built.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/products"} title={"Projects — hallelx2 labs"} description={"Ten projects across healthcare, education and the AI layer underneath them — what each one is, what it runs on, and how it was built."} />
      <ProductsIndexView />
    </>
  );
}
