import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Globe } from "lucide-react";
import Map, { Marker, Popup } from "react-map-gl";
import type { Company } from "@shared/schema";
import "mapbox-gl/dist/mapbox-gl.css";
import EstimateBuilder from "./components/EstimateBuilder";

function App() {
  const [popup, setPopup] = useState<Company | null>(null);
  
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies?local=true"],
  });

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-brand-green text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold" data-testid="header-title">
          BestJunkRemovalCompanies.com
        </h1>
        <input
          type="text"
          placeholder="Enter city or zip..."
          className="rounded-md px-3 py-1 text-black"
          data-testid="input-search-location"
        />
      </header>

      <div className="bg-yellow-highlight text-center py-3 font-semibold">
        🔥 Advertisement: Try{" "}
        <span className="text-orange-600">JunkIQ</span> – Smarter Junk Removal
        Quoting Software
      </div>

      <main className="flex flex-1">
        <section className="w-2/3 p-6 space-y-4 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Scottsdale Junk Removal
          </h2>
          
          {isLoading ? (
            <div className="text-center py-8" data-testid="text-loading">
              Loading companies...
            </div>
          ) : (
            companies.map((c) => (
              <div
                key={c.id}
                className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setPopup(c)}
                data-testid={`card-company-${c.id}`}
              >
                <h3 className="text-xl font-semibold" data-testid={`text-company-name-${c.id}`}>
                  {c.name}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} /> {c.address}
                </p>
                <p className="text-sm flex items-center gap-1">
                  <Phone size={14} /> {c.phone}
                </p>
                <a
                  href={c.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                  data-testid={`link-website-${c.id}`}
                >
                  <Globe size={14} /> Website
                </a>
                <p className="text-sm" data-testid={`text-rating-${c.id}`}>
                  ⭐ {c.rating} ({c.reviews} reviews)
                </p>
                <button 
                  className="mt-2 bg-brand-green text-white px-3 py-1 rounded-md hover:bg-deep-forest"
                  data-testid={`button-claim-${c.id}`}
                >
                  Claim this business
                </button>
              </div>
            ))
          )}
        </section>

        <aside className="w-1/3 p-4 space-y-4">
          <div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <p className="font-semibold text-gray-600">Map Placeholder</p>
              <p className="text-sm text-gray-500 mt-2">
                Mapbox token required to display map.
                <br />
                Set VITE_MAPBOX_TOKEN environment variable.
              </p>
            </div>
          </div>

          <EstimateBuilder />

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-bold mb-2">What is a Cubic Yard?</h3>
            <p className="text-sm text-gray-700">
              A cubic yard is 3ft × 3ft × 3ft — about the size of a standard
              washing machine. Junk removal trucks are usually 12–16 cubic yards
              (about 14 washing machines).
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-bold mb-2">Latest Articles</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>5 Questions to Ask Before Hiring a Junk Removal Company</li>
              <li>How to Save Money on Junk Removal</li>
              <li>Dumpster Rental vs Junk Removal – Which is Better?</li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-4 text-center">
            <h4 className="font-bold mb-2">Sponsored: Dumpster Rentals</h4>
            <p className="text-sm text-gray-700">
              Need a dumpster instead? Book your rental today.
            </p>
            <button 
              className="mt-2 bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700"
              data-testid="button-book-dumpster"
            >
              Book Dumpster
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-4 text-center">
            <h4 className="font-bold mb-2">Your Ad Here</h4>
            <p className="text-sm text-gray-600">
              Contact us to advertise to Scottsdale homeowners.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
