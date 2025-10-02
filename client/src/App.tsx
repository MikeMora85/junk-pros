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
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        padding: '16px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
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
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
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
              }}
            >
              <Plus size={16} />
              Add Business
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter your city or zip..."
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
              backgroundColor: 'rgba(255,255,255,0.95)',
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
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
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
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
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
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                }}
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
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }} data-testid="text-page-title">
            Scottsdale Junk Removal
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
            ⭐ {companies.length} verified pros
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
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      marginBottom: '12px',
                    }}>
                      ⭐ TOP RATED
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#fff',
                      flexShrink: 0,
                    }}>
                      {c.name.charAt(0)}
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
                              fill={i < Math.floor(parseFloat(c.rating)) ? "#fbbf24" : "none"}
                              stroke="#fbbf24"
                            />
                          ))}
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{c.rating}</span>
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>({c.reviews})</span>
                        {c.local && (
                          <span style={{
                            background: '#10b981',
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
                      
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                        <div style={{ marginBottom: '4px' }}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />{c.address}</div>
                        <div style={{ marginBottom: '4px' }}><Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />{c.phone}</div>
                      </div>
                      
                      <button 
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '700',
                          width: '100%',
                        }}
                        data-testid={`button-claim-${c.id}`}
                      >
                        📞 Get Free Quote
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right - Sidebar */}
          <div>
            <EstimateBuilderInline />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
