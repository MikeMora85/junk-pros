import { useRoute, Link, useLocation } from 'wouter';
import { CheckCircle2, Search, Home, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const itemDetails: Record<string, {
  title: string;
  description: string;
  detailedContent: string;
  whyChooseLocal: string[];
  tips: string[];
  relatedItems: string[];
}> = {
  'refrigerator': {
    title: 'Refrigerator Removal',
    description: 'Professional refrigerator removal service from local, vetted junk haulers. We safely disconnect, remove, and dispose of your old refrigerator following all environmental regulations.',
    detailedContent: 'Arizona homeowners and businesses trust our local refrigerator removal specialists for safe, eco-friendly appliance disposal. Whether you\'re upgrading to energy-efficient models in Scottsdale, clearing out rental properties in Phoenix, or renovating commercial kitchens in Tempe, our experienced teams handle refrigerators of all sizes. We understand Arizona\'s strict EPA refrigerant disposal regulations and work with certified recycling facilities throughout Mesa and Chandler to ensure proper handling of cooling agents and materials. From small under-counter units to commercial walk-in coolers, our Gilbert and Glendale teams provide same-day service with professional disconnection and careful removal that protects your property. Peoria residents appreciate our competitive pricing and commitment to environmental responsibility.',
    whyChooseLocal: [
      'Same-day service available in Phoenix and Scottsdale for urgent appliance upgrades',
      'EPA-certified refrigerant disposal through partnerships with Tempe and Mesa recycling facilities',
      'Knowledge of Arizona building codes for appliance removal in Chandler and Gilbert',
      'Lower costs than national franchises - support your local Glendale community',
      'Flexible scheduling works around your availability in Peoria and surrounding areas'
    ],
    tips: [
      'Empty and defrost your refrigerator before removal',
      'Disconnect from power and water lines',
      'Measure doorways to ensure smooth removal',
      'Remove doors if disposing yourself for safety'
    ],
    relatedItems: ['freezer', 'washing-machine', 'dishwasher', 'oven']
  },
  'sofa': {
    title: 'Sofa Removal',
    description: 'Fast and affordable sofa removal from trusted local junk haulers. Whether you\'re upgrading your furniture or clearing out space, our vetted professionals will remove your old sofa quickly and responsibly.',
    detailedContent: 'Furniture removal throughout Arizona requires local expertise and careful handling to protect your home. Our sofa removal specialists serve homeowners from Scottsdale to Phoenix, providing same-day service for everything from compact loveseats to oversized sectionals. Whether you\'re staging a home for sale in Tempe, downsizing in Mesa, or simply refreshing your living room in Chandler, our teams navigate tight hallways and stairs with professional care. We partner with local charities in Gilbert and Glendale to donate usable furniture, keeping quality pieces out of landfills while helping Arizona families in need. Our Peoria crews specialize in careful removal that protects walls, doorframes, and flooring while ensuring quick, efficient service that respects your time and property.',
    whyChooseLocal: [
      'Quick response times and flexible scheduling throughout Phoenix and Scottsdale',
      'Furniture donation partnerships with charities serving Tempe and Mesa communities',
      'Careful removal techniques protect homes in Chandler and Gilbert neighborhoods',
      'Competitive local pricing without franchise fees for Glendale residents',
      'Personal, professional service from your trusted Peoria neighbors'
    ],
    tips: [
      'Measure your sofa and doorways beforehand',
      'Remove cushions and pillows',
      'Clear a path from the sofa to the exit',
      'Check if the sofa can be donated instead'
    ],
    relatedItems: ['couch', 'mattress', 'loveseat', 'recliner']
  },
  'mattress': {
    title: 'Mattress Removal',
    description: 'Eco-friendly mattress removal and disposal service. Local junk haulers provide safe, sanitary removal of old mattresses and box springs.',
    detailedContent: 'Mattress disposal in Arizona requires specialized handling for sanitary and environmental reasons. Our mattress removal services across Phoenix and Scottsdale provide same-day pickup with proper recycling of all components. Arizona\'s climate means mattresses can harbor allergens and dust, making professional removal essential for Tempe and Mesa residents upgrading their sleep systems. We work with certified mattress recycling facilities that recover steel springs, foam padding, and fabric materials rather than sending them to landfills. Whether you\'re furnishing a new home in Chandler, clearing out guest rooms in Gilbert, or managing rental properties in Glendale, our teams handle mattresses and box springs with sanitary care. Peoria homeowners trust us for discrete, efficient service that leaves their homes clean and clutter-free.',
    whyChooseLocal: [
      'Same-day mattress pickup available throughout Phoenix and Scottsdale areas',
      'Partnership with Arizona mattress recycling facilities in Tempe and Mesa',
      'Sanitary handling protocols protect homes in Chandler and Gilbert',
      'No hidden fees or surprise charges for Glendale residents',
      'Support local Peoria businesses committed to environmental responsibility'
    ],
    tips: [
      'Wrap mattress in plastic for easier transport',
      'Check local recycling programs',
      'Remove all bedding and linens',
      'Measure stairways if on upper floors'
    ],
    relatedItems: ['box-spring', 'bed-frame', 'futon', 'sofa']
  },
  'hot-tub': {
    title: 'Hot Tub Removal',
    description: 'Professional hot tub removal and disposal service. Our local junk haulers have the experience and tools to safely remove hot tubs of all sizes.',
    detailedContent: 'Hot tub removal in Arizona requires specialized equipment, electrical expertise, and careful planning. Our teams serving Phoenix and Scottsdale handle everything from small portable spas to large built-in hot tubs with professional precision. Arizona\'s dry climate often leads to hot tub maintenance challenges, and many Tempe and Mesa homeowners eventually need removal services. We coordinate electrical disconnection with licensed technicians, drain units completely, and use industrial equipment to navigate tight side yards common in Chandler and Gilbert homes. Our crews understand the unique landscaping challenges of desert properties, protecting xeriscaping and pavers during removal. Whether you\'re reclaiming backyard space in Glendale or preparing a property for sale in Peoria, we handle complete hot tub demolition and haul-away, leaving your yard clean and ready for new possibilities.',
    whyChooseLocal: [
      'Specialized heavy-lifting equipment available in Phoenix and Scottsdale',
      'Licensed electrician partnerships for safe disconnection in Tempe and Mesa',
      'Understanding of Arizona property layouts and landscaping in Chandler and Gilbert',
      'Yard restoration services available for Glendale area properties',
      'Competitive rates for complex removals throughout Peoria and surrounding areas'
    ],
    tips: [
      'Drain the hot tub completely before removal',
      'Disconnect electrical and turn off breaker',
      'Clear a path for removal',
      'Consider if it can be moved in pieces',
      'Check if permits are needed for removal'
    ],
    relatedItems: ['pool-table', 'piano', 'deck', 'shed']
  },
  'piano': {
    title: 'Piano Removal',
    description: 'Expert piano removal service from local professionals. Our vetted local haulers have the experience and equipment to safely remove upright and grand pianos.',
    detailedContent: 'Piano removal demands specialized expertise and equipment to protect these valuable instruments and your Arizona home. Our piano removal specialists across Phoenix and Scottsdale handle uprights, baby grands, and full concert grands with professional care honed over years of experience. Whether you\'re downsizing in Tempe, clearing an estate in Mesa, or making room for home renovations in Chandler, we understand both the physical and emotional weight of parting with a piano. Our teams use specialized dollies and padding to navigate the tight doorways and staircases common in Gilbert and Glendale homes without damage. We partner with music schools and charities throughout Arizona to find new homes for playable pianos, while ensuring responsible disposal of instruments beyond repair. Peoria residents trust our careful, respectful approach to handling these cherished family heirlooms.',
    whyChooseLocal: [
      'Specialized piano moving equipment and techniques used throughout Phoenix and Scottsdale',
      'Decades of combined experience with delicate, heavy items in Tempe and Mesa',
      'Full insurance coverage protects your property in Chandler and Gilbert',
      'Donation coordination with local music programs in Glendale area',
      'Significantly lower costs than national moving services for Peoria residents'
    ],
    tips: [
      'Measure all doorways and stairways',
      'Remove the piano lid if possible',
      'Consider donation if piano is in good condition',
      'Clear a path from piano to exit',
      'Protect floors with cardboard or blankets'
    ],
    relatedItems: ['organ', 'pool-table', 'hot-tub', 'safe']
  },
  'washing-machine': {
    title: 'Washing Machine Removal',
    description: 'Quick and affordable washing machine removal service. Local junk haulers will disconnect, remove, and properly dispose of your old washing machine.',
    detailedContent: 'Washing machine removal throughout Arizona requires proper disconnection and eco-friendly disposal practices. Our appliance removal teams in Phoenix and Scottsdale provide same-day service for homeowners upgrading to high-efficiency models or clearing out broken units. Arizona\'s hard water can shorten appliance lifespan, making professional removal services essential for Tempe and Mesa residents. We handle the complete disconnection process, including water lines and drain hoses, preventing potential flooding and water damage. Our partnerships with metal recycling facilities in Chandler and Gilbert ensure that steel drums, motors, and electronic components are recovered rather than landfilled. Whether you\'re renovating laundry rooms in Glendale or managing rental property turnovers in Peoria, our teams provide efficient removal with no mess left behind.',
    whyChooseLocal: [
      'Fast same-day service available throughout Phoenix and Scottsdale areas',
      'Proper water line disconnection prevents damage in Tempe and Mesa homes',
      'Metal recycling partnerships maximize material recovery in Chandler and Gilbert',
      'Transparent pricing with no hidden fees for Glendale residents',
      'Support your Peoria community with local, independent service'
    ],
    tips: [
      'Turn off water supply and disconnect hoses',
      'Unplug from electrical outlet',
      'Drain any remaining water',
      'Clean up any spills or leaks',
      'Measure doorways for smooth removal'
    ],
    relatedItems: ['dryer', 'dishwasher', 'refrigerator', 'water-heater']
  },
  'treadmill': {
    title: 'Treadmill Removal',
    description: 'Professional treadmill removal service from local haulers. Our vetted junk removal professionals have the tools and experience to safely remove treadmills from any location.',
    detailedContent: 'Treadmill removal in Arizona homes presents unique challenges due to weight, size, and placement in difficult locations. Our fitness equipment specialists serving Phoenix and Scottsdale excel at removing treadmills from basements, second-floor rooms, and tight home gyms without damage to your property. Many Tempe and Mesa residents purchase treadmills with good intentions, only to have them become expensive clothes hangers - we make removal stress-free and affordable. Our teams understand the disassembly process for popular treadmill brands and use professional equipment to navigate stairs safely. We partner with local gyms and community centers in Chandler and Gilbert to donate working equipment, while recycling metal and electronic components from non-functional units. Whether you\'re reclaiming space in Glendale or downsizing in Peoria, our efficient service gets the job done quickly.',
    whyChooseLocal: [
      'Professional equipment for safe removal from Phoenix and Scottsdale homes',
      'Expertise with basement and tight space removals common in Tempe and Mesa',
      'Significantly lower costs than franchise services for Chandler and Gilbert residents',
      'Donation partnerships with local fitness centers throughout Glendale',
      'Flexible scheduling accommodates your availability in Peoria and surrounding areas'
    ],
    tips: [
      'Fold treadmill if possible',
      'Unplug and secure power cord',
      'Clear path to exit door',
      'Measure stairways if on upper floor',
      'Remove any loose accessories'
    ],
    relatedItems: ['exercise-equipment', 'elliptical', 'weight-bench', 'stationary-bike']
  },
  'shed': {
    title: 'Shed Removal',
    description: 'Complete shed removal and demolition service. Our local junk haulers can dismantle and remove sheds completely, leaving your yard clean and ready.',
    detailedContent: 'Shed removal and demolition across Arizona requires understanding of local materials and construction methods adapted to desert conditions. Our demolition teams in Phoenix and Scottsdale handle wood, metal, and vinyl sheds of all sizes, from small storage units to large workshops. Arizona\'s intense sun often deteriorates shed materials over time, making removal necessary for Tempe and Mesa homeowners reclaiming yard space. We provide complete teardown and haul-away service, including concrete foundations when needed, and recycle usable lumber and metal components. Our crews understand the landscaping considerations unique to Chandler and Gilbert properties, protecting irrigation systems and desert plants during removal. Whether you\'re clearing space for a new pool in Glendale or preparing your Peoria property for sale, we leave your yard clean, level, and ready for its next chapter.',
    whyChooseLocal: [
      'Complete demolition and haul-away service throughout Phoenix and Scottsdale',
      'Understanding of Arizona construction methods used in Tempe and Mesa sheds',
      'Material recycling maximizes recovery in Chandler and Gilbert areas',
      'Protection of desert landscaping and irrigation systems in Glendale',
      'Competitive local pricing for Peoria residents without franchise markups'
    ],
    tips: [
      'Empty shed completely before removal',
      'Check if shed can be donated or sold',
      'Clear area around shed for equipment access',
      'Disconnect any electrical connections',
      'Mark underground utilities if present'
    ],
    relatedItems: ['deck', 'fence', 'playground', 'gazebo']
  }
};

// City links for creating hyperlinks
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
              color: '#166534',
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

// Generate additional common items with generic content
const generateGenericItem = (item: string) => {
  const formatted = item.replace(/-/g, ' ');
  const capitalized = formatted.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    title: `${capitalized} Removal`,
    description: `Professional ${formatted} removal service from local, vetted junk haulers. Our independent operators provide fast, affordable, and eco-friendly ${formatted} removal and disposal.`,
    detailedContent: `Arizona residents trust our local ${formatted} removal specialists for fast, professional service. Our experienced teams serving Phoenix, Scottsdale, Tempe, and Mesa provide same-day ${formatted} removal with competitive pricing. Whether you\'re in Chandler, Gilbert, Glendale, or Peoria, our vetted local haulers deliver the quality service you deserve without franchise fees.`,
    whyChooseLocal: [
      'Fast response times and flexible scheduling throughout Phoenix and Scottsdale',
      'Support local independent businesses in your Tempe and Mesa community',
      'Competitive pricing without franchise fees for Chandler and Gilbert residents',
      'Eco-friendly disposal and recycling partnerships in Glendale area',
      'Personal service from your trusted Peoria neighbors'
    ],
    tips: [
      'Clear a path for easy removal',
      'Remove any personal items or contents',
      'Take photos for your records',
      'Ask about recycling or donation options'
    ],
    relatedItems: []
  };
};

export default function ItemRemovalPage() {
  const [, params] = useRoute('/items/:item');
  const [zipCode, setZipCode] = useState('');
  const [location] = useLocation();
  
  const itemSlug = params?.item || '';
  const itemInfo = itemDetails[itemSlug] || generateGenericItem(itemSlug);
  
  // Scroll to top when page loads or item changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // Set page title and meta tags for SEO
  useEffect(() => {
    document.title = `${itemInfo.title} - Local Vetted Junk Haulers | BestJunkRemovalCompanies.com`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `${itemInfo.description} Find trusted local junk haulers for ${itemInfo.title.toLowerCase()} near you. No franchises - just vetted local pros.`);
    }
  }, [itemInfo.title, itemInfo.description]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim()) {
      window.location.href = `/?zip=${encodeURIComponent(zipCode.trim())}`;
    }
  };
  
  const handleBack = () => {
    window.history.back();
  };

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
          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 48px)',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0 0 16px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            {itemInfo.title}
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 20px)',
            color: '#666',
            lineHeight: '1.6',
            margin: '0 0 32px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            {itemInfo.description}
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

      {/* Detailed Content Section */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#fff',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0 0 24px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Professional {itemInfo.title} Service
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#444',
            lineHeight: '1.8',
            margin: 0,
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            {addCityLinks(itemInfo.detailedContent)}
          </p>
        </div>
      </section>

      {/* Why Choose Local */}
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
            Why Choose Local Haulers For {itemInfo.title}?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {itemInfo.whyChooseLocal.map((reason, index) => (
              <div
                key={index}
                style={{
                  padding: '24px',
                  backgroundColor: '#fff',
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
                  {addCityLinks(reason)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Helpful Tips */}
      <section style={{
        padding: '60px 16px',
        backgroundColor: '#fff',
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
            Helpful Tips
          </h2>
          
          <div style={{
            display: 'grid',
            gap: '16px',
          }}>
            {itemInfo.tips.map((tip, index) => (
              <div
                key={index}
                style={{
                  padding: '20px 24px',
                  backgroundColor: '#f8f8f8',
                  borderLeft: '4px solid #fbbf24',
                  borderRadius: '8px',
                }}
              >
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  color: '#333',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Items */}
      {itemInfo.relatedItems.length > 0 && (
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
              Related Removal Services
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
            }}>
              {itemInfo.relatedItems.map((relatedItem) => (
                <Link
                  key={relatedItem}
                  href={`/items/${relatedItem}`}
                  style={{
                    padding: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: '#166534',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}
                  data-testid={`link-related-${relatedItem}`}
                >
                  {relatedItem.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')} Removal
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cities Section - Interlinks */}
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
            margin: '0 0 16px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            {itemInfo.title} in Major Cities
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 18px)',
            color: '#666',
            textAlign: 'center',
            margin: '0 0 32px 0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Find trusted local haulers for {itemInfo.title.toLowerCase()} in your area
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {cityLinks.map((cityData, index) => (
              <a
                key={index}
                href={cityData.url}
                style={{
                  display: 'block',
                  padding: '20px',
                  backgroundColor: '#f8f8f8',
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
                  e.currentTarget.style.backgroundColor = '#f8f8f8';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                data-testid={`link-city-${cityData.name.toLowerCase()}`}
              >
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '4px',
                }}>
                  {cityData.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#666',
                }}>
                  Arizona
                </div>
              </a>
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
            Ready To Remove Your {itemInfo.title.replace(' Removal', '')}?
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
            data-testid="link-cta-home"
          >
            Find Local Haulers
          </Link>
        </div>
      </section>
    </div>
  );
}
