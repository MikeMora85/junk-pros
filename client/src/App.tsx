import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe, Star, TrendingUp } from "lucide-react";
import type { Company } from "@shared/schema";
import EstimateBuilderInline from "./components/EstimateBuilderInline";

function App() {
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies?local=true"],
  });

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px 32px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  };

  const navStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#059669',
    margin: 0,
  };

  const searchStyle: React.CSSProperties = {
    flex: '1',
    maxWidth: '400px',
    padding: '11px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '32px',
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '32px',
  };

  const companyCardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
    transition: 'all 0.2s',
    cursor: 'pointer',
  };

  const avatarStyle: React.CSSProperties = {
    width: '72px',
    height: '72px',
    borderRadius: '8px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '700',
    color: '#059669',
    flexShrink: 0,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <header style={headerStyle}>
        <nav style={navStyle}>
          <h1 style={logoStyle} data-testid="header-title">
            Junk Removal Directory
          </h1>
          <input
            type="text"
            placeholder="Search location..."
            style={searchStyle}
            data-testid="input-search-location"
            onFocus={(e) => e.target.style.borderColor = '#059669'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </nav>
      </header>

      <div style={containerStyle}>
        <section>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '600', margin: '0 0 8px 0', color: '#111827' }} data-testid="text-page-title">
              Junk Removal in Scottsdale, AZ
            </h2>
            <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
              {companies.length} results • Sorted by recommended
            </p>
          </div>
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }} data-testid="text-loading">
              Loading companies...
            </div>
          ) : (
            companies.map((c) => (
              <div 
                key={c.id} 
                style={companyCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                data-testid={`card-company-${c.id}`}
              >
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={avatarStyle}>
                    {c.name.charAt(0)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', color: '#111827' }} data-testid={`text-company-name-${c.id}`}>
                      {c.name}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={16} fill="#fbbf24" stroke="#fbbf24" />
                        <span style={{ fontWeight: '600', color: '#111827' }}>{c.rating}</span>
                      </div>
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>({c.reviews} reviews)</span>
                      {c.local && (
                        <span style={{ 
                          backgroundColor: '#dcfce7', 
                          color: '#059669', 
                          padding: '2px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          fontWeight: '600',
                          marginLeft: '4px'
                        }}>
                          Local
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                        <MapPin size={16} />
                        <span>{c.address}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                        <Phone size={16} />
                        <span>{c.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        <Globe size={16} color="#2563eb" />
                        <a
                          href={c.website}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#2563eb', textDecoration: 'none' }}
                          data-testid={`link-website-${c.id}`}
                        >
                          Visit website
                        </a>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button 
                        style={{ 
                          backgroundColor: '#059669',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                        data-testid={`button-claim-${c.id}`}
                      >
                        Get Quote
                      </button>
                      <button 
                        style={{ 
                          backgroundColor: '#fff',
                          color: '#374151',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
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

        <aside style={{ position: 'sticky', top: '84px', alignSelf: 'flex-start' }}>
          <EstimateBuilderInline />

          <div style={{ 
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <TrendingUp size={20} color="#059669" />
              <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#111827' }}>Popular Articles</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                '5 Questions to Ask Before Hiring',
                'How to Save Money on Junk Removal',
                'Dumpster vs Junk Removal Services'
              ].map((article, i) => (
                <li key={i} style={{ 
                  padding: '10px 0',
                  borderBottom: i < 2 ? '1px solid #f3f4f6' : 'none',
                }}>
                  <a href="#" style={{ 
                    fontSize: '14px',
                    color: '#374151',
                    textDecoration: 'none',
                    display: 'block',
                  }}>
                    {article}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
