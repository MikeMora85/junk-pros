# Junk Removal Directory - Design Guidelines

## Design Approach

**Selected Framework**: Hybrid approach drawing from Material Design principles with custom utility elements inspired by Thumbtack and Angi (service marketplace patterns).

**Rationale**: This is a utility-focused directory requiring clear information hierarchy, efficient search/filter patterns, and trust-building through ratings and transparency. The design prioritizes findability and comparison over visual storytelling.

## Core Design Elements

### A. Color Palette

**Primary Colors:**
- Brand Green: 142 72% 20% (primary actions, navigation)
- Deep Forest: 142 60% 15% (hover states, headers)
- Sage Green: 142 40% 92% (light backgrounds, cards)

**Accent & Functional:**
- Yellow Highlight: 48 96% 53% (sponsored listings, ad badges)
- Trust Blue: 217 91% 60% (verified badges, trust signals)
- Rating Gold: 43 96% 56% (star ratings)
- White/Gray Scale: 0 0% 100%, 0 0% 96%, 0 0% 71%, 0 0% 33%

**Dark Mode**: Not required for this utility site - focus on light mode clarity.

### B. Typography

**Primary Font**: Inter (Google Fonts)
- Headers: 600-700 weight
- Body: 400 weight
- UI Elements: 500 weight

**Type Scale:**
- Hero Headline: text-5xl (48px)
- Section Headers: text-3xl (30px)
- Card Titles: text-xl (20px)
- Body: text-base (16px)
- Metadata/Ratings: text-sm (14px)

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Card padding: p-6
- Section spacing: py-16 to py-20
- Component gaps: gap-4 to gap-6
- Container: max-w-7xl with px-4

**Grid System:**
- Company listings: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Filter sidebar: 1/4 width on desktop, collapsible on mobile
- Map view: 50/50 split (list/map) on desktop, stacked on mobile

### D. Component Library

**Navigation Header:**
- Sticky top navigation with logo left, search center, "List Your Business" CTA right
- Secondary filter bar with location input, service type dropdown, and radius selector
- Background: white with subtle shadow on scroll

**Hero Section (WITH LARGE IMAGE):**
- Full-width hero (h-96 md:h-[500px])
- Background image: Junk removal truck loaded with items, slightly darkened overlay
- Centered content: H1 "Find Trusted Junk Removal Near You", location search bar with green CTA button
- Below search: Trust indicators (e.g., "2,400+ Verified Companies • 45,000+ Reviews")

**Company Listing Cards:**
- White background, rounded-xl, shadow-sm with hover:shadow-md transition
- Card structure: Company logo (left), Name/Rating/Badge (top right), Services list, Pricing range, Contact button (green), "Get Quote" (outline)
- Sponsored cards: Yellow border-l-4, "Sponsored" badge in yellow
- Rating display: Gold stars + review count + verified checkmark if applicable

**Interactive Map Section:**
- Full-width section with 50/50 split (desktop)
- Mapbox integration with custom green markers (active marker highlighted)
- Clicking marker shows company popup card with quick info + "View Details" link
- Map controls: zoom, locate me, filter toggle

**Estimate Builder:**
- Visual card-based builder with washing machine/furniture icons
- Left side: Item selection grid (add/remove items with + - buttons)
- Right side: Truck visualization showing items "loading" with total estimate
- Items represented as illustrated icons, not photos
- "Get Accurate Quote" CTA at bottom

**Educational Content Sections:**
- Two-column layout with article cards
- Each card: thumbnail image, title, excerpt, "Read More" link
- Topics: "How to Prepare for Junk Removal", "What Can't Be Removed?", "Pricing Guide"

**Trust Building Elements:**
- BBB rating badges, insurance verified icons, years in business
- Customer testimonial cards with photos, star ratings, service date
- "How It Works" visual process (1. Select Service → 2. Compare Quotes → 3. Book → 4. Done)

**Footer:**
- Multi-column layout: About, Popular Cities, Resources, Contact
- Newsletter signup with green button
- Trust badges row (Secure, Verified, Insured logos)

### E. Interactions

**Minimal Animation Strategy:**
- Card hover: subtle lift (shadow change)
- Button states: background darken on hover
- Map markers: gentle bounce on click
- Estimate builder: smooth fade-in for items added
- NO scroll animations, NO complex transitions

## Images Section

**Hero Image** (REQUIRED - LARGE):
- Description: Professional junk removal truck (preferably green/white) loaded with furniture, appliances, boxes. Clean suburban setting, bright daylight. Items neatly arranged showing professional service.
- Placement: Full-width hero section background with 40% dark overlay
- Dimensions: Minimum 1920x500px

**Company Logos:**
- Placeholder circular avatars for company listings
- 80x80px, white background

**Educational Content Thumbnails:**
- Four images showing: moving boxes, furniture removal, appliance disposal, before/after garage cleanout
- Dimensions: 400x250px each
- Style: Bright, professional photography

**Estimate Builder Icons:**
- Illustrated/icon representations of: washing machine, refrigerator, sofa, mattress, boxes, desk
- Style: Simple line art with green accent color
- NOT photographs - clean vector illustrations

**Truck Visualization:**
- Side-view illustration of moving truck with transparent cargo area showing items
- Style: Simplified vector illustration, green and gray color scheme

## Page Structure

1. **Hero with Search** (h-96 to h-[500px])
2. **Trust Bar** - Icons showing company count, reviews, coverage area (py-8)
3. **Featured/Sponsored Companies** - Horizontal scroll cards (py-12)
4. **Filter + Results Grid** - Sidebar filters + 3-column company cards (py-16)
5. **Map View Section** - Split view with toggle (py-16)
6. **Estimate Builder** - Interactive calculator (py-20, bg-sage-green)
7. **How It Works** - 4-step visual process (py-16)
8. **Educational Articles** - 2x2 grid of content cards (py-16)
9. **Final CTA** - "List Your Business" banner (py-12, bg-brand-green)
10. **Footer** - Comprehensive links and signup (py-12)

**Total Sections**: 10 comprehensive, purposeful sections creating a complete directory experience.