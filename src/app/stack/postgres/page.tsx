import type { Metadata } from "next";
import StackPostgresView from "@/module/site/views/StackPostgresView";
import JsonLd from "@/module/site/components/JsonLd";

export const metadata: Metadata = {
  title: "Postgres, Drizzle and Hono — hallelx2 labs",
  description: "The data and API layer: Drizzle over Postgres on Neon and Supabase, SQLite where the data belongs to one device, Hono as the server that runs in every runtime, and how the monorepos are laid out.",
};

export default function Page() {
  return (
    <>
      <JsonLd route={"/stack/postgres"} title={"Postgres, Drizzle and Hono — hallelx2 labs"} description={"The data and API layer: Drizzle over Postgres on Neon and Supabase, SQLite where the data belongs to one device, Hono as the server that runs in every runtime, and how the monorepos are laid out."} />
      <StackPostgresView />
    </>
  );
}
