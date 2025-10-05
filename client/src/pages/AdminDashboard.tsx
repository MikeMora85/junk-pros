import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Company } from "@shared/schema";
import { CheckCircle, X, Menu, ChevronDown, Home, LogOut, Search, Building2, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { useLocation } from "wouter";

const PREBUILT_MESSAGES = {
  reminder: {
    subject: "Payment Reminder - BestJunkRemovalCompanies.com",
    body: "Hi {businessName},\n\nThis is a friendly reminder that your Featured listing payment of $49 is due on {dueDate}.\n\nTo maintain your Featured status and continue receiving premium leads, please submit payment at your earliest convenience.\n\nThank you for being part of our directory!\n\nBest regards,\nBestJunkRemovalCompanies.com Team"
  },
  warning: {
    subject: "Payment Warning - Action Required",
    body: "Hi {businessName},\n\nYour Featured listing payment is now {daysOverdue} days overdue. This is warning #{warningNumber}.\n\nIf payment is not received within 5 business days, your listing will be downgraded to Free tier and removed from Featured results.\n\nPlease contact us immediately to resolve this matter.\n\nBest regards,\nBestJunkRemovalCompanies.com Team"
  },
  cancellation: {
    subject: "Subscription Cancelled - BestJunkRemovalCompanies.com",
    body: "Hi {businessName},\n\nDue to non-payment, your Featured subscription has been cancelled and your listing has been removed from our directory.\n\nYou may reactivate at any time by logging into your account and updating your payment information.\n\nIf you have questions, please contact our support team.\n\nBest regards,\nBestJunkRemovalCompanies.com Team"
  },
  reactivation: {
    subject: "Welcome Back - Subscription Reactivated",
    body: "Hi {businessName},\n\nGreat news! Your Featured listing has been reactivated and is now live in our directory.\n\nYou'll start receiving premium leads immediately. Thank you for being part of our network!\n\nBest regards,\nBestJunkRemovalCompanies.com Team"
  }
};

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'payments' | 'analytics'>('pending');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCompany, setExpandedCompany] = useState<number | null>(null);
  const [messageModal, setMessageModal] = useState<{open: boolean, type: string, company: Company | null}>({
    open: false,
    type: '',
    company: null
  });
  
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

  const getPrebuiltMessage = (type: string, company: Company) => {
    const template = PREBUILT_MESSAGES[type as keyof typeof PREBUILT_MESSAGES];
    if (!template) return { subject: '', body: '' };

    const daysOverdue = company.nextPaymentDate 
      ? Math.floor((Date.now() - new Date(company.nextPaymentDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      subject: template.subject,
      body: template.body
        .replace('{businessName}', company.name)
        .replace('{dueDate}', company.nextPaymentDate ? new Date(company.nextPaymentDate).toLocaleDateString() : 'N/A')
        .replace('{daysOverdue}', daysOverdue.toString())
        .replace('{warningNumber}', ((company.paymentWarnings || 0) + 1).toString())
    };
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
          {(['pending', 'active', 'payments', 'analytics'] as const).map(tab => (
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
      {(activeTab === 'pending' || activeTab === 'active') && (
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
      {(activeTab === 'pending' || activeTab === 'active') && (
        <div style={{ padding: '0 16px 16px' }}>
          {(activeTab === 'pending' ? pendingLoading : activeLoading) ? (
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

                    {/* Pending Actions */}
                    {activeTab === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          onClick={() => approveMutation.mutate(company.id)}
                          disabled={approveMutation.isPending}
                          style={{
                            flex: 1,
                            background: '#10b981',
                            color: '#fff',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          data-testid={`approve-${company.id}`}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => denyMutation.mutate(company.id)}
                          disabled={denyMutation.isPending}
                          style={{
                            flex: 1,
                            background: '#ef4444',
                            color: '#fff',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          data-testid={`deny-${company.id}`}
                        >
                          ✗ Deny
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded Actions Dropdown */}
                  {activeTab === 'active' && expandedCompany === company.id && (
                    <div style={{
                      borderTop: '2px solid #e5e7eb',
                      background: '#f9fafb',
                      padding: '12px 16px',
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', marginBottom: '12px' }}>
                        QUICK ACTIONS
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {company.subscriptionTier === 'featured' && company.subscriptionStatus !== 'active' && (
                          <>
                            <button
                              onClick={() => {
                                setMessageModal({ open: true, type: 'reminder', company });
                                setExpandedCompany(null);
                              }}
                              style={{
                                width: '100%',
                                background: '#fbbf24',
                                color: '#000',
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              data-testid={`reminder-${company.id}`}
                            >
                              💰 Send Payment Reminder
                            </button>
                            <button
                              onClick={() => {
                                setMessageModal({ open: true, type: 'warning', company });
                                setExpandedCompany(null);
                              }}
                              style={{
                                width: '100%',
                                background: '#f59e0b',
                                color: '#fff',
                                padding: '12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              data-testid={`warning-${company.id}`}
                            >
                              ⚠️ Send Payment Warning
                            </button>
                          </>
                        )}
                        {company.subscriptionStatus === 'cancelled' ? (
                          <button
                            onClick={() => {
                              setMessageModal({ open: true, type: 'reactivation', company });
                              setExpandedCompany(null);
                            }}
                            style={{
                              width: '100%',
                              background: '#10b981',
                              color: '#fff',
                              padding: '12px',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                            data-testid={`reactivate-${company.id}`}
                          >
                            ✅ Reactivate Subscription
                          </button>
                        ) : company.subscriptionTier === 'featured' && (
                          <button
                            onClick={() => {
                              setMessageModal({ open: true, type: 'cancellation', company });
                              setExpandedCompany(null);
                            }}
                            style={{
                              width: '100%',
                              background: '#ef4444',
                              color: '#fff',
                              padding: '12px',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                            data-testid={`cancel-${company.id}`}
                          >
                            🚫 Cancel Subscription
                          </button>
                        )}
                      </div>
                    </div>
                  )}
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
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700' }}>
              Analytics & Reports
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              View performance metrics and generate reports.
            </p>
          </div>
        </div>
      )}

      {/* Message Preview Modal */}
      {messageModal.open && messageModal.company && (
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
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <div style={{ padding: '20px', borderBottom: '2px solid #e5e7eb' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700' }}>
                {messageModal.type.charAt(0).toUpperCase() + messageModal.type.slice(1)} Message Preview
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                Review message before sending to {messageModal.company.name}
              </p>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', marginBottom: '4px' }}>
                  SUBJECT
                </div>
                <div style={{ 
                  background: '#f9fafb', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  border: '1px solid #e5e7eb'
                }}>
                  {getPrebuiltMessage(messageModal.type, messageModal.company).subject}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', marginBottom: '4px' }}>
                  MESSAGE
                </div>
                <div style={{ 
                  background: '#f9fafb', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  border: '1px solid #e5e7eb',
                  lineHeight: '1.6'
                }}>
                  {getPrebuiltMessage(messageModal.type, messageModal.company).body}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setMessageModal({ open: false, type: '', company: null })}
                  style={{
                    flex: 1,
                    background: '#e5e7eb',
                    color: '#000',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (messageModal.type === 'reminder') {
                      sendReminderMutation.mutate(messageModal.company!.id);
                    } else if (messageModal.type === 'warning') {
                      sendWarningMutation.mutate(messageModal.company!.id);
                    } else if (messageModal.type === 'cancellation') {
                      cancelSubscriptionMutation.mutate(messageModal.company!.id);
                    } else if (messageModal.type === 'reactivation') {
                      reactivateMutation.mutate(messageModal.company!.id);
                    }
                    setMessageModal({ open: false, type: '', company: null });
                  }}
                  style={{
                    flex: 1,
                    background: '#166534',
                    color: '#fff',
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                  data-testid="send-message"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
