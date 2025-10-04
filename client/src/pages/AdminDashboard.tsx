import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Company } from "@shared/schema";
import { CheckCircle, X, Edit, LogOut, UserPlus } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const { data: pendingCompanies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies/pending'],
    enabled: !!user?.isAdmin,
  });

  const { data: activeCompanies = [] } = useQuery<Company[]>({
    queryKey: ['/api/admin/companies/active'],
    enabled: !!user?.isAdmin,
  });

  const { data: myCompanies = [] } = useQuery<Company[]>({
    queryKey: ['/api/user/companies'],
    enabled: !!user,
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

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Company> }) => {
      await apiRequest('/api/companies/:id', {
        method: 'PATCH',
        body: data,
        params: { id: id.toString() },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      setEditingCompany(null);
    },
  });

  const inviteAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest('/api/admin/invite', {
        method: 'POST',
        body: { email },
      });
    },
    onSuccess: () => {
      setInviteEmail("");
      alert("Admin invitation sent successfully!");
    },
    onError: (error: any) => {
      alert(error.message || "Failed to invite admin");
    },
  });

  if (authLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Please log in to access admin dashboard</h2>
        <button
          onClick={() => window.location.href = '/api/login'}
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

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#000' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setLocation('/')}
            style={{
              background: '#e5e5e5',
              color: '#000',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            data-testid="button-back-home"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.location.href = '/api/logout'}
            style={{
              background: '#dc2626',
              color: '#fff',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            data-testid="button-logout"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Invite Admin Section */}
      <div style={{ 
        background: '#f3f4f6', 
        border: '2px solid #e5e7eb',
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '32px' 
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#000' }}>
          Invite Admin
        </h2>
        <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
          Grant admin access to other users by entering their email address
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address"
            style={{
              flex: 1,
              padding: '10px 16px',
              border: '2px solid #000',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            data-testid="input-invite-email"
          />
          <button
            onClick={() => inviteAdminMutation.mutate(inviteEmail)}
            disabled={!inviteEmail || inviteAdminMutation.isPending}
            style={{
              background: '#fbbf24',
              color: '#000',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: inviteEmail ? 'pointer' : 'not-allowed',
              opacity: inviteEmail ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            data-testid="button-invite-admin"
          >
            <UserPlus size={16} />
            {inviteAdminMutation.isPending ? 'Inviting...' : 'Invite'}
          </button>
        </div>
      </div>

      {/* My Companies Section */}
      {myCompanies.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
            My Business
          </h2>
          {myCompanies.map((company) => (
            <div
              key={company.id}
              style={{
                background: '#fff',
                border: '2px solid #fbbf24',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              {editingCompany?.id === company.id ? (
                <div>
                  <h3 style={{ marginBottom: '16px', color: '#000' }}>Edit Business</h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <input
                      type="text"
                      value={editingCompany.name}
                      onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                      placeholder="Business Name"
                      style={{
                        padding: '10px',
                        border: '2px solid #000',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type="text"
                      value={editingCompany.phone}
                      onChange={(e) => setEditingCompany({ ...editingCompany, phone: e.target.value })}
                      placeholder="Phone"
                      style={{
                        padding: '10px',
                        border: '2px solid #000',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                    <textarea
                      value={editingCompany.description || ''}
                      onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
                      placeholder="Description"
                      rows={4}
                      style={{
                        padding: '10px',
                        border: '2px solid #000',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => updateMutation.mutate({ id: company.id, data: editingCompany })}
                        disabled={updateMutation.isPending}
                        style={{
                          background: '#fbbf24',
                          color: '#000',
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setEditingCompany(null)}
                        style={{
                          background: '#e5e5e5',
                          color: '#000',
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#000' }}>
                        {company.name}
                      </h3>
                      <p style={{ color: '#666', marginBottom: '4px' }}>{company.phone}</p>
                      <p style={{ color: '#666', marginBottom: '4px' }}>{company.address}</p>
                      {company.description && <p style={{ color: '#000', marginTop: '12px' }}>{company.description}</p>}
                    </div>
                    <button
                      onClick={() => setEditingCompany(company)}
                      style={{
                        background: '#fbbf24',
                        color: '#000',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                      data-testid={`button-edit-${company.id}`}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pending Businesses Section */}
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
        Pending Businesses ({pendingCompanies.length})
      </h2>

      {isLoading ? (
        <p>Loading pending businesses...</p>
      ) : pendingCompanies.length === 0 ? (
        <p style={{ color: '#666' }}>No pending businesses to review</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px', marginBottom: '48px' }}>
          {pendingCompanies.map((company) => (
            <div
              key={company.id}
              style={{
                background: '#fff',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#000' }}>
                {company.name}
              </h3>
              <div style={{ marginBottom: '16px', color: '#666' }}>
                <p><strong>Phone:</strong> {company.phone}</p>
                <p><strong>Address:</strong> {company.address}</p>
                <p><strong>Website:</strong> {company.website}</p>
                <p><strong>City/State:</strong> {company.city}, {company.state}</p>
                {company.description && <p style={{ marginTop: '8px', color: '#000' }}>{company.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => approveMutation.mutate(company.id)}
                  disabled={approveMutation.isPending}
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  data-testid={`button-approve-${company.id}`}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => denyMutation.mutate(company.id)}
                  disabled={denyMutation.isPending}
                  style={{
                    background: '#dc2626',
                    color: '#fff',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  data-testid={`button-deny-${company.id}`}
                >
                  <X size={16} />
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Businesses Section */}
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: '#000' }}>
        Active Businesses ({activeCompanies.length})
      </h2>

      {activeCompanies.length === 0 ? (
        <p style={{ color: '#666' }}>No active businesses</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {activeCompanies.map((company) => (
            <div
              key={company.id}
              style={{
                background: '#fff',
                border: '2px solid #16a34a',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#000' }}>
                {company.name}
              </h3>
              <div style={{ color: '#666' }}>
                <p><strong>Phone:</strong> {company.phone}</p>
                <p><strong>Address:</strong> {company.address}</p>
                <p><strong>Website:</strong> {company.website}</p>
                <p><strong>City/State:</strong> {company.city}, {company.state}</p>
                <p><strong>Rating:</strong> {company.rating} ({company.reviews} reviews)</p>
                {company.description && <p style={{ marginTop: '8px', color: '#000' }}>{company.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
