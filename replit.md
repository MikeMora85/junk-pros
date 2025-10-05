# Junk Removal Directory Website

## Overview
A full-stack JavaScript application that helps users find local junk removal companies in Scottsdale, AZ. The site features an interactive map, visual estimate builder, company listings with ratings, and educational content. Includes admin system for managing business listings.

## Recent Changes
- 2025-10-05: Created custom login page with Admin and Business tabs
  - Built dedicated `/login` page replacing direct OAuth redirect
  - Two-tab interface: "Business Owner" and "Administrator" with dynamic submit button text
  - Email and password form fields with yellow (#fbbf24) branding
  - Back button for navigation, sign-up link to `/add-business`
  - Green login button in header now navigates to custom login page instead of direct auth
- 2025-10-05: Implemented comprehensive hamburger menu for SEO-rich navigation
  - Created half-page vertical slide-in menu accessible from homepage and state pages
  - Added "Areas Served" dropdown with searchable list of all 50 states
  - Added "Junk Removal Services" dropdown with searchable list of 15 service types
  - Included Home and Blog navigation links
  - Search functionality with real-time filtering in both state and service dropdowns
  - Yellow (#fbbf24) styling consistent with brand, hover effects on items
  - Hamburger button placed in top-left on homepage and next to home button on state pages
- 2025-10-04: Implemented admin system with Replit Auth
  - Added Replit Auth integration for user login/logout
  - Created admin dashboard at `/admin` for approving/denying businesses
  - Businesses now require approval before appearing in directory
  - First user to login automatically becomes admin
  - Admin can edit their own business (Mora's Junk Removal) from dashboard
  - Business submissions now pending by default, shown only after admin approval
  - Added user authentication to associate businesses with owners
- 2025-10-04: Redesigned business signup as comprehensive full-page experience
  - Created new AddBusiness page (`/add-business`) replacing modal-based signup
  - Added educational content about industry standards and minimum pricing ($38/cubic yard)
  - Implemented franchise exclusion messaging (no franchises accepted)
  - Added pricing tier options (Basic Free, Featured $49/month)
  - Built complete signup form with login creation and location validation
  - Emphasized value proposition and quality standards for independent operators
  - Updated all text to black (#000), removed all grey text
  - Changed slider to black line, updated button and form element colors to brand yellow (#fbbf24)
  - Added green checkmark badge to TOP RATED company profiles
- 2025-10-03: Enhanced company profile pages to be comprehensive lead gen landing pages
  - Added new fields: description, hours, availability, price sheets, years in business, insurance info, specialties, about us, why choose us
  - Redesigned CompanyDetailInline component with hero section, multiple CTAs, and detailed business information
  - Updated schema and storage to support new lead gen fields
  - Increased red banner font size to 24px for better prominence
  - Implemented consistent 3D lift effects across UI: state buttons, feature sections, and search bar all have 1px default lift and 2px hover lift with coordinated shadows
  - Changed home button to icon-only with black outline box (no text)
- 2025-10-02: Initial project setup with fullstack_js template
- Created data model for junk removal companies with location coordinates
- Set up Express backend with in-memory storage
- Built React frontend with Mapbox GL integration
- Implemented visual estimate builder with truck/washing machine graphics
- Configured Vite development server and TypeScript

## Project Architecture

### Backend (Express + Node.js)
- **server/index.ts**: Main server entry point, serves Vite dev server in development
- **server/routes.ts**: API routes for company data (`/api/companies`)
- **server/storage.ts**: In-memory storage with sample company data
- **server/vite.ts**: Vite middleware configuration

### Frontend (React + Vite)
- **client/src/App.tsx**: Main application component with map and company listings
- **client/src/components/EstimateBuilder.tsx**: Interactive pricing calculator with truck visualization
- **client/src/lib/queryClient.ts**: TanStack Query configuration for data fetching

### Shared
- **shared/schema.ts**: Drizzle ORM schema for company data (shared between frontend/backend)

## Running the Application

1. **Development**: Run `npm run dev` to start the development server
2. **Build**: Run `npm run build` to create production build
3. **Production**: Run `npm run start` to run in production mode

## Environment Variables
- `VITE_MAPBOX_TOKEN`: Mapbox API token for map functionality (required)

## Dependencies
- React + Vite for frontend
- Express for backend API
- Mapbox GL + react-map-gl for interactive maps
- TanStack Query for data fetching
- Tailwind CSS for styling
- Drizzle ORM + Zod for data validation

## Design
Following design guidelines in `design_guidelines.md`:
- Brand green (#166534) for primary actions
- Yellow highlights for sponsored content
- Clean card-based layout for company listings
- Inter font family throughout
