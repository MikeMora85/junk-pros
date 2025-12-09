import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useSEO, buildLandingPageSEO, buildOrganizationSchema } from "../lib/seo";
import { HamburgerMenu, RotatingBanner, InteractiveFooter } from "../components/SharedComponents";
import { Search, Menu, UserCircle } from "lucide-react";
import EstimateBuilderInline from "../components/EstimateBuilderInline";
import heroTruck from "@assets/D7C214E3-66B6-4E91-AC55-328BC4C0447C_1763365748045.png";

const stateNames: Record<string, string> = {
  'alabama': 'Alabama', 'alaska': 'Alaska', 'arizona': 'Arizona', 'arkansas': 'Arkansas',
  'california': 'California', 'colorado': 'Colorado', 'connecticut': 'Connecticut', 'delaware': 'Delaware',
  'florida': 'Florida', 'georgia': 'Georgia', 'hawaii': 'Hawaii', 'idaho': 'Idaho',
  'illinois': 'Illinois', 'indiana': 'Indiana', 'iowa': 'Iowa', 'kansas': 'Kansas',
  'kentucky': 'Kentucky', 'louisiana': 'Louisiana', 'maine': 'Maine', 'maryland': 'Maryland',
  'massachusetts': 'Massachusetts', 'michigan': 'Michigan', 'minnesota': 'Minnesota', 'mississippi': 'Mississippi',
  'missouri': 'Missouri', 'montana': 'Montana', 'nebraska': 'Nebraska', 'nevada': 'Nevada',
  'new-hampshire': 'New Hampshire', 'new-jersey': 'New Jersey', 'new-mexico': 'New Mexico', 'new-york': 'New York',
  'north-carolina': 'North Carolina', 'north-dakota': 'North Dakota', 'ohio': 'Ohio', 'oklahoma': 'Oklahoma',
  'oregon': 'Oregon', 'pennsylvania': 'Pennsylvania', 'rhode-island': 'Rhode Island', 'south-carolina': 'South Carolina',
  'south-dakota': 'South Dakota', 'tennessee': 'Tennessee', 'texas': 'Texas', 'utah': 'Utah',
  'vermont': 'Vermont', 'virginia': 'Virginia', 'washington': 'Washington', 'west-virginia': 'West Virginia',
  'wisconsin': 'Wisconsin', 'wyoming': 'Wyoming',
};

function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useSEO(buildLandingPageSEO());

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.trim().toLowerCase();
    const slug = query.replace(/\s+/g, '-');
    
    const isState = Object.keys(stateNames).includes(slug) || 
                    Object.values(stateNames).map(s => s.toLowerCase()).includes(query);
    
    if (isState) {
      const stateSlug = Object.keys(stateNames).find(key => 
        key === slug || stateNames[key].toLowerCase() === query
      );
      window.location.href = `/${stateSlug}`;
    } else {
      try {
        const response = await fetch(`/api/search-city?city=${encodeURIComponent(query)}`);
        const result = await response.json();
        
        if (result.state) {
          window.location.href = `/${result.state}/${slug}`;
        } else {
          window.location.href = `/arizona/${slug}`;
        }
      } catch (error) {
        window.location.href = `/arizona/${slug}`;
      }
    }
  };

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
      />
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <div style={{
        background: '#ffffff',
      }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(251, 191, 36, 0.15)',
        backdropFilter: 'blur(10px)',
        padding: '8px 16px',
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .homepage-header-buttons {
              max-width: 1400px !important;
            }
          }
        `}} />
      <div className="homepage-header-buttons" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '12px',
      }}>
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            backgroundColor: '#fbbf24',
            color: '#000',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
          data-testid="button-menu"
        >
          <Menu size={24} color="#000" />
        </button>
        
        {isAuthenticated && !!user && (
          <button
            onClick={() => {
              if ((user as { isAdmin?: boolean })?.isAdmin) {
                window.location.href = '/admin';
              } else {
                window.location.href = '/profile/edit';
              }
            }}
            style={{
              backgroundColor: 'transparent',
              color: '#000',
              padding: '0',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            data-testid="button-profile"
          >
            <UserCircle size={28} />
          </button>
        )}
      </div>
      </div>

      <div className="homepage-content" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 30px 20px',
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .homepage-content {
              max-width: 1400px !important;
              padding: 0 40px 30px 40px !important;
            }
            
            .state-grid {
              grid-template-columns: repeat(4, 1fr) !important;
              max-width: 100% !important;
              gap: 16px !important;
            }
            
            .homepage-hero h2 {
              font-size: 48px !important;
            }
            
            .homepage-hero p {
              font-size: 24px !important;
            }
          }
        `}} />
        <div className="homepage-hero" style={{
          textAlign: 'center',
          marginBottom: '48px',
          marginTop: '60px',
        }}>
          <div className="hero-image-container" style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginBottom: '0',
          }}>
            <style dangerouslySetInnerHTML={{__html: `
              @media (min-width: 1024px) {
                .hero-image-container img {
                  max-height: 400px !important;
                  width: auto !important;
                  margin: 0 auto !important;
                }
                .hero-image-container {
                  display: flex !important;
                  justify-content: center !important;
                  width: 100% !important;
                  margin-left: 0 !important;
                }
              }
            `}} />
            <img 
              src={heroTruck} 
              alt="Junk removal truck with US map" 
              loading="eager"
              fetchPriority="high"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
          
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0 0 16px 0',
            letterSpacing: '-0.02em',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Search By City
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            margin: '0 0 24px 0',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            No National Franchises, Local Junk Pros Closest to You.
          </p>

          <form onSubmit={handleSearch} style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            gap: '6px',
            backgroundColor: '#fff',
            padding: '5px',
            borderRadius: '10px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
            border: '2px solid transparent',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '2px solid #fbbf24';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '2px solid transparent';
          }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your city"
              style={{
                flex: 1,
                minWidth: '0',
                width: '1px',
                padding: '10px 8px',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                borderRadius: '8px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                backgroundColor: 'transparent',
                WebkitTextSizeAdjust: '100%',
                touchAction: 'manipulation',
              }}
              data-testid="input-homepage-search"
            />
            <button
              type="submit"
              style={{
                padding: '10px 14px',
                background: '#fbbf24',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              data-testid="button-homepage-search"
            >
              <Search size={18} />
            </button>
          </form>
          
          <div style={{
            marginTop: '24px',
            textAlign: 'center',
          }}>
            <RotatingBanner />
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .feature-card {
            padding: 20px 28px !important;
          }
          .feature-cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
          }
          @media (max-width: 640px) {
            .feature-card {
              padding: 20px 24px !important;
            }
            .feature-cards-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}} />
        <div className="feature-cards-grid" style={{
          marginTop: '48px',
          marginBottom: '60px',
        }}>
          {[
            {
              title: 'Local & Independent',
              description: 'Only locally-owned companies based in your city - no franchises',
            },
            {
              title: 'Instant Quotes',
              description: 'Get free estimates from multiple local companies in minutes',
            },
            {
              title: 'Your Neighborhood Crew',
              description: 'Support independent businesses located right in your community',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="feature-card"
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 5px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
            >
              <h4 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#374151',
                margin: '0 0 8px 0',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                {feature.title}
              </h4>
              <p style={{
                fontSize: '15px',
                color: '#6b7280',
                margin: '0',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 900px) {
            .calculator-right-column-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}} />
        <div className="calculator-right-column-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '30px',
          marginBottom: '60px',
        }}>
          <div>
            <EstimateBuilderInline />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
              transform: 'translateY(-1px)',
            }}>
            <h3 style={{
              fontSize: '19px',
              fontWeight: '700',
              margin: 0,
              marginBottom: '16px',
              color: '#1a1a1a',
              letterSpacing: '-0.01em',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              textAlign: 'center',
            }}>
              How It Works
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>1</div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', margin: 0, color: '#1a1a1a' }}>Search Your City</h4>
                  <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: 0 }}>
                    Enter your city name to discover independent junk removal companies serving your area.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>2</div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', margin: 0, color: '#1a1a1a' }}>Compare Companies</h4>
                  <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: 0 }}>
                    Browse detailed profiles, read reviews, check pricing, and compare services from local haulers.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  backgroundColor: '#fbbf24',
                  color: '#000',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  flexShrink: 0,
                }}>3</div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', margin: 0, color: '#1a1a1a' }}>Connect Directly</h4>
                  <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: 0 }}>
                    Call or email the company directly. No middleman, no service fees—just local service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: '19px',
              fontWeight: '700',
              margin: 0,
              marginBottom: '20px',
              color: '#1a1a1a',
              letterSpacing: '-0.01em',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              textAlign: 'center',
            }}>
              Popular Cities
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
            }}>
              {[
                { city: 'New York', stateSlug: 'ny' },
                { city: 'Los Angeles', stateSlug: 'ca' },
                { city: 'Chicago', stateSlug: 'il' },
                { city: 'Houston', stateSlug: 'tx' },
                { city: 'Phoenix', stateSlug: 'az' },
                { city: 'Philadelphia', stateSlug: 'pa' },
                { city: 'San Antonio', stateSlug: 'tx' },
                { city: 'San Diego', stateSlug: 'ca' },
                { city: 'Dallas', stateSlug: 'tx' },
                { city: 'San Jose', stateSlug: 'ca' },
                { city: 'Austin', stateSlug: 'tx' },
                { city: 'Jacksonville', stateSlug: 'fl' },
                { city: 'Seattle', stateSlug: 'wa' },
                { city: 'Denver', stateSlug: 'co' },
                { city: 'Boston', stateSlug: 'ma' },
                { city: 'Portland', stateSlug: 'or' },
              ].map(({ city, stateSlug }) => (
                <a
                  key={city}
                  href={`/${stateSlug}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '16px',
                    textDecoration: 'none',
                    color: '#1a1a1a',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
                    transform: 'translateY(-1px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 5px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  data-testid={`link-city-${city.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    textAlign: 'center',
                    margin: 0,
                  }}>{city}</h4>
                </a>
              ))}
            </div>
          </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .why-choose-grid {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          @media (min-width: 768px) {
            .why-choose-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}} />
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
          transform: 'translateY(-1px)',
          marginBottom: '60px',
        }}>
          <h3 style={{
            fontSize: '19px',
            fontWeight: '700',
            margin: 0,
            marginBottom: '16px',
            color: '#1a1a1a',
            letterSpacing: '-0.01em',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            textAlign: 'center',
          }}>
            Why Choose Independent Junk Removal Companies
          </h3>
          <div className="why-choose-grid">
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ color: '#fbbf24', fontSize: '18px', lineHeight: '1', fontWeight: '700', flexShrink: 0 }}>✓</div>
              <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: 0 }}>
                <strong>Better Pricing</strong> — Independent companies don't pay franchise fees, which means lower prices for you
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ color: '#fbbf24', fontSize: '18px', lineHeight: '1', fontWeight: '700', flexShrink: 0 }}>✓</div>
              <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: 0 }}>
                <strong>Local Ownership</strong> — Talk directly to the owner who lives in your community and cares about reputation
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ color: '#fbbf24', fontSize: '18px', lineHeight: '1', fontWeight: '700', flexShrink: 0 }}>✓</div>
              <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: 0 }}>
                <strong>Flexible Service</strong> — Get personalized solutions and flexible scheduling that big franchises can't offer
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ color: '#fbbf24', fontSize: '18px', lineHeight: '1', fontWeight: '700', flexShrink: 0 }}>✓</div>
              <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: 0 }}>
                <strong>Support Your Community</strong> — Keep your money local and support small business owners in your area
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ color: '#fbbf24', fontSize: '18px', lineHeight: '1', fontWeight: '700', flexShrink: 0 }}>✓</div>
              <p style={{ fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: 0 }}>
                <strong>No Platform Fees</strong> — Contact companies directly without paying middleman booking fees or commissions
              </p>
            </div>
          </div>
        </div>

      </div>
      </div>
      
      <InteractiveFooter />
    </div>
  );
}

export default LandingPage;
