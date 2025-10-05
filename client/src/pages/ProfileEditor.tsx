import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../lib/auth';
import { apiRequest, queryClient } from '../lib/queryClient';
import type { Company } from '@shared/schema';
import { useLocation } from 'wouter';
import { ArrowLeft, Save, Eye, EyeOff, Plus, X, Upload, Star, Trash2 } from 'lucide-react';

export default function ProfileEditor() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<'basic' | 'features' | 'reviews' | 'gallery'>('basic');

  // Get user's company
  const { data: companies, isLoading } = useQuery<Company[]>({
    queryKey: ['/api/companies/my'],
    enabled: !!user,
  });

  const company = companies?.[0];

  // Local state for form
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [newReview, setNewReview] = useState({ platform: '', author: '', rating: 5, text: '', date: '', url: '' });
  const [priceSheetItem, setPriceSheetItem] = useState({ service: '', price: '', unit: 'load' });
  const [addOnItem, setAddOnItem] = useState({ name: '', price: '' });

  // Initialize form data when company loads
  useState(() => {
    if (company && Object.keys(formData).length === 0) {
      setFormData(company);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Company>) => {
      if (!company) return;
      await apiRequest(`/api/companies/${company.id}`, {
        method: 'PATCH',
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const toggleFeature = (feature: 'priceSheetVisible' | 'addOnCostsVisible') => {
    setFormData(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const addReview = () => {
    const reviews = (formData.platformReviews as any[]) || [];
    const reviewId = `review-${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      platformReviews: [...reviews, { ...newReview, id: reviewId }],
    }));
    setNewReview({ platform: '', author: '', rating: 5, text: '', date: '', url: '' });
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
    const items = (formData.priceSheetData as any[]) || [];
    setFormData(prev => ({
      ...prev,
      priceSheetData: [...items, { ...priceSheetItem, id: Date.now() }],
    }));
    setPriceSheetItem({ service: '', price: '', unit: 'load' });
  };

  const addAddOnItem = () => {
    const items = (formData.addOnCosts as any[]) || [];
    setFormData(prev => ({
      ...prev,
      addOnCosts: [...items, { ...addOnItem, id: Date.now() }],
    }));
    setAddOnItem({ name: '', price: '' });
  };

  if (isLoading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!company) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>No company found</div>;
  }

  const reviews = (formData.platformReviews as any[]) || [];
  const priceSheet = (formData.priceSheetData as any[]) || [];
  const addOns = (formData.addOnCosts as any[]) || [];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setLocation('/')}
            style={{
              background: 'transparent',
              border: '1px solid #d1d5db',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            data-testid="button-back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Edit Your Profile</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          style={{
            background: '#166534',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          data-testid="button-save"
        >
          <Save size={18} />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 20px',
        display: 'flex',
        gap: '32px',
        overflowX: 'auto',
      }}>
        {[
          { id: 'basic', label: 'Basic Info' },
          { id: 'features', label: 'Features & Pricing' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'gallery', label: 'Gallery' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '16px 0',
              fontSize: '15px',
              fontWeight: '600',
              color: activeSection === tab.id ? '#166534' : '#6b7280',
              borderBottom: activeSection === tab.id ? '2px solid #166534' : '2px solid transparent',
              cursor: 'pointer',
            }}
            data-testid={`tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Basic Info */}
        {activeSection === 'basic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Business Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Business Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Website URL</label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  data-testid="input-website"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>About Your Business</label>
                <textarea
                  value={formData.aboutUs || ''}
                  onChange={e => setFormData(prev => ({ ...prev, aboutUs: e.target.value }))}
                  rows={5}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit' }}
                  data-testid="textarea-about"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Hours of Operation</label>
                  <input
                    type="text"
                    value={formData.hours || ''}
                    onChange={e => setFormData(prev => ({ ...prev, hours: e.target.value }))}
                    placeholder="Mon-Fri: 8AM-6PM"
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    data-testid="input-hours"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Years in Business</label>
                  <input
                    type="number"
                    value={formData.yearsInBusiness || ''}
                    onChange={e => setFormData(prev => ({ ...prev, yearsInBusiness: parseInt(e.target.value) }))}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    data-testid="input-years"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features & Pricing */}
        {activeSection === 'features' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Price Sheet */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Price Sheet</h3>
                <button
                  onClick={() => toggleFeature('priceSheetVisible')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: formData.priceSheetVisible ? '#166534' : '#9ca3af',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                  data-testid="toggle-pricesheet"
                >
                  {formData.priceSheetVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  {formData.priceSheetVisible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Service (e.g., Furniture Removal)"
                  value={priceSheetItem.service}
                  onChange={e => setPriceSheetItem(prev => ({ ...prev, service: e.target.value }))}
                  style={{ flex: 2, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  data-testid="input-price-service"
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={priceSheetItem.price}
                  onChange={e => setPriceSheetItem(prev => ({ ...prev, price: e.target.value }))}
                  style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  data-testid="input-price-amount"
                />
                <select
                  value={priceSheetItem.unit}
                  onChange={e => setPriceSheetItem(prev => ({ ...prev, unit: e.target.value }))}
                  style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  data-testid="select-price-unit"
                >
                  <option value="load">per load</option>
                  <option value="item">per item</option>
                  <option value="hour">per hour</option>
                  <option value="cubic yard">per cubic yard</option>
                </select>
                <button
                  onClick={addPriceSheetItem}
                  disabled={!priceSheetItem.service || !priceSheetItem.price}
                  style={{
                    background: '#166534',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: priceSheetItem.service && priceSheetItem.price ? 'pointer' : 'not-allowed',
                  }}
                  data-testid="button-add-price"
                >
                  <Plus size={18} />
                </button>
              </div>

              {priceSheet.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {priceSheet.map((item: any) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <span style={{ fontWeight: '600' }}>{item.service}</span>
                      <span>{item.price} {item.unit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add-On Costs */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Add-On Costs</h3>
                <button
                  onClick={() => toggleFeature('addOnCostsVisible')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: formData.addOnCostsVisible ? '#166534' : '#9ca3af',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                  data-testid="toggle-addons"
                >
                  {formData.addOnCostsVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  {formData.addOnCostsVisible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Add-on name (e.g., Extra labor)"
                  value={addOnItem.name}
                  onChange={e => setAddOnItem(prev => ({ ...prev, name: e.target.value }))}
                  style={{ flex: 2, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  data-testid="input-addon-name"
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={addOnItem.price}
                  onChange={e => setAddOnItem(prev => ({ ...prev, price: e.target.value }))}
                  style={{ flex: 1, padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  data-testid="input-addon-price"
                />
                <button
                  onClick={addAddOnItem}
                  disabled={!addOnItem.name || !addOnItem.price}
                  style={{
                    background: '#166534',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: addOnItem.name && addOnItem.price ? 'pointer' : 'not-allowed',
                  }}
                  data-testid="button-add-addon"
                >
                  <Plus size={18} />
                </button>
              </div>

              {addOns.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {addOns.map((item: any) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <span style={{ fontWeight: '600' }}>{item.name}</span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews */}
        {activeSection === 'reviews' && (
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Platform Reviews</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Add reviews from Google, Yelp, Facebook, and other platforms. Star reviews to feature them on your quick view profile.</p>

            {/* Add Review Form */}
            <div style={{ marginBottom: '24px', padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Add New Review</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Platform</label>
                  <select
                    value={newReview.platform}
                    onChange={e => setNewReview(prev => ({ ...prev, platform: e.target.value }))}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    data-testid="select-platform"
                  >
                    <option value="">Select platform</option>
                    <option value="Google">Google</option>
                    <option value="Yelp">Yelp</option>
                    <option value="Facebook">Facebook</option>
                    <option value="BBB">Better Business Bureau</option>
                    <option value="Trustpilot">Trustpilot</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Author Name</label>
                  <input
                    type="text"
                    value={newReview.author}
                    onChange={e => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    data-testid="input-author"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={e => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    data-testid="select-rating"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Date</label>
                  <input
                    type="date"
                    value={newReview.date}
                    onChange={e => setNewReview(prev => ({ ...prev, date: e.target.value }))}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                    data-testid="input-date"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Review Text</label>
                <textarea
                  value={newReview.text}
                  onChange={e => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                  rows={3}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit' }}
                  data-testid="textarea-review"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Review URL (optional)</label>
                <input
                  type="text"
                  value={newReview.url}
                  onChange={e => setNewReview(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px' }}
                  data-testid="input-url"
                />
              </div>

              <button
                onClick={addReview}
                disabled={!newReview.platform || !newReview.author || !newReview.text}
                style={{
                  background: '#166534',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: (newReview.platform && newReview.author && newReview.text) ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
                data-testid="button-add-review"
              >
                Add Review
              </button>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Your Reviews ({reviews.length})</h4>
                {reviews.map((review: any) => {
                  const isFeatured = (formData.featuredReviewIds || []).includes(review.id);
                  return (
                    <div
                      key={review.id}
                      style={{
                        padding: '16px',
                        background: isFeatured ? '#f0fdf4' : '#f9fafb',
                        borderRadius: '8px',
                        border: isFeatured ? '2px solid #166534' : '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ 
                            background: '#166534', 
                            color: '#fff', 
                            padding: '4px 12px', 
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}>
                            {review.platform}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => toggleFeaturedReview(review.id)}
                            style={{
                              background: isFeatured ? '#166534' : '#e5e7eb',
                              color: isFeatured ? '#fff' : '#000',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                            data-testid={`button-feature-${review.id}`}
                          >
                            {isFeatured ? '★ Featured' : 'Feature'}
                          </button>
                          <button
                            onClick={() => removeReview(review.id)}
                            style={{
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                            data-testid={`button-delete-${review.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', marginBottom: '8px' }}>{review.text}</p>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        <strong>{review.author}</strong> • {review.date}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Gallery */}
        {activeSection === 'gallery' && (
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Photo Gallery</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Add photos of your work, team, trucks, and completed projects.</p>
            
            <div style={{
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
            }}>
              <Upload size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>Photo upload coming soon</p>
              <button
                style={{
                  background: '#166534',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                }}
                disabled
              >
                Upload Photos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
