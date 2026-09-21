import type { Metadata } from "next";
import MercalaView from "@/module/site/views/MercalaView";

export const metadata: Metadata = {
  title: "Mercala — hallelx2 labs",
  description: "An agent-native, multi-tenant commerce platform in Java 21 and Spring AI — hybrid search without Elasticsearch, three layers of tenant isolation, and a transactional outbox over Kafka.",
};

export default function Page() {
  return <MercalaView />;
}
