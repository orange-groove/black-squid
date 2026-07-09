import { MarketingShell } from "@/components/site/marketing-shell";

// Shared chrome for every product route (/products/*). Individual product
// pages render their content via the <ProductPageLayout> component, so they
// all get the same nav, footer, and page frame from here.
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <MarketingShell>{children}</MarketingShell>;
}
