import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MapPin, Phone, Star, Plus, X, Camera, Calendar } from "lucide-react";
import type { Company } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import EstimateBuilderInline from "./components/EstimateBuilderInline";
import img1 from "@assets/stock_images/junk_removal_truck_s_8d89f5e0.jpg";
import img2 from "@assets/stock_images/junk_removal_truck_s_08e95c57.jpg";
import img3 from "@assets/stock_images/junk_removal_truck_s_6100f5f9.jpg";
import img4 from "@assets/stock_images/junk_removal_truck_s_20fde47d.jpg";
import img5 from "@assets/stock_images/junk_removal_truck_s_8e2ece45.jpg";
import img6 from "@assets/stock_images/junk_removal_truck_s_7e78a264.jpg";

const images = [img1, img2, img3, img4, img5, img6];

function App() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null);
  const [carouselOffsets, setCarouselOffsets] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  // Extract city and state from URL path like /arizona/scottsdale or default to Scottsdale
  const path = window.location.pathname;
  const pathMatch = path.match(/^\/([^/]+)\/([^/]+)/);
  const city = pathMatch ? pathMatch[2] : 'scottsdale';
  const state = pathMatch ? pathMatch[1] : 'arizona';
  
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies", { city, state }],
    queryFn: async () => {
      const response = await fetch(`/api/companies?city=${city}&state=${state}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const createCompanyMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies?local=true"] });
      setShowBusinessForm(false);
      alert('Success! Your business is now live on the directory.');
    },
    onError: () => {
      alert('Failed to submit business. Please try again.');
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselOffsets((prev) => {
        const next: Record<number, number> = {};
        companies.forEach((c) => {
          next[c.id] = ((prev[c.id] || 0) + 1) % images.length;
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [companies]);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <>
      {selectedCompany && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 2000,
          overflow: 'auto',
        }} onClick={() => setSelectedCompanyId(null)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CompanyDetailInline company={selectedCompany} onClose={() => setSelectedCompanyId(null)} />
          </div>
        </div>
      )}
    
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5f3ff 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      margin: '0',
      padding: '0',
      width: '100%',
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes breatheGlow {
          0%, 100% { box-shadow: 0 6px 20px rgba(0,0,0,0.2), 0 0 15px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 8px 30px rgba(0,0,0,0.3), 0 0 30px rgba(0,0,0,0.4); }
        }
        .breathing-button {
          animation: breatheGlow 2s ease-in-out infinite;
        }
        .header-title-responsive {
          font-size: 20px;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 1024px) {
          .main-grid {
            grid-template-columns: 2fr 1fr;
            gap: 20px;
          }
        }
        @media (max-width: 768px) {
          .header-title-responsive {
            font-size: 18px;
            word-break: break-word;
            max-width: 100%;
          }
        }
      `}} />
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        boxShadow: '0 8px 30px rgba(168,85,247,0.6), 0 0 60px rgba(236,72,153,0.4)',
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
            <div>
              <p style={{
                fontSize: '16px',
                color: '#fff',
                margin: '0',
                fontWeight: '700',
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}>
                Find Trusted Local Pros, Get Instant Quotes
              </p>
            </div>
            <button
              onClick={() => setShowBusinessForm(true)}
              className="breathing-button"
              style={{
                background: 'linear-gradient(135deg, #f9a8d4 0%, #fda4af 100%)',
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
              data-testid="button-add-business"
            >
              <Plus size={16} />
              Add Business
            </button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              // Parse search query - expect format like "Phoenix" or "Phoenix, AZ"
              const parts = searchQuery.split(',').map(p => p.trim().toLowerCase());
              const searchCity = parts[0];
              const searchState = parts[1] || 'arizona'; // default to arizona
              
              // Normalize state name (e.g., "AZ" -> "arizona")
              const stateMap: Record<string, string> = {
                'az': 'arizona',
                'ca': 'california',
                'tx': 'texas',
                'fl': 'florida',
                'ny': 'new-york',
              };
              const normalizedState = stateMap[searchState] || searchState;
              
              // Navigate to city page
              window.location.href = `/${normalizedState}/${searchCity}`;
            }
          }} style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <input
              type="text"
              placeholder="City or zip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
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
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #f9a8d4 0%, #fda4af 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(249,168,212,0.4)',
              }}
              data-testid="button-search"
            >
              Search
            </button>
          </form>
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
            boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
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
              const formData = new FormData(e.currentTarget);
              const locationInput = formData.get('location') as string;
              // Extract city from location input (format: "City, ST")
              const locationParts = locationInput.split(',');
              const businessCity = locationParts[0]?.trim() || city;
              const businessState = locationParts[1]?.trim() || state;
              
              const data = {
                name: formData.get('name') as string,
                address: locationInput,
                phone: formData.get('phone') as string,
                website: formData.get('logoUrl') || 'https://example.com',
                rating: '4.5',
                reviews: 0,
                services: ['Junk Removal'],
                longitude: -111.9281,
                latitude: 33.4942,
                local: true,
                logoUrl: formData.get('logoUrl') as string || null,
                reviewSnippets: [],
                city: businessCity,
                state: businessState,
              };
              createCompanyMutation.mutate(data);
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Business Name *
                </label>
                <input
                  type="text"
                  name="name"
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
                  name="email"
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
                  name="phone"
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
                  name="location"
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
                  name="logoUrl"
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
                Publish My Business
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ padding: '20px 0 0 0', margin: '0', width: '100%' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '24px', padding: '0 16px', margin: '0 0 24px 0' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }} data-testid="text-page-title">
            {city.charAt(0).toUpperCase() + city.slice(1)} Junk Removal
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
            {companies.length} verified pro{companies.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Two Column Layout - Stacks on Mobile */}
        <div style={{ padding: '0', margin: '0', width: '100%' }}>
          <div className="main-grid" style={{ margin: '0', padding: '0', width: '100%', gap: '0' }}>
              {/* Left - Company Listings */}
              <div style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', margin: '0', padding: '0' }}>
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }} data-testid="text-loading">
                    Loading...
                  </div>
                ) : (
                  companies.map((c, index) => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCompanyId(c.id)} 
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '0',
                    padding: '0',
                    marginBottom: '1px',
                    marginLeft: '0',
                    marginRight: '0',
                    boxShadow: 'none',
                    borderBottom: '1px solid #e5e7eb',
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  data-testid={`card-company-${c.id}`}
                >
                  {index === 0 && (
                    <div style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #f472b6 0%, #fb7185 100%)',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '0',
                      fontSize: '11px',
                      fontWeight: '700',
                      marginBottom: '12px',
                      marginLeft: '0',
                      marginTop: '0',
                      boxShadow: 'none',
                    }}>
                      TOP RATED
                    </div>
                  )}
                  
                  {/* Image Carousel */}
                  <div style={{
                    marginBottom: '16px',
                    marginTop: '0',
                    overflow: 'hidden',
                    borderRadius: '0',
                  }}>
                    <div style={{
                      display: 'flex',
                      transition: 'transform 1.5s ease-in-out',
                      transform: `translateX(-${(carouselOffsets[c.id] || 0) * 50}%)`,
                    }}>
                      {[...images, ...images].map((img, i) => (
                        <div
                          key={i}
                          style={{
                            minWidth: '50%',
                            padding: '0',
                          }}
                        >
                          <img
                            src={img}
                            alt="Service photo"
                            style={{
                              width: '100%',
                              height: '140px',
                              objectFit: 'cover',
                              borderRadius: '0',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', padding: '0' }}>
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
                      
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                        <div style={{ marginBottom: '4px' }}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />{c.address}</div>
                        <div><Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />{c.phone}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Review Snippets */}
                  {c.reviewSnippets && c.reviewSnippets.length > 0 && (
                    <div style={{
                      backgroundColor: '#fdf4ff',
                      borderRadius: '0',
                      padding: '12px',
                      marginBottom: '12px',
                      marginLeft: '0',
                      marginRight: '0',
                      border: 'none',
                      borderTop: '1px solid #f3e8ff',
                      borderBottom: '1px solid #f3e8ff',
                    }}>
                      {c.reviewSnippets.slice(0, 2).map((review, i) => (
                        <div key={i} style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          marginBottom: i < c.reviewSnippets!.slice(0, 2).length - 1 ? '8px' : '0',
                          fontStyle: 'italic',
                          lineHeight: '1.5',
                        }}>
                          "{review}"
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Call Now Button */}
                  <button 
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      color: 'white',
                      padding: '12px 20px',
                      borderRadius: '0',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '700',
                      width: '100%',
                      marginBottom: '12px',
                      marginLeft: '0',
                      marginRight: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: 'none',
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
                    borderRadius: '0',
                    padding: '16px 0',
                    marginLeft: '0',
                    marginRight: '0',
                    marginBottom: '0',
                    border: 'none',
                    borderTop: '1px solid #f3e8ff',
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

              {/* Estimator and Ads Section - Full Width */}
              <div style={{
                gridColumn: 'span 2',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                  gap: '16px',
                }}>
                  <EstimateBuilderInline />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* JunkIQ Ad */}
                    <div style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
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
                      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
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
        </div>
      </div>
    </div>
    </>
  );
}

function CompanyDetailInline({ company, onClose }: { company: Company; onClose: () => void }) {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto',
      background: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        padding: '24px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={24} color="#fff" />
        </button>
        
        <h1 style={{
          color: '#fff',
          margin: '0',
          fontSize: '32px',
          fontWeight: '800',
        }}>
          {company.name}
        </h1>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              fill={star <= Math.floor(parseFloat(company.rating)) ? "#fff" : "none"}
              color="#fff"
            />
          ))}
          <span style={{ color: '#fff', marginLeft: '8px' }}>
            {company.rating} ({company.reviews} reviews)
          </span>
        </div>
      </div>
      
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: '18px', fontWeight: '700' }}>Contact Info</h3>
          <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}><MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />{company.address}</p>
          <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}><Phone size={16} style={{ display: 'inline', marginRight: '8px' }} />{company.phone}</p>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: '18px', fontWeight: '700' }}>Services</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {company.services.map((s, i) => (
              <span key={i} style={{
                padding: '6px 12px',
                background: '#fdf4ff',
                border: '1px solid #f3e8ff',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#a855f7',
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        
        {company.reviewSnippets && company.reviewSnippets.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: '18px', fontWeight: '700' }}>Reviews</h3>
            {company.reviewSnippets.map((review, i) => (
              <p key={i} style={{ 
                padding: '12px', 
                background: '#fdf4ff', 
                border: '1px solid #f3e8ff',
                borderRadius: '8px',
                margin: '0 0 8px 0',
                fontStyle: 'italic',
                color: '#6b7280',
              }}>
                "{review}"
              </p>
            ))}
          </div>
        )}
        
        <button
          onClick={() => window.open(`tel:${company.phone}`, '_self')}
          style={{
            width: '100%',
            marginTop: '24px',
            padding: '16px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Phone size={20} />
          Call Now
        </button>
      </div>
    </div>
  );
}

export default App;
