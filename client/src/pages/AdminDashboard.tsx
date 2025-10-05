import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Company } from "@shared/schema";
import { CheckCircle, X, Edit, LogOut, UserPlus, Search, AlertTriangle, Ban, DollarSign, TrendingUp, Users, Building2, Filter } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'payments' | 'analytics'>('pending');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  
  const { data: pendingCompanies = [], isLoading: pendingLoading } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies/pending'],
    enabled: !!user?.isAdmin,
  });

  const { data: activeCompanies = [], isLoading: activeLoading } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies/active'],
    enabled: !!user?.isAdmin && activeTab === 'active',
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('/api/admin/companies/:id/status', {
        method: 'PATCH',
        body: { status: 'approved' },
        params: { id: id.toString() },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
    },
  });

  const denyMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('/api/admin/companies/:id/status', {
        method: 'PATCH',
        body: { status: 'denied' },
        params: { id: id.toString() },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/pending'] });
    },
  });

  const sendReminderMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('/api/admin/companies/:id/send-reminder', {
        method: 'POST',
        params: { id: id.toString() },
      });
    },
    onSuccess: (data: any) => {
      alert(data.message || 'Payment reminder sent!');
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
    },
  });

  const sendWarningMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('/api/admin/companies/:id/send-warning', {
        method: 'POST',
        params: { id: id.toString() },
      });
    },
    onSuccess: (data: any) => {
      alert(data.message || 'Warning sent!');
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('/api/admin/companies/:id/cancel-subscription', {
        method: 'POST',
        params: { id: id.toString() },
      });
    },
    onSuccess: (data: any) => {
      alert(data.message || 'Subscription cancelled!');
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('/api/admin/companies/:id/reactivate', {
        method: 'POST',
        params: { id: id.toString() },
      });
    },
    onSuccess: (data: any) => {
      alert(data.message || 'Subscription reactivated!');
      queryClient.invalidateQueries({ queryKey: ['/api/admin/companies/active'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
    },
  });

  const handleLogout = async () => {
    localStorage.removeItem('auth_token');
    await apiRequest('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  if (authLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Please log in to access admin dashboard</h2>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            background: '#fbbf24',
            color: '#000',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
          data-testid="button-login"
        >
          Log In
        </button>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  const filteredCompanies = (activeTab === 'pending' ? pendingCompanies : activeCompanies).filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.subscriptionStatus === statusFilter;
    const matchesTier = tierFilter === 'all' || company.subscriptionTier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const stats = {
    totalActive: activeCompanies.length,
    totalPending: pendingCompanies.length,
    featuredCount: activeCompanies.filter(c => c.subscriptionTier === 'featured').length,
    pastDue: activeCompanies.filter(c => c.subscriptionStatus === 'past_due').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setLocation('/')}
            style={{
              background: '#e5e7eb',
              color: '#000',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            data-testid="button-home"
          >
            Back to Home
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            data-testid="button-logout"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Building2 size={24} color="#166534" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Active Businesses</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.totalActive}</div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <AlertTriangle size={24} color="#f59e0b" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Pending Approval</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.totalPending}</div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <TrendingUp size={24} color="#8b5cf6" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Featured Tier</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.featuredCount}</div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <DollarSign size={24} color="#ef4444" />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Past Due</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>{stats.pastDue}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '8px',
        marginBottom: '20px',
        display: 'flex',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        {(['pending', 'active', 'payments', 'analytics'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '12px',
              background: activeTab === tab ? '#fbbf24' : 'transparent',
              color: activeTab === tab ? '#000' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
            data-testid={`tab-${tab}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      {(activeTab === 'pending' || activeTab === 'active') && (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                }}
                data-testid="input-search"
              />
            </div>

            {activeTab === 'active' && (
              <>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  style={{
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: '#fff',
                  }}
                  data-testid="select-tier"
                >
                  <option value="all">All Tiers</option>
                  <option value="free">Free</option>
                  <option value="featured">Featured</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: '#fff',
                  }}
                  data-testid="select-status"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="past_due">Past Due</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </>
            )}
          </div>
        </div>
      )}

      {/* Companies List */}
      {(activeTab === 'pending' || activeTab === 'active') && (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700' }}>
            {activeTab === 'pending' ? 'Pending Approvals' : 'Active Businesses'}
          </h2>
          
          {(activeTab === 'pending' ? pendingLoading : activeLoading) ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          ) : filteredCompanies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No businesses found
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                  data-testid={`company-${company.id}`}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700' }}>
                      {company.name}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                      {company.city}, {company.state} • {company.phone}
                    </div>
                    {activeTab === 'active' && (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{
                          background: company.subscriptionTier === 'featured' ? '#fbbf24' : '#e5e7eb',
                          color: '#000',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {company.subscriptionTier === 'featured' ? 'FEATURED' : 'FREE'}
                        </span>
                        <span style={{
                          background: company.subscriptionStatus === 'active' ? '#10b981' : 
                                     company.subscriptionStatus === 'past_due' ? '#ef4444' : '#6b7280',
                          color: '#fff',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {company.subscriptionStatus?.toUpperCase()}
                        </span>
                        {company.paymentWarnings > 0 && (
                          <span style={{
                            color: '#ef4444',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}>
                            ⚠️ {company.paymentWarnings} warning(s)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {activeTab === 'pending' ? (
                      <>
                        <button
                          onClick={() => approveMutation.mutate(company.id)}
                          disabled={approveMutation.isPending}
                          style={{
                            background: '#10b981',
                            color: '#fff',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          data-testid={`approve-${company.id}`}
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button
                          onClick={() => denyMutation.mutate(company.id)}
                          disabled={denyMutation.isPending}
                          style={{
                            background: '#ef4444',
                            color: '#fff',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                          data-testid={`deny-${company.id}`}
                        >
                          <X size={16} /> Deny
                        </button>
                      </>
                    ) : (
                      <>
                        {company.subscriptionTier === 'featured' && company.subscriptionStatus !== 'active' && (
                          <>
                            <button
                              onClick={() => sendReminderMutation.mutate(company.id)}
                              disabled={sendReminderMutation.isPending}
                              style={{
                                background: '#fbbf24',
                                color: '#000',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                              data-testid={`reminder-${company.id}`}
                            >
                              💰 Reminder
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Send warning to ${company.name}? This will increment their warning count.`)) {
                                  sendWarningMutation.mutate(company.id);
                                }
                              }}
                              disabled={sendWarningMutation.isPending}
                              style={{
                                background: '#f59e0b',
                                color: '#fff',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                              data-testid={`warning-${company.id}`}
                            >
                              ⚠️ Warning
                            </button>
                          </>
                        )}
                        {company.subscriptionStatus === 'cancelled' ? (
                          <button
                            onClick={() => {
                              if (confirm(`Reactivate subscription for ${company.name}?`)) {
                                reactivateMutation.mutate(company.id);
                              }
                            }}
                            disabled={reactivateMutation.isPending}
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              padding: '8px 16px',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                            data-testid={`reactivate-${company.id}`}
                          >
                            ✅ Reactivate
                          </button>
                        ) : company.subscriptionTier === 'featured' && (
                          <button
                            onClick={() => {
                              if (confirm(`Cancel subscription for ${company.name}? This will remove them from the directory.`)) {
                                cancelSubscriptionMutation.mutate(company.id);
                              }
                            }}
                            disabled={cancelSubscriptionMutation.isPending}
                            style={{
                              background: '#ef4444',
                              color: '#fff',
                              padding: '8px 16px',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                            data-testid={`cancel-${company.id}`}
                          >
                            <Ban size={16} /> Cancel
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700' }}>
            Payment Management
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Track subscriptions, send payment reminders, and manage billing.
          </p>
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Payment management features coming soon...
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '700' }}>
            Analytics & Reports
          </h2>
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Analytics dashboard coming soon...
          </div>
        </div>
      )}
    </div>
  );
}
