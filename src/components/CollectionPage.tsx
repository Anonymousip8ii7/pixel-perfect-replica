import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQueryOptions } from "@/lib/shopify";
import { ProductGrid } from "./ProductGrid";

type Props = {
  query?: string;
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  tone?: "light" | "summer" | "winter";
};

export function CollectionPage({ query, eyebrow, title, intro, image, tone = "light" }: Props) {
  const { data } = useSuspenseQuery(productsQueryOptions({ query }));
  const winter = tone === "winter";
  const heroTone = winter ? "bg-espresso text-winter-foreground" : tone === "summer" ? "bg-butter/50" : "bg-secondary/50";

  return (
    <main className={winter ? "bg-espresso text-winter-foreground" : ""}>
      <section className={`${heroTone}`}>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div className="fade-up">
            <p className={`eyebrow ${winter ? "text-taupe" : "text-muted-foreground"}`}>{eyebrow}</p>
            <h1 className="mt-4 text-6xl leading-none md:text-8xl">{title}</h1>
            <p className={`mt-6 max-w-md ${winter ? "text-winter-foreground/75" : "text-muted-foreground"}`}>{intro}</p>
          </div>
          {image && (
            <div className="aspect-[4/5] overflow-hidden rounded-2xl md:ml-auto md:w-4/5">
              <img src={image} alt={`${title} collection editorial`} className="h-full w-full object-cover" width={1024} height={1280} />
            </div>
          )}
        </div>
      </section>
      <section className={`mx-auto max-w-7xl px-5 py-16 md:px-8 ${winter ? "[&_.text-muted-foreground]:text-taupe" : ""}`}>
        <ProductGrid products={data} filters />
      </section>
    </main>
  );
}
