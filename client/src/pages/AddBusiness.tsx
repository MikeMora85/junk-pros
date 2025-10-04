import { useState } from "react";

export default function AddBusiness() {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    phone: "",
    state: "",
    city: "",
    pricingTier: "",
    confirmPricing: false,
    confirmNoFranchise: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      {/* Hero Section */}
      <div style={{
        background: '#fbbf24',
        padding: '48px 16px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '700',
          color: '#000',
          marginBottom: '16px',
          letterSpacing: '-0.02em',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}>
          Join the Premier Junk Removal Directory
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#000',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}>
          Connect with customers actively searching for professional junk removal services in your area. Built exclusively for independent, quality-focused operators.
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 16px',
      }}>
        {/* Signup Form */}
        <form onSubmit={handleSubmit} style={{
          background: '#fff',
          border: '2px solid #fbbf24',
          padding: '32px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#000',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}>
            Create Your Account
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g., Quick Junk Removal LLC"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e5e5',
                fontSize: '16px',
                color: '#000',
              }}
              data-testid="input-business-name"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e5e5',
                fontSize: '16px',
                color: '#000',
              }}
              data-testid="input-email"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
              Password *
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a secure password"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e5e5',
                fontSize: '16px',
                color: '#000',
              }}
              data-testid="input-password"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e5e5',
                fontSize: '16px',
                color: '#000',
              }}
              data-testid="input-phone"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
              State *
            </label>
            <select
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e5e5',
                fontSize: '16px',
                color: '#000',
              }}
              data-testid="select-state"
            >
              <option value="">Select your state</option>
              <option value="alabama">Alabama</option>
              <option value="arizona">Arizona</option>
              <option value="california">California</option>
              <option value="florida">Florida</option>
              <option value="texas">Texas</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
              Primary City *
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="City where you operate"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e5e5e5',
                fontSize: '16px',
                color: '#000',
              }}
              data-testid="input-city"
            />
            <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '12px', color: '#000', marginTop: '4px' }}>
              You can add more cities after signup
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#000',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                required
                checked={formData.confirmPricing}
                onChange={(e) => setFormData({ ...formData, confirmPricing: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
                data-testid="checkbox-pricing"
              />
              I confirm my pricing meets the $38/cubic yard minimum standard
            </label>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#000',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                required
                checked={formData.confirmNoFranchise}
                onChange={(e) => setFormData({ ...formData, confirmNoFranchise: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
                data-testid="checkbox-franchise"
              />
              I confirm this is an independent business, not a franchise
            </label>
          </div>

          <button
            type="submit"
            disabled={!formData.pricingTier}
            style={{
              width: '100%',
              background: formData.pricingTier ? '#fbbf24' : '#e5e5e5',
              color: '#000',
              padding: '16px',
              border: 'none',
              fontSize: '18px',
              fontWeight: '700',
              cursor: formData.pricingTier ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
            data-testid="button-submit"
          >
            {formData.pricingTier === 'featured' ? 'Start 30-Day Free Trial' : 'Create Free Account'}
          </button>

          {!formData.pricingTier && (
            <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '12px', color: '#000', marginTop: '8px', textAlign: 'center' }}>
              Please select a pricing plan above
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
