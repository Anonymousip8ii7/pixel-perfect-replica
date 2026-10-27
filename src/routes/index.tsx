import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productsQueryOptions } from "@/lib/shopify";
import { ProductGrid } from "@/components/ProductGrid";
import hero from "@/assets/hero.jpg";
import summer from "@/assets/summer.jpg";
import winter from "@/assets/winter.jpg";
import story from "@/assets/story.jpg";

const featuredQ = productsQueryOptions({ first: 8 });
const newQ = productsQueryOptions({ first: 4, newest: true });

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(featuredQ), context.queryClient.ensureQueryData(newQ)]),
  head: () => ({
    meta: [
      { title: "Maison Oat — Cozy Editorial Clothing for Summer & Winter" },
      { name: "description", content: "A quiet clothing boutique: airy summer linen looks and warm winter knits, styled for slow days." },
      { property: "og:title", content: "Maison Oat — Cozy Editorial Clothing" },
      { property: "og:description", content: "Airy summer looks and warm winter knits, styled for slow days." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: featured } = useSuspenseQuery(featuredQ);
  const { data: arrivals } = useSuspenseQuery(newQ);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[560px] overflow-hidden">
        <img src={hero} alt="Woman in a cream shirt and wide trousers walking through a sunlit courtyard" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-5 md:px-8">
          <div className="fade-up max-w-xl">
            <p className="eyebrow text-muted-foreground">New season edit</p>
            <h1 className="mt-5 text-6xl leading-[0.95] md:text-8xl">
              Dressed for <em>slow</em> days.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Soft silhouettes and quiet colours — easy pieces for sun-warmed mornings and lamplit evenings.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full px-8">
              <Link to="/shop">Shop collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Seasons */}
      <section aria-labelledby="seasons" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <h2 id="seasons" className="sr-only">Seasonal collections</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SeasonCard to="/summer" img={summer} alt="Woman in a butter yellow dress by the sea" label="Summer" sub="Airy · Sunlit · Relaxed" tone="bg-butter text-foreground" />
          <SeasonCard to="/winter" img={winter} alt="Woman in a chocolate knit sweater and burgundy scarf by lamplight" label="Winter" sub="Layered · Warm · Intimate" tone="bg-espresso text-winter-foreground" />
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <SectionHead eyebrow="Curated" title="Featured pieces" link="/shop" />
        <ProductGrid products={featured} />
      </section>

      {/* New arrivals */}
      <section className="bg-oat/60 py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead eyebrow="Just in" title="New arrivals" link="/shop" />
          <ProductGrid products={arrivals} />
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-8">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl">
          <img src={story} alt="Folded knitwear and linen on an atelier table" loading="lazy" width={1024} height={1280} className="h-full w-full object-cover" />
        </div>
        <div className="max-w-md">
          <p className="eyebrow text-muted-foreground">Our story</p>
          <h2 className="mt-4 text-5xl leading-tight md:text-6xl">Made for the in-between moments.</h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Maison Oat began with a simple idea: clothes should feel like a deep breath. We design two quiet
            collections a year — one for light, one for warmth — in colours borrowed from sand, sage and
            woodsmoke.
          </p>
          <Link to="/shop" className="eyebrow mt-8 inline-block underline underline-offset-8">Explore the edit</Link>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead eyebrow="@maisonoat" title="Seen on the feed" />
        </div>
        <div className="grid grid-cols-2 gap-2 px-2 md:grid-cols-4">
          {[
            { src: summer, alt: "Butter yellow dress by the sea" },
            { src: story, alt: "Atelier table with knitwear" },
            { src: winter, alt: "Chocolate knit by lamplight" },
            { src: hero, alt: "Linen look in a sunlit courtyard" },
          ].map((g) => (
            <div key={g.alt} className="group aspect-square overflow-hidden rounded-lg">
              <img src={g.src} alt={g.alt} loading="lazy" className="img-zoom h-full w-full object-cover group-hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}

function SeasonCard({ to, img, alt, label, sub, tone }: { to: "/summer" | "/winter"; img: string; alt: string; label: string; sub: string; tone: string }) {
  return (
    <Link to={to} className={`group relative block overflow-hidden rounded-2xl ${tone}`}>
      <div className="aspect-[4/5] overflow-hidden">
        <img src={img} alt={alt} loading="lazy" width={1024} height={1280} className="img-zoom h-full w-full object-cover group-hover:scale-105" />
      </div>
      <div className="flex items-end justify-between p-6 md:p-8">
        <div>
          <p className="eyebrow opacity-70">{sub}</p>
          <h3 className="mt-2 text-5xl tracking-[0.08em] md:text-6xl">{label.toUpperCase()}</h3>
        </div>
        <span className="eyebrow underline underline-offset-8">Shop →</span>
      </div>
    </Link>
  );
}

function SectionHead({ eyebrow, title, link }: { eyebrow: string; title: string; link?: "/shop" }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-3 text-4xl md:text-5xl">{title}</h2>
      </div>
      {link && <Link to={link} className="eyebrow shrink-0 underline underline-offset-8">View all</Link>}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    toast("Newsletter signups aren't connected yet", { description: "We'll switch this on soon.", position: "top-center" });
    setEmail("");
  };
  return (
    <section className="bg-sage/40 py-24">
      <div className="mx-auto max-w-xl px-5 text-center">
        <p className="eyebrow text-muted-foreground">Letters from the studio</p>
        <h2 className="mt-4 text-5xl">Stay in the loop</h2>
        <p className="mt-4 text-muted-foreground">New collections and quiet notes, a few times a season.</p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <Input id="nl-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="h-12 rounded-full bg-background px-5" />
          <Button type="submit" size="lg" className="h-12 rounded-full px-8">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
