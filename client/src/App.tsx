import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe, Star, Sparkles, Plus, X } from "lucide-react";
import type { Company } from "@shared/schema";
import EstimateBuilderInline from "./components/EstimateBuilderInline";

function App() {
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies?local=true"],
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <nav style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #fff 0%, #d1fae5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }} data-testid="header-title">
            <Sparkles size={24} color="#fbbf24" fill="#fbbf24" />
            Junk Removal Pros
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            <input
              type="text"
              placeholder="Enter your city or zip..."
              style={{
                flex: '1',
                maxWidth: '300px',
                minWidth: '150px',
                padding: '12px 18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                fontSize: '15px',
                outline: 'none',
                backgroundColor: 'rgba(255,255,255,0.95)',
                transition: 'all 0.2s',
              }}
              data-testid="input-search-location"
              onFocus={(e) => {
                e.target.style.borderColor = '#fbbf24';
                e.target.style.boxShadow = '0 0 0 3px rgba(251,191,36,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={() => setShowBusinessForm(true)}
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#fff',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(251,191,36,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(251,191,36,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(251,191,36,0.3)';
              }}
            >
              <Plus size={18} />
              Add Business
            </button>
          </div>
        </nav>
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
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              padding: '24px',
              borderRadius: '20px 20px 0 0',
              position: 'relative',
            }}>
              <button
                onClick={() => setShowBusinessForm(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              >
                <X size={20} color="#fff" />
              </button>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#fff',
                margin: '0 0 8px 0',
              }}>
                🚀 Add Your Business
              </h2>
              <p style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.9)',
                margin: 0,
              }}>
                Get more customers by listing your junk removal service
              </p>
            </div>
            
            <form style={{ padding: '28px' }} onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you! We will review your submission and contact you within 24 hours.');
              setShowBusinessForm(false);
            }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Quick Junk Removal LLC"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Service Area (City, State) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Scottsdale, AZ"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Website (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://yourwebsite.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10b981'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(5,150,105,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,150,105,0.3)';
                }}
              >
                ✨ Submit for Review
              </button>

              <p style={{
                fontSize: '13px',
                color: '#6b7280',
                textAlign: 'center',
                marginTop: '16px',
                marginBottom: 0,
              }}>
                We'll review your submission within 24 hours
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 380px)',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Left Column - Company Listings */}
          <section style={{ minWidth: 0 }}>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: '0 0 8px 0',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }} data-testid="text-page-title">
                Top Junk Removal in Scottsdale
              </h2>
              <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
                ⭐ {companies.length} highly rated pros • All verified & insured
              </p>
            </div>
            
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }} data-testid="text-loading">
                Loading companies...
              </div>
            ) : (
              companies.map((c, index) => (
                <div 
                  key={c.id} 
                  style={{
                    backgroundColor: '#fff',
                    border: '2px solid transparent',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '20px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(5,150,105,0.15)';
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  data-testid={`card-company-${c.id}`}
                >
                  {index === 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      boxShadow: '0 2px 8px rgba(251,191,36,0.3)',
                    }}>
                      ⭐ TOP RATED
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                    }}>
                      {c.name.charAt(0)}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        margin: '0 0 10px 0',
                        color: '#111827',
                        wordBreak: 'break-word',
                      }} data-testid={`text-company-name-${c.id}`}>
                        {c.name}
                      </h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < Math.floor(parseFloat(c.rating)) ? "#fbbf24" : "none"}
                              stroke="#fbbf24"
                            />
                          ))}
                        </div>
                        <span style={{ fontWeight: '700', color: '#111827', fontSize: '15px' }}>{c.rating}</span>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>({c.reviews} reviews)</span>
                        {c.local && (
                          <span style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                          }}>
                            ✓ LOCAL
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                          <MapPin size={16} color="#10b981" />
                          <span style={{ wordBreak: 'break-word' }}>{c.address}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                          <Phone size={16} color="#10b981" />
                          <span>{c.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                          <Globe size={16} color="#3b82f6" />
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}
                            data-testid={`link-website-${c.id}`}
                          >
                            Visit website →
                          </a>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button 
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '700',
                            boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(5,150,105,0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(5,150,105,0.3)';
                          }}
                          data-testid={`button-claim-${c.id}`}
                        >
                          📞 Get Free Quote
                        </button>
                        <button 
                          style={{
                            backgroundColor: '#fff',
                            color: '#374151',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            border: '2px solid #e5e7eb',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#10b981';
                            e.currentTarget.style.color = '#10b981';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.color = '#374151';
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Right Column - Sidebar */}
          <aside style={{
            position: 'sticky',
            top: '100px',
            minWidth: 0,
          }}>
            <EstimateBuilderInline />

            <div style={{
              background: 'linear-gradient(135deg, #fff 0%, #f0fdf4 100%)',
              border: '2px solid #10b981',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(5,150,105,0.15)',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: '0 0 16px 0',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                💡 Popular Articles
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  '5 Questions Before Hiring',
                  'Save Money on Junk Removal',
                  'Dumpster vs Junk Removal'
                ].map((article, i) => (
                  <li key={i} style={{
                    padding: '12px 0',
                    borderBottom: i < 2 ? '1px solid #d1fae5' : 'none',
                  }}>
                    <a href="#" style={{
                      fontSize: '14px',
                      color: '#374151',
                      textDecoration: 'none',
                      display: 'block',
                      fontWeight: '500',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#10b981'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                    >
                      {article} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;
