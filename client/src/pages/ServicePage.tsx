import { useRoute, Link, useLocation } from 'wouter';
import { CheckCircle2, Search, Home, ArrowLeft, Building2, Users, Truck, Recycle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSEO, buildServicePageSEO, buildWebPageSchema, buildBreadcrumbSchema } from '../lib/seo';

const serviceDetails: Record<string, {
  title: string;
  category: string;
  description: string;
  detailedDescription: string;
  benefits: string[];
  process: string[];
  commonItems: string[];
  whyChooseLocal: string[];
  icon: any;
}> = {
  'office-cleanouts': {
    title: 'Office Cleanouts',
    category: 'Commercial',
    description: 'Professional office cleanout services for businesses relocating, downsizing, or renovating. Our local junk haulers specialize in removing office furniture, electronics, and equipment efficiently with minimal disruption to your operations.',
    detailedDescription: 'Businesses nationwide trust local office cleanout specialists for professional, efficient service. Whether you\'re relocating your headquarters, downsizing your workspace, or renovating your facilities, experienced teams handle everything from cubicle disassembly to electronics removal. Our directory connects you with businesses of all sizes, from small startups to large corporate offices, providing customized solutions that meet your timeline and budget.',
    whyChooseLocal: [
      'Local teams provide faster response times in your area',
      'Familiar with commercial building regulations and requirements',
      'Established relationships with local recycling centers and donation facilities',
      'Support local businesses - they\'re your neighbors',
      'Same-day service often available'
    ],
    benefits: [
      'After-hours and weekend availability',
      'Secure document destruction available',
      'Electronics recycling and data wiping',
      'Fast turnaround to minimize downtime',
      'Licensed and insured professionals'
    ],
    process: [
      'Schedule a free on-site assessment',
      'Receive detailed quote with no hidden fees',
      'Choose convenient pickup time',
      'Professional team handles all loading',
      'Space left clean and ready to use'
    ],
    commonItems: ['Desks', 'Office Chairs', 'Filing Cabinets', 'Cubicle Walls', 'Conference Tables', 'Computers', 'Printers', 'Copiers'],
    icon: Building2
  },
  'warehouse-clearing': {
    title: 'Warehouse Clearing',
    category: 'Commercial',
    description: 'Complete warehouse and industrial facility clearing services. We handle large-scale cleanouts for warehouses, manufacturing plants, and distribution centers with specialized equipment and experienced crews.',
    detailedDescription: 'Growing industrial sectors demand reliable warehouse clearing services that can handle massive projects efficiently. Experienced crews specialize in clearing distribution centers, manufacturing facilities, and industrial warehouses of any size. They bring industrial-grade equipment and large teams to complete your project on schedule, whether you\'re closing a facility, relocating operations, or preparing for new tenants. From pallet rack removal to heavy machinery disposal, they handle every aspect with professionalism and attention to safety regulations.',
    whyChooseLocal: [
      'Rapid deployment for urgent clearing needs',
      'Deep understanding of industrial zoning and disposal regulations',
      'Established partnerships with recycling centers maximize salvage value returns',
      'Local teams provide consistent, reliable service you can trust',
      'Same-day assessments often available'
    ],
    benefits: [
      'Industrial-grade equipment available',
      'Large crew capacity for quick completion',
      'Recycling and salvage value recovery',
      'Dock and loading bay expertise',
      'Proper disposal of industrial materials'
    ],
    process: [
      'Site walkthrough and project planning',
      'Detailed scope and timeline provided',
      'Coordinate with your schedule',
      'Systematic clearing and sorting',
      'Final sweep and facility ready'
    ],
    commonItems: ['Pallet Racks', 'Forklifts', 'Conveyor Systems', 'Industrial Shelving', 'Machinery', 'Packaging Materials', 'Pallets', 'Scrap Metal'],
    icon: Truck
  },
  'retail-space': {
    title: 'Retail Space Cleanouts',
    category: 'Commercial',
    description: 'Retail space cleanout services for store closures, renovations, or relocations. Fast, professional removal of fixtures, inventory, and displays to help you meet tight deadlines.',
    detailedDescription: 'Retail businesses nationwide face tight timelines when closing, renovating, or relocating their storefronts. Retail cleanout specialists understand the urgency of lease deadlines and the importance of leaving spaces market-ready for landlords. They efficiently remove display fixtures, shelving systems, point-of-sale equipment, and remaining inventory while coordinating donation opportunities for usable merchandise. Whether you\'re a boutique or a shopping center anchor store, they handle everything from mannequins to merchandising displays with speed and professionalism.',
    whyChooseLocal: [
      'Quick response times to meet your lease deadlines',
      'Familiar with retail property management requirements',
      'Connections with local charities for inventory donation opportunities',
      'Understanding of peak traffic hours to minimize disruption',
      'Same-day emergency services often available for unexpected closures'
    ],
    benefits: [
      'Quick turnaround for lease deadlines',
      'Fixture and display removal expertise',
      'Donation options for usable inventory',
      'Clean sweep for new tenants',
      'Flexible scheduling around hours'
    ],
    process: [
      'Assess space and removal needs',
      'Provide competitive quote',
      'Schedule around business hours',
      'Remove all fixtures and inventory',
      'Leave space broom-clean'
    ],
    commonItems: ['Display Cases', 'Shelving Units', 'Mannequins', 'Point-of-Sale Systems', 'Signage', 'Clothing Racks', 'Inventory', 'Lighting Fixtures'],
    icon: Building2
  },
  'restaurant-equipment': {
    title: 'Restaurant Equipment Removal',
    category: 'Commercial',
    description: 'Specialized restaurant equipment removal for closures, renovations, or upgrades. We safely remove and dispose of commercial kitchen equipment, following all health and safety regulations.',
    detailedDescription: 'Vibrant restaurant scenes require specialized expertise when it comes to commercial kitchen equipment removal. Certified technicians safely disconnect and remove everything from commercial ovens and walk-in coolers to grease traps and exhaust hoods, ensuring full compliance with health department regulations. They understand the value of commercial kitchen equipment and can coordinate resale or donation of working appliances. Whether you\'re a fine dining establishment undergoing renovation or closing a quick-service location, they handle your equipment with the care and professionalism it deserves.',
    whyChooseLocal: [
      'Licensed technicians trained in commercial kitchen disconnection',
      'Familiar with health department requirements and disposal regulations',
      'Network of restaurant equipment buyers for working appliance resale',
      'Quick turnaround times help restaurants meet renovation schedules',
      'After-hours service available to minimize business disruption'
    ],
    benefits: [
      'Commercial kitchen expertise',
      'Proper disconnection of gas/electric',
      'Grease trap and hood system removal',
      'Resale options for working equipment',
      'Health code compliant disposal'
    ],
    process: [
      'Kitchen assessment and planning',
      'Equipment disconnection coordination',
      'Safe removal of all items',
      'Proper disposal or resale',
      'Kitchen left clean and ready'
    ],
    commonItems: ['Commercial Ovens', 'Refrigerators', 'Freezers', 'Prep Tables', 'Dishwashers', 'Grills', 'Fryers', 'Range Hoods'],
    icon: Building2
  },
  'home-cleanouts': {
    title: 'Home Cleanouts',
    category: 'Residential',
    description: 'Complete residential cleanout services for any situation. Whether you\'re moving, decluttering, or preparing a home for sale, our local haulers provide compassionate and efficient service.',
    detailedDescription: 'Homeowners trust complete home cleanout services for life\'s major transitions. Whether you\'re downsizing, moving across the country, preparing a property for sale, or simply reclaiming space from years of accumulation, compassionate teams handle every item with respect. They sort through belongings carefully, identifying items for donation, recycling, or proper disposal while treating your home and memories with dignity. An eco-friendly approach ensures usable items find new homes while reducing landfill waste.',
    whyChooseLocal: [
      'Same-day service often available for time-sensitive moving situations',
      'Established relationships with local donation centers',
      'Local teams understand the unique needs of homeowners in your area',
      'Familiar with HOA requirements and disposal guidelines',
      'Trusted for sensitive cleanout situations requiring compassion and discretion'
    ],
    benefits: [
      'Same-day service often available',
      'Sensitive to personal situations',
      'Donation of usable items',
      'Eco-friendly disposal practices',
      'Respectful of your property'
    ],
    process: [
      'Free in-home estimate',
      'Sort items for donation/disposal',
      'Professional removal team',
      'Clean up and sweep',
      'Home left move-in ready'
    ],
    commonItems: ['Furniture', 'Appliances', 'Clothing', 'Books', 'Electronics', 'Kitchenware', 'Decorations', 'Toys'],
    icon: Users
  },
  'garage-cleanouts': {
    title: 'Garage Cleanouts',
    category: 'Residential',
    description: 'Garage and basement cleanout services to reclaim your space. We remove years of accumulated items quickly and affordably, recycling and donating whenever possible.',
    detailedDescription: 'Garages become catch-all spaces for everything from seasonal decorations to old lawn equipment and forgotten projects. Garage cleanout specialists transform cluttered spaces into functional storage areas or workshop spaces you can actually use. They handle the heavy lifting of removing decades of accumulation, properly disposing of hazardous materials like old paint and chemicals, and recycling metal and electronics. No sorting required on your part - they handle everything from evaluation to final sweep, leaving your garage clean and organized.',
    whyChooseLocal: [
      'Fast response times for weekend project scheduling',
      'Knowledge of hazardous waste disposal sites and regulations',
      'Local teams understand regional climate storage challenges',
      'Convenient scheduling around your availability',
      'Same-day service often available'
    ],
    benefits: [
      'No sorting required on your part',
      'Heavy item removal included',
      'Hazardous material guidance',
      'Garage left clean and empty',
      'Affordable flat-rate pricing'
    ],
    process: [
      'Quick walkthrough and quote',
      'Schedule convenient time',
      'Team removes everything',
      'Sort for recycling/donation',
      'Final cleanup and sweep'
    ],
    commonItems: ['Old Tools', 'Bicycles', 'Lawn Equipment', 'Paint Cans', 'Car Parts', 'Holiday Decorations', 'Sports Equipment', 'Storage Boxes'],
    icon: Users
  },
  'attic-basement': {
    title: 'Attic & Basement Cleanouts',
    category: 'Residential',
    description: 'Professional attic and basement clearing services. We navigate tight spaces and stairs to remove decades of stored items, treating your belongings with care and respect.',
    detailedDescription: 'Attics and basements hold generations of memories along with forgotten storage. Our experienced crews specialize in navigating narrow stairs, low ceilings, and tight access points to safely remove everything from vintage furniture to boxes of family keepsakes. We take extra care with potentially valuable or sentimental items, alerting you to anything that might have significance or worth. Whether you\'re preparing a home for sale, creating usable space, or settling an estate, we handle the physical challenges while treating each item with the respect it deserves.',
    whyChooseLocal: [
      'Experienced with various home layouts and architectural styles',
      'Careful handling protects your property while navigating stairs and tight spaces',
      'Local expertise in identifying valuable vintage items',
      'Flexible scheduling works around family availability',
      'Trusted for respectful, thorough service'
    ],
    benefits: [
      'Experienced with tight spaces',
      'Careful stair navigation',
      'Old item disposal expertise',
      'Family heirloom identification',
      'Complete debris removal'
    ],
    process: [
      'Assess access and items',
      'Provide detailed estimate',
      'Protect floors and walls',
      'Systematic removal',
      'Space left clean and empty'
    ],
    commonItems: ['Old Furniture', 'Holiday Items', 'Storage Totes', 'Vintage Items', 'Trunks', 'Mirrors', 'Picture Frames', 'Boxes'],
    icon: Users
  },
  'yard-debris': {
    title: 'Yard Debris Removal',
    category: 'Residential',
    description: 'Yard waste and debris removal for landscaping projects, storm cleanup, or seasonal maintenance. We handle branches, leaves, soil, and all types of organic yard waste.',
    detailedDescription: 'Regional landscapes require specialized yard debris removal, especially after storm seasons or major landscaping projects. Teams handle everything from tree trimmings and pruning waste to garden redesign debris and old landscaping materials. They understand the unique challenges of local yards and regional plants. Whether you\'re refreshing your landscape or cleaning up after storm damage, they provide efficient removal with eco-friendly disposal practices.',
    whyChooseLocal: [
      'Rapid storm cleanup response',
      'Expertise with regional landscaping materials',
      'Knowledge of local composting facilities and green waste recycling',
      'Understanding of HOA landscaping requirements',
      'Same-day service often available for urgent project cleanup needs'
    ],
    benefits: [
      'Large capacity trucks',
      'Organic waste composting',
      'Storm damage cleanup',
      'Same-day service available',
      'Affordable pricing'
    ],
    process: [
      'Assess debris volume',
      'Provide instant quote',
      'Load and haul away',
      'Proper disposal/composting',
      'Yard left clean'
    ],
    commonItems: ['Tree Branches', 'Leaves', 'Grass Clippings', 'Soil', 'Mulch', 'Plants', 'Logs', 'Stumps'],
    icon: Recycle
  },
  'estate-cleanouts': {
    title: 'Estate Cleanouts',
    category: 'Estates',
    description: 'Compassionate estate cleanout services during difficult times. We handle complete property clearing with respect, care, and sensitivity to family heirlooms and memories.',
    detailedDescription: 'Settling an estate is emotionally challenging, and our compassionate teams provide supportive, respectful service during this difficult time. We work closely with families, executors, and estate attorneys to systematically clear properties while carefully identifying valuable items, family heirlooms, and personal effects. Our experienced crews understand the emotional weight of this process and handle every belonging with dignity and care. We coordinate with local charities for donation of usable items, arrange estate sales when appropriate, and ensure the property is left clean and ready for the next chapter.',
    whyChooseLocal: [
      'Trusted for generations of compassionate estate service',
      'Established relationships with local estate sale companies',
      'Knowledge of probate timelines helps families meet deadlines',
      'Connections with local charities and donation centers',
      'Discreet, respectful service protects family privacy'
    ],
    benefits: [
      'Compassionate and respectful service',
      'Experience with sensitive situations',
      'Heirloom and valuable identification',
      'Donation coordination for charities',
      'Thorough and complete clearing'
    ],
    process: [
      'Meet with family representatives',
      'Walk through entire property',
      'Identify items for keeping/donating',
      'Careful removal and sorting',
      'Property left ready for sale'
    ],
    commonItems: ['Furniture', 'Personal Effects', 'Antiques', 'Collections', 'Appliances', 'Clothing', 'Books', 'Artwork'],
    icon: Users
  },
  'foreclosure-cleanouts': {
    title: 'Foreclosure Cleanouts',
    category: 'Estates',
    description: 'Fast foreclosure property cleanout services for banks, realtors, and property managers. We clear properties quickly to get them market-ready with competitive pricing.',
    detailedDescription: 'Banks, realtors, and property managers nationwide rely on foreclosure cleanout services to quickly transform vacant properties into market-ready homes. Specialists handle everything from occupied to completely abandoned properties, removing all contents, debris, and unwanted items while documenting the property condition. Efficient crews work fast to minimize holding costs and get properties ready for resale. They\'re experienced with REO properties, short sales, and bank-owned homes, providing the rapid turnaround and competitive pricing that real estate professionals demand.',
    whyChooseLocal: [
      'Quick deployment to minimize property holding costs',
      'Established relationships with local real estate agents and banks',
      'Understanding of local real estate market timelines',
      'Secure service protects property integrity',
      'Volume pricing available for property management companies'
    ],
    benefits: [
      'Rapid response and completion',
      'Experienced with abandoned properties',
      'Secure and insured service',
      'Property left broom-clean',
      'Competitive bulk pricing'
    ],
    process: [
      'Property assessment and quote',
      'Coordinate access and timing',
      'Complete property clearing',
      'Minor repairs noted for owner',
      'Property ready for showing'
    ],
    commonItems: ['Abandoned Furniture', 'Personal Items', 'Trash', 'Appliances', 'Debris', 'Damaged Items'],
    icon: Building2
  },
  'hoarding-cleanup': {
    title: 'Hoarding Cleanup',
    category: 'Estates',
    description: 'Professional hoarding cleanup services with compassion and discretion. Our trained teams work with sensitivity to help restore safe, livable spaces while respecting the individual\'s needs.',
    detailedDescription: 'Hoarding situations require specialized expertise, compassion, and complete discretion. Our trained professionals work with individuals, families, and mental health specialists to restore safe, livable environments while respecting the emotional complexity of hoarding disorder. We proceed at a pace comfortable for the individual, carefully sorting through accumulated items and identifying anything of value or importance. Our teams are trained in biohazard safety, proper sanitization, and trauma-informed care, ensuring we treat every person and situation with the dignity and understanding they deserve.',
    whyChooseLocal: [
      'Discreet service protects client privacy',
      'Partnerships with local mental health professionals',
      'Compassionate teams understand the sensitive nature of hoarding situations',
      'Knowledge of local resources and support services',
      'Trusted for non-judgmental, respectful service'
    ],
    benefits: [
      'Trained in hoarding situations',
      'Non-judgmental approach',
      'Work with mental health professionals',
      'Biohazard cleaning if needed',
      'Complete discretion and privacy'
    ],
    process: [
      'Confidential consultation',
      'Develop cleanup plan with client',
      'Gradual or complete clearing',
      'Sort and organize kept items',
      'Deep cleaning and sanitizing'
    ],
    commonItems: ['Accumulated Items', 'Paper Products', 'Clothing', 'Food Containers', 'General Clutter', 'Personal Belongings'],
    icon: Users
  },
  'downsizing': {
    title: 'Downsizing Services',
    category: 'Estates',
    description: 'Downsizing and senior moving services to help transition to smaller homes or senior living. We make the process easier by handling furniture removal and donation coordination.',
    detailedDescription: 'Transitioning to a smaller home or senior living community is a significant life change, and our downsizing specialists make the process manageable and stress-free. We work patiently with seniors and their families to decide what treasured items will fit in the new space and what needs to find new homes. Our compassionate teams handle the physical work of moving, donation coordination, and disposal, allowing families to focus on the emotional aspects of this transition. We understand the importance of preserving dignity and independence throughout the downsizing journey.',
    whyChooseLocal: [
      'Patient, understanding teams familiar with local senior communities',
      'Established relationships with area senior living facilities',
      'Knowledge of local donation centers for convenient pickups',
      'Flexible scheduling accommodates family availability',
      'Trusted for compassionate downsizing assistance'
    ],
    benefits: [
      'Patient and understanding service',
      'Help with decision-making',
      'Coordinate donations and sales',
      'Familiar with senior needs',
      'Stress-free transition support'
    ],
    process: [
      'Meet to discuss needs',
      'Plan what to keep/remove',
      'Coordinate donations',
      'Professional removal',
      'New space ready to move in'
    ],
    commonItems: ['Furniture', 'Appliances', 'Kitchenware', 'Books', 'Decorations', 'Linens', 'Clothing'],
    icon: Users
  },
  'storage-unit-cleanouts': {
    title: 'Storage Unit Cleanouts',
    category: 'Specialty',
    description: 'Storage unit cleanout and clearing services. Whether you\'re closing a unit or clearing inherited storage, we handle complete removal quickly and affordably.',
    detailedDescription: 'Storage units often become forgotten spaces filled with items from life transitions, moves, or inheritances. Our storage unit cleanout services help you reclaim those monthly fees by completely clearing units quickly and affordably. We meet you at the storage facility, sort through contents to identify anything valuable or worth keeping, and haul away everything else. Whether you\'re closing a unit you\'ve had for years, dealing with an inherited storage space, or need to clear out a business storage, we handle the entire process efficiently so you can stop paying storage fees.',
    whyChooseLocal: [
      'Quick response helps avoid additional monthly storage fees',
      'Familiar with major storage facilities in your area',
      'Same-day service often available to meet facility deadlines',
      'Local teams provide reliable, punctual service',
      'Trusted for fast, affordable storage unit clearing'
    ],
    benefits: [
      'Meet at storage facility',
      'Avoid late fees with quick service',
      'Sort valuable items',
      'Complete unit clearing',
      'Clean out in one trip'
    ],
    process: [
      'Unit assessment and quote',
      'Schedule facility access',
      'Remove all contents',
      'Sort for disposal/donation',
      'Unit left empty and clean'
    ],
    commonItems: ['Furniture', 'Boxes', 'Appliances', 'Tools', 'Clothing', 'Electronics', 'Sporting Goods'],
    icon: Building2
  },
  'construction-debris': {
    title: 'Construction Debris Removal',
    category: 'Specialty',
    description: 'Construction and renovation debris removal for contractors and homeowners. We handle drywall, lumber, concrete, and all types of construction waste with proper disposal.',
    detailedDescription: 'Construction and renovation projects generate massive amounts of debris that can slow down your work and create safety hazards. Our construction debris removal services keep job sites clean and compliant with safety regulations. We handle everything from demolition waste and drywall scraps to roofing materials and concrete, providing a cost-effective alternative to renting dumpsters. Whether you\'re a contractor working on multiple projects or a homeowner tackling a DIY renovation, we offer flexible pickup schedules and proper disposal of all construction materials, including recycling when possible.',
    whyChooseLocal: [
      'Quick turnaround keeps construction projects on schedule',
      'Understanding of local building codes and disposal requirements',
      'Flexible scheduling works with contractor timelines',
      'Knowledge of local recycling facilities for construction materials',
      'Reliable service trusted by contractors and homeowners alike'
    ],
    benefits: [
      'Contractor-friendly service',
      'Dumpster alternative',
      'Recycling of materials',
      'Job site kept clean',
      'Flexible scheduling'
    ],
    process: [
      'Assess debris type and volume',
      'Provide competitive quote',
      'Schedule pickup or ongoing service',
      'Load all debris',
      'Proper disposal and recycling'
    ],
    commonItems: ['Drywall', 'Lumber', 'Concrete', 'Roofing Materials', 'Tile', 'Carpet', 'Cabinets', 'Fixtures'],
    icon: Truck
  },
  'electronic-waste': {
    title: 'Electronic Waste Removal',
    category: 'Specialty',
    description: 'E-waste removal and recycling services for safe disposal of electronics. We ensure proper recycling and data destruction for all electronic devices.',
    detailedDescription: 'Electronic waste contains hazardous materials that require specialized disposal and recycling. Our certified e-waste removal service ensures your old computers, monitors, televisions, and other electronics are recycled responsibly and in compliance with environmental regulations. We provide secure data destruction for devices containing sensitive information and can handle everything from single items to bulk corporate electronics disposal. Whether you\'re upgrading office equipment, clearing out old technology, or responsibly disposing of household electronics, we make it easy and environmentally friendly.',
    whyChooseLocal: [
      'Certified e-waste recycling partnerships',
      'Secure data destruction services protect businesses',
      'Knowledge of local environmental regulations for electronic disposal',
      'Convenient pickup scheduling for residents and businesses',
      'Free recycling options available for some items'
    ],
    benefits: [
      'Certified e-waste recycling',
      'Data security and wiping',
      'Environmental compliance',
      'Bulk electronics accepted',
      'Free recycling for some items'
    ],
    process: [
      'Assess electronics for pickup',
      'Provide quote if needed',
      'Schedule convenient pickup',
      'Secure data destruction',
      'Proper recycling certified'
    ],
    commonItems: ['Computers', 'Monitors', 'TVs', 'Printers', 'Phones', 'Tablets', 'Cables', 'Keyboards'],
    icon: Recycle
  },
  'appliance-removal': {
    title: 'Appliance Removal',
    category: 'Specialty',
    description: 'Professional appliance removal and disposal service. We safely disconnect and remove all types of household and commercial appliances with proper recycling.',
    detailedDescription: 'Removing old appliances requires proper disconnection, careful handling, and environmentally responsible disposal. Our appliance removal specialists handle refrigerators, washers, dryers, dishwashers, and all major appliances with care to avoid damage to your home. We include basic disconnection service, navigate stairs and tight spaces safely, and ensure appliances are recycled properly rather than ending up in landfills. Whether you\'re upgrading to energy-efficient models, clearing out rental property appliances, or disposing of broken units, we make the process quick, easy, and eco-friendly.',
    whyChooseLocal: [
      'Same-day appliance removal often available',
      'Knowledge of local appliance recycling facilities',
      'Experienced with various home layouts and tight spaces',
      'Affordable flat-rate pricing',
      'Trusted by homeowners and property managers for reliable service'
    ],
    benefits: [
      'Safe disconnection included',
      'Appliance recycling',
      'Same-day service available',
      'No damage to property',
      'Affordable flat rates'
    ],
    process: [
      'Schedule appointment',
      'Disconnect if needed',
      'Carefully remove appliance',
      'Transport for recycling',
      'Area cleaned and ready'
    ],
    commonItems: ['Refrigerators', 'Washers', 'Dryers', 'Dishwashers', 'Ovens', 'Microwaves', 'Water Heaters', 'AC Units'],
    icon: Truck
  }
};

const cityLinks = [
  { name: 'Scottsdale', url: '/arizona/scottsdale' },
  { name: 'Phoenix', url: '/arizona/phoenix' },
  { name: 'Tempe', url: '/arizona/tempe' },
  { name: 'Mesa', url: '/arizona/mesa' },
  { name: 'Chandler', url: '/arizona/chandler' },
  { name: 'Gilbert', url: '/arizona/gilbert' },
  { name: 'Glendale', url: '/arizona/glendale' },
  { name: 'Peoria', url: '/arizona/peoria' }
];

// Helper function to convert city names to links
function addCityLinks(text: string) {
  let result: (string | JSX.Element)[] = [text];
  
  cityLinks.forEach(({ name, url }) => {
    result = result.flatMap((part) => {
      if (typeof part !== 'string') return [part];
      
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      const parts: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(part)) !== null) {
        if (match.index > lastIndex) {
          parts.push(part.slice(lastIndex, match.index));
        }
        parts.push(
          <a
            key={`${name}-${match.index}`}
            href={url}
            style={{
              color: '#000',
              fontWeight: '600',
              textDecoration: 'underline',
            }}
          >
            {name}
          </a>
        );
        lastIndex = match.index + name.length;
      }
      
      if (lastIndex < part.length) {
        parts.push(part.slice(lastIndex));
      }
      
      return parts.length > 0 ? parts : [part];
    });
  });
  
  return result;
}

export default function ServicePage() {
  const [, params] = useRoute('/services/:service');
  const [zipCode, setZipCode] = useState('');
  const [location] = useLocation();
  
  const serviceSlug = params?.service || '';
  const serviceInfo = serviceDetails[serviceSlug];
  
  // SEO
  if (serviceInfo) {
    useSEO(buildServicePageSEO(serviceSlug, serviceInfo.title, serviceInfo.description));
  }
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim()) {
      window.location.href = `/?zip=${encodeURIComponent(zipCode.trim())}`;
    }
  };
  
  const handleBack = () => {
    window.history.back();
  };

  if (!serviceInfo) {
    return <div>Service not found</div>;
  }

  const IconComponent = serviceInfo.icon;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            cursor: 'pointer',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
          data-testid="button-back"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#fbbf24',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#000',
            textDecoration: 'none',
            cursor: 'pointer',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
          data-testid="button-home"
        >
          <Home size={18} />
          <span>Home</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(to bottom, #f8f8f8, #fff)',
        padding: '40px 16px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#fbbf24',
            borderRadius: '20px',
            marginBottom: '16px',
          }}>
            <IconComponent size={20} />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#000',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}>
              {serviceInfo.category}
            </span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 48px)',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0 0 16px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            {serviceInfo.title}
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 20px)',
            color: '#666',
            lineHeight: '1.6',
            margin: '0 0 32px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            {serviceInfo.description}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            gap: '8px',
          }}>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter your city"
              style={{
                flex: 1,
                padding: '14px 16px',
                border: '2px solid #fbbf24',
                borderRadius: '8px',
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              data-testid="input-zip-search"
            />
            <button
              type="submit"
              style={{
                padding: '14px 20px',
                backgroundColor: '#fbbf24',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              data-testid="button-zip-search"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </section>

      {/* Detailed Description Section */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#fff',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            margin: '0 0 24px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            About Our {serviceInfo.title}
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 18px)',
            color: '#333',
            lineHeight: '1.8',
            textAlign: 'center',
            margin: '0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            {addCityLinks(serviceInfo.detailedDescription)}
          </p>
        </div>
      </section>

      {/* Why Choose Local Section */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#f8f8f8',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            margin: '0 0 32px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Why Choose Local Haulers?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}>
            {serviceInfo.whyChooseLocal.map((reason, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  border: '2px solid #fbbf24',
                }}
              >
                <CheckCircle2 
                  size={24} 
                  style={{ 
                    color: '#fbbf24', 
                    flexShrink: 0,
                    marginTop: '2px' 
                  }} 
                />
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  color: '#333',
                  lineHeight: '1.6',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {addCityLinks(reason)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#fff',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            margin: '0 0 32px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Service Benefits
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {serviceInfo.benefits.map((benefit, index) => (
              <div
                key={index}
                style={{
                  padding: '24px',
                  backgroundColor: '#f8f8f8',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '16px',
                }}
              >
                <CheckCircle2 size={24} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  color: '#333',
                  lineHeight: '1.6',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#f8f8f8',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            margin: '0 0 32px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Our Process
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '16px',
          }}>
            {serviceInfo.process.map((step, index) => (
              <div
                key={index}
                style={{
                  padding: '20px 24px',
                  backgroundColor: '#fff',
                  borderLeft: '4px solid #fbbf24',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px',
                  flexShrink: 0,
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {index + 1}
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  color: '#333',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Items Section */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#fff',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            margin: '0 0 32px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Common Items We Handle
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
          }}>
            {serviceInfo.commonItems.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8f8f8',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '15px',
                  color: '#000',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section - Interlinks */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#f8f8f8',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: '700',
            color: '#1a1a1a',
            textAlign: 'center',
            margin: '0 0 16px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            {serviceInfo.title} in Major Cities
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 18px)',
            color: '#666',
            textAlign: 'center',
            margin: '0 0 32px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Find trusted local haulers for {serviceInfo.title.toLowerCase()} in your area
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {[
              { city: 'Scottsdale', state: 'Arizona', url: '/arizona/scottsdale' },
              { city: 'Phoenix', state: 'Arizona', url: '/arizona/phoenix' },
              { city: 'Tempe', state: 'Arizona', url: '/arizona/tempe' },
              { city: 'Mesa', state: 'Arizona', url: '/arizona/mesa' },
              { city: 'Chandler', state: 'Arizona', url: '/arizona/chandler' },
              { city: 'Gilbert', state: 'Arizona', url: '/arizona/gilbert' },
              { city: 'Glendale', state: 'Arizona', url: '/arizona/glendale' },
              { city: 'Peoria', state: 'Arizona', url: '/arizona/peoria' }
            ].map((cityData, index) => (
              <a
                key={index}
                href={cityData.url}
                style={{
                  display: 'block',
                  padding: '20px',
                  backgroundColor: '#fff',
                  border: '2px solid #fbbf24',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fffbeb';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                data-testid={`link-city-${cityData.city.toLowerCase()}`}
              >
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '4px',
                }}>
                  {cityData.city}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                }}>
                  {cityData.state}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#fbbf24',
        color: '#000',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 36px)',
            fontWeight: '700',
            margin: '0 0 16px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Ready For {serviceInfo.title}?
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 18px)',
            margin: '0 0 24px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Find trusted, local, vetted junk haulers in your area. No national franchises - just quality local service.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: '700',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
            data-testid="button-find-haulers-cta"
          >
            Find Local Haulers
          </Link>
        </div>
      </section>
    </div>
  );
}
