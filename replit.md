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
- **Typography**: Inter font family used throughout the application.
- **Interactive Elements**: 3D lift effects (1px default, 2px hover) on state buttons, feature sections, and search bar.
- **Navigation**: Comprehensive hamburger menu with searchable dropdowns for "Areas Served" and "Junk Removal Services".
- **Company Profiles**: Enhanced profiles with hero sections, multiple CTAs, detailed business information, and green checkmark badges for "TOP RATED" companies.

### Technical Implementations
- **Frontend**: React with Vite, styled using Tailwind CSS.
- **Backend**: Node.js with Express.
- **Database**: PostgreSQL for data persistence, integrated using Drizzle ORM.
- **Authentication**: Token-based authentication for business owners and administrators using bcrypt for password hashing. Replit Auth for initial admin setup.
- **Data Fetching**: TanStack Query for efficient data management in the frontend.
- **Mapping**: Mapbox GL and react-map-gl for interactive maps.
- **Visual Estimate Builder**: Interactive calculator with graphical representations of items and truck capacity.
- **Business Management**:
    - **Signup**: Comprehensive full-page signup process with educational content, pricing tiers, and login creation.
    - **Profile Editing**: Comprehensive ProfileEditor page (/profile/edit) for business owners with tabs for Basic Info, Pricing, Reviews, and Gallery. City page profiles display "Edit Your Profile" button for owners.
    - **Approval System**: Automatic business approval upon signup.
    - **Performance Tracking**: Automatic tracking of customer interactions (clicks, calls, photo quotes, in-person estimates) with an API endpoint `/api/track/event`.
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
- **Drizzle ORM**: Object-relational mapper for database interactions.
- **Zod**: For schema validation.
- **TanStack Query**: For data fetching and caching in the React frontend.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Replit Auth**: For initial administrator authentication setup.
- **bcrypt**: For secure password hashing.