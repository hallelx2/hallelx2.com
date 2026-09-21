import type { Metadata } from "next";
import ProductsIndexView from "@/module/site/views/ProductsIndexView";

export const metadata: Metadata = {
  title: "Projects — hallelx2 labs",
  description: "Nine projects across healthcare, education and the AI layer underneath them — what each one is, what it runs on, and how it was built.",
};

export default function Page() {
  return <ProductsIndexView />;
}
