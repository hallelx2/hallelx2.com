import type { Metadata } from "next";
import StackJavaView from "@/module/site/views/StackJavaView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Java 21 and Spring AI — hallelx2 labs",
  description: "Mercala on Java 21 and Spring Boot: four Maven modules, defence in depth for multi-tenancy, hybrid search inside Postgres with no Elasticsearch, and Kafka with a transactional outbox.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/stack/java"} title={"Java 21 and Spring AI — hallelx2 labs"} description={"Mercala on Java 21 and Spring Boot: four Maven modules, defence in depth for multi-tenancy, hybrid search inside Postgres with no Elasticsearch, and Kafka with a transactional outbox."} />
      <StackJavaView />
    </>
  );
}
