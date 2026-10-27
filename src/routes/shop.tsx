import { createFileRoute } from "@tanstack/react-router";
import { productsQueryOptions } from "@/lib/shopify";
import { CollectionPage } from "@/components/CollectionPage";

export const Route = createFileRoute("/shop")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions({})),
  head: () => ({
    meta: [
      { title: "Shop All — Maison Oat" },
      { name: "description", content: "Browse every piece from Maison Oat: linen for summer, knitwear for winter." },
      { property: "og:title", content: "Shop All — Maison Oat" },
      { property: "og:description", content: "Browse every piece from Maison Oat." },
    ],
  }),
  component: () => (
    <CollectionPage eyebrow="The full edit" title="Shop all" intro="Every piece, both seasons. Filter by category to find your next favourite." />
  ),
});
