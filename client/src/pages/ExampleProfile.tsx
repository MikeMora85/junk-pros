import { Link } from "wouter";
import { ArrowLeft, Trash2, Home, Sofa, Phone, Mail } from "lucide-react";

export default function ExampleProfile() {
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
            Mora's Junk Removal
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
              ))}
              <span style={{ marginLeft: '8px', fontWeight: '700', fontSize: '18px', color: '#111827' }}>
                4.8
              </span>
              <span style={{ marginLeft: '4px', color: '#6b7280', fontSize: '14px' }}>
                52 reviews
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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            textAlign: 'center',
          }}>
            <div>
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
                <Trash2 size={32} color="#374151" />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                Junk Removal
              </div>
            </div>
            <div>
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
                <Home size={32} color="#374151" />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                Cleanouts
              </div>
            </div>
            <div>
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                  <rect x="3" y="10" width="18" height="11" rx="2" />
                  <path d="M7 10V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5" />
                </svg>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                Appliance Removal
              </div>
            </div>
            <div>
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
                <Sofa size={32} color="#374151" />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>
                Furniture Removal
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          {/* Left Column */}
          <div style={{ flex: 1 }}>
            {/* About Us */}
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
              }}>
                Professional junk removal services for homes and businesses. We offer fast and reliable hauling, with free estimates and eco-friendly disposal options.
              </p>
            </div>

            {/* Photos */}
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
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '100%',
                      height: '120px',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af',
                      fontSize: '12px',
                    }}
                  >
                    Photo {i}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
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

              {/* Review 1 */}
              <div style={{ marginBottom: '16px' }}>
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
                    MD
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                      Michael D.
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
                  Great experience! The team was on time, worked quickly, and left the area spotless. Highly recommend!
                </p>
              </div>

              {/* Review 2 */}
              <div style={{ marginBottom: '16px' }}>
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
                    SM
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                      Sarah M.
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
                  Very professional and reasonably priced. Will definitely use them again for future junk removal projects.
                </p>
              </div>

              {/* Review 3 */}
              <div>
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
                    JR
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>
                      John R.
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
                  Excellent service from start to finish! The crew was courteous and efficient.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ width: '100%', maxWidth: '300px' }}>
            {/* Pricing */}
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
                <div style={{
                  padding: '4px 12px',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  VISA
                </div>
                <div style={{
                  padding: '4px 12px',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  Mastercard
                </div>
                <div style={{
                  padding: '4px 12px',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  AmEx
                </div>
                <div style={{
                  padding: '4px 12px',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#374151',
                }}>
                  Discover
                </div>
              </div>
            </div>

            {/* Business Hours */}
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
                <div>8:00 AM - 6:00 PM</div>
                <div>8:00 AM - 4:00 PM</div>
                <div>Sunday - Closed</div>
              </div>
            </div>

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
                <div>1234 Elm St</div>
                <div>Springfield, IL 62701</div>
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
                <span style={{ fontSize: '14px', color: '#6b7280' }}>(555) 555-1234</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#6b7280' }}>1234@mora's.com</span>
              </div>
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
