import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe } from "lucide-react";
import type { Company } from "@shared/schema";
import EstimateBuilderInline from "./components/EstimateBuilderInline";

function App() {
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies?local=true"],
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ backgroundColor: 'hsl(142 72% 20%)', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }} data-testid="header-title">
          BestJunkRemovalCompanies.com
        </h1>
        <input
          type="text"
          placeholder="Enter city or zip..."
          style={{ borderRadius: '8px', padding: '10px 16px', border: 'none', fontSize: '15px', minWidth: '220px' }}
          data-testid="input-search-location"
        />
      </header>

      <div style={{ backgroundColor: 'hsl(48 96% 53%)', textAlign: 'center', padding: '14px', fontWeight: '600', fontSize: '15px' }}>
        🔥 Advertisement: Try <span style={{color: '#ea580c'}}>JunkIQ</span> – Smarter Junk Removal Quoting Software
      </div>

      <main style={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
        <section style={{ flex: '1 1 600px', padding: '28px', overflowY: 'auto' }}>
          <h2 style={{fontSize: '34px', fontWeight: 'bold', marginBottom: '24px', marginTop: 0}} data-testid="text-page-title">
            Scottsdale Junk Removal
          </h2>
          
          {isLoading ? (
            <div style={{textAlign: 'center', padding: '40px', fontSize: '16px'}} data-testid="text-loading">
              Loading companies...
            </div>
          ) : (
            companies.map((c) => (
              <div 
                key={c.id} 
                style={{ 
                  backgroundColor: 'white', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  marginBottom: '20px',
                  transition: 'box-shadow 0.2s'
                }} 
                data-testid={`card-company-${c.id}`}
              >
                <h3 style={{ fontSize: '22px', fontWeight: '600', marginTop: 0, marginBottom: '12px' }} data-testid={`text-company-name-${c.id}`}>
                  {c.name}
                </h3>
                <p style={{ fontSize: '15px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#4b5563' }}>
                  <MapPin size={16} /> {c.address}
                </p>
                <p style={{ fontSize: '15px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={16} /> {c.phone}
                </p>
                <a
                  href={c.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '15px', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', margin: '8px 0' }}
                  data-testid={`link-website-${c.id}`}
                >
                  <Globe size={16} /> Website
                </a>
                <p style={{ fontSize: '15px', margin: '12px 0' }} data-testid={`text-rating-${c.id}`}>
                  ⭐ <strong>{c.rating}</strong> ({c.reviews} reviews)
                </p>
                <button 
                  style={{ 
                    marginTop: '12px', 
                    backgroundColor: 'hsl(142 72% 20%)', 
                    color: 'white', 
                    padding: '10px 18px', 
                    borderRadius: '8px', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600'
                  }} 
                  data-testid={`button-claim-${c.id}`}
                >
                  Claim this business
                </button>
              </div>
            ))
          )}
        </section>

        <aside style={{ flex: '0 0 380px', padding: '28px', backgroundColor: '#f9fafb' }}>
          <div style={{ height: '280px', backgroundColor: '#e5e7eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ fontWeight: '600', color: '#4b5563', fontSize: '18px', marginBottom: '8px' }}>🗺️ Map Placeholder</p>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                Mapbox token required to display interactive map.
                <br />
                <small>Set VITE_MAPBOX_TOKEN environment variable.</small>
              </p>
            </div>
          </div>

          <EstimateBuilderInline />

          <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 'bold', marginTop: 0, marginBottom: '12px', fontSize: '17px' }}>What is a Cubic Yard?</h3>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
              A cubic yard is 3ft × 3ft × 3ft — about the size of a standard washing machine. Junk removal trucks are usually 12–16 cubic yards (about 14 washing machines).
            </p>
          </div>

          <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 'bold', marginTop: 0, marginBottom: '12px', fontSize: '17px' }}>Latest Articles</h3>
            <ul style={{ fontSize: '14px', color: '#374151', paddingLeft: '20px', margin: 0, lineHeight: '1.8' }}>
              <li>5 Questions to Ask Before Hiring a Junk Removal Company</li>
              <li>How to Save Money on Junk Removal</li>
              <li>Dumpster Rental vs Junk Removal – Which is Better?</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 'bold', marginTop: 0, marginBottom: '8px', fontSize: '16px' }}>Sponsored: Dumpster Rentals</h4>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
              Need a dumpster instead? Book your rental today.
            </p>
            <button 
              style={{ 
                backgroundColor: '#ea580c', 
                color: 'white', 
                padding: '10px 18px', 
                borderRadius: '8px', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600'
              }}
              data-testid="button-book-dumpster"
            >
              Book Dumpster
            </button>
          </div>

          <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <h4 style={{ fontWeight: 'bold', marginTop: 0, marginBottom: '8px', fontSize: '16px' }}>Your Ad Here</h4>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              Contact us to advertise to Scottsdale homeowners.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
