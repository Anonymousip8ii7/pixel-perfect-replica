import { createFileRoute } from "@tanstack/react-router";
import { productsQueryOptions } from "@/lib/shopify";
import { CollectionPage } from "@/components/CollectionPage";
import summer from "@/assets/summer.jpg";

const Q = "tag:summer";

export const Route = createFileRoute("/summer")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions({ query: Q })),
  head: () => ({
    meta: [
      { title: "Summer Collection — Maison Oat" },
      { name: "description", content: "Bright, airy summer pieces in soft pastels — light dresses, shirts and easy trousers." },
      { property: "og:title", content: "Summer Collection — Maison Oat" },
      { property: "og:description", content: "Bright, airy summer pieces in soft pastels." },
    ],
  }),
  component: () => (
    <CollectionPage
      query={Q}
      tone="summer"
      image={summer}
      eyebrow="Collection 01 — Summer"
      title="Sun-warmed"
      intro="Airy silhouettes in butter, sage and oatmeal. Pieces for long lunches, sea breezes and slow afternoons."
    />
  ),
});
