import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { MapPin, Phone, Star, Plus, X, Camera, Calendar } from "lucide-react";
import type { Company } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import EstimateBuilderInline from "../components/EstimateBuilderInline";
import img1 from "@assets/stock_images/junk_removal_truck_s_8d89f5e0.jpg";
import img2 from "@assets/stock_images/junk_removal_truck_s_08e95c57.jpg";
import img3 from "@assets/stock_images/junk_removal_truck_s_6100f5f9.jpg";
import img4 from "@assets/stock_images/junk_removal_truck_s_20fde47d.jpg";
import img5 from "@assets/stock_images/junk_removal_truck_s_8e2ece45.jpg";
import img6 from "@assets/stock_images/junk_removal_truck_s_7e78a264.jpg";

const images = [img1, img2, img3, img4, img5, img6];

export default function HomePage() {
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null);
  const [carouselOffsets, setCarouselOffsets] = useState<Record<number, number>>({});
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies?local=true"],
  });

  const createCompanyMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies?local=true"] });
      setShowBusinessForm(false);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselOffsets((prev) => {
        const next: Record<number, number> = {};
        companies.forEach((c) => {
          next[c.id] = ((prev[c.id] || 0) + 1) % images.length;
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [companies]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      website: formData.get('website') as string,
      rating: formData.get('rating') as string,
      reviews: parseInt(formData.get('reviews') as string),
      services: (formData.get('services') as string).split(',').map(s => s.trim()),
      longitude: parseFloat(formData.get('longitude') as string),
      latitude: parseFloat(formData.get('latitude') as string),
      local: true,
      logoUrl: formData.get('logoUrl') as string || null,
      reviewSnippets: [],
    };

    createCompanyMutation.mutate(data);
  };

  return (
    <>
      {showBusinessForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
          }}>
            <button
              onClick={() => setShowBusinessForm(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
              data-testid="button-close-form"
            >
              <X size={24} color="#6b7280" />
            </button>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Add Your Business
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                  Business Name*
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                  data-testid="input-business-name"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                  Address*
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                  data-testid="input-address"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                  Phone*
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                  data-testid="input-phone"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                  Website*
                </label>
                <input
                  type="url"
                  name="website"
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                  data-testid="input-website"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                    Rating*
                  </label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    min="0"
                    max="5"
                    required
                    defaultValue="4.5"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '14px',
                    }}
                    data-testid="input-rating"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                    Reviews*
                  </label>
                  <input
                    type="number"
                    name="reviews"
                    min="0"
                    required
                    defaultValue="0"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '14px',
                    }}
                    data-testid="input-reviews"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                  Services (comma separated)*
                </label>
                <input
                  type="text"
                  name="services"
                  required
                  placeholder="e.g. Furniture Removal, Appliance Removal"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                  data-testid="input-services"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                    Latitude*
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    step="0.0001"
                    required
                    defaultValue="33.4942"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '14px',
                    }}
                    data-testid="input-latitude"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                    Longitude*
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    step="0.0001"
                    required
                    defaultValue="-111.9281"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      fontSize: '14px',
                    }}
                    data-testid="input-longitude"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151' }}>
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logoUrl"
                  placeholder="https://example.com/logo.png"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '14px',
                  }}
                  data-testid="input-logo-url"
                />
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                  Provide a link to your company logo for better visibility
                </p>
              </div>

              <button
                type="submit"
                disabled={createCompanyMutation.isPending}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  color: '#fff',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: createCompanyMutation.isPending ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                  opacity: createCompanyMutation.isPending ? 0.6 : 1,
                }}
                data-testid="button-submit-business"
              >
                {createCompanyMutation.isPending ? 'Submitting...' : 'Submit for Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rest of the existing home page JSX continues below... */}
      {/* I'll continue writing the rest in the next tool call */}
    </>
  );
}
