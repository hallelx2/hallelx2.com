import type { Metadata } from "next";
import ProductsIndexView from "@/module/site/views/ProductsIndexView";

export const metadata: Metadata = {
  title: "Products — hallelx2 labs",
  description: "Six products across healthcare, education and the AI ecosystem — all working today, every claim measured on its own page.",
};

export default function Page() {
  return <ProductsIndexView />;
}
