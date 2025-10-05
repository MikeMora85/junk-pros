# Junk Removal Directory Website

## Overview
A full-stack JavaScript application that helps users find local junk removal companies in Scottsdale, AZ. The site features an interactive map, visual estimate builder, company listings with ratings, and educational content. Includes admin system for managing business listings.

## Recent Changes
- 2025-10-05: Implemented automatic business approval and owner authentication system
  - **Auto-Approval**: Businesses are now automatically approved on signup (no pending approval needed)
  - **Business Owner Login**: Email and password authentication for business owners
  - **Schema Updates**: Added businessOwners table with email, passwordHash, companyId fields
  - **Secure Authentication**: Bcrypt password hashing for security
  - **Token-Based Auth**: Bearer tokens for business owner sessions
  - **Signup Flow**: Business owners create credentials during signup and are auto-logged in
  - **Profile Access**: After signup, owners are automatically redirected to profile editor
  - **Storage Updates**: New storage methods for creating/retrieving business owners
  - **Login Support**: Business tab on /login page for owner authentication
  - **Company Association**: Each business owner linked to their company via companyId
- 2025-10-05: Implemented business performance tracking system
  - **Event Tracking**: Automatic tracking of all customer interactions (clicks, calls, photo quotes, in-person estimates)
  - **Tracking API**: POST /api/track/event endpoint to record events with companyId, eventType, timestamp, and metadata
  - **Event Types**: 'click' (profile view), 'call' (phone button), 'photo_quote' (send photos), 'book_quote' (in-person estimate)
  - **Frontend Integration**: trackBusinessEvent() utility function automatically tracks all business action buttons
  - **Monthly Reports Tab**: New "Reports" tab in admin dashboard showing performance metrics per business
  - **Report Metrics**: Displays profile clicks, calls, photo quotes, and in-person estimates for each business
  - **Data Storage**: businessEvents table stores all tracking data with timestamps for monthly reporting
  - **Admin Reporting**: Month selector and tier filters for analyzing business performance
  - **Schema**: businessEvents table with id, companyId, eventType, eventDate, metadata fields
- 2025-10-05: Built comprehensive analytics system with geographic search
  - **State/City Filtering**: Search analytics for any state, city, or website-wide data
  - **Business Statistics**: Total, Active, Pending, Denied counts with color-coded cards
  - **Subscription Metrics**: Featured/Free tier counts, Active/Past Due/Cancelled status tracking
  - **Revenue Analytics**: Monthly revenue (active subs), potential revenue, at-risk revenue calculations
  - **Geographic Distribution**: State-by-state breakdown with total/active/featured counts
  - **City Breakdown**: Drill down to city-level metrics when state selected
  - **Business Details List**: Complete business info with status/tier badges for filtered results
  - **Dynamic Headers**: Shows current filter context (Website-Wide, State, or City/State)
  - **Mobile-Responsive**: Responsive grid layouts that adapt to all screen sizes
- 2025-10-05: Added action template management system to admin dashboard
  - **New Action Menu Item**: Create custom action templates from hamburger menu
  - **Edit Actions Menu Item**: Manage and modify all action templates
  - **Template Editor**: Full-featured form for creating/editing actions with:
    - Action name field
    - Email subject line field
    - Message body with variable support ({businessName}, {dueDate}, {daysOverdue}, {warningNumber})
    - Color picker with 7 preset colors for button styling
  - **Template List View**: See all action templates with color indicators and edit buttons
  - **4 Prebuilt Templates**: Payment Reminder, Payment Warning, Cancellation Notice, Reactivation Welcome
  - **Form Validation**: Required field validation, disabled save until all fields complete
  - **Success Alerts**: Confirmation messages on create/update actions
  - **Modal Interface**: Full-screen overlay modal with close button and responsive design
- 2025-10-05: Built comprehensive mobile-responsive admin dashboard with payment management
  - **Mobile-First Design**: Fully responsive layout that works perfectly on all screen sizes
  - **Hamburger Menu**: Compact navigation menu with Back to Home, New Action, Edit Actions, and Logout
  - **Payment Tracking Schema**: subscriptionTier, subscriptionStatus, lastPaymentDate, nextPaymentDate, paymentWarnings
  - **Token-Based Auth**: localStorage + Bearer token authentication for reliability
  - **4 Dashboard Tabs**: Pending, Active, Payments, Analytics (responsive scrollable tabs)
  - **Smart Stats Grid**: Auto-adjusting grid showing Active, Pending, Featured, Past Due counts
  - **Business Card Dropdowns**: Expandable action menus on each business with quick access to all features
  - **Dropdown Actions with Mail Icons**: All action buttons execute immediately with mail icon (✉️)
  - **Advanced Filtering**: Search by name/city/state + tier/status filters on mobile
  - **Color Scheme**: Matches main site with green (#166534) primary, yellow (#fbbf24) featured badges
  - **Subscription Badges**: Visual FREE/FEATURED tier indicators and ACTIVE/PAST_DUE/CANCELLED status
  - **Warning System**: Auto-incrementing warning counter with visual indicators
  - **All admin actions protected** with token-based authentication
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
- 2025-10-03: Enhanced company profile pages to be comprehensive business profile pages
  - Added new fields: description, hours, availability, price sheets, years in business, insurance info, specialties, about us, why choose us
  - Redesigned CompanyDetailInline component with hero section, multiple CTAs, and detailed business information
  - Updated schema and storage to support new business profile fields
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
