import { MapPin, Book, TrendingUp } from "lucide-react";

interface StatePageProps {
  stateName: string;
  stateSlug: string;
}

export default function StatePage({ stateName, stateSlug }: StatePageProps) {
  const popularCities = {
    'arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale'],
    'california': ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento'],
    'texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso'],
    'florida': ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah'],
    'new-york': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'],
  }[stateSlug] || [];

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
        }}>
          <a href="/" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '700',
            display: 'inline-block',
            marginBottom: '12px',
          }}>
            ← BestJunkRemovalCompanies
          </a>
          <h1 style={{
            color: '#fff',
            fontSize: '32px',
            fontWeight: '800',
            margin: '0',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}>
            {stateName} Junk Removal Guide
          </h1>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 16px',
      }}>
        {/* Cities Grid */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
          }}>
            <MapPin size={28} style={{ display: 'inline', marginRight: '8px' }} />
            Find Companies by City
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {popularCities.map((city) => (
              <a
                key={city}
                href={`/${stateSlug}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  padding: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
                data-testid={`link-city-${city.toLowerCase()}`}
              >
                {city}
              </a>
            ))}
          </div>
        </section>

        {/* Educational Content */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
          }}>
            <Book size={28} style={{ display: 'inline', marginRight: '8px' }} />
            {stateName} Junk Removal Guide
          </h2>
          <div style={{
            backgroundColor: '#fff',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '16px',
            }}>
              What You Need to Know About Junk Removal in {stateName}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.8',
              marginBottom: '16px',
            }}>
              Finding reliable junk removal services in {stateName} is easier than ever. Whether you're clearing out a garage, renovating your home, or managing an estate cleanout, local professionals are ready to help.
            </p>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#374151',
              marginTop: '24px',
              marginBottom: '12px',
            }}>
              Common Services Offered:
            </h4>
            <ul style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '24px',
            }}>
              <li>Residential junk removal and cleanouts</li>
              <li>Furniture and appliance disposal</li>
              <li>Construction debris removal</li>
              <li>Yard waste and green waste hauling</li>
              <li>Estate and foreclosure cleanouts</li>
              <li>Commercial and office cleanouts</li>
            </ul>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#374151',
              marginTop: '24px',
              marginBottom: '12px',
            }}>
              Average Costs:
            </h4>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              lineHeight: '1.8',
            }}>
              Most junk removal companies in {stateName} charge based on volume. Expect to pay $100-$200 for a small load (1/8 of a truck), $200-$400 for a medium load (1/4 truck), and $400-$800 for a full truck load. Many companies offer free estimates and same-day service.
            </p>
          </div>
        </section>

        {/* Tips Section */}
        <section>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
          }}>
            <TrendingUp size={28} style={{ display: 'inline', marginRight: '8px' }} />
            Tips for Choosing a Junk Removal Company
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {[
              {
                title: 'Check Reviews',
                description: 'Read customer reviews to ensure quality service and reliability.',
              },
              {
                title: 'Get Multiple Quotes',
                description: 'Compare prices from 2-3 companies to ensure competitive rates.',
              },
              {
                title: 'Verify Insurance',
                description: 'Make sure the company is licensed and insured for your protection.',
              },
              {
                title: 'Ask About Recycling',
                description: 'Choose companies that donate or recycle items when possible.',
              },
            ].map((tip, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#fff',
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#374151',
                  marginBottom: '8px',
                }}>
                  {tip.title}
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#6b7280',
                  margin: '0',
                  lineHeight: '1.6',
                }}>
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
