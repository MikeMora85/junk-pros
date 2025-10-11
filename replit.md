# Junk Removal Directory Website

## Overview
A nationwide full-stack JavaScript application connecting users with local, independent junk removal companies across all 45 states and 675 cities. The platform includes an interactive map, a visual estimate builder, detailed company listings with ratings, and informative content. It also features a robust admin system for managing business listings and tracking performance. No franchises accepted - local vetted haulers only.

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
- **Search Functionality**:
    - Homepage search bar supports zip codes, state names, and city names
    - City search uses `/api/search-city` endpoint to find which state a city belongs to
    - Automatically redirects to the correct state/city page (e.g., "San Francisco" → `/california/san-francisco`)
    - URL slug formatting: city names with spaces are converted to hyphens for clean URLs
    - City page routing handles both formats: converts URL slugs back to proper city names for database queries
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
        - **Contact Email Feature**: Featured businesses can set a public-facing contact email separate from their login email
        - **Logo Upload**: **UPGRADED to Replit Object Storage** for 30x faster saves (2 seconds vs 65 seconds)
            - Professional file upload using Uppy.js modal interface
            - Direct upload to Google Cloud Storage via presigned URLs
            - Max file size: 10MB (up from 2MB)
            - Stores as `/objects/logos/{uuid}` URL (replaces base64 encoding)
            - Public ACL for logo visibility across all pages
            - Live preview in Basic Information tab
            - **Uppy Styles**: CDN-hosted (https://releases.transloadit.com/uppy/v3.25.3/uppy.min.css) loaded in index.html to avoid Vite module resolution issues
        - **Complete Field Editing**: All business details editable including logo, team members, gallery images, pricing, services, and contact information
        - Save Progress and Go to Live Page buttons
        - Clean yellow and black design matching brand colors
    - **Approval System**: Automatic business approval upon signup.
    - **Performance Tracking**: Automatic tracking of customer interactions (clicks, calls, photo quotes, in-person estimates) with an API endpoint `/api/track/event`.
    - **Unclaimed Business Listings**:
        - Businesses can be prefilled with name, phone, city, state, and optional address
        - Marked as "unclaimed" until business owner claims their profile
        - Unclaimed listings display with limited information (name and phone only)
        - Non-clickable gray cards with "Unclaimed Listing - Basic Info Only" badge
        - Yellow "Claim Your Profile" button on each unclaimed listing (matches brand colors)
        - **Claim Flow**:
            - Clicking "Claim Your Profile" redirects to `/add-business?claim=true&name=[Business Name]&phone=[Phone]`
            - AddBusiness page reads URL parameters and prefills business name and phone fields
            - Shows "Claim Your Profile" heading instead of standard signup heading
            - Displays green claiming banner with checkmark icon showing "Claiming Profile: [Business Name]"
            - Banner message: "We've prefilled your business name and phone. Complete the rest to activate your profile!"
        - Bulk import endpoint for admins: `POST /api/admin/companies/bulk-unclaimed`
        - Required fields: name, phone, city, state (address optional)
        - Database schema includes `claimed` boolean field (default: false)
        - **Nationwide Expansion**: Successfully imported 135 vetted junk removal companies across all 45 states covering 675 cities, providing comprehensive national coverage for independent local operators
- **Admin Dashboard**:
    - **Yellow/White Branding**: Complete redesign with #fbbf24 (yellow) and black color scheme matching website aesthetics
    - **Mobile-Responsive**: Hamburger menu navigation with sticky header
    - **Comprehensive Tabs**: Active, Unclaimed, Featured, Analytics for organized business management
    - **Smart Stats Grid**: Real-time metrics showing Active (953), Unclaimed, Featured, and States covered
    - **Advanced Filtering**: 
        - State dropdown with dynamic city sub-filtering
        - Real-time search by name, city, or phone
        - Filter persistence across tabs
    - **Unclaimed Business Management**:
        - Dedicated Unclaimed tab showing all unclaimed listings
        - "Add Unclaimed Business" button with inline form
        - Fields: Name, Phone, City, State, Address (optional)
        - One-click bulk addition via API
        - Mark unclaimed as claimed directly from admin
    - **Business Actions**:
        - Expandable action menus per business
        - View Profile (opens in new tab)
        - **Display Order Control**: Set custom display order for businesses on city pages (lower numbers appear first, default 999)
        - **Badge/Banner System**: Quick-add badges (TOP RATED, BEST VALUE, FASTEST, VERIFIED) or remove badges with one click
        - Mark as Claimed
        - Delete Business (with confirmation)
    - **Analytics Dashboard**:
        - Platform-wide metrics
        - State breakdown with business counts
        - Featured rate calculations
        - Geographic coverage statistics

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