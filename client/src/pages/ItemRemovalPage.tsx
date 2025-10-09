import { useRoute, Link } from 'wouter';
import { CheckCircle2, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const itemDetails: Record<string, {
  title: string;
  description: string;
  whyLocal: string[];
  tips: string[];
  relatedItems: string[];
}> = {
  'refrigerator': {
    title: 'Refrigerator Removal',
    description: 'Professional refrigerator removal service from local, vetted junk haulers. We safely disconnect, remove, and dispose of your old refrigerator following all environmental regulations. Our local haulers ensure proper recycling of refrigerants and materials.',
    whyLocal: [
      'Same-day or next-day service availability',
      'Proper refrigerant disposal following EPA guidelines',
      'Lower costs than national franchises',
      'Support your local community',
      'Flexible scheduling that works for you'
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
    description: 'Fast and affordable sofa removal from trusted local junk haulers. Whether you\'re upgrading your furniture or clearing out space, our vetted professionals will remove your old sofa quickly and responsibly. Many local haulers donate usable furniture to charities.',
    whyLocal: [
      'Quick response times and flexible scheduling',
      'Furniture donation options for usable pieces',
      'Careful removal to avoid damage to your home',
      'Competitive pricing from local businesses',
      'Personal service from your neighbors'
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
    description: 'Eco-friendly mattress removal and disposal service. Local junk haulers provide safe, sanitary removal of old mattresses and box springs. Most mattresses are recycled, with materials like steel, foam, and fabric being repurposed.',
    whyLocal: [
      'Same-day service often available',
      'Mattress recycling and eco-friendly disposal',
      'No hidden fees or surprise charges',
      'Support local small businesses',
      'Proper sanitary handling'
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
    description: 'Professional hot tub removal and disposal service. Removing a hot tub requires expertise, equipment, and proper disposal methods. Our local junk haulers have the experience and tools to safely remove hot tubs of all sizes, including disconnecting electrical and plumbing.',
    whyLocal: [
      'Specialized equipment for heavy lifting',
      'Licensed and insured professionals',
      'Electrical and plumbing disconnect services',
      'Yard restoration options available',
      'Competitive rates for complex removals'
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
    description: 'Expert piano removal service from local professionals. Pianos are heavy, valuable, and require special care during removal. Our vetted local haulers have the experience and equipment to safely remove upright and grand pianos without damaging your home.',
    whyLocal: [
      'Specialized piano moving equipment',
      'Experience with delicate, heavy items',
      'Insurance coverage for your protection',
      'Donation options for working pianos',
      'Lower costs than national services'
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
    description: 'Quick and affordable washing machine removal service. Local junk haulers will disconnect, remove, and properly dispose of your old washing machine. We ensure eco-friendly recycling of metal components and proper handling of any residual water.',
    whyLocal: [
      'Fast, same-day service often available',
      'Proper water line disconnection',
      'Appliance recycling and metal recovery',
      'No hidden fees or extra charges',
      'Support your local community'
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
    description: 'Professional treadmill removal service from local haulers. Treadmills are heavy and awkward to move. Our vetted junk removal professionals have the tools and experience to safely remove treadmills from any location in your home, including basements and upper floors.',
    whyLocal: [
      'Equipment for moving heavy fitness equipment',
      'Experience with basement and tight space removals',
      'Lower costs than franchise services',
      'Donation options for working equipment',
      'Flexible scheduling'
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
    description: 'Complete shed removal and demolition service. Whether your shed is wood, metal, or plastic, our local junk haulers can dismantle and remove it completely. We handle everything from small storage sheds to large workshops, leaving your yard clean and ready.',
    whyLocal: [
      'Complete demolition and haul-away service',
      'Yard cleanup and debris removal',
      'Recycling of usable materials',
      'Flexible scheduling around your needs',
      'Competitive pricing from local pros'
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

// Generate additional common items with generic content
const generateGenericItem = (item: string) => {
  const formatted = item.replace(/-/g, ' ');
  const capitalized = formatted.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  return {
    title: `${capitalized} Removal`,
    description: `Professional ${formatted} removal service from local, vetted junk haulers. Our independent operators provide fast, affordable, and eco-friendly ${formatted} removal and disposal. Get same-day service from trusted local professionals who care about your community.`,
    whyLocal: [
      'Fast response times and flexible scheduling',
      'Support local independent businesses',
      'Competitive pricing without franchise fees',
      'Eco-friendly disposal and recycling',
      'Personal service from your neighbors'
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
  
  const itemSlug = params?.item || '';
  const itemInfo = itemDetails[itemSlug] || generateGenericItem(itemSlug);
  
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>

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

      {/* Why Choose Local */}
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
            Why Choose Local Haulers For {itemInfo.title}?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {itemInfo.whyLocal.map((reason, index) => (
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
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Helpful Tips */}
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
                  backgroundColor: '#fff',
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
                    backgroundColor: '#f8f8f8',
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
            data-testid="button-find-haulers-cta"
          >
            Find Local Haulers
          </Link>
        </div>
      </section>
    </div>
  );
}
