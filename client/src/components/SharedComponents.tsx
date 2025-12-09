import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function RotatingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const messages = [
    'All 50 States • Local Independent Companies Only • No Franchises',
    'Find Trusted Local Pros',
    'Same Day Service Available',
    'Licensed & Insured Professionals',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', height: '28px', overflow: 'hidden' }}>
      {messages.map((message, index) => (
        <p
          key={index}
          style={{
            color: '#000',
            fontSize: '24px',
            margin: '0',
            fontWeight: '600',
            position: 'absolute',
            width: '100%',
            top: '0',
            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
            transform: `translateY(${(index - currentIndex) * 100}%)`,
            opacity: index === currentIndex ? 1 : 0,
          }}
        >
          {message}
        </p>
      ))}
    </div>
  );
}

export function InteractiveFooter() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const allStates = [
    { name: 'Alabama', slug: 'alabama' },
    { name: 'Alaska', slug: 'alaska' },
    { name: 'Arizona', slug: 'arizona' },
    { name: 'Arkansas', slug: 'arkansas' },
    { name: 'California', slug: 'california' },
    { name: 'Colorado', slug: 'colorado' },
    { name: 'Connecticut', slug: 'connecticut' },
    { name: 'Delaware', slug: 'delaware' },
    { name: 'Florida', slug: 'florida' },
    { name: 'Georgia', slug: 'georgia' },
    { name: 'Hawaii', slug: 'hawaii' },
    { name: 'Idaho', slug: 'idaho' },
    { name: 'Illinois', slug: 'illinois' },
    { name: 'Indiana', slug: 'indiana' },
    { name: 'Iowa', slug: 'iowa' },
    { name: 'Kansas', slug: 'kansas' },
    { name: 'Kentucky', slug: 'kentucky' },
    { name: 'Louisiana', slug: 'louisiana' },
    { name: 'Maine', slug: 'maine' },
    { name: 'Maryland', slug: 'maryland' },
    { name: 'Massachusetts', slug: 'massachusetts' },
    { name: 'Michigan', slug: 'michigan' },
    { name: 'Minnesota', slug: 'minnesota' },
    { name: 'Mississippi', slug: 'mississippi' },
    { name: 'Missouri', slug: 'missouri' },
    { name: 'Montana', slug: 'montana' },
    { name: 'Nebraska', slug: 'nebraska' },
    { name: 'Nevada', slug: 'nevada' },
    { name: 'New Hampshire', slug: 'new-hampshire' },
    { name: 'New Jersey', slug: 'new-jersey' },
    { name: 'New Mexico', slug: 'new-mexico' },
    { name: 'New York', slug: 'new-york' },
    { name: 'North Carolina', slug: 'north-carolina' },
    { name: 'North Dakota', slug: 'north-dakota' },
    { name: 'Ohio', slug: 'ohio' },
    { name: 'Oklahoma', slug: 'oklahoma' },
    { name: 'Oregon', slug: 'oregon' },
    { name: 'Pennsylvania', slug: 'pennsylvania' },
    { name: 'Rhode Island', slug: 'rhode-island' },
    { name: 'South Carolina', slug: 'south-carolina' },
    { name: 'South Dakota', slug: 'south-dakota' },
    { name: 'Tennessee', slug: 'tennessee' },
    { name: 'Texas', slug: 'texas' },
    { name: 'Utah', slug: 'utah' },
    { name: 'Vermont', slug: 'vermont' },
    { name: 'Virginia', slug: 'virginia' },
    { name: 'Washington', slug: 'washington' },
    { name: 'West Virginia', slug: 'west-virginia' },
    { name: 'Wisconsin', slug: 'wisconsin' },
    { name: 'Wyoming', slug: 'wyoming' },
  ];

  const popularCities = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
    'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
    'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
    'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA',
    'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Boston, MA'
  ];

  const serviceCategories = [
    'Residential Junk Removal',
    'Commercial Junk Removal',
    'Construction Debris Removal',
    'Estate Cleanouts',
    'Foreclosure Cleanouts',
    'Garage Cleanouts',
    'Basement Cleanouts',
    'Attic Cleanouts',
    'Office Cleanouts',
    'Storage Unit Cleanouts',
    'Hoarding Cleanup',
    'Yard Waste Removal',
    'Hot Tub Removal',
    'Shed Demolition',
    'Deck Removal',
    'Fence Removal'
  ];

  const commonItems = [
    'Furniture Removal',
    'Appliance Removal',
    'Mattress Removal',
    'E-Waste Recycling',
    'TV Disposal',
    'Refrigerator Removal',
    'Couch Removal',
    'Washer & Dryer Removal',
    'Hot Tub Removal',
    'Piano Removal',
    'Treadmill Removal',
    'Carpet Removal',
    'Tire Disposal',
    'Yard Waste',
    'Construction Debris',
    'Office Equipment'
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer style={{
      backgroundColor: '#fbbf24',
      color: '#000',
      padding: '0',
      width: '100%',
      margin: 0,
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* Drop-Up Sections - Light Yellow Background */}
      {expandedSection && (
        <div style={{
          backgroundColor: '#fef3c7',
          borderTop: '3px solid #000',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '20px',
        }}>
          {expandedSection === 'areas' && (
            <div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                color: '#000',
              }}>
                Browse by State
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '8px',
              }}>
                {allStates.map(state => (
                  <a
                    key={state.slug}
                    href={`/${state.slug}`}
                    style={{
                      color: '#000',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      padding: '6px',
                      borderRadius: '4px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    data-testid={`link-footer-state-${state.slug}`}
                  >
                    {state.name}
                  </a>
                ))}
              </div>

              <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginTop: '24px',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                color: '#000',
              }}>
                Popular Cities
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '8px',
              }}>
                {popularCities.map(city => {
                  const [cityName, stateAbbr] = city.split(', ');
                  const stateName = allStates.find(s => s.name.startsWith(stateAbbr))?.slug || stateAbbr.toLowerCase();
                  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <a
                      key={city}
                      href={`/${stateName}/${citySlug}`}
                      style={{
                        color: '#000',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        padding: '6px',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      data-testid={`link-footer-city-${city.toLowerCase().replace(/[,\s]+/g, '-')}`}
                    >
                      {city}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {expandedSection === 'services' && (
            <div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                color: '#000',
              }}>
                Our Services
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '8px',
              }}>
                {serviceCategories.map(service => (
                  <a
                    key={service}
                    href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{
                      color: '#000',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      padding: '6px',
                      borderRadius: '4px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    data-testid={`link-footer-service-${service.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {service}
                  </a>
                ))}
              </div>
            </div>
          )}

          {expandedSection === 'items' && (
            <div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                color: '#000',
              }}>
                Items We Remove
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '8px',
              }}>
                {commonItems.map(item => (
                  <a
                    key={item}
                    href={`/items/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{
                      color: '#000',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      padding: '6px',
                      borderRadius: '4px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    data-testid={`link-footer-item-${item.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Footer Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
      }}>
        {/* Interactive Buttons - Subtle Footer Links */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <button
            onClick={() => toggleSection('areas')}
            style={{
              backgroundColor: 'transparent',
              color: '#000',
              border: 'none',
              padding: '0',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              transition: 'all 0.2s',
              textDecoration: expandedSection === 'areas' ? 'underline' : 'none',
              opacity: 0.8,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
            data-testid="button-footer-areas"
          >
            <span>Areas Served</span>
            <ChevronDown size={14} style={{ transform: expandedSection === 'areas' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          <button
            onClick={() => toggleSection('services')}
            style={{
              backgroundColor: 'transparent',
              color: '#000',
              border: 'none',
              padding: '0',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              transition: 'all 0.2s',
              textDecoration: expandedSection === 'services' ? 'underline' : 'none',
              opacity: 0.8,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
            data-testid="button-footer-services"
          >
            <span>Services</span>
            <ChevronDown size={14} style={{ transform: expandedSection === 'services' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          <button
            onClick={() => toggleSection('items')}
            style={{
              backgroundColor: 'transparent',
              color: '#000',
              border: 'none',
              padding: '0',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              transition: 'all 0.2s',
              textDecoration: expandedSection === 'items' ? 'underline' : 'none',
              opacity: 0.8,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
            data-testid="button-footer-items"
          >
            <span>Items We Remove</span>
            <ChevronDown size={14} style={{ transform: expandedSection === 'items' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Static Footer Info */}
        <div style={{
          borderTop: '2px solid #000',
          paddingTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '16px',
        }}>
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '8px',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              color: '#000',
            }}>
              About Us
            </h4>
            <p style={{
              fontSize: '13px',
              color: '#000',
              lineHeight: '1.4',
              margin: '0',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}>
              Connecting you with trusted local junk removal professionals across all 50 states. 
              No national franchises, just quality independent companies.
            </p>
          </div>

          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '8px',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              color: '#000',
            }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <a href="/" style={{
                color: '#000',
                textDecoration: 'none',
                fontSize: '13px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              data-testid="link-footer-home">
                Home
              </a>
              <a href="/add-business" style={{
                color: '#000',
                textDecoration: 'none',
                fontSize: '13px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              data-testid="link-footer-add-business">
                Add Your Business
              </a>
              <a href="/blog" style={{
                color: '#000',
                textDecoration: 'none',
                fontSize: '13px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              data-testid="link-footer-blog">
                Blog
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid #000',
          paddingTop: '10px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '12px',
            color: '#000',
            margin: '0',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            © {new Date().getFullYear()} Junk Removal Directory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function HamburgerMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        }}
        onClick={onClose}
        data-testid="menu-overlay"
      />

      {/* Side Menu */}
      <div
        className="hamburger-menu-panel"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '75%',
          maxWidth: '600px',
          backgroundColor: '#ffffff',
          zIndex: 10001,
          overflowY: 'auto',
          boxShadow: '4px 0 16px rgba(0,0,0,0.2)',
        }}
        data-testid="side-menu"
      >
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .hamburger-menu-panel {
              width: 37.5% !important;
              max-width: 300px !important;
            }
          }
        `}} />
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '2px solid #fbbf24',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: '#ffffff',
          zIndex: 10,
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#000', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>Menu</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
            data-testid="button-close-menu"
          >
            <X size={24} color="#000" />
          </button>
        </div>

        {/* Menu Content */}
        <div style={{ padding: '20px' }}>
          {/* Home */}
          <a
            href="/"
            style={{
              display: 'block',
              padding: '16px',
              color: '#000',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              borderBottom: '1px solid #e5e5e5',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
            data-testid="link-home"
          >
            Home
          </a>

          {/* Blog */}
          <a
            href="/blog"
            style={{
              display: 'block',
              padding: '16px',
              color: '#000',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              borderBottom: '1px solid #e5e5e5',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
            data-testid="link-blog"
          >
            Blog
          </a>

          {/* Add Your Business - CTA */}
          <a
            href="/add-business"
            style={{
              display: 'block',
              padding: '16px',
              color: '#000',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '700',
              borderBottom: '1px solid #e5e5e5',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              background: '#fbbf24',
              margin: '8px 0',
            }}
            data-testid="link-add-business"
          >
            Add Your Business
          </a>

          {/* Login/Profile/Logout */}
          {user ? (
            <>
              <Link
                href="/profile/edit"
                style={{
                  display: 'block',
                  padding: '16px',
                  color: '#000',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  borderBottom: '1px solid #e5e5e5',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
                data-testid="link-menu-profile"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'block',
                  padding: '16px',
                  color: '#000',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  borderBottom: '1px solid #e5e5e5',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  cursor: 'pointer',
                }}
                data-testid="button-menu-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              style={{
                display: 'block',
                padding: '16px',
                color: '#000',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '600',
                borderBottom: '1px solid #e5e5e5',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              data-testid="link-menu-login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
