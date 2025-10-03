import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { MapPin, Phone, Star, Globe, ArrowLeft } from "lucide-react";
import type { Company } from "@shared/schema";
import img1 from "@assets/stock_images/junk_removal_truck_s_8d89f5e0.jpg";
import img2 from "@assets/stock_images/junk_removal_truck_s_08e95c57.jpg";
import img3 from "@assets/stock_images/junk_removal_truck_s_6100f5f9.jpg";
import img4 from "@assets/stock_images/junk_removal_truck_s_20fde47d.jpg";
import img5 from "@assets/stock_images/junk_removal_truck_s_8e2ece45.jpg";
import img6 from "@assets/stock_images/junk_removal_truck_s_7e78a264.jpg";

const images = [img1, img2, img3, img4, img5, img6];

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
        background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5f3ff 100%)',
        padding: '20px',
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
        background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5f3ff 100%)',
        padding: '20px',
      }}>
        <Link href="/">
          <button style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}>
            <ArrowLeft size={20} />
            Back to Directory
          </button>
        </Link>
        <div style={{ color: '#6b7280' }}>Company not found</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5f3ff 100%)',
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        boxShadow: '0 8px 30px rgba(168,85,247,0.6)',
        padding: '16px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/">
            <button style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '600',
            }} data-testid="button-back">
              <ArrowLeft size={16} />
              Back to Directory
            </button>
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Company Header */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '12px',
              background: company.logoUrl ? '#fff' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              fontWeight: '800',
              color: '#fff',
              flexShrink: 0,
              boxShadow: company.logoUrl ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 12px rgba(168,85,247,0.3)',
              padding: company.logoUrl ? '8px' : '0',
              border: company.logoUrl ? '2px solid #f3e8ff' : 'none',
              overflow: 'hidden',
            }}>
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                company.name.charAt(0)
              )}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                margin: '0 0 12px 0',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }} data-testid="text-company-name">
                {company.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={star <= Math.floor(parseFloat(company.rating)) ? "#ec4899" : "none"}
                      color="#ec4899"
                    />
                  ))}
                  <span style={{ marginLeft: '8px', fontWeight: '700', fontSize: '18px' }}>
                    {company.rating}
                  </span>
                  <span style={{ marginLeft: '4px', color: '#6b7280', fontSize: '14px' }}>
                    ({company.reviews} reviews)
                  </span>
                </div>
                {company.local && (
                  <span style={{
                    background: '#a855f7',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}>
                    LOCAL
                  </span>
                )}
              </div>

              <div style={{ fontSize: '15px', color: '#6b7280', marginBottom: '8px' }}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
                {company.address}
              </div>
              <div style={{ fontSize: '15px', color: '#6b7280', marginBottom: '8px' }}>
                <Phone size={16} style={{ display: 'inline', marginRight: '8px' }} />
                {company.phone}
              </div>
              <div style={{ fontSize: '15px', color: '#6b7280' }}>
                <Globe size={16} style={{ display: 'inline', marginRight: '8px' }} />
                <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: '#a855f7' }}>
                  {company.website}
                </a>
              </div>
            </div>
          </div>

          <button
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '16px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
            }}
            onClick={() => window.open(`tel:${company.phone}`, '_self')}
            data-testid="button-call-now"
          >
            <Phone size={20} />
            Call Now: {company.phone}
          </button>
        </div>

        {/* Services */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#111827',
          }}>
            Services Offered
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {company.services.map((service, i) => (
              <span
                key={i}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
                  border: '2px solid #f3e8ff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#a855f7',
                }}
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#111827',
          }}>
            Gallery
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {images.slice(0, 6).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Service photo ${i + 1}`}
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            ))}
          </div>
        </div>

        {/* Reviews */}
        {company.reviewSnippets && company.reviewSnippets.length > 0 && (
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#111827',
            }}>
              Customer Reviews
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {company.reviewSnippets.map((review, i) => (
                <div
                  key={i}
                  style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
                    borderRadius: '8px',
                    border: '1px solid #f3e8ff',
                  }}
                >
                  <div style={{ display: 'flex', marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill="#ec4899"
                        color="#ec4899"
                      />
                    ))}
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    fontStyle: 'italic',
                    lineHeight: '1.6',
                  }}>
                    "{review}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
