import { useRoute, Link, useLocation } from 'wouter';
import { CheckCircle2, Search, Home, ArrowLeft, Building2, Users, Truck, Recycle } from 'lucide-react';
import { useState, useEffect } from 'react';

const serviceDetails: Record<string, {
  title: string;
  category: string;
  description: string;
  benefits: string[];
  process: string[];
  commonItems: string[];
  icon: any;
}> = {
  'office-cleanouts': {
    title: 'Office Cleanouts',
    category: 'Commercial',
    description: 'Professional office cleanout services for businesses relocating, downsizing, or renovating. Our local junk haulers specialize in removing office furniture, electronics, and equipment efficiently with minimal disruption to your operations.',
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

export default function ServicePage() {
  const [, params] = useRoute('/services/:service');
  const [zipCode, setZipCode] = useState('');
  const [location] = useLocation();
  
  const serviceSlug = params?.service || '';
  const serviceInfo = serviceDetails[serviceSlug];
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // Set page title and meta tags for SEO
  useEffect(() => {
    if (serviceInfo) {
      document.title = `${serviceInfo.title} - Local Vetted Junk Haulers | BestJunkRemovalCompanies.com`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `${serviceInfo.description} Find trusted local junk haulers for ${serviceInfo.title.toLowerCase()} near you.`);
      }
    }
  }, [serviceInfo]);
  
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
              placeholder="Enter your zip code"
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
            Why Choose Local Haulers?
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
                <CheckCircle2 size={24} color="#166534" style={{ flexShrink: 0, marginTop: '2px' }} />
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
                  color: '#166534',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#166534',
        color: '#fff',
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
            opacity: 0.9,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Find trusted, local, vetted junk haulers in your area. No national franchises - just quality local service.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: '#fbbf24',
              color: '#000',
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
