import { useQuery } from "@tanstack/react-query";
import type { Company } from "@shared/schema";

function App() {
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies?local=true"],
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'green' }}>BestJunkRemovalCompanies.com</h1>
      
      {isLoading ? (
        <p>Loading companies...</p>
      ) : (
        <div>
          <h2>Companies Found: {companies.length}</h2>
          {companies.map((c) => (
            <div key={c.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <h3>{c.name}</h3>
              <p>{c.address}</p>
              <p>{c.phone}</p>
              <p>⭐ {c.rating} ({c.reviews} reviews)</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
