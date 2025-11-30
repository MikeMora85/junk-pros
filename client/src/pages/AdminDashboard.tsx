import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Company } from "@shared/schema";
import { Menu, X, Search, Plus, Building2, MapPin, Phone, Mail, Star, DollarSign, AlertCircle, CheckCircle, Eye, Trash2, Edit3, RefreshCw, CreditCard, Users, Send, XCircle } from "lucide-react";
import { useLocation } from "wouter";

interface Subscriber {
  id: number;
  email: string;
  companyId: number | null;
  companyName: string | null;
  companyPhone: string | null;
  companyCity: string | null;
  companyState: string | null;
  subscriptionTier: string;
  subscriptionStatus: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string | null;
  stripeData: {
    customerEmail: string | null;
    customerPhone: string | null;
    customerName: string | null;
    subscription: {
      id: string;
      status: string;
      currentPeriodStart: number;
      currentPeriodEnd: number;
      cancelAtPeriodEnd: boolean;
      canceledAt: number | null;
    } | null;
    paymentMethod: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    } | null;
    lifetimeValue: number;
    invoiceCount: number;
  } | null;
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'active' | 'unclaimed' | 'featured' | 'analytics' | 'subscribers' | 'financials'>('active');
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddUnclaimed, setShowAddUnclaimed] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  const [subscriberFilter, setSubscriberFilter] = useState<string>("all");
  const [expandedSubscriber, setExpandedSubscriber] = useState<number | null>(null);
  const [showEmailBlast, setShowEmailBlast] = useState(false);
  const [emailBlastForm, setEmailBlastForm] = useState({ subject: "", message: "", recipientFilter: "all" });
  
  // Add Unclaimed Business Form State
  const [unclaimedForm, setUnclaimedForm] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    address: "",
  });

  const { data: pendingCompanies = [], isLoading: pendingLoading, refetch: refetchPending } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies/pending'],
    enabled: !!user?.isAdmin,
  });

  const { data: activeCompanies = [], isLoading: activeLoading, refetch: refetchActive } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies/active'],
    enabled: !!user?.isAdmin,
  });

  const { data: subscribers = [], isLoading: subscribersLoading, refetch: refetchSubscribers } = useQuery<Subscriber[]>({
    queryKey: ['/api/admin/subscribers'],
    enabled: !!user?.isAdmin,
  });

  interface FinancialData {
    weekly: number;
    monthly: number;
    yearly: number;
    totalTransactions: number;
    activeSubscriptions: number;
    mrr: number;
    recentTransactions: {
      id: string;
      amount: number;
      date: string;
      customerEmail: string;
      description: string;
    }[];
  }

  const { data: financials, isLoading: financialsLoading, refetch: refetchFinancials } = useQuery<FinancialData>({
    queryKey: ['/api/admin/financials'],
    enabled: !!user?.isAdmin && activeTab === 'financials',
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/subscribers/${id}/cancel`, { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscribers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
      alert('Subscription cancelled successfully!');
    },
    onError: (error: any) => {
      alert(`Failed to cancel subscription: ${error.message || 'Unknown error'}`);
    },
  });

  const emailBlastMutation = useMutation({
    mutationFn: async (data: { subject: string; message: string; recipientFilter: string }) => {
      return await apiRequest('/api/admin/email-blast', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (result: any) => {
      alert(`Email blast sent! ${result.sent} emails sent, ${result.failed} failed.`);
      setShowEmailBlast(false);
      setEmailBlastForm({ subject: "", message: "", recipientFilter: "all" });
    },
    onError: (error: any) => {
      alert(`Failed to send email blast: ${error.message || 'Unknown error'}`);
    },
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

  const updateDisplayOrderMutation = useMutation({
    mutationFn: async ({ id, displayOrder }: { id: number; displayOrder: number }) => {
      await apiRequest(`/api/admin/companies/${id}/display-order`, {
        method: 'PATCH',
        body: { displayOrder },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
    },
  });

  const updateBadgeMutation = useMutation({
    mutationFn: async ({ id, badge }: { id: number; badge: string | null }) => {
      await apiRequest(`/api/admin/companies/${id}/badge`, {
        method: 'PATCH',
        body: { badge },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
      alert('Badge saved!');
    },
    onError: (error: any) => {
      alert(`Failed to save badge: ${error.message || 'Unknown error'}`);
    },
  });

  const sendWarningMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/companies/${id}/send-warning`, {
        method: 'POST',
        body: {},
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
      alert('Warning sent successfully!');
    },
    onError: () => {
      alert('Failed to send warning');
    },
  });

  const confirmReviewCountMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/admin/companies/${id}/confirm-review-count`, {
        method: 'POST',
        body: {},
      });
    },
    onSuccess: () => {
      alert('Review count confirmed and notification sent!');
    },
    onError: () => {
      alert('Failed to confirm review count');
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
              border: '1px solid #e5e7eb',
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
  const featuredCompanies = allCompanies.filter(c => c.subscriptionTier === 'premium');
  
  // Get unique states (case-insensitive) - preserve the properly capitalized version
  const stateMap = new Map<string, string>();
  allCompanies.forEach(c => {
    const lowerState = c.state.toLowerCase();
    if (!stateMap.has(lowerState)) {
      // Use the first properly capitalized version we encounter
      stateMap.set(lowerState, c.state);
    }
  });
  const states = Array.from(stateMap.values()).sort();
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

  // Show only recent if toggle is on
  if (showRecentOnly) {
    displayCompanies = displayCompanies.slice(0, 20);
  }

  const stats = {
    total: allCompanies.length,
    active: activeCompanies.length,
    unclaimed: unclaimedCompanies.length,
    featured: featuredCompanies.length,
  };

  const handleRefresh = async () => {
    const results = await Promise.all([
      refetchActive(),
      refetchPending()
    ]);
    // Show toast notification
    alert(`Refreshed! ${results[0].data?.length || 0} companies loaded.`);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header - Yellow/Black - Compact */}
      <div style={{
        background: '#fbbf24',
        borderBottom: '2px solid #e5e7eb',
        padding: '10px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '18px',
              fontWeight: '800', 
              color: '#000',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              lineHeight: 1,
            }}>
              Admin <span style={{ fontWeight: '400', fontSize: '14px', opacity: 0.8 }}>({stats.total})</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button
              onClick={handleRefresh}
              style={{
                background: '#f59e0b',
                color: '#000',
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Refresh data"
              data-testid="button-refresh"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: '#f59e0b',
                color: '#000',
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              data-testid="button-menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '20px',
            background: '#fff',
            border: '2px solid #fbbf24',
            borderRadius: '12px',
            padding: '8px',
            marginTop: '8px',
            minWidth: '200px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <button
              onClick={() => { setLocation('/'); setMenuOpen(false); }}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#000',
                border: 'none',
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fef3c7'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Home
            </button>
            <button
              onClick={async () => {
                await apiRequest('/api/auth/logout', { method: 'POST' });
                setLocation('/');
              }}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#000',
                border: 'none',
                padding: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fef3c7'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Logout
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        padding: '16px',
        background: '#f9fafb',
      }}>
        <div style={{
          background: '#fff',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <Building2 size={24} color="#000" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#000' }}>{stats.active}</div>
          <div style={{ fontSize: '12px', color: '#000', fontWeight: '600' }}>Active</div>
        </div>
        <div style={{
          background: '#fff',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <AlertCircle size={24} color="#000" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#000' }}>{stats.unclaimed}</div>
          <div style={{ fontSize: '12px', color: '#000', fontWeight: '600' }}>Unclaimed</div>
        </div>
        <div style={{
          background: '#fff',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <Star size={24} color="#000" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#000' }}>{stats.featured}</div>
          <div style={{ fontSize: '12px', color: '#000', fontWeight: '600' }}>Featured</div>
        </div>
        <div style={{
          background: '#fff',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <MapPin size={24} color="#000" style={{ margin: '0 auto 6px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#000' }}>{states.length}</div>
          <div style={{ fontSize: '12px', color: '#000', fontWeight: '600' }}>States</div>
        </div>
      </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#fbbf24',
        borderBottom: '2px solid #e5e7eb',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
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
          { id: 'subscribers', label: 'Subscribers', count: subscribers.length },
          { id: 'financials', label: 'Financials', count: null },
          { id: 'analytics', label: 'Analytics', count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? '#fff' : 'transparent',
              color: '#000',
              border: 'none',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #000' : '2px solid transparent',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            data-testid={`tab-${tab.id}`}
          >
            {tab.label} {tab.count !== null && `(${tab.count})`}
          </button>
        ))}
        </div>
      </div>

      {/* Filters & Search */}
      {activeTab !== 'analytics' && (
        <div style={{ padding: '16px', background: '#fff', borderBottom: '2px solid #fbbf24' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(auto-fit, minmax(250px, 1fr))' : '1fr',
            gap: '12px', 
            marginBottom: '16px' 
          }}>
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
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
                data-testid="input-search"
              />
            </div>

            {/* Show Recent Toggle */}
            <button
              onClick={() => setShowRecentOnly(!showRecentOnly)}
              style={{
                width: '100%',
                padding: '12px',
                background: showRecentOnly ? '#fbbf24' : '#fff',
                color: '#000',
                border: '2px solid #fbbf24',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
              data-testid="button-show-recent"
            >
              {showRecentOnly ? '✓ Showing 20 Newest' : 'Show 20 Newest Only'}
            </button>
            
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
                border: '1px solid #e5e7eb',
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
                  border: '1px solid #e5e7eb',
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
              background: '#fbbf24',
              color: '#000',
              padding: '12px 20px',
              border: 'none',
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
        </div>
      )}

      {/* Add Unclaimed Form */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
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
                border: '1px solid #e5e7eb',
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
                border: '1px solid #e5e7eb',
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
                border: '1px solid #e5e7eb',
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
                border: '1px solid #e5e7eb',
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
                border: '1px solid #e5e7eb',
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
                border: '1px solid #e5e7eb',
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
                border: '1px solid #e5e7eb',
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
      </div>

      {/* Companies List */}
      {activeTab !== 'analytics' && (
        <div style={{ padding: '20px', background: '#f9fafb', minHeight: 'calc(100vh - 300px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600', color: '#000' }}>
            Showing {displayCompanies.length} businesses
          </div>
          {displayCompanies.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              background: '#fff',
              borderRadius: '12px',
              border: '2px solid #fbbf24',
            }}>
              <AlertCircle size={48} color="#000" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '18px', color: '#000', margin: 0 }}>No businesses found</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {displayCompanies.map((company) => (
                <div
                  key={company.id}
                  style={{
                    background: '#fff',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '16px' }}>
                    {/* Company Name */}
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '20px', 
                      fontWeight: '800', 
                      color: '#000',
                      lineHeight: 1.2,
                    }}>
                      {company.name}
                    </h3>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {company.badge && (
                        <span style={{
                          background: '#16a34a',
                          color: '#fff',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          ✓ {company.badge}
                        </span>
                      )}
                      {company.subscriptionTier === 'featured' && (
                        <span style={{
                          background: '#fbbf24',
                          color: '#000',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}>
                          ⭐ FEATURED
                        </span>
                      )}
                      {!company.claimed && (
                        <span style={{
                          background: '#e5e7eb',
                          color: '#000',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                        }}>
                          UNCLAIMED
                        </span>
                      )}
                      <span style={{
                        background: '#e5e7eb',
                        color: '#000',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '700',
                      }}>
                        Order: {company.displayOrder ?? 999}
                      </span>
                    </div>

                    {/* Location & Phone */}
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      <MapPin size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      {company.city}, {company.state}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                      <Phone size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      {company.phone}
                    </div>

                    {/* Actions Button - Full Width */}
                    <button
                      onClick={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
                      style={{
                        width: '100%',
                        background: '#fbbf24',
                        color: '#000',
                        padding: '12px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                      data-testid={`button-actions-${company.id}`}
                    >
                      {expandedCompany === company.id ? 'Close' : 'Actions'}
                    </button>
                  </div>

                  {/* Actions Menu */}
                  {expandedCompany === company.id && (
                    <div style={{
                      padding: '16px',
                      paddingTop: '0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}>
                      <button
                        onClick={() => window.open(`/${company.state.toLowerCase()}/${company.city.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
                        style={{
                          background: '#fff',
                          color: '#000',
                          padding: '12px',
                          border: '2px solid #fbbf24',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <Eye size={20} />
                        View Profile
                      </button>

                      {/* Warning Button */}
                      <button
                        onClick={() => {
                          if (confirm(`Send payment warning to ${company.name}? This will increment their warning count and send a notification.`)) {
                            sendWarningMutation.mutate(company.id);
                          }
                        }}
                        style={{
                          background: '#f97316',
                          color: '#fff',
                          padding: '12px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                        data-testid={`button-warning-${company.id}`}
                      >
                        <AlertCircle size={20} />
                        Send Warning {company.paymentWarnings ? `(${company.paymentWarnings})` : ''}
                      </button>

                      {/* Confirm Review Count Button */}
                      <button
                        onClick={() => confirmReviewCountMutation.mutate(company.id)}
                        style={{
                          background: '#10b981',
                          color: '#fff',
                          padding: '12px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                        data-testid={`button-confirm-reviews-${company.id}`}
                      >
                        <CheckCircle size={20} />
                        Confirm Review Count ({company.reviews || 0})
                      </button>

                      {/* Display Order Control */}
                      <div style={{
                        background: '#fff',
                        padding: '12px',
                        border: '2px solid #fbbf24',
                        borderRadius: '8px',
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: '#000' }}>
                          Display Order in {company.city}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                          Lower numbers appear first within the same tier
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input
                            type="number"
                            value={company.displayOrder ?? 999}
                            onChange={(e) => {
                              const newOrder = parseInt(e.target.value) || 999;
                              updateDisplayOrderMutation.mutate({ id: company.id, displayOrder: newOrder });
                            }}
                            style={{
                              width: '100%',
                              padding: '10px',
                              border: '2px solid #fbbf24',
                              borderRadius: '6px',
                              fontSize: '16px',
                              fontWeight: '600',
                              boxSizing: 'border-box',
                            }}
                            data-testid={`input-order-${company.id}`}
                          />
                          <button
                            onClick={() => {
                              // Find minimum displayOrder in this city (same tier)
                              const sameCityCompanies = displayCompanies.filter(c => 
                                c.city === company.city && 
                                c.state === company.state &&
                                c.subscriptionTier === company.subscriptionTier
                              );
                              const minOrder = Math.min(...sameCityCompanies.map(c => c.displayOrder ?? 999));
                              const topOrder = Math.max(1, minOrder - 1);
                              updateDisplayOrderMutation.mutate({ id: company.id, displayOrder: topOrder });
                            }}
                            style={{
                              width: '100%',
                              background: '#16a34a',
                              color: '#fff',
                              padding: '10px 16px',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                            data-testid={`button-top-${company.id}`}
                          >
                            Move to Top in City
                          </button>
                        </div>
                      </div>

                      {/* Badge Control */}
                      <div style={{
                        background: '#fff',
                        padding: '12px',
                        border: '2px solid #fbbf24',
                        borderRadius: '8px',
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#000' }}>
                          Badge/Banner
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <button
                              onClick={() => updateBadgeMutation.mutate({ id: company.id, badge: 'TOP RATED' })}
                              style={{
                                background: company.badge === 'TOP RATED' ? '#16a34a' : '#fff',
                                color: company.badge === 'TOP RATED' ? '#fff' : '#000',
                                padding: '8px',
                                border: '2px solid #fbbf24',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                              data-testid={`button-badge-toprated-${company.id}`}
                            >
                              TOP RATED
                            </button>
                            <button
                              onClick={() => updateBadgeMutation.mutate({ id: company.id, badge: 'BEST VALUE' })}
                              style={{
                                background: company.badge === 'BEST VALUE' ? '#16a34a' : '#fff',
                                color: company.badge === 'BEST VALUE' ? '#fff' : '#000',
                                padding: '8px',
                                border: '2px solid #fbbf24',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                              data-testid={`button-badge-bestvalue-${company.id}`}
                            >
                              BEST VALUE
                            </button>
                            <button
                              onClick={() => updateBadgeMutation.mutate({ id: company.id, badge: 'FASTEST' })}
                              style={{
                                background: company.badge === 'FASTEST' ? '#16a34a' : '#fff',
                                color: company.badge === 'FASTEST' ? '#fff' : '#000',
                                padding: '8px',
                                border: '2px solid #fbbf24',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                              data-testid={`button-badge-fastest-${company.id}`}
                            >
                              FASTEST
                            </button>
                            <button
                              onClick={() => updateBadgeMutation.mutate({ id: company.id, badge: 'VERIFIED' })}
                              style={{
                                background: company.badge === 'VERIFIED' ? '#16a34a' : '#fff',
                                color: company.badge === 'VERIFIED' ? '#fff' : '#000',
                                padding: '8px',
                                border: '2px solid #fbbf24',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                              }}
                              data-testid={`button-badge-verified-${company.id}`}
                            >
                              VERIFIED
                            </button>
                          </div>
                          <button
                            onClick={() => updateBadgeMutation.mutate({ id: company.id, badge: null })}
                            style={{
                              background: '#ef4444',
                              color: '#fff',
                              padding: '8px',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                            data-testid={`button-badge-remove-${company.id}`}
                          >
                            Remove Badge
                          </button>
                        </div>
                      </div>
                      {!company.claimed && (
                        <button
                          onClick={() => claimMutation.mutate(company.id)}
                          style={{
                            background: '#10b981',
                            color: '#fff',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
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
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
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
        </div>
      )}

      {/* Financials Tab */}
      {activeTab === 'financials' && (
        <div style={{ padding: '20px', background: '#f9fafb', minHeight: 'calc(100vh - 300px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#000' }}>
                Financial Overview
              </h2>
              <button
                onClick={() => refetchFinancials()}
                style={{
                  background: '#fbbf24',
                  color: '#000',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Refresh Data
              </button>
            </div>

            {financialsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>Loading financial data...</div>
            ) : financials ? (
              <>
                {/* Revenue Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    background: '#fff',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>This Week</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#16a34a' }}>
                      ${financials.weekly.toFixed(2)}
                    </div>
                  </div>
                  <div style={{
                    background: '#fff',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>This Month</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#16a34a' }}>
                      ${financials.monthly.toFixed(2)}
                    </div>
                  </div>
                  <div style={{
                    background: '#fff',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>This Year</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#16a34a' }}>
                      ${financials.yearly.toFixed(2)}
                    </div>
                  </div>
                  <div style={{
                    background: '#fff',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Monthly Recurring</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#16a34a' }}>
                      ${financials.mrr.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Active Subscriptions</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#000' }}>
                      {financials.activeSubscriptions}
                    </div>
                  </div>
                  <div style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Transactions</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: '#000' }}>
                      {financials.totalTransactions}
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div style={{
                  background: '#fff',
                  border: '2px solid #fbbf24',
                  borderRadius: '12px',
                  padding: '20px',
                }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#000' }}>
                    Recent Transactions
                  </h3>
                  {financials.recentTransactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                      No transactions yet
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f9fafb' }}>
                            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Date</th>
                            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Customer</th>
                            <th style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Description</th>
                            <th style={{ textAlign: 'right', padding: '12px', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {financials.recentTransactions.map((tx) => (
                            <tr key={tx.id}>
                              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                {new Date(tx.date).toLocaleDateString()}
                              </td>
                              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                {tx.customerEmail}
                              </td>
                              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb' }}>
                                {tx.description}
                              </td>
                              <td style={{ padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'right', fontWeight: '700', color: '#16a34a' }}>
                                ${tx.amount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Failed to load financial data. Please try refreshing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{ padding: '20px', background: '#f9fafb', minHeight: 'calc(100vh - 300px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            background: '#fff',
            border: '2px solid #fbbf24',
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
            border: '2px solid #fbbf24',
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
                    background: '#fff',
                    border: '2px solid #fbbf24',
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
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div style={{ padding: '20px', background: '#f9fafb', minHeight: 'calc(100vh - 300px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            
            {/* Subscriber Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <div style={{
                background: '#fff',
                border: '2px solid #fbbf24',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}>
                <Users size={24} color="#000" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#000' }}>{subscribers.length}</div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Total Subscribers</div>
              </div>
              <div style={{
                background: '#fff',
                border: '2px solid #16a34a',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}>
                <Star size={24} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#16a34a' }}>
                  {subscribers.filter(s => s.subscriptionTier === 'premium').length}
                </div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Featured ($49)</div>
              </div>
              <div style={{
                background: '#fff',
                border: '2px solid #2563eb',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}>
                <CheckCircle size={24} color="#2563eb" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#2563eb' }}>
                  {subscribers.filter(s => s.subscriptionTier === 'standard').length}
                </div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Professional ($10)</div>
              </div>
              <div style={{
                background: '#fff',
                border: '2px solid #dc2626',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}>
                <XCircle size={24} color="#dc2626" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#dc2626' }}>
                  {subscribers.filter(s => s.subscriptionStatus === 'cancelled' || s.subscriptionStatus === 'past_due').length}
                </div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Cancelled/Past Due</div>
              </div>
              <div style={{
                background: '#fff',
                border: '2px solid #fbbf24',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}>
                <DollarSign size={24} color="#000" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#000' }}>
                  ${subscribers.reduce((sum, s) => sum + (s.stripeData?.lifetimeValue || 0), 0).toFixed(0)}
                </div>
                <div style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Total Revenue</div>
              </div>
            </div>

            {/* Filters and Email Blast Button */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}>
              <select
                value={subscriberFilter}
                onChange={(e) => setSubscriberFilter(e.target.value)}
                style={{
                  padding: '12px',
                  border: '2px solid #fbbf24',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: '#fff',
                }}
                data-testid="select-subscriber-filter"
              >
                <option value="all">All Subscribers</option>
                <option value="premium">Featured Only ($49)</option>
                <option value="standard">Professional Only ($10)</option>
                <option value="basic">Basic Only (Free)</option>
                <option value="active">Active Only</option>
                <option value="cancelled">Cancelled</option>
                <option value="past_due">Past Due</option>
              </select>
              <button
                onClick={() => setShowEmailBlast(!showEmailBlast)}
                style={{
                  background: '#fbbf24',
                  color: '#000',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                data-testid="button-email-blast"
              >
                <Send size={18} />
                Send Email Blast
              </button>
              <button
                onClick={() => refetchSubscribers()}
                style={{
                  background: '#fff',
                  color: '#000',
                  padding: '12px',
                  border: '2px solid #fbbf24',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                data-testid="button-refresh-subscribers"
              >
                <RefreshCw size={18} />
              </button>
            </div>

            {/* Email Blast Form */}
            {showEmailBlast && (
              <div style={{
                background: '#fff',
                border: '3px solid #fbbf24',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '800', color: '#000' }}>
                  Send Email Blast
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <select
                    value={emailBlastForm.recipientFilter}
                    onChange={(e) => setEmailBlastForm(prev => ({ ...prev, recipientFilter: e.target.value }))}
                    style={{
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                    }}
                    data-testid="select-email-recipient-filter"
                  >
                    <option value="all">All Subscribers</option>
                    <option value="premium">Featured Only ($49)</option>
                    <option value="standard">Professional Only ($10)</option>
                    <option value="basic">Basic Only (Free)</option>
                    <option value="active">Active Only</option>
                    <option value="cancelled">Cancelled Only</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Email Subject"
                    value={emailBlastForm.subject}
                    onChange={(e) => setEmailBlastForm(prev => ({ ...prev, subject: e.target.value }))}
                    style={{
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                    }}
                    data-testid="input-email-subject"
                  />
                  <textarea
                    placeholder="Email Message..."
                    value={emailBlastForm.message}
                    onChange={(e) => setEmailBlastForm(prev => ({ ...prev, message: e.target.value }))}
                    style={{
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      minHeight: '150px',
                      resize: 'vertical',
                    }}
                    data-testid="input-email-message"
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => emailBlastMutation.mutate(emailBlastForm)}
                      disabled={emailBlastMutation.isPending || !emailBlastForm.subject || !emailBlastForm.message}
                      style={{
                        flex: 1,
                        background: emailBlastMutation.isPending ? '#ccc' : '#fbbf24',
                        color: '#000',
                        padding: '12px',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: emailBlastMutation.isPending ? 'not-allowed' : 'pointer',
                      }}
                      data-testid="button-send-email"
                    >
                      {emailBlastMutation.isPending ? 'Sending...' : 'Send Email Blast'}
                    </button>
                    <button
                      onClick={() => setShowEmailBlast(false)}
                      style={{
                        background: '#fff',
                        color: '#000',
                        padding: '12px 24px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                      data-testid="button-cancel-email"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Subscribers List */}
            {subscribersLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading subscribers...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {subscribers
                  .filter(sub => {
                    if (subscriberFilter === 'all') return true;
                    if (subscriberFilter === 'premium') return sub.subscriptionTier === 'premium';
                    if (subscriberFilter === 'standard') return sub.subscriptionTier === 'standard';
                    if (subscriberFilter === 'basic') return sub.subscriptionTier === 'basic';
                    if (subscriberFilter === 'active') return sub.subscriptionStatus === 'active';
                    if (subscriberFilter === 'cancelled') return sub.subscriptionStatus === 'cancelled';
                    if (subscriberFilter === 'past_due') return sub.subscriptionStatus === 'past_due';
                    return true;
                  })
                  .map(subscriber => (
                    <div
                      key={subscriber.id}
                      style={{
                        background: '#fff',
                        border: expandedSubscriber === subscriber.id ? '3px solid #fbbf24' : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Subscriber Header */}
                      <div
                        onClick={() => setExpandedSubscriber(expandedSubscriber === subscriber.id ? null : subscriber.id)}
                        style={{
                          padding: '16px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ fontWeight: '700', fontSize: '16px', color: '#000' }}>
                            {subscriber.companyName || 'No Company'}
                          </div>
                          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                            {subscriber.email}
                          </div>
                          {subscriber.companyCity && (
                            <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                              {subscriber.companyCity}, {subscriber.companyState}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* Tier Badge */}
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background: subscriber.subscriptionTier === 'premium' ? '#16a34a' :
                                        subscriber.subscriptionTier === 'standard' ? '#2563eb' : '#9ca3af',
                            color: '#fff',
                          }}>
                            {subscriber.subscriptionTier === 'premium' ? 'FEATURED $49' :
                             subscriber.subscriptionTier === 'standard' ? 'PRO $10' : 'BASIC'}
                          </span>
                          {/* Status Badge */}
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            background: subscriber.subscriptionStatus === 'active' ? '#dcfce7' :
                                        subscriber.subscriptionStatus === 'past_due' ? '#fef3c7' : '#fee2e2',
                            color: subscriber.subscriptionStatus === 'active' ? '#16a34a' :
                                   subscriber.subscriptionStatus === 'past_due' ? '#d97706' : '#dc2626',
                          }}>
                            {subscriber.subscriptionStatus.toUpperCase()}
                          </span>
                          {/* Card Info */}
                          {subscriber.stripeData?.paymentMethod && (
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: '#f3f4f6',
                              color: '#374151',
                            }}>
                              <CreditCard size={14} />
                              {subscriber.stripeData.paymentMethod.brand?.toUpperCase()} ****{subscriber.stripeData.paymentMethod.last4}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedSubscriber === subscriber.id && (
                        <div style={{
                          padding: '16px',
                          borderTop: '2px solid #fbbf24',
                          background: '#fefce8',
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            {/* Contact Info */}
                            <div>
                              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: '#000' }}>Contact Info</h4>
                              <div style={{ fontSize: '14px', color: '#374151' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                  <Mail size={14} />
                                  {subscriber.email}
                                </div>
                                {subscriber.companyPhone && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Phone size={14} />
                                    {subscriber.companyPhone}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Payment Details */}
                            <div>
                              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: '#000' }}>Payment Details</h4>
                              <div style={{ fontSize: '14px', color: '#374151' }}>
                                {subscriber.stripeData?.paymentMethod ? (
                                  <>
                                    <div>Card: {subscriber.stripeData.paymentMethod.brand?.toUpperCase()} ****{subscriber.stripeData.paymentMethod.last4}</div>
                                    <div>Expires: {subscriber.stripeData.paymentMethod.expMonth}/{subscriber.stripeData.paymentMethod.expYear}</div>
                                  </>
                                ) : (
                                  <div style={{ color: '#999' }}>No card on file</div>
                                )}
                              </div>
                            </div>

                            {/* Subscription Details */}
                            <div>
                              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: '#000' }}>Subscription</h4>
                              <div style={{ fontSize: '14px', color: '#374151' }}>
                                {subscriber.stripeData?.subscription ? (
                                  <>
                                    <div>Status: {subscriber.stripeData.subscription.status}</div>
                                    <div>Next Billing: {new Date(subscriber.stripeData.subscription.currentPeriodEnd * 1000).toLocaleDateString()}</div>
                                    {subscriber.stripeData.subscription.cancelAtPeriodEnd && (
                                      <div style={{ color: '#dc2626' }}>Cancels at period end</div>
                                    )}
                                  </>
                                ) : (
                                  <div style={{ color: '#999' }}>No subscription</div>
                                )}
                              </div>
                            </div>

                            {/* Lifetime Value */}
                            <div>
                              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: '#000' }}>Lifetime Value</h4>
                              <div style={{ fontSize: '24px', fontWeight: '800', color: '#16a34a' }}>
                                ${(subscriber.stripeData?.lifetimeValue || 0).toFixed(2)}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                {subscriber.stripeData?.invoiceCount || 0} payments
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                            {subscriber.companyId && (
                              <button
                                onClick={() => setLocation(`/company/${subscriber.companyId}`)}
                                style={{
                                  background: '#fff',
                                  color: '#000',
                                  padding: '10px 20px',
                                  border: '2px solid #fbbf24',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                                data-testid={`button-view-company-${subscriber.id}`}
                              >
                                <Eye size={16} />
                                View Company
                              </button>
                            )}
                            {subscriber.stripeData?.subscription && subscriber.subscriptionStatus === 'active' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Cancel subscription for ${subscriber.companyName || subscriber.email}? This will downgrade them to Basic tier.`)) {
                                    cancelSubscriptionMutation.mutate(subscriber.id);
                                  }
                                }}
                                style={{
                                  background: '#dc2626',
                                  color: '#fff',
                                  padding: '10px 20px',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                                data-testid={`button-cancel-subscription-${subscriber.id}`}
                              >
                                <XCircle size={16} />
                                Cancel Subscription
                              </button>
                            )}
                          </div>

                          {/* Stripe IDs (for debugging) */}
                          <div style={{ marginTop: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '8px', fontSize: '11px', color: '#666' }}>
                            <div>Stripe Customer: {subscriber.stripeCustomerId || 'N/A'}</div>
                            <div>Stripe Subscription: {subscriber.stripeSubscriptionId || 'N/A'}</div>
                            <div>Joined: {subscriber.createdAt ? new Date(subscriber.createdAt).toLocaleDateString() : 'Unknown'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
