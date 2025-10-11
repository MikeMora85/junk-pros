# Junk Removal Directory Website

## Overview
A full-stack JavaScript application designed to connect users with local junk removal companies in Scottsdale, AZ. The platform includes an interactive map, a visual estimate builder, detailed company listings with ratings, and informative content. It also features a robust admin system for managing business listings and tracking performance, with a vision to become a leading directory for independent junk removal operators, emphasizing quality and local service.

## User Preferences
I want iterative development.
Ask before making major changes.
I prefer detailed explanations.

## System Architecture

### UI/UX Decisions
- **Color Scheme**: Brand green (#166534) for primary actions and headers, yellow (#fbbf24) for highlights, featured badges, action buttons, and form elements.
- **Layout**: Clean, card-based layout for company listings, mobile-first responsive design across all components (admin dashboard, navigation).
- **Typography**: 'Helvetica Neue', Arial, sans-serif font family used throughout the application.
- **Interactive Elements**: 3D lift effects (1px default, 2px hover) on state buttons, feature sections, and search bar.
- **Navigation**: Comprehensive hamburger menu with searchable dropdowns for "Areas Served" and "Junk Removal Services".
- **Company Profiles**: Enhanced profiles with hero sections, multiple CTAs, detailed business information, and green checkmark badges for "TOP RATED" companies.
- **Zip Code Search**: Interactive search feature allowing users to find their closest vetted hauler by entering a zip code, with full-screen "Congratulations" overlay showing the nearest company and up to 5 additional nearby options within 15 miles, all sorted by distance.
- **SEO Landing Pages**: 
  - 40+ item removal pages (/items/refrigerator, /items/sofa, etc.) with rich content, tips, and mobile-responsive design
  - 16 service category pages (/services/office-cleanouts, /services/garage-cleanouts, etc.) with detailed benefits, process steps, and common items sections
  - All landing pages include zip search functionality, Back/Home navigation buttons, and auto scroll-to-top
  - Mobile-friendly with responsive typography using clamp() and flexible grid layouts
  - City interlinks sections on both service and item pages linking to major cities (Scottsdale, Phoenix, Tempe, Mesa, Chandler, Gilbert, Glendale, Peoria) for enhanced SEO
  - **In-depth Content**: Each page includes detailed descriptions and "Why Choose Local" sections with city names naturally woven into the content as clickable green links
  - City mentions automatically converted to internal links throughout all content for maximum SEO benefit

### Technical Implementations
- **Frontend**: React with Vite, styled using Tailwind CSS.
- **Backend**: Node.js with Express.
- **Database**: PostgreSQL for data persistence, integrated using Drizzle ORM.
- **Authentication**: Token-based authentication for business owners and administrators using bcrypt for password hashing. Replit Auth for initial admin setup.
- **Data Fetching**: TanStack Query for efficient data management in the frontend.
- **Mapping**: Mapbox GL and react-map-gl for interactive maps.
- **Geocoding & Distance Calculation**: 
    - Google Maps Geocoding API for converting zip codes to coordinates
    - Haversine formula for calculating distances between user location and haulers
    - Distance-based filtering showing haulers within 15-mile radius
    - Automatic sorting by proximity from user's zip code
- **Visual Estimate Builder**: Interactive calculator with graphical representations of items and truck capacity.
- **Business Management**:
    - **Signup**: Comprehensive full-page signup process with educational content, pricing tiers, and login creation.
        - **Terms Agreement System**: Two collapsible sections with "REQUIRED READ" labels:
            - "Why Independent Operators Choose Us" - Platform standards and benefits
            - "Membership Requirements" - No franchises, pricing standards ($38 minimum, $45-$65 standard)
        - Sticky section headers when scrolling within sections
        - Auto-close dropdowns when agreement checkboxes are clicked
        - Dual validation requiring both agreements before signup
        - Green checkmark completion indicators on section headers
        - Agreement timestamps saved to database (agreedToPlatformStandards, agreedToRequirements)
        - Admin visibility of agreement dates for compliance tracking
    - **Profile Editing**: Simple, intuitive ProfileEditor page (/profile/edit) with:
        - Full-width yellow numbered tabs (#fbbf24 inactive, #f59e0b active)
        - 6 organized sections: Basic Information, Services & Specialties, About Your Business, Pricing, Team & Gallery, Visibility Settings
        - Completion tracking with green checkmarks (#16a34a) for finished sections
        - 9 selectable service type icons (residential, commercial, furniture, appliances, electronics, yard waste, construction, moving, general junk)
        - Toggle switches for visibility settings (Show Pricing, Show Additional Costs)
        - Save Progress and Go to Live Page buttons
        - Clean yellow and black design matching brand colors
    - **Approval System**: Automatic business approval upon signup.
    - **Performance Tracking**: Automatic tracking of customer interactions (clicks, calls, photo quotes, in-person estimates) with an API endpoint `/api/track/event`.
    - **Unclaimed Business Listings**:
        - Businesses can be prefilled with name, phone, city, state, and optional zip
        - Marked as "unclaimed" until business owner claims their profile
        - Unclaimed listings display with limited information (name and phone only)
        - Non-clickable gray cards with "Unclaimed Listing - Basic Info Only" badge
        - Green "Claim Your Profile" button on each unclaimed listing
        - **Claim Flow**:
            - Clicking "Claim Your Profile" redirects to `/add-business?claim=true&name=[Business Name]&phone=[Phone]`
            - AddBusiness page reads URL parameters and prefills business name and phone fields
            - Shows "Claim Your Profile" heading instead of standard signup heading
            - Displays green claiming banner with checkmark icon showing "Claiming Profile: [Business Name]"
            - Banner message: "We've prefilled your business name and phone. Complete the rest to activate your profile!"
        - Bulk import endpoint for admins: `POST /api/admin/companies/bulk-unclaimed`
        - Required fields: name, phone, city, state (zip optional)
        - Address auto-generated from city, state, zip for search indexing
        - Database schema includes `claimed` boolean field (default: false)
- **Admin Dashboard**:
    - Mobile-responsive design with a hamburger menu.
    - Tabs for Pending, Active, Payments, and Analytics.
    - Smart stats grid, expandable action menus for businesses.
    - Advanced filtering and search capabilities.
    - Payment tracking schema including subscription tier/status, payment dates, and warning system.
    - Action template management system for creating custom email templates with variables and color coding.
    - Comprehensive analytics system with geographic search, business statistics (Total, Active, Pending, Denied), subscription metrics (Featured/Free, Active/Past Due/Cancelled), and revenue analytics.

### System Design Choices
- **Modular Architecture**: Clear separation of concerns between frontend, backend, and shared schema.
- **State and City Handling**: Database queries for city/state are case-insensitive and trim whitespace for robust URL flexibility.
- **User Roles**: Distinct routing and access control for business owners and administrators.
- **Data Persistence**: Migration from in-memory storage to PostgreSQL for all critical data.

## External Dependencies
- **PostgreSQL**: Primary database for all persistent data.
- **Mapbox GL / react-map-gl**: For interactive maps and location services.
- **Google Maps Geocoding API**: For zip code to coordinate conversion (requires VITE_GOOGLE_MAPS_API_KEY environment variable).
- **Drizzle ORM**: Object-relational mapper for database interactions.
- **Zod**: For schema validation.
- **TanStack Query**: For data fetching and caching in the React frontend.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Replit Auth**: For initial administrator authentication setup.
- **bcrypt**: For secure password hashing.