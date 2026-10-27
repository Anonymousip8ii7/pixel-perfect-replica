import { useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus, X, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export function CartDrawer() {
  const { items, isLoading, isSyncing, isOpen, setOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart } =
    useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "USD";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button aria-label={`Open bag, ${totalItems} items`} className="relative flex items-center gap-2 text-sm">
          <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
          <span className="hidden sm:inline eyebrow">Bag ({totalItems})</span>
          {totalItems > 0 && (
            <span className="sm:hidden absolute -top-1.5 -right-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-3xl">Your bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            <p className="font-display text-xl italic">Nothing here yet.</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-5 overflow-y-auto px-4">
              {items.map((item) => {
                const img = item.product.node.images.edges[0]?.node;
                return (
                  <li key={item.variantId} className="flex gap-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      {img && <img src={img.url} alt={img.altText ?? item.product.node.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <h4 className="font-display text-lg leading-tight">{item.product.node.title}</h4>
                        <button aria-label="Remove item" onClick={() => removeItem(item.variantId)} className="text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.selectedOptions.map((o) => o.value).join(" · ")}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border">
                          <button aria-label="Decrease" className="p-1.5" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}><Minus className="h-3 w-3" /></button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button aria-label="Increase" className="p-1.5" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
                        </div>
                        <span className="text-sm">{formatPrice(item.price.amount, item.price.currencyCode)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-4 border-t p-4">
              <div className="flex justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="font-display text-xl">{formatPrice(String(total), currency)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes are calculated at checkout.</p>
              <Button onClick={checkout} size="lg" className="w-full rounded-full" disabled={isLoading || isSyncing}>
                {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Checkout"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
