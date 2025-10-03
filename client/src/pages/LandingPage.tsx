import { MapPin, Search, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const parts = searchQuery.split(',').map(p => p.trim().toLowerCase());
      const searchCity = parts[0];
      const searchState = parts[1] || 'arizona';
      
      const stateMap: Record<string, string> = {
        'az': 'arizona',
        'ca': 'california',
        'tx': 'texas',
        'fl': 'florida',
        'ny': 'new-york',
      };
      const normalizedState = stateMap[searchState] || searchState;
      
      window.location.href = `/${normalizedState}/${searchCity}`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5f3ff 100%)',
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        padding: '24px 16px',
        boxShadow: '0 8px 30px rgba(168,85,247,0.6)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <h1 style={{
            color: '#fff',
            fontSize: '36px',
            fontWeight: '800',
            margin: '0 0 8px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}>
            BestJunkRemovalCompanies
          </h1>
          <p style={{
            color: '#fff',
            fontSize: '18px',
            margin: '0',
            opacity: 0.95,
          }}>
            Find Trusted Local Pros, Get Instant Quotes
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 16px',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 16px 0',
          }}>
            America's Premier Junk Removal Directory
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            margin: '0 0 40px 0',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Connect with vetted local junk removal companies in your area. Compare prices, read reviews, and get instant quotes.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            gap: '12px',
            backgroundColor: '#fff',
            padding: '8px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(168,85,247,0.2)',
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your city (e.g., Phoenix, AZ)"
              style={{
                flex: 1,
                padding: '16px 20px',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                borderRadius: '8px',
              }}
              data-testid="input-homepage-search"
            />
            <button
              type="submit"
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
              }}
              data-testid="button-homepage-search"
            >
              <Search size={20} />
              Search
            </button>
          </form>
        </div>

        {/* Popular States */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#374151',
            marginBottom: '24px',
          }}>
            Browse by State
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {[
              { name: 'Arizona', slug: 'arizona' },
              { name: 'California', slug: 'california' },
              { name: 'Texas', slug: 'texas' },
              { name: 'Florida', slug: 'florida' },
              { name: 'New York', slug: 'new-york' },
              { name: 'Illinois', slug: 'illinois' },
            ].map((state) => (
              <a
                key={state.slug}
                href={`/${state.slug}`}
                style={{
                  padding: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                data-testid={`link-state-${state.slug}`}
              >
                <MapPin size={18} />
                {state.name}
              </a>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '48px',
        }}>
          {[
            {
              icon: <Star size={32} />,
              title: 'Verified Reviews',
              description: 'Read authentic reviews from real customers in your area',
            },
            {
              icon: <TrendingUp size={32} />,
              title: 'Instant Quotes',
              description: 'Get free estimates from multiple companies in minutes',
            },
            {
              icon: <MapPin size={32} />,
              title: 'Local Experts',
              description: 'Find trusted professionals serving your neighborhood',
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#fff',
                padding: '32px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{
                display: 'inline-flex',
                padding: '16px',
                background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
                borderRadius: '12px',
                color: '#a855f7',
                marginBottom: '16px',
              }}>
                {feature.icon}
              </div>
              <h4 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#374151',
                margin: '0 0 8px 0',
              }}>
                {feature.title}
              </h4>
              <p style={{
                fontSize: '15px',
                color: '#6b7280',
                margin: '0',
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
