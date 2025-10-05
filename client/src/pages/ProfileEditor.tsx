import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import type { Company } from '@shared/schema';
import { useLocation } from 'wouter';
import { Save, Eye, Upload, Plus, Trash2, Star, Phone, MapPin, Globe, DollarSign, Image as ImageIcon, X, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ProfileEditor() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [activeSection, setActiveSection] = useState<'basic' | 'pricing' | 'reviews' | 'gallery'>('basic');
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [newReview, setNewReview] = useState({ platform: 'Google', author: '', rating: 5, text: '', date: '', url: '' });
  const [priceSheetItem, setPriceSheetItem] = useState({ service: '', price: '', unit: 'load' });
  const [addOnItem, setAddOnItem] = useState({ name: '', price: '' });
  const [galleryUrl, setGalleryUrl] = useState('');

  // Get user's company
  const { data: companies, isLoading, error } = useQuery<Company[]>({
    queryKey: ['/api/companies/my'],
  });

  const company = companies?.[0];

  // Debug logging
  useEffect(() => {
    console.log('ProfileEditor - companies:', companies);
    console.log('ProfileEditor - company:', company);
    console.log('ProfileEditor - error:', error);
    console.log('ProfileEditor - isLoading:', isLoading);
  }, [companies, company, error, isLoading]);

  // Local state for form
  const [formData, setFormData] = useState<Partial<Company>>({});

  // Initialize form data when company loads
  useEffect(() => {
    if (company) {
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
      alert('✅ Profile saved successfully!');
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setFormData(prev => ({ ...prev, logoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addReview = () => {
    if (!newReview.platform || !newReview.author || !newReview.text) {
      alert('Please fill in platform, author, and review text');
      return;
    }
    const reviews = (formData.platformReviews as any[]) || [];
    const reviewId = `review-${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      platformReviews: [...reviews, { ...newReview, id: reviewId }],
    }));
    setNewReview({ platform: 'Google', author: '', rating: 5, text: '', date: '', url: '' });
  };

  const removeReview = (reviewId: string) => {
    const reviews = (formData.platformReviews as any[]) || [];
    setFormData(prev => ({
      ...prev,
      platformReviews: reviews.filter((r: any) => r.id !== reviewId),
      featuredReviewIds: (prev.featuredReviewIds || []).filter(id => id !== reviewId),
    }));
  };

  const toggleFeaturedReview = (reviewId: string) => {
    const featured = formData.featuredReviewIds || [];
    const isFeatured = featured.includes(reviewId);
    setFormData(prev => ({
      ...prev,
      featuredReviewIds: isFeatured 
        ? featured.filter(id => id !== reviewId)
        : [...featured, reviewId],
    }));
  };

  const addPriceSheetItem = () => {
    if (!priceSheetItem.service || !priceSheetItem.price) {
      alert('Please fill in service name and price');
      return;
    }
    const items = (formData.priceSheetData as any[]) || [];
    setFormData(prev => ({
      ...prev,
      priceSheetData: [...items, { ...priceSheetItem, id: Date.now() }],
    }));
    setPriceSheetItem({ service: '', price: '', unit: 'load' });
  };

  const removePriceSheetItem = (id: number) => {
    const items = (formData.priceSheetData as any[]) || [];
    setFormData(prev => ({
      ...prev,
      priceSheetData: items.filter((item: any) => item.id !== id),
    }));
  };

  const addAddOnItem = () => {
    if (!addOnItem.name || !addOnItem.price) {
      alert('Please fill in add-on name and price');
      return;
    }
    const items = (formData.addOnCosts as any[]) || [];
    setFormData(prev => ({
      ...prev,
      addOnCosts: [...items, { ...addOnItem, id: Date.now() }],
    }));
    setAddOnItem({ name: '', price: '' });
  };

  const removeAddOnItem = (id: number) => {
    const items = (formData.addOnCosts as any[]) || [];
    setFormData(prev => ({
      ...prev,
      addOnCosts: items.filter((item: any) => item.id !== id),
    }));
  };

  const addGalleryImage = () => {
    if (!galleryUrl) {
      alert('Please enter an image URL');
      return;
    }
    const images = formData.galleryImages || [];
    setFormData(prev => ({
      ...prev,
      galleryImages: [...images, galleryUrl],
    }));
    setGalleryUrl('');
  };

  const removeGalleryImage = (index: number) => {
    const images = formData.galleryImages || [];
    setFormData(prev => ({
      ...prev,
      galleryImages: images.filter((_, i) => i !== index),
    }));
  };

  const toggleFeature = (feature: 'priceSheetVisible' | 'addOnCostsVisible') => {
    setFormData(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
      }}>
        <div style={{ textAlign: 'center', color: '#dc2626', fontSize: '18px', fontWeight: '600' }}>
          Error loading profile
        </div>
        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', maxWidth: '500px' }}>
          {error.message || 'Failed to load company data. Please make sure you are logged in.'}
        </div>
        <button
          onClick={() => window.location.href = '/login'}
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
        >
          Go to Login
        </button>
      </div>
    );
  }

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
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
            No Business Profile Found
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            {localStorage.getItem('auth_token') ? 
              'Your account is not linked to a business. Please sign up to create your business profile.' :
              'Please log in to access your business profile.'
            }
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {!localStorage.getItem('auth_token') && (
              <button
                onClick={() => setLocation('/login')}
                style={{
                  background: '#166534',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                data-testid="button-login"
              >
                Login
              </button>
            )}
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
      </div>
    );
  }

  const reviews = (formData.platformReviews as any[]) || [];
  const priceSheet = (formData.priceSheetData as any[]) || [];
  const addOns = (formData.addOnCosts as any[]) || [];
  const galleryImages = formData.galleryImages || [];

  return (
    <div 
      key={company?.id || 'no-company'}
      style={{ 
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            margin: 0,
            color: '#fff',
          }}>
            Business Profile
          </h1>
          {company?.city && company?.state && (
            <button
              onClick={() => setLocation(`/${company.state.toLowerCase()}/${company.city.toLowerCase()}`)}
              style={{
                background: '#fbbf24',
                color: '#000',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '600',
              }}
              data-testid="button-live-profile"
            >
              <Eye size={18} color="#000" />
              Go to Live Profile
            </button>
          )}
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

      {/* Main Tabs */}
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
          <>
            {/* Section Tabs */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '20px',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}>
              {[
                { id: 'basic', label: 'Basic Info', icon: null },
                { id: 'pricing', label: 'Pricing', icon: DollarSign },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'gallery', label: 'Gallery', icon: ImageIcon },
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  style={{
                    background: activeSection === section.id ? '#fbbf24' : '#e5e7eb',
                    color: activeSection === section.id ? '#000' : '#000',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                  }}
                  data-testid={`section-${section.id}`}
                >
                  {section.icon && <section.icon size={16} />}
                  {section.label}
                </button>
              ))}
            </div>

            {/* Basic Info Section */}
            {activeSection === 'basic' && (
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
                      background: '#fbbf24',
                      color: '#000',
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
                        placeholder="Tell customers about your business..."
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                          Insurance
                        </label>
                        <input
                          type="text"
                          value={formData.insuranceInfo || ''}
                          onChange={e => setFormData(prev => ({ ...prev, insuranceInfo: e.target.value }))}
                          placeholder="Fully insured"
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
              </div>
            )}

            {/* Pricing Section */}
            {activeSection === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Price Sheet */}
                <div style={{ 
                  background: '#f9fafb', 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#000' }}>
                      Price Sheet
                    </h3>
                    <button
                      onClick={() => toggleFeature('priceSheetVisible')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: formData.priceSheetVisible ? '#166534' : '#6b7280',
                        fontWeight: '600',
                      }}
                      data-testid="toggle-pricesheet"
                    >
                      {formData.priceSheetVisible ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      {formData.priceSheetVisible ? 'Visible' : 'Hidden'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Service name"
                        value={priceSheetItem.service}
                        onChange={e => setPriceSheetItem(prev => ({ ...prev, service: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        data-testid="input-service"
                      />
                      <input
                        type="text"
                        placeholder="$150"
                        value={priceSheetItem.price}
                        onChange={e => setPriceSheetItem(prev => ({ ...prev, price: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        data-testid="input-price"
                      />
                      <select
                        value={priceSheetItem.unit}
                        onChange={e => setPriceSheetItem(prev => ({ ...prev, unit: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        data-testid="select-unit"
                      >
                        <option value="load">per load</option>
                        <option value="item">per item</option>
                        <option value="hour">per hour</option>
                      </select>
                    </div>
                    <button
                      onClick={addPriceSheetItem}
                      style={{
                        background: '#fbbf24',
                        color: '#000',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontWeight: '600',
                      }}
                      data-testid="button-add-price"
                    >
                      <Plus size={18} /> Add Price
                    </button>
                  </div>

                  {priceSheet.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {priceSheet.map((item: any) => (
                        <div key={item.id} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          background: '#fff',
                          padding: '12px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                        }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#000' }}>{item.service}</div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>{item.price} {item.unit}</div>
                          </div>
                          <button
                            onClick={() => removePriceSheetItem(item.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#ef4444',
                            }}
                            data-testid={`delete-price-${item.id}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add-On Costs */}
                <div style={{ 
                  background: '#f9fafb', 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#000' }}>
                      Add-On Costs
                    </h3>
                    <button
                      onClick={() => toggleFeature('addOnCostsVisible')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: formData.addOnCostsVisible ? '#166534' : '#6b7280',
                        fontWeight: '600',
                      }}
                      data-testid="toggle-addon"
                    >
                      {formData.addOnCostsVisible ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      {formData.addOnCostsVisible ? 'Visible' : 'Hidden'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="Add-on name (e.g., Stairs)"
                        value={addOnItem.name}
                        onChange={e => setAddOnItem(prev => ({ ...prev, name: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        data-testid="input-addon-name"
                      />
                      <input
                        type="text"
                        placeholder="$25"
                        value={addOnItem.price}
                        onChange={e => setAddOnItem(prev => ({ ...prev, price: e.target.value }))}
                        style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                        data-testid="input-addon-price"
                      />
                    </div>
                    <button
                      onClick={addAddOnItem}
                      style={{
                        background: '#fbbf24',
                        color: '#000',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontWeight: '600',
                      }}
                      data-testid="button-add-addon"
                    >
                      <Plus size={18} /> Add Add-On
                    </button>
                  </div>

                  {addOns.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {addOns.map((item: any) => (
                        <div key={item.id} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          background: '#fff',
                          padding: '12px',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                        }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#000' }}>{item.name}</div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>{item.price}</div>
                          </div>
                          <button
                            onClick={() => removeAddOnItem(item.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#ef4444',
                            }}
                            data-testid={`delete-addon-${item.id}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {activeSection === 'reviews' && (
              <div style={{ 
                background: '#f9fafb', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#000' }}>
                  Platform Reviews
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <select
                    value={newReview.platform}
                    onChange={e => setNewReview(prev => ({ ...prev, platform: e.target.value }))}
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                    data-testid="select-platform"
                  >
                    <option value="Google">Google</option>
                    <option value="Yelp">Yelp</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Trustpilot">Trustpilot</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Author name"
                    value={newReview.author}
                    onChange={e => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                    data-testid="input-author"
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>Rating:</label>
                    <select
                      value={newReview.rating}
                      onChange={e => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                      style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                      data-testid="select-rating"
                    >
                      {[5, 4, 3, 2, 1].map(rating => (
                        <option key={rating} value={rating}>{rating} ⭐</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    placeholder="Review text"
                    value={newReview.text}
                    onChange={e => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                    rows={3}
                    style={{ 
                      padding: '10px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px', 
                      fontSize: '14px',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      resize: 'vertical',
                    }}
                    data-testid="input-review-text"
                  />
                  <button
                    onClick={addReview}
                    style={{
                      background: '#fbbf24',
                      color: '#000',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontWeight: '600',
                    }}
                    data-testid="button-add-review"
                  >
                    <Plus size={18} /> Add Review
                  </button>
                </div>

                {reviews.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reviews.map((review: any) => (
                      <div key={review.id} style={{ 
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#000' }}>{review.platform} - {review.author}</div>
                            <div style={{ color: '#fbbf24', fontSize: '14px' }}>{'⭐'.repeat(review.rating)}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => toggleFeaturedReview(review.id)}
                              style={{
                                background: (formData.featuredReviewIds || []).includes(review.id) ? '#fbbf24' : '#e5e7eb',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                              data-testid={`feature-review-${review.id}`}
                            >
                              {(formData.featuredReviewIds || []).includes(review.id) ? '⭐ Featured' : 'Feature'}
                            </button>
                            <button
                              onClick={() => removeReview(review.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#ef4444',
                              }}
                              data-testid={`delete-review-${review.id}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <p style={{ margin: 0, color: '#374151', fontSize: '14px', lineHeight: '1.5' }}>{review.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Gallery Section */}
            {activeSection === 'gallery' && (
              <div style={{ 
                background: '#f9fafb', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: '#000' }}>
                  Photo Gallery
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Image URL (e.g., https://example.com/image.jpg)"
                    value={galleryUrl}
                    onChange={e => setGalleryUrl(e.target.value)}
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                    data-testid="input-gallery-url"
                  />
                  <button
                    onClick={addGalleryImage}
                    style={{
                      background: '#fbbf24',
                      color: '#000',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontWeight: '600',
                    }}
                    data-testid="button-add-gallery"
                  >
                    <Plus size={18} /> Add Photo
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '12px',
                  }}>
                    {galleryImages.map((url: string, index: number) => (
                      <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden' }}>
                        <img 
                          src={url} 
                          alt={`Gallery ${index + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          onClick={() => removeGalleryImage(index)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          data-testid={`delete-gallery-${index}`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
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
                      <span style={{ color: '#166534', fontSize: '16px' }}>{formData.website}</span>
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

                {formData.priceSheetVisible && priceSheet.length > 0 && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#000' }}>
                      Pricing
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {priceSheet.map((item: any) => (
                        <div key={item.id} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          padding: '8px 0',
                        }}>
                          <span style={{ color: '#374151' }}>{item.service}</span>
                          <span style={{ fontWeight: '600', color: '#000' }}>{item.price} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {reviews.length > 0 && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#000' }}>
                      Reviews
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {reviews.slice(0, 3).map((review: any) => (
                        <div key={review.id} style={{ 
                          background: '#f9fafb',
                          padding: '12px',
                          borderRadius: '8px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontWeight: '600', color: '#000' }}>{review.author}</span>
                            <span style={{ color: '#fbbf24' }}>{'⭐'.repeat(review.rating)}</span>
                          </div>
                          <p style={{ margin: 0, color: '#374151', fontSize: '14px' }}>{review.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {galleryImages.length > 0 && (
                  <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px', color: '#000' }}>
                      Gallery
                    </h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                      gap: '8px',
                    }}>
                      {galleryImages.slice(0, 6).map((url: string, index: number) => (
                        <div key={index} style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden' }}>
                          <img 
                            src={url} 
                            alt={`Gallery ${index + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
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
                📱 This is how your profile will appear to customers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
