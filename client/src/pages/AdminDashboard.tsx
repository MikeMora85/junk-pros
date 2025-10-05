import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Company } from "@shared/schema";
import { Menu, ChevronDown, Home, LogOut, Search, Building2, AlertTriangle, TrendingUp, DollarSign, Mail, Plus, Edit } from "lucide-react";
import { useLocation } from "wouter";

interface ActionTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  color: string;
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'active' | 'payments' | 'analytics' | 'reports'>('active');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);
  const [actionsView, setActionsView] = useState<'list' | 'new' | 'edit' | null>(null);
  const [editingAction, setEditingAction] = useState<ActionTemplate | null>(null);
  const [analyticsStateFilter, setAnalyticsStateFilter] = useState<string>("all");
  const [analyticsCityFilter, setAnalyticsCityFilter] = useState<string>("all");
  const [actionTemplates, setActionTemplates] = useState<ActionTemplate[]>([
    {
      id: 'reminder',
      name: 'Payment Reminder',
      subject: 'Featured Listing Payment Due - BestJunkRemovalCompanies.com',
      body: 'Hello local junk hauler,\n\nThis is a friendly reminder that your Featured listing payment of $49 is due on {dueDate}.\n\nTo maintain your Featured status and continue receiving premium exposure on our high domain authority website, please submit payment at your earliest convenience.\n\nThank you for being part of our directory!\n\nBest regards,\nBestJunkRemovalCompanies.com Team',
      color: '#fbbf24'
    },
    {
      id: 'warning',
      name: 'Payment Warning',
      subject: 'URGENT: Payment Overdue - Action Required',
      body: 'Hello local junk hauler,\n\nYour Featured listing payment is now {daysOverdue} days overdue. This is warning #{warningNumber}.\n\nIf payment is not received within 5 business days, your listing will be downgraded to Free tier and lose Featured visibility and SEO traffic benefits.\n\nPlease contact us immediately to resolve this matter.\n\nBest regards,\nBestJunkRemovalCompanies.com Team',
      color: '#f59e0b'
    },
    {
      id: 'cancellation',
      name: 'Cancellation Notice',
      subject: 'Featured Subscription Cancelled - BestJunkRemovalCompanies.com',
      body: 'Hello local junk hauler,\n\nDue to non-payment, your Featured subscription has been cancelled and your listing has been removed from our directory.\n\nYou may reactivate at any time by logging into your account and updating your payment information to regain your premium exposure.\n\nIf you have questions, please contact our support team.\n\nBest regards,\nBestJunkRemovalCompanies.com Team',
      color: '#ef4444'
    },
    {
      id: 'reactivation',
      name: 'Reactivation Welcome',
      subject: 'Welcome Back! Your Featured Listing is Live',
      body: 'Hello local junk hauler,\n\nGreat news! Your Featured listing has been reactivated and is now live in our directory.\n\nYou\'ll start receiving premium visibility and local SEO traffic immediately. Thank you for being part of our network!\n\nBest regards,\nBestJunkRemovalCompanies.com Team',
      color: '#10b981'
    }
  ]);
  
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

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/companies/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
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
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }

  const filteredCompanies = activeCompanies.filter(company => {
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
    <div style={{ minHeight: '100vh', background: '#f9fafb', paddingBottom: '60px' }}>
      {/* Mobile-Friendly Header */}
      <div style={{
        background: '#fff',
        borderBottom: '2px solid #e5e7eb',
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#166534' }}>Admin</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent',
              border: '2px solid #166534',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            data-testid="button-menu"
          >
            <Menu size={24} color="#166534" />
          </button>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '60px',
            right: '16px',
            background: '#fff',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '200px',
            zIndex: 200,
          }}>
            <button
              onClick={() => {
                setLocation('/');
                setMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid #e5e7eb',
              }}
              data-testid="menu-home"
            >
              <Home size={20} color="#166534" />
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Back to Home</span>
            </button>
            <button
              onClick={() => {
                setActionsView('new');
                setEditingAction(null);
                setMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid #e5e7eb',
              }}
              data-testid="menu-new-action"
            >
              <Plus size={20} color="#166534" />
              <span style={{ fontSize: '16px', fontWeight: '500' }}>New Action</span>
            </button>
            <button
              onClick={() => {
                setActionsView('list');
                setMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid #e5e7eb',
              }}
              data-testid="menu-edit-actions"
            >
              <Edit size={20} color="#166534" />
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Edit Actions</span>
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
              data-testid="menu-logout"
            >
              <LogOut size={20} color="#ef4444" />
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#ef4444' }}>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid - Responsive */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        padding: '16px',
      }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Building2 size={20} color="#166534" />
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Active</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#000' }}>{stats.totalActive}</div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Pending</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#000' }}>{stats.totalPending}</div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <TrendingUp size={20} color="#8b5cf6" />
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Featured</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#000' }}>{stats.featuredCount}</div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <DollarSign size={20} color="#ef4444" />
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Past Due</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{stats.pastDue}</div>
        </div>
      </div>

      {/* Tabs - Mobile Scrollable */}
      <div style={{
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        padding: '8px 16px',
      }}>
        <div style={{ display: 'inline-flex', gap: '8px', minWidth: '100%' }}>
          {(['active', 'payments', 'analytics', 'reports'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? '#166534' : 'transparent',
                color: activeTab === tab ? '#fff' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
              }}
              data-testid={`tab-${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters - Mobile */}
      {activeTab === 'active' && (
        <div style={{ padding: '16px' }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              data-testid="input-search"
            />
          </div>

          {activeTab === 'active' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
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
                  flex: 1,
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: '#fff',
                }}
                data-testid="select-status"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="past_due">Past Due</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Companies List - Mobile Optimized */}
      {activeTab === 'active' && (
        <div style={{ padding: '0 16px 16px' }}>
          {activeLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading...</div>
          ) : filteredCompanies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No businesses found
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  style={{
                    background: '#fff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  {/* Company Header */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '700', color: '#000' }}>
                          {company.name}
                        </h3>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                          {company.city}, {company.state}
                        </div>
                        <div style={{ fontSize: '13px', color: '#6b7280' }}>
                          {company.phone}
                        </div>
                      </div>

                      {activeTab === 'active' && (
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => setExpandedCompany(expandedCompany === company.id ? null : company.id)}
                            style={{
                              background: '#166534',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            data-testid={`actions-${company.id}`}
                          >
                            Actions
                            <ChevronDown 
                              size={16} 
                              style={{ 
                                transform: expandedCompany === company.id ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                              }} 
                            />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {expandedCompany === company.id && (
                            <div style={{
                              position: 'absolute',
                              right: 0,
                              top: '100%',
                              marginTop: '4px',
                              background: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                              minWidth: '200px',
                              zIndex: 1000,
                              overflow: 'hidden',
                            }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <button
                                  onClick={() => {
                                    window.open(`/${company.state.toLowerCase()}/${company.city.toLowerCase()}/${company.id}`, '_blank');
                                    setExpandedCompany(null);
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    transition: 'background 0.15s',
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                  data-testid={`view-profile-${company.id}`}
                                >
                                  View Profile
                                </button>
                                
                                <button
                                  onClick={() => {
                                    const action = company.subscriptionStatus === 'active' ? 'pause' : 'resume';
                                    if (confirm(`${action === 'pause' ? 'Pause' : 'Resume'} ${company.name}?`)) {
                                      alert(`Pause/Resume coming soon!`);
                                    }
                                    setExpandedCompany(null);
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: company.subscriptionStatus === 'active' ? '#f59e0b' : '#10b981',
                                    transition: 'background 0.15s',
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                  data-testid={`pause-${company.id}`}
                                >
                                  {company.subscriptionStatus === 'active' ? 'Pause Profile' : 'Resume Profile'}
                                </button>
                                
                                <button
                                  onClick={() => {
                                    if (confirm(`⚠️ PERMANENTLY DELETE ${company.name}? This cannot be undone!`)) {
                                      deleteMutation.mutate(company.id);
                                    }
                                    setExpandedCompany(null);
                                  }}
                                  disabled={deleteMutation.isPending}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#ef4444',
                                    transition: 'background 0.15s',
                                    opacity: deleteMutation.isPending ? 0.5 : 1,
                                  }}
                                  onMouseEnter={(e) => !deleteMutation.isPending && (e.currentTarget.style.background = '#fef2f2')}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                  data-testid={`delete-${company.id}`}
                                >
                                  {deleteMutation.isPending ? 'Deleting...' : 'Delete Profile'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    {activeTab === 'active' && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                        <span style={{
                          background: company.subscriptionTier === 'featured' ? '#fbbf24' : '#e5e7eb',
                          color: '#000',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '700',
                        }}>
                          {company.subscriptionTier === 'featured' ? 'FEATURED' : 'FREE'}
                        </span>
                        <span style={{
                          background: company.subscriptionStatus === 'active' ? '#10b981' : 
                                     company.subscriptionStatus === 'past_due' ? '#ef4444' : '#6b7280',
                          color: '#fff',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '700',
                        }}>
                          {company.subscriptionStatus?.toUpperCase()}
                        </span>
                        {company.paymentWarnings > 0 && (
                          <span style={{
                            color: '#ef4444',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}>
                            ⚠️ {company.paymentWarnings} warning(s)
                          </span>
                        )}
                      </div>
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
        <div style={{ padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700' }}>
              Payment Management
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              Track subscriptions, send payment reminders, and manage billing.
            </p>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div style={{ padding: '16px' }}>
          {/* Search Filters */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#000' }}>
              Filter Analytics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#000' }}>
                  State
                </label>
                <select
                  value={analyticsStateFilter}
                  onChange={(e) => {
                    setAnalyticsStateFilter(e.target.value);
                    setAnalyticsCityFilter("all");
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    background: '#fff',
                  }}
                  data-testid="select-analytics-state"
                >
                  <option value="all">All States (Website-Wide)</option>
                  {Array.from(new Set([...pendingCompanies, ...activeCompanies].map(c => c.state))).sort().map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              {analyticsStateFilter !== "all" && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#000' }}>
                    City
                  </label>
                  <select
                    value={analyticsCityFilter}
                    onChange={(e) => setAnalyticsCityFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      background: '#fff',
                    }}
                    data-testid="select-analytics-city"
                  >
                    <option value="all">All Cities in {analyticsStateFilter}</option>
                    {Array.from(new Set([...pendingCompanies, ...activeCompanies]
                      .filter(c => c.state === analyticsStateFilter)
                      .map(c => c.city))).sort().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {(() => {
            const allCompanies = [...pendingCompanies, ...activeCompanies];
            const filteredAnalytics = allCompanies.filter(c => {
              if (analyticsStateFilter !== "all" && c.state !== analyticsStateFilter) return false;
              if (analyticsCityFilter !== "all" && c.city !== analyticsCityFilter) return false;
              return true;
            });

            const analyticsData = {
              total: filteredAnalytics.length,
              active: filteredAnalytics.filter(c => c.status === 'approved').length,
              pending: filteredAnalytics.filter(c => c.status === 'pending').length,
              denied: filteredAnalytics.filter(c => c.status === 'denied').length,
              featured: filteredAnalytics.filter(c => c.subscriptionTier === 'featured').length,
              free: filteredAnalytics.filter(c => c.subscriptionTier === 'free').length,
              activeSubscriptions: filteredAnalytics.filter(c => c.subscriptionStatus === 'active').length,
              pastDue: filteredAnalytics.filter(c => c.subscriptionStatus === 'past_due').length,
              cancelled: filteredAnalytics.filter(c => c.subscriptionStatus === 'cancelled').length,
              monthlyRevenue: filteredAnalytics.filter(c => c.subscriptionTier === 'featured' && c.subscriptionStatus === 'active').length * 49,
              potentialRevenue: filteredAnalytics.filter(c => c.subscriptionTier === 'featured').length * 49,
            };

            const locationLabel = analyticsCityFilter !== "all" 
              ? `${analyticsCityFilter}, ${analyticsStateFilter}`
              : analyticsStateFilter !== "all"
                ? analyticsStateFilter
                : "Website-Wide";

            return (
              <>
                {/* Overview Header */}
                <div style={{ background: '#166534', borderRadius: '12px', padding: '20px', marginBottom: '16px', color: '#fff' }}>
                  <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700' }}>
                    Analytics: {locationLabel}
                  </h2>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                    Complete business metrics and performance data
                  </p>
                </div>

                {/* Business Statistics Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '2px solid #e5e7eb' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px', fontWeight: '600' }}>Total Businesses</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#000' }}>{analyticsData.total}</div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '2px solid #10b981' }}>
                    <div style={{ fontSize: '13px', color: '#10b981', marginBottom: '6px', fontWeight: '600' }}>Active</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{analyticsData.active}</div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '2px solid #fbbf24' }}>
                    <div style={{ fontSize: '13px', color: '#f59e0b', marginBottom: '6px', fontWeight: '600' }}>Pending</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>{analyticsData.pending}</div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', border: '2px solid #ef4444' }}>
                    <div style={{ fontSize: '13px', color: '#ef4444', marginBottom: '6px', fontWeight: '600' }}>Denied</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>{analyticsData.denied}</div>
                  </div>
                </div>

                {/* Subscription Metrics */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#000' }}>
                    Subscription Metrics
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '16px'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Featured Tier</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#fbbf24' }}>{analyticsData.featured}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Free Tier</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#6b7280' }}>{analyticsData.free}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Active Subs</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{analyticsData.activeSubscriptions}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Past Due</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{analyticsData.pastDue}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Cancelled</div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>{analyticsData.cancelled}</div>
                    </div>
                  </div>
                </div>

                {/* Revenue Analytics */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#000' }}>
                    Revenue Analytics
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '16px'
                  }}>
                    <div style={{ background: '#dcfce7', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '13px', color: '#166534', marginBottom: '4px', fontWeight: '600' }}>Monthly Revenue (Active)</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#166534' }}>${analyticsData.monthlyRevenue}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        From {analyticsData.activeSubscriptions} active subscriptions
                      </div>
                    </div>
                    <div style={{ background: '#fef3c7', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '13px', color: '#92400e', marginBottom: '4px', fontWeight: '600' }}>Potential Revenue</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#92400e' }}>${analyticsData.potentialRevenue}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        If all {analyticsData.featured} featured paid
                      </div>
                    </div>
                    <div style={{ background: '#fee2e2', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ fontSize: '13px', color: '#991b1b', marginBottom: '4px', fontWeight: '600' }}>At Risk Revenue</div>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: '#991b1b' }}>${analyticsData.pastDue * 49}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        From {analyticsData.pastDue} past due accounts
                      </div>
                    </div>
                  </div>
                </div>

                {/* Geographic Breakdown */}
                {analyticsStateFilter === "all" && (
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#000' }}>
                      Geographic Distribution
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Array.from(new Set(allCompanies.map(c => c.state))).sort().map(state => {
                        const stateCompanies = allCompanies.filter(c => c.state === state);
                        const stateActive = stateCompanies.filter(c => c.status === 'approved').length;
                        const stateFeatured = stateCompanies.filter(c => c.subscriptionTier === 'featured').length;
                        return (
                          <div key={state} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '12px',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{ fontWeight: '600', color: '#000' }}>{state}</div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                              <span style={{ color: '#6b7280' }}>Total: <strong>{stateCompanies.length}</strong></span>
                              <span style={{ color: '#10b981' }}>Active: <strong>{stateActive}</strong></span>
                              <span style={{ color: '#fbbf24' }}>Featured: <strong>{stateFeatured}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* City Breakdown */}
                {analyticsStateFilter !== "all" && analyticsCityFilter === "all" && (
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#000' }}>
                      Cities in {analyticsStateFilter}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Array.from(new Set(allCompanies.filter(c => c.state === analyticsStateFilter).map(c => c.city))).sort().map(city => {
                        const cityCompanies = allCompanies.filter(c => c.state === analyticsStateFilter && c.city === city);
                        const cityActive = cityCompanies.filter(c => c.status === 'approved').length;
                        const cityFeatured = cityCompanies.filter(c => c.subscriptionTier === 'featured').length;
                        return (
                          <div key={city} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '12px',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}>
                            <div style={{ fontWeight: '600', color: '#000' }}>{city}</div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                              <span style={{ color: '#6b7280' }}>Total: <strong>{cityCompanies.length}</strong></span>
                              <span style={{ color: '#10b981' }}>Active: <strong>{cityActive}</strong></span>
                              <span style={{ color: '#fbbf24' }}>Featured: <strong>{cityFeatured}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Business List */}
                {filteredAnalytics.length > 0 && (
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginTop: '16px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#000' }}>
                      Business Details ({filteredAnalytics.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {filteredAnalytics.map(company => (
                        <div key={company.id} style={{ 
                          padding: '12px',
                          background: '#f9fafb',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '700', color: '#000', marginBottom: '4px' }}>{company.name}</div>
                              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                                {company.city}, {company.state} • {company.phone}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              <span style={{ 
                                background: company.status === 'approved' ? '#dcfce7' : company.status === 'pending' ? '#fef3c7' : '#fee2e2',
                                color: company.status === 'approved' ? '#166534' : company.status === 'pending' ? '#92400e' : '#991b1b',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {company.status?.toUpperCase() || 'PENDING'}
                              </span>
                              <span style={{ 
                                background: company.subscriptionTier === 'featured' ? '#fef3c7' : '#e5e7eb',
                                color: company.subscriptionTier === 'featured' ? '#92400e' : '#6b7280',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {company.subscriptionTier?.toUpperCase() || 'FREE'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div style={{ padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', marginBottom: '16px' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#000' }}>
              Monthly Performance Reports
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#6b7280' }}>
              Track clicks, calls, photo quotes, and in-person estimates for all businesses. Select a month below to view detailed performance data.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                  Month
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#fff',
                  }}
                >
                  <option>October 2025</option>
                  <option>September 2025</option>
                  <option>August 2025</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                  Filter by Tier
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: '#fff',
                  }}
                >
                  <option value="all">All Tiers</option>
                  <option value="featured">Featured Only</option>
                  <option value="free">Free Only</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeCompanies.slice(0, 5).map((company) => (
                <div
                  key={company.id}
                  style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    background: '#f9fafb',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#000' }}>
                        {company.name}
                      </h3>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {company.city}, {company.state}
                      </div>
                    </div>
                    <span style={{
                      background: company.subscriptionTier === 'featured' ? '#fef3c7' : '#e5e7eb',
                      color: company.subscriptionTier === 'featured' ? '#92400e' : '#6b7280',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {company.subscriptionTier?.toUpperCase() || 'FREE'}
                    </span>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '12px',
                    background: '#fff',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Profile Clicks</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#166534' }}>0</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Calls</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#166534' }}>0</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Photo Quotes</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#166534' }}>0</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>In-Person Estimates</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#166534' }}>0</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeCompanies.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                No active businesses to report on
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Templates Management Modal */}
      {actionsView && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '2px solid #e5e7eb', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
                  {actionsView === 'list' ? 'Manage Actions' : actionsView === 'new' ? 'New Action' : 'Edit Action'}
                </h3>
                <button
                  onClick={() => {
                    setActionsView(null);
                    setEditingAction(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* List View */}
            {actionsView === 'list' && (
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {actionTemplates.map((template) => (
                    <div
                      key={template.id}
                      style={{
                        position: 'relative',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                        paddingRight: '100px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: template.color,
                          }}
                        />
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
                          {template.name}
                        </h4>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280' }}>
                        {template.subject}
                      </div>
                      <button
                        onClick={() => {
                          setEditingAction(template);
                          setActionsView('edit');
                        }}
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          background: '#166534',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Create/Edit Form */}
            {(actionsView === 'new' || actionsView === 'edit') && (
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    Action Name
                  </label>
                  <input
                    type="text"
                    value={editingAction?.name || ''}
                    onChange={(e) => setEditingAction(prev => prev ? { ...prev, name: e.target.value } : {
                      id: Date.now().toString(),
                      name: e.target.value,
                      subject: '',
                      body: '',
                      color: '#166534'
                    })}
                    placeholder="e.g., Payment Reminder"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={editingAction?.subject || ''}
                    onChange={(e) => setEditingAction(prev => prev ? { ...prev, subject: e.target.value } : null)}
                    placeholder="Payment Reminder - BestJunkRemovalCompanies.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    Message Body
                  </label>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    Available variables: {'{businessName}'}, {'{dueDate}'}, {'{daysOverdue}'}, {'{warningNumber}'}
                  </div>
                  <textarea
                    value={editingAction?.body || ''}
                    onChange={(e) => setEditingAction(prev => prev ? { ...prev, body: e.target.value } : null)}
                    placeholder="Hi {businessName},&#10;&#10;Your message here..."
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    Button Color
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['#fbbf24', '#f59e0b', '#ef4444', '#10b981', '#166534', '#3b82f6', '#8b5cf6'].map(color => (
                      <button
                        key={color}
                        onClick={() => setEditingAction(prev => prev ? { ...prev, color } : null)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: color,
                          border: editingAction?.color === color ? '3px solid #000' : '2px solid #e5e7eb',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setActionsView('list');
                      setEditingAction(null);
                    }}
                    style={{
                      flex: 1,
                      background: '#e5e7eb',
                      color: '#000',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editingAction) {
                        if (actionsView === 'new') {
                          setActionTemplates(prev => [...prev, editingAction]);
                        } else {
                          setActionTemplates(prev => prev.map(t => t.id === editingAction.id ? editingAction : t));
                        }
                        alert(`Action "${editingAction.name}" ${actionsView === 'new' ? 'created' : 'updated'} successfully!`);
                        setActionsView('list');
                        setEditingAction(null);
                      }
                    }}
                    disabled={!editingAction?.name || !editingAction?.subject || !editingAction?.body}
                    style={{
                      flex: 1,
                      background: (!editingAction?.name || !editingAction?.subject || !editingAction?.body) ? '#9ca3af' : '#166534',
                      color: '#fff',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: (!editingAction?.name || !editingAction?.subject || !editingAction?.body) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {actionsView === 'new' ? 'Create Action' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
