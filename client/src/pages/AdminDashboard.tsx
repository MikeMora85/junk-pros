import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Company } from "@shared/schema";
import { Menu, X, Search, Plus, Building2, MapPin, Phone, Mail, Star, DollarSign, AlertCircle, CheckCircle, Eye, Trash2, Edit3 } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'active' | 'unclaimed' | 'featured' | 'analytics'>('active');
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddUnclaimed, setShowAddUnclaimed] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);
  
  // Add Unclaimed Business Form State
  const [unclaimedForm, setUnclaimedForm] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    address: "",
  });

  const { data: pendingCompanies = [], isLoading: pendingLoading } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies/pending'],
    enabled: !!user?.isAdmin,
  });

  const { data: activeCompanies = [], isLoading: activeLoading } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies/active'],
    enabled: !!user?.isAdmin,
  });

  const addUnclaimedMutation = useMutation({
    mutationFn: async (data: typeof unclaimedForm) => {
      const response = await apiRequest('/api/admin/companies/bulk-unclaimed', {
        method: 'POST',
        body: { companies: [data] },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
      setUnclaimedForm({ name: "", phone: "", city: "", state: "", address: "" });
      setShowAddUnclaimed(false);
      alert('Unclaimed business added successfully!');
    },
    onError: (error: any) => {
      alert(`Failed to add business: ${error.message || 'Unknown error'}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/companies/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
      setExpandedCompany(null);
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/companies/${id}`, {
        method: 'PATCH',
        body: { claimed: true },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
    },
  });

  if (authLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user?.isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: '#000' }}>Access Denied</h2>
          <button
            onClick={() => setLocation('/login')}
            style={{
              background: '#fbbf24',
              color: '#000',
              padding: '12px 24px',
              border: '2px solid #000',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const allCompanies = [...pendingCompanies, ...activeCompanies];
  const unclaimedCompanies = allCompanies.filter(c => !c.claimed);
  const featuredCompanies = allCompanies.filter(c => c.subscriptionTier === 'featured');
  const states = Array.from(new Set(allCompanies.map(c => c.state))).sort();
  const cities = stateFilter !== 'all' 
    ? Array.from(new Set(allCompanies.filter(c => c.state === stateFilter).map(c => c.city))).sort()
    : [];

  let displayCompanies = activeTab === 'active' ? activeCompanies 
    : activeTab === 'unclaimed' ? unclaimedCompanies
    : activeTab === 'featured' ? featuredCompanies
    : allCompanies;

  // Apply filters
  displayCompanies = displayCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.phone.includes(searchQuery);
    const matchesState = stateFilter === 'all' || company.state === stateFilter;
    const matchesCity = cityFilter === 'all' || company.city === cityFilter;
    return matchesSearch && matchesState && matchesCity;
  });

  const stats = {
    total: allCompanies.length,
    active: activeCompanies.length,
    unclaimed: unclaimedCompanies.length,
    featured: featuredCompanies.length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header - Yellow/Black */}
      <div style={{
        background: '#fbbf24',
        borderBottom: '4px solid #000',
        padding: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: 'clamp(18px, 5vw, 24px)',
              fontWeight: '800', 
              color: '#000',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              lineHeight: 1.2,
            }}>
              Admin
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: 'clamp(11px, 3vw, 13px)', color: '#000', opacity: 0.8 }}>
              {stats.total} businesses
            </p>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: '#000',
              color: '#fbbf24',
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
            data-testid="button-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '20px',
            background: '#000',
            borderRadius: '12px',
            padding: '12px',
            marginTop: '8px',
            minWidth: '200px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            <button
              onClick={() => { setLocation('/'); setMenuOpen(false); }}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#fbbf24',
                border: 'none',
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              🏠 Home
            </button>
            <button
              onClick={async () => {
                await apiRequest('/api/auth/logout', { method: 'POST' });
                setLocation('/');
              }}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#fbbf24',
                border: 'none',
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '16px',
      }}>
        <div style={{
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <Building2 size={24} color="#000" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#000' }}>{stats.active}</div>
          <div style={{ fontSize: '12px', color: '#000', fontWeight: '600' }}>Active</div>
        </div>
        <div style={{
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <AlertCircle size={24} color="#000" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#000' }}>{stats.unclaimed}</div>
          <div style={{ fontSize: '12px', color: '#000', fontWeight: '600' }}>Unclaimed</div>
        </div>
        <div style={{
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <Star size={24} color="#000" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#000' }}>{stats.featured}</div>
          <div style={{ fontSize: '12px', color: '#000', fontWeight: '600' }}>Featured</div>
        </div>
        <div style={{
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <MapPin size={24} color="#000" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#000' }}>{states.length}</div>
          <div style={{ fontSize: '12px', color: '#000', fontWeight: '600' }}>States</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#000',
        display: 'flex',
        gap: '0',
        padding: '0',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {[
          { id: 'active', label: 'Active', count: stats.active },
          { id: 'unclaimed', label: 'Unclaimed', count: stats.unclaimed },
          { id: 'featured', label: 'Featured', count: stats.featured },
          { id: 'analytics', label: 'Analytics', count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? '#fbbf24' : 'transparent',
              color: activeTab === tab.id ? '#000' : '#fbbf24',
              border: 'none',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '3px solid #000' : '3px solid transparent',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            data-testid={`tab-${tab.id}`}
          >
            {tab.label} {tab.count !== null && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Filters & Search */}
      {activeTab !== 'analytics' && (
        <div style={{ padding: '16px', background: '#fef3c7', borderBottom: '2px solid #fbbf24' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                placeholder="Search by name, city, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
                data-testid="input-search"
              />
            </div>
            
            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCityFilter('all');
              }}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #000',
                borderRadius: '8px',
                fontSize: '16px',
                background: '#fff',
                fontWeight: '600',
                boxSizing: 'border-box',
              }}
              data-testid="select-state"
            >
              <option value="all">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* City Filter */}
            {stateFilter !== 'all' && (
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#fff',
                  fontWeight: '600',
                  boxSizing: 'border-box',
                }}
                data-testid="select-city"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            )}
          </div>

          {/* Add Unclaimed Button */}
          <button
            onClick={() => setShowAddUnclaimed(!showAddUnclaimed)}
            style={{
              width: '100%',
              background: '#000',
              color: '#fbbf24',
              padding: '12px 20px',
              border: '2px solid #000',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxSizing: 'border-box',
            }}
            data-testid="button-add-unclaimed"
          >
            <Plus size={20} />
            Add Unclaimed Business
          </button>
        </div>
      )}

      {/* Add Unclaimed Form */}
      {showAddUnclaimed && (
        <div style={{
          padding: '20px',
          background: '#fff',
          border: '3px solid #fbbf24',
          borderRadius: '12px',
          margin: '20px',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '800', color: '#000' }}>
            Add New Unclaimed Business
          </h3>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Business Name *"
              value={unclaimedForm.name}
              onChange={(e) => setUnclaimedForm(prev => ({ ...prev, name: e.target.value }))}
              style={{
                padding: '12px',
                border: '2px solid #000',
                borderRadius: '8px',
                fontSize: '16px',
              }}
              data-testid="input-unclaimed-name"
            />
            <input
              type="tel"
              placeholder="Phone Number *"
              value={unclaimedForm.phone}
              onChange={(e) => setUnclaimedForm(prev => ({ ...prev, phone: e.target.value }))}
              style={{
                padding: '12px',
                border: '2px solid #000',
                borderRadius: '8px',
                fontSize: '16px',
              }}
              data-testid="input-unclaimed-phone"
            />
            <input
              type="text"
              placeholder="City *"
              value={unclaimedForm.city}
              onChange={(e) => setUnclaimedForm(prev => ({ ...prev, city: e.target.value }))}
              style={{
                padding: '12px',
                border: '2px solid #000',
                borderRadius: '8px',
                fontSize: '16px',
              }}
              data-testid="input-unclaimed-city"
            />
            <input
              type="text"
              placeholder="State *"
              value={unclaimedForm.state}
              onChange={(e) => setUnclaimedForm(prev => ({ ...prev, state: e.target.value }))}
              style={{
                padding: '12px',
                border: '2px solid #000',
                borderRadius: '8px',
                fontSize: '16px',
              }}
              data-testid="input-unclaimed-state"
            />
            <input
              type="text"
              placeholder="Address (optional)"
              value={unclaimedForm.address}
              onChange={(e) => setUnclaimedForm(prev => ({ ...prev, address: e.target.value }))}
              style={{
                padding: '12px',
                border: '2px solid #000',
                borderRadius: '8px',
                fontSize: '16px',
              }}
              data-testid="input-unclaimed-address"
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
                if (!unclaimedForm.name || !unclaimedForm.phone || !unclaimedForm.city || !unclaimedForm.state) {
                  alert('Please fill in all required fields');
                  return;
                }
                addUnclaimedMutation.mutate(unclaimedForm);
              }}
              disabled={addUnclaimedMutation.isPending}
              style={{
                background: '#fbbf24',
                color: '#000',
                padding: '12px 24px',
                border: '2px solid #000',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
              data-testid="button-submit-unclaimed"
            >
              {addUnclaimedMutation.isPending ? 'Adding...' : 'Add Business'}
            </button>
            <button
              onClick={() => {
                setShowAddUnclaimed(false);
                setUnclaimedForm({ name: "", phone: "", city: "", state: "", address: "" });
              }}
              style={{
                background: '#fff',
                color: '#000',
                padding: '12px 24px',
                border: '2px solid #000',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Companies List */}
      {activeTab !== 'analytics' && (
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#000' }}>
            Showing {displayCompanies.length} businesses
          </div>
          {displayCompanies.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              background: '#fef3c7',
              borderRadius: '12px',
              border: '2px solid #fbbf24',
            }}>
              <AlertCircle size={48} color="#000" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', color: '#000', margin: 0 }}>No businesses found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayCompanies.map((company) => (
                <div
                  key={company.id}
                  style={{
                    background: '#fff',
                    border: company.claimed ? '3px solid #fbbf24' : '3px solid #d1d5db',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '16px', background: company.claimed ? '#fef3c7' : '#f3f4f6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#000' }}>
                            {company.name}
                          </h3>
                          {company.subscriptionTier === 'featured' && (
                            <span style={{
                              background: '#fbbf24',
                              color: '#000',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '700',
                            }}>
                              ⭐ FEATURED
                            </span>
                          )}
                          {!company.claimed && (
                            <span style={{
                              background: '#d1d5db',
                              color: '#000',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '700',
                            }}>
                              UNCLAIMED
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                          <MapPin size={16} style={{ display: 'inline', marginRight: '4px' }} />
                          {company.city}, {company.state}
                        </div>
                        <div style={{ fontSize: '14px', color: '#666' }}>
                          <Phone size={16} style={{ display: 'inline', marginRight: '4px' }} />
                          {company.phone}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
                        style={{
                          background: '#000',
                          color: '#fbbf24',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                        data-testid={`button-actions-${company.id}`}
                      >
                        {expandedCompany === company.id ? 'Close' : 'Actions'}
                      </button>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  {expandedCompany === company.id && (
                    <div style={{
                      padding: '16px',
                      background: '#fff',
                      borderTop: '2px solid #fbbf24',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}>
                      <button
                        onClick={() => window.open(`/${company.state.toLowerCase()}/${company.city.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
                        style={{
                          background: '#fbbf24',
                          color: '#000',
                          padding: '12px',
                          border: '2px solid #000',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Eye size={20} />
                        View Profile
                      </button>
                      {!company.claimed && (
                        <button
                          onClick={() => claimMutation.mutate(company.id)}
                          style={{
                            background: '#10b981',
                            color: '#fff',
                            padding: '12px',
                            border: '2px solid #000',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <CheckCircle size={20} />
                          Mark as Claimed
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${company.name}? This cannot be undone.`)) {
                            deleteMutation.mutate(company.id);
                          }
                        }}
                        style={{
                          background: '#ef4444',
                          color: '#fff',
                          padding: '12px',
                          border: '2px solid #000',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Trash2 size={20} />
                        Delete Business
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{ padding: '20px' }}>
          <div style={{
            background: '#fef3c7',
            border: '3px solid #fbbf24',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '800', color: '#000' }}>
              Platform Analytics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#000' }}>{stats.total}</div>
                <div style={{ fontSize: '16px', color: '#000' }}>Total Businesses</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#000' }}>{states.length}</div>
                <div style={{ fontSize: '16px', color: '#000' }}>States Covered</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#000' }}>{stats.featured}</div>
                <div style={{ fontSize: '16px', color: '#000' }}>Featured Listings</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: '800', color: '#000' }}>
                  {((stats.featured / stats.total) * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '16px', color: '#000' }}>Featured Rate</div>
              </div>
            </div>
          </div>

          {/* State Breakdown */}
          <div style={{
            background: '#fff',
            border: '3px solid #fbbf24',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '800', color: '#000' }}>
              State Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {states.map(state => {
                const stateCompanies = allCompanies.filter(c => c.state === state);
                return (
                  <div key={state} style={{
                    background: '#fef3c7',
                    padding: '12px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontWeight: '700', color: '#000' }}>{state}</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>
                      {stateCompanies.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
