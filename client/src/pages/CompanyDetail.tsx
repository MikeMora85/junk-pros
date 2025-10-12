import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Trash2, Home, Sofa, Phone, Mail } from "lucide-react";
import type { Company } from "@shared/schema";
import { trackBusinessEvent } from "../lib/tracking";

export default function CompanyDetail() {
  const [, params] = useRoute("/company/:id");
  const companyId = params?.id ? parseInt(params.id) : null;

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ["/api/companies", companyId],
    enabled: !!companyId,
  });

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ color: '#6b7280', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f9fafb',
        padding: '20px',
      }}>
        <Link href="/">
          <button style={{
            padding: '8px 16px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <ArrowLeft size={16} />
            Back
          </button>
        </Link>
        <div style={{ color: '#6b7280', marginTop: '20px' }}>Company not found</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      paddingBottom: '40px',
    }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href={`/${company.state.toLowerCase().replace(/\s+/g, '-')}/${company.city.toLowerCase()}`}>
            <button style={{
              padding: '8px 16px',
              background: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '600',
            }} data-testid="button-back">
              <ArrowLeft size={16} />
              Back
            </button>
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {/* Company Header */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 12px 0',
            color: '#111827',
          }} data-testid="text-company-name">
            {company.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
              ))}
              <span style={{ marginLeft: '8px', fontWeight: '700', fontSize: '18px', color: '#111827' }}>
                {company.rating}
              </span>
              <span style={{ marginLeft: '4px', color: '#6b7280', fontSize: '14px' }}>
                {company.reviews} reviews
              </span>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              padding: '14px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onClick={() => {
              trackBusinessEvent(company.id, 'call');
              window.open(`tel:${company.phone}`, '_self');
            }}
            data-testid="button-request-quote"
          >
            Request a Quote
          </button>
        </div>

        {/* Services Icons */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: '16px',
            textAlign: 'center',
          }}>
            {company.services.slice(0, 4).map((service, i) => {
              const icons = [Trash2, Home, Sofa, Sofa];
              const Icon = icons[i] || Trash2;
              return (
                <div key={i}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    margin: '0 auto 8px',
                    background: '#f3f4f6',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Icon size={32} color="#374151" />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                    {service}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          {/* Left Column */}
          <div style={{ flex: 1 }}>
            {/* About Us */}
            {company.aboutUs && (
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#111827',
                }}>
                  About Us
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}>
                  {company.aboutUs}
                </p>
              </div>
            )}

            {/* Photos */}
            {((company.galleryImages && company.galleryImages.length > 0) || company.logoUrl || company.reviews > 0) && (
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#111827',
                }}>
                  Photos
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                }}>
                  {(() => {
                    const hasGallery = company.galleryImages && company.galleryImages.length > 0;
                    const imagesToShow = hasGallery 
                      ? company.galleryImages!.slice(0, 4)
                      : [1, 2, 3, 4];
                    
                    return imagesToShow.map((img, i) => (
                      <img
                        key={i}
                        src={typeof img === 'string' ? img : `https://picsum.photos/400/300?random=${img}`}
                        alt={`Gallery ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Reviews */}
            {company.reviewSnippets && company.reviewSnippets.length > 0 && (
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: '#111827',
                }}>
                  Reviews
                </h2>

                {company.reviewSnippets.map((review, i) => (
                  <div key={i} style={{ marginBottom: i < company.reviewSnippets!.length - 1 ? '16px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#6b7280',
                      }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                          Customer {i + 1}
                        </div>
                        <div style={{ display: 'flex' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.5',
                      margin: 0,
                    }}>
                      {review}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ width: '100%', maxWidth: '300px' }}>
            {/* Pricing - if available */}
            {company.priceSheetData && (
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#111827',
                }}>
                  Pricing
                </h2>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.8' }}>
                  <div>• Single Item: $75</div>
                  <div>• 1/4 Load: $150</div>
                  <div>• 1/2 Load: $500</div>
                </div>
              </div>
            )}

            {/* Amenities */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#111827',
              }}>
                Amenities
              </h2>
              <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.8' }}>
                <div>• Free Estimates</div>
                <div>• Same-Day Service</div>
                <div>• Eco-Friendly</div>
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#111827',
              }}>
                Payment Methods
              </h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['VISA', 'Mastercard', 'AmEx', 'Discover'].map((method) => (
                  <div key={method} style={{
                    padding: '4px 12px',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                  }}>
                    {method}
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            {company.hours && (
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#111827',
                }}>
                  Business Hours
                </h2>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.8' }}>
                  {company.hours}
                </div>
              </div>
            )}

            {/* Location */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#111827',
              }}>
                Location
              </h2>
              <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                {company.address}
              </div>
            </div>

            {/* Contact Information */}
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#111827',
              }}>
                Contact Information
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Phone size={16} color="#6b7280" />
                <a href={`tel:${company.phone}`} style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                  {company.phone}
                </a>
              </div>
              {company.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} color="#6b7280" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none' }}>
                    Visit Website
                  </a>
                </div>
              )}
              <button
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
                onClick={() => {
                  trackBusinessEvent(company.id, 'call');
                  window.open(`tel:${company.phone}`, '_self');
                }}
                data-testid="button-request-quote-bottom"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
