import { useState } from "react";
import { CheckCircle, XCircle, TrendingUp, Users, Shield, DollarSign, Award, Search } from "lucide-react";

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

  const [checkCity, setCheckCity] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'available' | 'taken'>('idle');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, simulate check - in real app would call API
    // Randomly return available/taken for demo
    const isAvailable = Math.random() > 0.3;
    setAvailabilityStatus(isAvailable ? 'available' : 'taken');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif", overflowX: 'hidden' }}>
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

      {/* Success Message */}
      {isSubmitted && (
        <div style={{
          background: '#dcfce7',
          border: '2px solid #16a34a',
          padding: '24px',
          margin: '20px 12px',
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <CheckCircle size={32} color="#16a34a" fill="#16a34a" />
            <div>
              <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
                Account Created Successfully!
              </h3>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '16px', color: '#000', lineHeight: '1.6' }}>
                Welcome to the directory, {formData.businessName}! Your {formData.pricingTier === 'basic' ? 'FREE Basic' : formData.pricingTier === 'professional' ? 'Professional' : 'Featured'} listing is now being processed. You'll receive an email at {formData.email} with next steps to complete your profile and start getting leads.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 12px',
      }}>
        
        {/* Why Join Section */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#000',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Why Independent Operators Choose Us
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <div style={{
              background: '#f5f5f5',
              padding: '20px',
              border: '1px solid #e5e5e5',
            }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <TrendingUp size={24} color="#fbbf24" />
                <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '18px', fontWeight: '700', color: '#000' }}>Qualified Leads</h3>
              </div>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
                Customers come to us ready to hire. They've already done their research and are comparing local options, not just browsing.
              </p>
            </div>

            <div style={{
              background: '#f5f5f5',
              padding: '20px',
              border: '1px solid #e5e5e5',
            }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <Users size={24} color="#fbbf24" />
                <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '18px', fontWeight: '700', color: '#000' }}>No Franchise Competition</h3>
              </div>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
                We only list independent operators. Customers find you, not big franchise chains with inflated pricing and corporate overhead.
              </p>
            </div>

            <div style={{
              background: '#f5f5f5',
              padding: '20px',
              border: '1px solid #e5e5e5',
            }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <Shield size={24} color="#fbbf24" />
                <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '18px', fontWeight: '700', color: '#000' }}>Quality Standards</h3>
              </div>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
                We verify minimum pricing standards to protect the industry and ensure sustainable business practices for all operators.
              </p>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div style={{
          background: '#fff',
          border: '2px solid #000',
          padding: '32px',
          marginBottom: '48px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#000',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}>
            Membership Requirements
          </h2>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <CheckCircle size={24} color="#16a34a" fill="#16a34a" />
              <div>
                <h4 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>
                  Independent Operators Only
                </h4>
                <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
                  We exclusively list locally-owned, independent junk removal companies. No franchises accepted.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <CheckCircle size={24} color="#16a34a" fill="#16a34a" />
              <div>
                <h4 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>
                  Pricing Standards
                </h4>
                <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
                  Minimum <strong>$38 per cubic yard</strong> required. Established companies typically charge <strong>$45-$65 per cubic yard</strong>. Below-market pricing hurts the industry by setting unsustainable expectations and devaluing professional service.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <CheckCircle size={24} color="#16a34a" fill="#16a34a" />
              <div>
                <h4 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>
                  Physical Location Requirement
                </h4>
                <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
                  Your business must be <strong>physically located in the city you select</strong>. We're hyperlocal—connecting customers with their neighborhood junk removal company. You cannot list a city just because you serve it; your business address must be within city limits.
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fef3c7',
            padding: '16px',
            border: '1px solid #fbbf24',
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <XCircle size={20} color="#000" />
              <div>
                <h4 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '4px' }}>
                  We Do NOT Accept:
                </h4>
                <ul style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Franchise operations (1-800-GOT-JUNK, College Hunks, etc.)</li>
                  <li>Companies charging below industry minimums (&lt;$38/cubic yard)</li>
                  <li>Unlicensed or uninsured operators</li>
                  <li>Businesses not physically located in the city they're listing (must be hyperlocal)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Education */}
        <div style={{
          background: '#f5f5f5',
          padding: '32px',
          marginBottom: '48px',
          border: '1px solid #e5e5e5',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#000',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}>
            Industry Pricing Standards
          </h2>
          <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6', marginBottom: '20px' }}>
            Understanding proper pricing ensures sustainable business operations and fair compensation for your work. While $38/cubic yard is our minimum requirement, established junk removal companies typically charge <strong>$45-$65 per cubic yard</strong>.
          </p>
          
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '16px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
              Standard Load Pricing (Established Companies)
            </h4>
            <ul style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Minimum load (¼ truck, ~3.5 cubic yards): $160-$230</li>
              <li>Half truck (~7 cubic yards): $315-$455</li>
              <li>¾ truck (~10 cubic yards): $450-$650</li>
              <li>Full truck (~14 cubic yards): $630-$910</li>
            </ul>
            <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '13px', color: '#000', marginTop: '8px', fontStyle: 'italic' }}>
              Based on $45-$65 per cubic yard industry standard
            </p>
          </div>

          <div style={{
            background: '#fff',
            padding: '16px',
            border: '2px solid #fbbf24',
            marginBottom: '16px',
          }}>
            <DollarSign size={20} color="#fbbf24" style={{ marginBottom: '8px' }} />
            <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>Why the $45-$65 standard?</strong> Established companies charge this range to properly cover all business costs while maintaining quality service and sustainable operations.
            </p>
            <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
              <strong>$38 minimum floor:</strong> This is the absolute minimum to cover truck costs, fuel, labor, disposal fees, insurance, and overhead. Charging less means working at a loss or cutting corners that hurt you long-term.
            </p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#000',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}>
            Choose Your Plan
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
          }}>
            <div
              onClick={() => setFormData({ ...formData, pricingTier: 'basic' })}
              style={{
                background: formData.pricingTier === 'basic' ? '#fef3c7' : '#fff',
                border: `2px solid ${formData.pricingTier === 'basic' ? '#fbbf24' : '#e5e5e5'}`,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              data-testid="tier-basic"
            >
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: '#fbbf24',
                color: '#000',
                padding: '4px 10px',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                1
              </div>
              <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '8px', marginTop: '32px' }}>
                Basic Listing - FREE
              </h3>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', marginBottom: '12px' }}>
                Get discovered by local customers searching for junk removal
              </p>
              <ul style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Profile page with business details</li>
                <li>Contact information display</li>
                <li>Service area coverage</li>
                <li>Customer reviews</li>
              </ul>
            </div>

            <div
              onClick={() => setFormData({ ...formData, pricingTier: 'professional' })}
              style={{
                background: formData.pricingTier === 'professional' ? '#fef3c7' : '#fff',
                border: `2px solid ${formData.pricingTier === 'professional' ? '#fbbf24' : '#e5e5e5'}`,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                marginTop: '16px',
              }}
              data-testid="tier-professional"
            >
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: '#fbbf24',
                color: '#000',
                padding: '4px 10px',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                2
              </div>
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '16px',
                background: '#fbbf24',
                color: '#000',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: '700',
              }}>
                RECOMMENDED
              </div>
              <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '8px', marginTop: '32px' }}>
                Professional Profile - $10/month
              </h3>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', marginBottom: '12px' }}>
                Full landing page experience with booking and quoting tools
              </p>
              <ul style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>Everything in Basic</li>
                <li>Full-blown landing page profile</li>
                <li>Integrated quoting tool</li>
                <li>Online booking system</li>
                <li>Active calendar with availability</li>
                <li>Photo gallery (up to 5 images)</li>
              </ul>
            </div>

            <div
              onClick={() => setFormData({ ...formData, pricingTier: 'featured' })}
              style={{
                background: formData.pricingTier === 'featured' ? '#fef3c7' : '#fff',
                border: `2px solid ${formData.pricingTier === 'featured' ? '#fbbf24' : '#e5e5e5'}`,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
              }}
              data-testid="tier-featured"
            >
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: '#fbbf24',
                color: '#000',
                padding: '4px 10px',
                fontSize: '14px',
                fontWeight: '700',
              }}>
                3
              </div>
              <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '8px', marginTop: '32px' }}>
                Featured Listing - $49/month
              </h3>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', marginBottom: '12px' }}>
                Maximum visibility and all professional tools combined
              </p>
              <ul style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', paddingLeft: '20px', lineHeight: '1.8', marginBottom: '20px' }}>
                <li>Everything in Professional</li>
                <li>Top placement in search results</li>
                <li>Featured badge on your profile</li>
                <li>Photo gallery (up to 15 images)</li>
                <li>Priority customer support</li>
              </ul>

              {/* City Availability Checker */}
              <div onClick={(e) => e.stopPropagation()} style={{
                background: '#fff',
                border: '2px solid #fbbf24',
                padding: '16px',
                marginTop: '20px',
              }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: '12px',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  Check City Availability
                </h4>
                <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6', marginBottom: '16px' }}>
                  The Featured tier is exclusive - only one company per city. Check if your city is available:
                </p>
                
                <form onSubmit={handleCheckAvailability}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={checkCity}
                      onChange={(e) => setCheckCity(e.target.value)}
                      placeholder="Enter city, state (e.g., Scottsdale, Arizona)"
                      style={{
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        flex: 1,
                        padding: '12px',
                        border: '2px solid #e5e5e5',
                        fontSize: '14px',
                        color: '#000',
                      }}
                      data-testid="input-check-city"
                    />
                    <button
                      type="submit"
                      style={{
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        background: '#fbbf24',
                        color: '#000',
                        padding: '12px 20px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      data-testid="button-check-availability"
                    >
                      <Search size={18} />
                    </button>
                  </div>
                </form>

                {availabilityStatus === 'available' && (
                  <div style={{
                    padding: '12px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    background: '#fff',
                  }}>
                    <CheckCircle size={24} color="#16a34a" fill="#16a34a" />
                    <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '16px', fontWeight: '700', color: '#16a34a' }}>
                      {checkCity} is available!
                    </span>
                  </div>
                )}

                {availabilityStatus === 'taken' && (
                  <div style={{
                    padding: '12px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    background: '#fff',
                  }}>
                    <XCircle size={24} color="#dc2626" />
                    <span style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>
                      {checkCity} is taken
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

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
                textAlign: 'center',
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
                textAlign: 'center',
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
                textAlign: 'center',
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
                textAlign: 'center',
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
                textAlign: 'center',
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
                textAlign: 'center',
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

        {/* Trust Signals */}
        <div style={{
          marginTop: '48px',
          textAlign: 'center',
          padding: '32px 16px',
          background: '#f5f5f5',
          border: '1px solid #e5e5e5',
        }}>
          <Award size={32} color="#fbbf24" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            Join the Community
          </h3>
          <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Thousands of homeowners use our directory every month to find trusted local junk removal professionals. Get your share of qualified leads and grow your business.
          </p>
        </div>
      </div>
    </div>
  );
}
