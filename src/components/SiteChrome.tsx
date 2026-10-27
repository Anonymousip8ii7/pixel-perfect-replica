import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CartDrawer } from "./CartDrawer";

const NAV = [
  { to: "/shop", label: "Shop all" },
  { to: "/summer", label: "Summer" },
  { to: "/winter", label: "Winter" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <nav aria-label="Main" className="hidden flex-1 gap-8 md:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow hover:opacity-60" activeProps={{ className: "underline underline-offset-8" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden flex-1" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" strokeWidth={1.4} /> : <Menu className="h-5 w-5" strokeWidth={1.4} />}
        </button>
        <Link to="/" className="font-display text-2xl tracking-[0.18em] md:text-3xl">
          MAISON OAT
        </Link>
        <div className="flex flex-1 justify-end">
          <CartDrawer />
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="flex flex-col gap-4 border-t px-5 py-6 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-display text-2xl">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="font-display text-3xl tracking-[0.18em]">MAISON OAT</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Quiet clothing for slow days — linen for the sun, knits for the cold.</p>
        </div>
        <div>
          <p className="eyebrow mb-4 text-muted-foreground">Shop</p>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:underline">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4 text-muted-foreground">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>hello@maisonoat.com</li>
            <li>Instagram @maisonoat</li>
          </ul>
        </div>
      </div>
      <p className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Maison Oat</p>
    </footer>
  );
}
