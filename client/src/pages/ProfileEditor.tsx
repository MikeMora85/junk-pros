import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { apiRequest, queryClient } from '../lib/queryClient';
import type { Company } from '@shared/schema';
import { useLocation } from 'wouter';
import { ArrowLeft, Save, Eye, Upload, Plus, Trash2, Star, Phone, MapPin, Globe, Mail } from 'lucide-react';

export default function ProfileEditor() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Get user's company
  const { data: companies, isLoading } = useQuery<Company[]>({
    queryKey: ['/api/companies/my'],
    enabled: !!user,
  });

  const company = companies?.[0];

  // Local state for form
  const [formData, setFormData] = useState<Partial<Company>>({});

  // Initialize form data when company loads
  useEffect(() => {
    if (company && Object.keys(formData).length === 0) {
      setFormData(company);
      if (company.logoUrl) {
        setLogoPreview(company.logoUrl);
      }
    }
  }, [company]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Company>) => {
      if (!company) return;
      await apiRequest(`/api/companies/${company.id}`, {
        method: 'PATCH',
        body: data as any,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      alert('Profile saved successfully!');
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: "'Helvetica Neue', Arial, sans-serif"
      }}>
        <div style={{ textAlign: 'center', color: '#166534', fontSize: '18px', fontWeight: '600' }}>
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            No company found
          </div>
          <button
            onClick={() => setLocation('/')}
            style={{
              background: '#fbbf24',
              color: '#000',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            data-testid="button-home"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fff',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: '#166534',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setLocation('/')}
            style={{
              background: '#fbbf24',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            data-testid="button-back"
          >
            <ArrowLeft size={20} color="#000" />
          </button>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            margin: 0,
            color: '#fff',
          }}>
            Business Profile
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          style={{
            background: '#fbbf24',
            color: '#000',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: updateMutation.isPending ? 0.7 : 1,
          }}
          data-testid="button-save"
        >
          <Save size={18} />
          {updateMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#f9fafb',
        borderBottom: '2px solid #e5e7eb',
        padding: '0 20px',
        display: 'flex',
        gap: '8px',
      }}>
        <button
          onClick={() => setActiveTab('edit')}
          style={{
            background: activeTab === 'edit' ? '#fff' : 'transparent',
            border: 'none',
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: '600',
            color: activeTab === 'edit' ? '#166534' : '#6b7280',
            borderBottom: activeTab === 'edit' ? '3px solid #166534' : '3px solid transparent',
            cursor: 'pointer',
            borderRadius: '0',
          }}
          data-testid="tab-edit"
        >
          Edit Profile
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          style={{
            background: activeTab === 'preview' ? '#fff' : 'transparent',
            border: 'none',
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: '600',
            color: activeTab === 'preview' ? '#166534' : '#6b7280',
            borderBottom: activeTab === 'preview' ? '3px solid #166534' : '3px solid transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          data-testid="tab-preview"
        >
          <Eye size={18} />
          Preview
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'edit' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Logo Upload */}
            <div style={{ 
              background: '#f9fafb', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#000' }}>
                Company Logo
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                {logoPreview && (
                  <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid #e5e7eb',
                  }}>
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}
                <label style={{
                  background: '#166534',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  <Upload size={18} />
                  Upload Logo
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoChange}
                    style={{ display: 'none' }}
                    data-testid="input-logo"
                  />
                </label>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  JPG, PNG, or GIF (max 5MB)
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div style={{ 
              background: '#f9fafb', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#000' }}>
                Basic Information
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    data-testid="input-website"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    About Your Business
                  </label>
                  <textarea
                    value={formData.aboutUs || ''}
                    onChange={e => setFormData(prev => ({ ...prev, aboutUs: e.target.value }))}
                    rows={5}
                    placeholder="Tell customers about your business, experience, and what makes you unique..."
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      resize: 'vertical',
                    }}
                    data-testid="input-about"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    Years in Business
                  </label>
                  <input
                    type="number"
                    value={formData.yearsInBusiness || ''}
                    onChange={e => setFormData(prev => ({ ...prev, yearsInBusiness: parseInt(e.target.value) || 0 }))}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    data-testid="input-years"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
                    Insurance Information
                  </label>
                  <input
                    type="text"
                    value={formData.insuranceInfo || ''}
                    onChange={e => setFormData(prev => ({ ...prev, insuranceInfo: e.target.value }))}
                    placeholder="e.g., Fully insured, $1M liability"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    data-testid="input-insurance"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Preview Tab
          <div style={{ 
            background: '#f9fafb', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ 
              background: '#fff', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              {/* Preview Header */}
              <div style={{ 
                background: '#166534', 
                padding: '24px 20px',
                color: '#fff',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  {logoPreview && (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#fff',
                      border: '2px solid #fbbf24',
                    }}>
                      <img 
                        src={logoPreview} 
                        alt={formData.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0', color: '#fff' }}>
                      {formData.name || 'Your Business Name'}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={18} fill="#fbbf24" color="#fbbf24" />
                      <span style={{ fontSize: '16px', fontWeight: '600' }}>
                        {formData.rating || '0.0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {formData.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Phone size={20} color="#166534" />
                      <span style={{ color: '#000', fontSize: '16px' }}>{formData.phone}</span>
                    </div>
                  )}

                  {formData.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Globe size={20} color="#166534" />
                      <a 
                        href={formData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#166534', fontSize: '16px', textDecoration: 'underline' }}
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {formData.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <MapPin size={20} color="#166534" />
                      <span style={{ color: '#000', fontSize: '16px' }}>{formData.address}</span>
                    </div>
                  )}
                </div>

                {formData.aboutUs && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#000' }}>
                      About Us
                    </h3>
                    <p style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
                      {formData.aboutUs}
                    </p>
                  </div>
                )}

                {formData.yearsInBusiness && formData.yearsInBusiness > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ 
                      background: '#f0fdf4', 
                      border: '1px solid #166534',
                      padding: '12px',
                      borderRadius: '6px',
                      color: '#166534',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                      {formData.yearsInBusiness} years in business
                    </div>
                  </div>
                )}

                {formData.insuranceInfo && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ 
                      background: '#fef3c7', 
                      border: '1px solid #fbbf24',
                      padding: '12px',
                      borderRadius: '6px',
                      color: '#000',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}>
                      🛡️ {formData.insuranceInfo}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ 
              marginTop: '20px', 
              padding: '16px', 
              background: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fbbf24',
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#000', fontWeight: '600' }}>
                📱 This is how your profile will appear to customers on mobile and desktop
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
