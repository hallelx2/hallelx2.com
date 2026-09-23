import { graphFor } from "@/module/site/schema";

/**
 * Structured data for one route.
 *
 * Serialised with the closing-angle escape so a "</script>" inside any string
 * cannot terminate the block early — the standard JSON-LD injection hazard.
 */
export default function JsonLd({
  route, title, description,
}: { route: string; title: string; description: string }) {
  const json = JSON.stringify(graphFor(route, title, description)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
