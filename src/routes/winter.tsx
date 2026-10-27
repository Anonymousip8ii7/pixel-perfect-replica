import { createFileRoute } from "@tanstack/react-router";
import { productsQueryOptions } from "@/lib/shopify";
import { CollectionPage } from "@/components/CollectionPage";
import winter from "@/assets/winter.jpg";

const Q = "tag:winter";

export const Route = createFileRoute("/winter")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions({ query: Q })),
  head: () => ({
    meta: [
      { title: "Winter Collection — Maison Oat" },
      { name: "description", content: "Warm, layered winter pieces in chocolate, espresso and burgundy — knits and cozy layers." },
      { property: "og:title", content: "Winter Collection — Maison Oat" },
      { property: "og:description", content: "Warm, layered winter pieces in earthy tones." },
    ],
  }),
  component: () => (
    <CollectionPage
      query={Q}
      tone="winter"
      image={winter}
      eyebrow="Collection 02 — Winter"
      title="Fireside"
      intro="Layered and intimate. Deep chocolate, espresso and burgundy pieces made for lamplight and long evenings."
    />
  ),
});
