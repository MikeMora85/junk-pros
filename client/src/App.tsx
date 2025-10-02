import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe, Star, Sparkles, Plus, X, Camera, Calendar } from "lucide-react";
import type { Company } from "@shared/schema";
import EstimateBuilderInline from "./components/EstimateBuilderInline";

function App() {
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null);
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies?local=true"],
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5f3ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        padding: '16px',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#fff',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }} data-testid="header-title">
              <Sparkles size={20} color="#fbbf24" fill="#fbbf24" />
              Junk Removal Pros
            </h1>
            <button
              onClick={() => setShowBusinessForm(true)}
              style={{
                background: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(244,114,182,0.4)',
              }}
              data-testid="button-add-business"
            >
              <Plus size={16} />
              Add Business
            </button>
          </div>
          <input
            type="text"
            placeholder="City or zip..."
            style={{
              width: '100%',
              maxWidth: '100%',
              padding: '12px 16px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxSizing: 'border-box',
            }}
            data-testid="input-search-location"
          />
        </div>
      </header>

      {/* Business Form Modal */}
      {showBusinessForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px',
        }} onClick={() => setShowBusinessForm(false)}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              padding: '20px',
              borderRadius: '16px 16px 0 0',
              position: 'relative',
            }}>
              <button
                onClick={() => setShowBusinessForm(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                data-testid="button-close-form"
              >
                <X size={18} color="#fff" />
              </button>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: '#fff',
                margin: '0 0 8px 0',
              }}>
                Add Your Business
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
              }}>
                Get more customers by listing your service
              </p>
            </div>
            
            <form style={{ padding: '24px' }} onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you! We will review your submission within 24 hours.');
              setShowBusinessForm(false);
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Quick Junk Removal LLC"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                  data-testid="input-business-name"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                  data-testid="input-business-email"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                  data-testid="input-business-phone"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  City, State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Scottsdale, AZ"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                  data-testid="input-business-location"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Logo URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com/logo.png"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '15px',
                  }}
                  data-testid="input-business-logo"
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                  Provide a link to your company logo for better visibility
                </p>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  color: '#fff',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                }}
                data-testid="button-submit-business"
              >
                Submit for Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 16px',
      }}>
        {/* Page Title */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }} data-testid="text-page-title">
            Scottsdale Junk Removal
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
            {companies.length} verified pros
          </p>
        </div>

        {/* Two Column Layout - Stacks on Mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {/* Left - Company Listings */}
          <div style={{ gridColumn: 'span 2' }}>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }} data-testid="text-loading">
                Loading...
              </div>
            ) : (
              companies.map((c, index) => (
                <div 
                  key={c.id}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                  data-testid={`card-company-${c.id}`}
                >
                  {index === 0 && (
                    <div style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      marginBottom: '12px',
                      boxShadow: '0 2px 8px rgba(244,114,182,0.3)',
                    }}>
                      TOP RATED
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      background: c.logoUrl ? '#fff' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: c.logoUrl ? 'none' : '0 4px 12px rgba(168,85,247,0.3)',
                      padding: c.logoUrl ? '4px' : '0',
                      border: c.logoUrl ? '2px solid #f3e8ff' : 'none',
                      overflow: 'hidden',
                    }}>
                      {c.logoUrl ? (
                        <img
                          src={c.logoUrl}
                          alt={`${c.name} logo`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                              parent.style.boxShadow = '0 4px 12px rgba(168,85,247,0.3)';
                              parent.style.border = 'none';
                              parent.style.padding = '0';
                              parent.textContent = c.name.charAt(0);
                            }
                          }}
                        />
                      ) : (
                        c.name.charAt(0)
                      )}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        margin: '0 0 8px 0',
                        color: '#111827',
                      }} data-testid={`text-company-name-${c.id}`}>
                        {c.name}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < Math.floor(parseFloat(c.rating)) ? "#f472b6" : "none"}
                              stroke="#f472b6"
                            />
                          ))}
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{c.rating}</span>
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>({c.reviews})</span>
                        {c.local && (
                          <span style={{
                            background: '#a855f7',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}>
                            LOCAL
                          </span>
                        )}
                      </div>
                      
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        <div style={{ marginBottom: '4px' }}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />{c.address}</div>
                        <div><Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />{c.phone}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Call Now Button */}
                  <button 
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '700',
                      width: '100%',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
                    }}
                    onClick={() => window.open(`tel:${c.phone}`, '_self')}
                    data-testid={`button-call-${c.id}`}
                  >
                    <Phone size={18} />
                    Call Now
                  </button>

                  {/* Quote Section */}
                  <div style={{
                    backgroundColor: '#fdf4ff',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '2px solid #f3e8ff',
                  }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      margin: '0 0 12px 0',
                      color: '#374151',
                    }}>
                      Get a Quote
                    </h4>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        style={{
                          flex: '1',
                          minWidth: '140px',
                          backgroundColor: '#fff',
                          color: '#374151',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                        onClick={() => alert('Photo upload feature coming soon!')}
                        data-testid={`button-send-photos-${c.id}`}
                      >
                        <Camera size={16} />
                        Send Photos
                      </button>
                      
                      <button
                        style={{
                          flex: '1',
                          minWidth: '140px',
                          background: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
                          color: '#fff',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(244,114,182,0.3)',
                        }}
                        onClick={() => {
                          setExpandedQuote(expandedQuote === c.id ? null : c.id);
                        }}
                        data-testid={`button-in-person-${c.id}`}
                      >
                        <Calendar size={16} />
                        In Person Estimate
                      </button>
                    </div>

                    {/* Calendar/Availability Section */}
                    {expandedQuote === c.id && (
                      <div style={{
                        marginTop: '16px',
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '2px solid #a855f7',
                      }}>
                        <h5 style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          margin: '0 0 12px 0',
                          color: '#a855f7',
                        }}>
                          Available Times
                        </h5>
                        
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {['Today 2:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 3:00 PM', 'Friday 9:00 AM'].map((time, i) => (
                            <button
                              key={i}
                              style={{
                                padding: '10px 16px',
                                backgroundColor: '#fdf4ff',
                                border: '2px solid #f3e8ff',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#a855f7',
                                textAlign: 'left',
                              }}
                              onClick={() => alert(`Appointment scheduled for ${time}`)}
                              data-testid={`button-time-slot-${c.id}-${i}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right - Sidebar */}
          <div>
            <EstimateBuilderInline />
            
            {/* JunkIQ Ad */}
            <div style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
              color: '#fff',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 12px 0' }}>
                JunkIQ - Smart Pricing
              </h3>
              <p style={{ fontSize: '14px', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                Get instant, accurate pricing with AI-powered load estimation. No surprises, just fair prices.
              </p>
              <button style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#a855f7',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '700',
              }}>
                Try JunkIQ Now
              </button>
            </div>

            {/* Dumpster Rental Ad */}
            <div style={{
              backgroundColor: '#fff',
              border: '2px solid #f3e8ff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                margin: '0 0 12px 0',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Need a Dumpster?
              </h3>
              <p style={{ fontSize: '14px', margin: '0 0 16px 0', lineHeight: '1.5', color: '#6b7280' }}>
                For bigger projects, rent a dumpster. Sizes from 10-40 yards. Starting at $299/week.
              </p>
              <button style={{
                width: '100%',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                color: '#fff',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '700',
              }}>
                Get Dumpster Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
