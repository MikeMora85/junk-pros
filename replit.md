# Junk Removal Directory Website

## Overview
This full-stack JavaScript application aims to connect users with independent junk removal companies nationwide. It features an interactive map, a visual estimate builder, detailed company listings with ratings, and informative content. The platform supports a 4-tier subscription system (Unclaimed, Basic/FREE, Standard, Premium) to offer varying levels of features and visibility for businesses. A robust admin system allows for managing business listings and tracking performance. The project's ambition is to provide comprehensive national coverage for independent local operators, excluding franchises.

## User Preferences
I want iterative development.
Ask before making major changes.
I prefer detailed explanations.

## SEO Strategy
**Primary Target Keywords:**
- "junk removal near me" - Main keyword for local search intent
- "same day junk removal" - Secondary keyword targeting urgency/speed

These keywords should be prioritized in future SEO optimization efforts including:
- Page titles and meta descriptions
- Header tags (H1, H2) on landing pages
- City and state page content
- Blog post optimization
- Internal linking anchor text

## System Architecture

### UI/UX Decisions
The design emphasizes a clean, card-based layout with a mobile-first responsive approach. The color scheme utilizes brand green (#166534) for primary actions and yellow (#fbbf24) for highlights and interactive elements. Typography is 'Helvetica Neue', Arial, sans-serif. Interactive elements include 3D lift effects on buttons and sections. Navigation features a comprehensive hamburger menu with searchable dropdowns. Company profiles are enhanced with hero sections, multiple CTAs, and a green checkmark for "TOP RATED" companies. A key feature is the interactive zip code search, which displays the closest vetted haulers and redirects to specific state/city pages. Extensive SEO-optimized landing pages are implemented for over 40 item removal and 16 service categories, incorporating rich content, zip search, and interlinking for improved discoverability.

### Technical Implementations
The frontend is built with React and Vite, styled using Tailwind CSS. The backend uses Node.js with Express. PostgreSQL is the chosen database, integrated via Drizzle ORM. Authentication is token-based using bcrypt for password hashing, with Replit Auth for initial admin setup. TanStack Query manages data fetching on the frontend. Mapbox GL and react-map-gl are used for interactive maps, while Google Maps Geocoding API and the Haversine formula handle geocoding and distance calculations.

Key functionalities include:
- **Search Functionality**: Supports zip codes, states, and cities, with automatic redirection to relevant state/city pages and clean URL slug formatting.
- **Visual Estimate Builder**: An interactive calculator for junk removal estimates.
- **Business Management**:
    - **Signup**: A comprehensive signup process with educational content, tiered pricing, and a robust agreement system that saves agreement timestamps.
    - **Profile Editing**: A mobile-friendly, continuous-scroll interface (`/profile/edit`) with a sticky header. It includes sections for basic information, services, business details, pricing, team/gallery management, and visibility settings. Features include visual business hours selection, multi-photo gallery uploads, team member management with individual photos, and Google review tracking. Logo uploads are handled via Replit Object Storage using Uppy.js, offering faster saves and direct upload to Google Cloud Storage.
    - **Approval System**: Automatic business approval upon signup.
    - **Performance Tracking**: API endpoint for tracking customer interactions.
    - **Unclaimed Business Listings**: Support for prefilled, unclaimed business listings with a clear claiming flow that pre-fills signup forms.
- **Admin Dashboard**: A mobile-responsive dashboard with yellow/white branding, comprehensive tabs (Active, Unclaimed, Featured, Analytics), smart stats, advanced filtering, and robust management tools for businesses, including display order control and badge/banner assignment.

### System Design Choices
The architecture is modular, separating frontend, backend, and shared schema. Database queries for city/state are case-insensitive and trim whitespace for flexibility. Distinct user roles with access control are implemented for business owners and administrators. All critical data is persisted in PostgreSQL.

## Payment Processing
The platform integrates **Stripe** for subscription payment processing with the following features:
- **Subscription Tiers**: Basic (free), Standard ($10/month), Premium ($49/month)
- **Payment Flow**: Signup → Stripe Checkout (for paid tiers) → Profile Editor
- **Database Tracking**: Stripe customer ID and subscription ID stored in `business_owners` table
- **Subscription Lifecycle**: 
  - Paid tier companies start with 'pending' status until payment succeeds
  - Webhook handlers activate subscriptions on successful payment
  - Failed payments trigger 'past_due' status
  - Canceled subscriptions downgrade companies to basic tier
- **Security**: API keys managed via Replit Secrets (STRIPE_SECRET_KEY, VITE_STRIPE_PUBLIC_KEY, STRIPE_WEBHOOK_SECRET)
- **Components**: 
  - `/stripe-checkout` route for payment collection using Stripe Elements
  - `/api/create-subscription` endpoint for subscription creation
  - `/api/stripe-webhook` endpoint for handling Stripe events

## Email Configuration
- **Provider**: Resend (API key stored in RESEND_API_KEY secret)
- **Sender Address**: info@findlocaljunkpros.com
- **Uses**: Quote request notifications, admin email blasts to business owners

## External Dependencies
- **PostgreSQL**: Primary database (Neon-hosted, DATABASE_URL secret).
- **Mapbox GL / react-map-gl**: Interactive maps.
- **Google Maps Geocoding API**: Zip code to coordinate conversion.
- **Drizzle ORM**: Database interactions.
- **Zod**: Schema validation.
- **TanStack Query**: Frontend data fetching and caching.
- **Tailwind CSS**: Styling.
- **Replit Auth**: Admin authentication.
- **bcrypt**: Password hashing.
- **Stripe**: Subscription payment processing.
- **Resend**: Transactional email delivery.