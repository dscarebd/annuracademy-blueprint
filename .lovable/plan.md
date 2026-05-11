## Goal

Replace the current image-only logo with a clean, code-built logo component that combines the user's purple graduation-cap icon with brand text + tagline. Same composition in header and footer, fully responsive across mobile, tablet, and desktop.

## Approach

Build a single `BrandLogo` component instead of relying on a baked-in PNG (which gets blurry/awkward at small sizes). The component arranges:

- The cap icon (transparent PNG) on the left
- "An-Nur" (dark) + "Academy" (purple) wordmark on the right
- Thin tagline "Bangladesh's AI Learning Platform" underneath

This keeps text crisp at every breakpoint and lets us hide the tagline on very small screens automatically.

## Steps

1. **Save icon asset**
   - Copy uploaded `1778505073128.png` → `src/assets/logo-icon.png` (transparent, square).

2. **Create `src/components/BrandLogo.tsx`**
   - Props: `variant?: "header" | "footer"` (default `header`), `className?: string`.
   - Responsive sizing via Tailwind (no JS):
     - **header variant**
       - icon: `h-8 sm:h-9 md:h-10`
       - wordmark: `text-base sm:text-lg md:text-xl`
       - tagline: `text-[9px] sm:text-[10px] md:text-[11px]`, hidden below `sm` (`hidden sm:block`) so mobile stays clean
     - **footer variant**
       - icon: `h-11 md:h-12`
       - wordmark: `text-xl md:text-2xl`
       - tagline: `text-[11px] md:text-xs`, always visible
   - Layout: `inline-flex items-center gap-2 sm:gap-2.5`, wordmark + tagline stacked with `leading-none` and `mt-0.5`.
   - Wordmark: "An-Nur" `text-foreground`, "Academy" `text-primary`, both `font-bold tracking-tight`.
   - Tagline: `text-muted-foreground font-light tracking-wide whitespace-nowrap`.
   - Image: `w-auto object-contain shrink-0`, `alt="An-Nur Academy"`.

3. **Wire into `Navbar.tsx`**
   - Replace current `<img src={logo} ... />` block with `<BrandLogo variant="header" />` inside the existing `<Link to="/">`.
   - Remove the `import logo from "@/assets/logo.png"`.
   - Keep nav height `h-16 md:h-20` so logo fits cleanly.

4. **Wire into `DashboardHeader.tsx`**
   - Same swap: `<BrandLogo variant="header" />` inside the `<Link to="/">`.
   - Remove the old `logo` import.

5. **Wire into `Footer.tsx`**
   - Replace current footer logo block with `<BrandLogo variant="footer" />`.
   - Remove old `logo` import.

6. **Cleanup**
   - Delete `src/assets/logo.png` (no longer used).

## Responsive guarantees

- Mobile (≤640px): icon + compact wordmark only; tagline hidden in header so cart + menu fit on 360–390px viewports without wrapping.
- Tablet (640–1024px): tagline appears, icon scales up slightly.
- Desktop (≥1024px): full size, balanced with nav links.
- Footer: tagline always visible since space is generous.
- All sizes use Tailwind utility classes only — no custom media queries, no layout shift.

## Files touched

- new: `src/assets/logo-icon.png`
- new: `src/components/BrandLogo.tsx`
- edit: `src/components/Navbar.tsx`
- edit: `src/components/DashboardHeader.tsx`
- edit: `src/components/Footer.tsx`
- delete: `src/assets/logo.png`
