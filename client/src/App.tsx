import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe } from "lucide-react";
import type { Company } from "@shared/schema";

function App() {
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies?local=true"],
  });

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' as const },
    header: { backgroundColor: 'hsl(142 72% 20%)', color: 'white', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '24px', fontWeight: 'bold' },
    input: { borderRadius: '6px', padding: '8px 12px', border: '1px solid #ccc' },
    banner: { backgroundColor: 'hsl(48 96% 53%)', textAlign: 'center' as const, padding: '12px', fontWeight: '600' },
    main: { display: 'flex', flex: 1, flexWrap: 'wrap' as const },
    section: { width: '66%', padding: '24px', overflowY: 'auto' as const },
    aside: { width: '34%', padding: '16px' },
    card: { backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
    companyName: { fontSize: '20px', fontWeight: '600', marginBottom: '8px' },
    text: { fontSize: '14px', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '4px' },
    button: { marginTop: '8px', backgroundColor: 'hsl(142 72% 20%)', color: 'white', padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer' },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title} data-testid="header-title">
          BestJunkRemovalCompanies.com
        </h1>
        <input
          type="text"
          placeholder="Enter city or zip..."
          style={styles.input}
          data-testid="input-search-location"
        />
      </header>

      <div style={styles.banner}>
        🔥 Advertisement: Try <span style={{color: '#ea580c'}}>JunkIQ</span> – Smarter Junk Removal Quoting Software
      </div>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={{fontSize: '30px', fontWeight: 'bold', marginBottom: '16px'}} data-testid="text-page-title">
            Scottsdale Junk Removal
          </h2>
          
          {isLoading ? (
            <div style={{textAlign: 'center', padding: '32px'}} data-testid="text-loading">
              Loading companies...
            </div>
          ) : (
            companies.map((c) => (
              <div key={c.id} style={styles.card} data-testid={`card-company-${c.id}`}>
                <h3 style={styles.companyName} data-testid={`text-company-name-${c.id}`}>
                  {c.name}
                </h3>
                <p style={styles.text}>
                  <MapPin size={14} /> {c.address}
                </p>
                <p style={styles.text}>
                  <Phone size={14} /> {c.phone}
                </p>
                <a
                  href={c.website}
                  target="_blank"
                  rel="noreferrer"
                  style={{...styles.text, color: '#2563eb', textDecoration: 'none'}}
                  data-testid={`link-website-${c.id}`}
                >
                  <Globe size={14} /> Website
                </a>
                <p style={styles.text} data-testid={`text-rating-${c.id}`}>
                  ⭐ {c.rating} ({c.reviews} reviews)
                </p>
                <button style={styles.button} data-testid={`button-claim-${c.id}`}>
                  Claim this business
                </button>
              </div>
            ))
          )}
        </section>

        <aside style={styles.aside}>
          <div style={{height: '256px', backgroundColor: '#e5e7eb', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'}}>
            <div style={{textAlign: 'center', padding: '16px'}}>
              <p style={{fontWeight: '600', color: '#4b5563'}}>Map Placeholder</p>
              <p style={{fontSize: '14px', color: '#6b7280', marginTop: '8px'}}>
                Mapbox token required.
                <br />
                Set VITE_MAPBOX_TOKEN.
              </p>
            </div>
          </div>

          <div style={{...styles.card, marginBottom: '16px'}}>
            <h3 style={{fontWeight: 'bold', marginBottom: '8px'}}>Estimate Builder</h3>
            <p style={{fontSize: '14px'}}>Interactive estimate builder coming soon!</p>
          </div>

          <div style={styles.card}>
            <h3 style={{fontWeight: 'bold', marginBottom: '8px'}}>What is a Cubic Yard?</h3>
            <p style={{fontSize: '14px', color: '#374151'}}>
              A cubic yard is 3ft × 3ft × 3ft — about the size of a standard washing machine.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
