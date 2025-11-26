import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle, XCircle, Award, Search, X, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentFormInline({ tier, formData, onSuccess, onError, onCancel, stripeCustomerId, stripeSubscriptionId }: { 
  tier: string; 
  formData: any; 
  onSuccess: () => void; 
  onError: (message: string) => void;
  onCancel: () => void;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  console.log('PaymentFormInline mounted', { stripe: !!stripe, elements: !!elements, isReady });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError('Payment system not ready. Please wait a moment.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Confirming payment...');
      
      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (confirmError) {
        console.error('Payment confirmation error:', confirmError);
        onError(`Payment Failed: ${confirmError.message}`);
        setIsProcessing(false);
        return;
      }

      console.log('Payment status:', paymentIntent?.status);

      if (paymentIntent?.status === 'succeeded') {
        console.log('Payment succeeded! Creating account...');
        
        // Payment succeeded! Now create the account
        const tierMapping: Record<string, string> = {
          'basic': 'basic',
          'professional': 'standard',
          'featured': 'premium',
        };

        const companyData = {
          name: formData.businessName,
          address: `${formData.city}, ${formData.state}`,
          phone: formData.phone,
          website: formData.email,
          rating: "0.0",
          reviews: 0,
          services: ["Junk Removal"],
          longitude: -111.9,
          latitude: 33.4,
          local: true,
          city: formData.city,
          state: formData.state,
          email: formData.email,
          password: formData.password,
          claimed: true,
          subscriptionTier: tierMapping[tier] || 'basic',
          agreedToPlatformStandards: new Date(),
          agreedToRequirements: new Date(),
          stripePaymentIntentId: paymentIntent.id,
          stripeCustomerId: stripeCustomerId,
          stripeSubscriptionId: stripeSubscriptionId,
        };

        // Create account after successful payment
        const response = await apiRequest('/api/companies', {
          method: 'POST',
          body: companyData,
        });

        console.log('Account created:', response);

        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          onSuccess();
        } else {
          onError('Account created but login failed. Please try logging in.');
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      onError(`Error: ${err.message || 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      maxWidth: '400px', 
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <h2 style={{
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '6px',
        color: '#000',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}>
        Complete Your {tier === 'professional' ? 'Professional' : 'Featured'} Subscription
      </h2>
      <p style={{
        fontSize: '14px',
        marginBottom: '16px',
        color: '#666',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}>
        {tier === 'professional' ? '$10/month' : '$49/month'} - Cancel anytime
      </p>

      <div style={{ 
        marginBottom: '16px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <PaymentElement 
          onReady={() => {
            console.log('PaymentElement ready');
            setIsReady(true);
          }}
          onLoadError={(error) => {
            console.error('PaymentElement load error:', error);
            onError(`Failed to load payment form: ${error.message}`);
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || !isReady || isProcessing}
        style={{
          width: '100%',
          padding: '14px',
          background: isProcessing || !isReady ? '#ccc' : '#fbbf24',
          color: '#000',
          border: '2px solid #000',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: isProcessing || !isReady ? 'not-allowed' : 'pointer',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          marginBottom: '10px',
          boxSizing: 'border-box',
        }}
        data-testid="button-complete-payment"
      >
        {isProcessing ? 'Processing...' : !isReady ? 'Loading...' : 'Complete Payment'}
      </button>
      
      <button
        type="button"
        onClick={onCancel}
        disabled={isProcessing}
        style={{
          width: '100%',
          padding: '12px',
          background: '#fff',
          color: '#666',
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          boxSizing: 'border-box',
        }}
        data-testid="button-cancel-payment"
      >
        Cancel
      </button>
    </form>
  );
}

export default function AddBusiness() {
  const urlParams = new URLSearchParams(window.location.search);
  const isClaiming = urlParams.get('claim') === 'true';
  const prefilledName = urlParams.get('name') || '';
  const prefilledPhone = urlParams.get('phone') || '';

  const [formData, setFormData] = useState({
    businessName: prefilledName,
    email: "",
    password: "",
    phone: prefilledPhone,
    state: "",
    city: "",
    pricingTier: "",
    confirmPricing: false,
    confirmNoFranchise: false,
  });

  const [checkCity, setCheckCity] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'available' | 'taken'>('idle');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isWhyUsOpen, setIsWhyUsOpen] = useState(false);
  const [hasReadWhyUs, setHasReadWhyUs] = useState(false);
  const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const [hasReadRequirements, setHasReadRequirements] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [stripeCustomerId, setStripeCustomerId] = useState("");
  const [stripeSubscriptionId, setStripeSubscriptionId] = useState("");

  const createBusinessMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/companies', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      
      // Check if this is a paid tier that needs payment
      const isPaidTier = formData.pricingTier === 'professional' || formData.pricingTier === 'featured';
      
      if (isPaidTier && response.user?.ownerId) {
        // Redirect to Stripe checkout for paid tiers
        window.location.href = `/stripe-checkout?tier=${formData.pricingTier}&businessOwnerId=${response.user.ownerId}`;
        return;
      }
      
      // For free tier, save token and redirect to profile
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      // Show success message and redirect to profile editor
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // After showing success, redirect to profile editor
      setTimeout(() => {
        window.location.href = '/profile/edit';
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Failed to create business:', error);
      alert(error.message || 'Failed to create business. Please try again.');
    },
  });

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkCity.trim()) {
      return;
    }
    
    try {
      // Check if any Premium profile exists in this city
      const response = await fetch(`/api/companies?city=${encodeURIComponent(checkCity)}&state=all`);
      const companies = await response.json();
      
      // Check if any company in this city has Premium tier
      const hasPremium = companies.some((c: any) => 
        c.city.toLowerCase() === checkCity.toLowerCase() && 
        c.subscriptionTier === 'premium'
      );
      
      setAvailabilityStatus(hasPremium ? 'taken' : 'available');
    } catch (error) {
      console.error('Failed to check availability:', error);
      alert('Failed to check availability. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that user has read and agreed to platform standards
    if (!hasReadWhyUs) {
      alert('Please read and agree to the platform standards and requirements before continuing.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsWhyUsOpen(true); // Auto-open the section
      return;
    }
    
    // Validate that user has read and agreed to membership requirements
    if (!hasReadRequirements) {
      alert('Please read and agree to the membership requirements and pricing standards before continuing.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsRequirementsOpen(true); // Auto-open the section
      return;
    }
    
    const tier = formData.pricingTier;
    
    // For paid tiers, show payment form first
    if (tier === 'professional' || tier === 'featured') {
      try {
        // Create payment intent
        const response = await apiRequest('/api/create-payment-setup', {
          method: 'POST',
          body: { tier }
        } as any);
        
        setClientSecret(response.clientSecret);
        setStripeCustomerId(response.customerId || '');
        setStripeSubscriptionId(response.subscriptionId || '');
        setShowPayment(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error: any) {
        console.error('Payment setup error:', error);
        // Try to parse error message from server response
        let errorMessage = 'Failed to initialize payment. Please try again.';
        try {
          if (error.message) {
            const parsed = JSON.parse(error.message);
            errorMessage = parsed.error || parsed.details || error.message;
          }
        } catch {
          errorMessage = error.message || errorMessage;
        }
        alert(errorMessage);
      }
      return;
    }
    
    // For free tier, create account immediately
    const tierMapping: Record<string, string> = {
      'basic': 'basic',
      'professional': 'standard',
      'featured': 'premium',
    };
    
    const companyData = {
      name: formData.businessName,
      address: `${formData.city}, ${formData.state}`,
      phone: formData.phone,
      website: formData.email,
      rating: "0.0",
      reviews: 0,
      services: ["Junk Removal"],
      longitude: -111.9,
      latitude: 33.4,
      local: true,
      city: formData.city,
      state: formData.state,
      email: formData.email,
      password: formData.password,
      claimed: true,
      subscriptionTier: tierMapping[formData.pricingTier] || 'basic',
      agreedToPlatformStandards: new Date(),
      agreedToRequirements: new Date(),
    };

    createBusinessMutation.mutate(companyData);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif", overflowX: 'hidden' }}>
      {/* Back Button */}
      <div className="back-button-container" style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        zIndex: 100,
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .back-button-container {
              left: calc((100vw - 900px) / 2 - 16px) !important;
            }
          }
        `}} />
        <button
          onClick={handleBack}
          style={{
            backgroundColor: '#fbbf24',
            color: '#000',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.18)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          data-testid="button-back"
        >
          <ArrowLeft size={18} color="#000" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="add-business-hero" style={{
        background: 'transparent',
        border: '3px solid #fbbf24',
        borderRadius: '8px',
        padding: '24px 16px',
        textAlign: 'center',
        margin: '16px',
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .add-business-hero {
              max-width: 868px !important;
              margin: 16px auto !important;
            }
          }
        `}} />
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#000',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}>
          {isClaiming ? 'Claim Your Profile' : 'Join the Premier Junk Removal Directory'}
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#000',
          maxWidth: '800px',
          margin: '0 auto',
          lineHeight: '1.6',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}>
          {isClaiming 
            ? 'Complete your business profile and start connecting with customers who are searching for your services!'
            : 'Connect with customers actively searching for professional junk removal services in your area. Built exclusively for independent, quality-focused operators.'}
        </p>
      </div>

      {/* Claiming Banner */}
      {isClaiming && (
        <div style={{
          background: '#dcfce7',
          border: '2px solid #16a34a',
          padding: '16px',
          margin: '20px auto',
          maxWidth: '800px',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}>
            <CheckCircle size={20} color="#16a34a" />
            <strong style={{ color: '#16a34a', fontSize: '16px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              Claiming Profile: {prefilledName}
            </strong>
          </div>
          <p style={{ 
            margin: 0, 
            color: '#166534', 
            fontSize: '14px',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            We've prefilled your business name and phone. Complete the rest to activate your profile!
          </p>
        </div>
      )}

      {/* Success Modal Popup */}
      {isSubmitted && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            overflowY: 'auto',
          }}
          onClick={() => setIsSubmitted(false)}
        >
          <div 
            style={{
              background: '#dcfce7',
              border: '3px solid #16a34a',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              margin: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSubmitted(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
              }}
              data-testid="button-close-x"
            >
              <X size={24} color="#000" />
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <CheckCircle size={48} color="#16a34a" fill="#16a34a" />
              <div>
                <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '24px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
                  Account Created Successfully!
                </h3>
                <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '16px', color: '#000', lineHeight: '1.6', marginBottom: '20px' }}>
                  Welcome to the directory, {formData.businessName}! Your {formData.pricingTier === 'basic' ? 'FREE Basic' : formData.pricingTier === 'professional' ? 'Professional' : 'Featured'} listing is now being processed. You'll receive an email at {formData.email} with next steps to complete your profile and start receiving local SEO traffic and exposure.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    background: '#16a34a',
                    color: '#fff',
                    padding: '12px 32px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  data-testid="button-close-success"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fff',
            zIndex: 1000,
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <div 
            style={{
              background: '#fff',
              padding: '20px 16px',
              width: '100%',
              maxWidth: '100vw',
              boxSizing: 'border-box',
              minHeight: '100vh',
              overflowX: 'hidden',
            }}
          >
            {!clientSecret ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ fontSize: '18px', color: '#000', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                  Setting up payment...
                </p>
              </div>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentFormInline 
                  tier={formData.pricingTier}
                  formData={formData}
                  stripeCustomerId={stripeCustomerId}
                  stripeSubscriptionId={stripeSubscriptionId}
                  onSuccess={() => {
                    console.log('Payment success, redirecting to profile editor');
                    window.location.href = '/profile/edit';
                  }}
                  onError={(err) => {
                    console.error('Payment error callback:', err);
                    setPaymentError(err);
                    alert(err);
                  }}
                  onCancel={() => {
                    console.log('Payment cancelled');
                    setShowPayment(false);
                    setClientSecret("");
                    setStripeCustomerId("");
                    setStripeSubscriptionId("");
                  }}
                />
              </Elements>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '24px 16px',
      }}>
        
        {/* Platform Standards & Requirements */}
        <div style={{ 
          marginBottom: '24px',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          <div style={{
            background: '#fbbf24',
            padding: '12px 16px',
            textAlign: 'center',
          }}>
            <span style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              color: '#000',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Platform Standards
            </span>
          </div>
          
          <div style={{
            padding: '24px',
            background: '#fff',
          }}>
            <h3 style={{ 
              fontFamily: "'Helvetica Neue', Arial, sans-serif", 
              fontSize: '16px', 
              fontWeight: '700', 
              color: '#000', 
              marginBottom: '12px' 
            }}>
              Why Join:
            </h3>
            <ul style={{ 
              fontFamily: "'Helvetica Neue', Arial, sans-serif", 
              fontSize: '15px', 
              color: '#000', 
              paddingLeft: '20px', 
              lineHeight: '2',
              marginBottom: '24px',
            }}>
              <li><strong>High-intent traffic</strong> — Customers ready to hire, not just browsing</li>
              <li><strong>No franchise competition</strong> — Independent operators only</li>
              <li><strong>Quality standards</strong> — Verified pricing protects the industry</li>
              <li><strong>Local SEO</strong> — Optimized for city-specific searches</li>
            </ul>

            <h3 style={{ 
              fontFamily: "'Helvetica Neue', Arial, sans-serif", 
              fontSize: '16px', 
              fontWeight: '700', 
              color: '#000', 
              marginBottom: '12px' 
            }}>
              Requirements:
            </h3>
            <ul style={{ 
              fontFamily: "'Helvetica Neue', Arial, sans-serif", 
              fontSize: '15px', 
              color: '#000', 
              paddingLeft: '20px', 
              lineHeight: '2',
              marginBottom: '20px',
            }}>
              <li><strong>Independent operators only</strong> — No franchises</li>
              <li><strong>Minimum $38/cubic yard</strong> — Industry standard is $45-$65/cubic yard</li>
              <li><strong>Must be physically located in your listed city</strong> — Hyperlocal only</li>
              <li><strong>Licensed and insured</strong></li>
            </ul>

            {/* Required Agreement Checkbox */}
            <div style={{
              background: '#fef3c7',
              padding: '16px',
              borderRadius: '6px',
              border: '2px solid #fbbf24',
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                <input
                  type="checkbox"
                  checked={hasReadWhyUs && hasReadRequirements}
                  onChange={(e) => {
                    setHasReadWhyUs(e.target.checked);
                    setHasReadRequirements(e.target.checked);
                  }}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                  data-testid="checkbox-read-requirements"
                />
                <span style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#000',
                  lineHeight: '1.4',
                }}>
                  I understand the benefits and meet all requirements
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div style={{ marginBottom: '24px' }}>
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
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <div
              onClick={() => setFormData({ ...formData, pricingTier: 'basic' })}
              style={{
                background: formData.pricingTier === 'basic' ? '#fef3c7' : '#fff',
                border: `2px solid ${formData.pricingTier === 'basic' ? '#fbbf24' : '#e5e5e5'}`,
                borderRadius: '8px',
                padding: '24px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
              data-testid="tier-basic"
            >
              <div style={{
                display: 'inline-block',
                background: '#fbbf24',
                color: '#000',
                padding: '4px 12px',
                fontSize: '14px',
                fontWeight: '700',
                borderRadius: '4px',
                marginBottom: '12px',
              }}>
                1
              </div>
              <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
                Basic Listing - FREE
              </h3>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', marginBottom: '12px' }}>
                Get discovered by local customers searching for junk removal
              </p>
              <ul style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', paddingLeft: '0', lineHeight: '1.8', marginBottom: '16px', listStyle: 'none', textAlign: 'center' }}>
                <li>Profile page with business details</li>
                <li>Contact information display</li>
                <li>Service area coverage</li>
                <li>Customer reviews</li>
              </ul>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData({ ...formData, pricingTier: formData.pricingTier === 'basic' ? '' : 'basic' });
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: formData.pricingTier === 'basic' ? '#166534' : '#fbbf24',
                  color: formData.pricingTier === 'basic' ? '#fff' : '#000',
                  border: '2px solid #000',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
                data-testid="button-select-basic"
              >
                {formData.pricingTier === 'basic' ? 'SELECTED' : 'SELECT'}
              </button>
            </div>

            <div
              onClick={() => setFormData({ ...formData, pricingTier: 'professional' })}
              style={{
                background: formData.pricingTier === 'professional' ? '#fef3c7' : '#fff',
                border: `2px solid ${formData.pricingTier === 'professional' ? '#fbbf24' : '#e5e5e5'}`,
                borderRadius: '8px',
                padding: '24px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
              data-testid="tier-professional"
            >
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '16px',
                background: '#fbbf24',
                color: '#000',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '4px',
              }}>
                RECOMMENDED
              </div>
              <div style={{
                display: 'inline-block',
                background: '#fbbf24',
                color: '#000',
                padding: '4px 12px',
                fontSize: '14px',
                fontWeight: '700',
                borderRadius: '4px',
                marginBottom: '12px',
              }}>
                2
              </div>
              <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
                Professional Profile - $10/month
              </h3>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', marginBottom: '12px' }}>
                Full landing page experience with booking and quoting tools
              </p>
              <ul style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', paddingLeft: '0', lineHeight: '1.8', marginBottom: '16px', listStyle: 'none', textAlign: 'center' }}>
                <li>Everything in Basic</li>
                <li>Full-blown landing page profile</li>
                <li>Integrated quoting tool</li>
                <li>Online booking system</li>
                <li>Active calendar with availability</li>
                <li>Photo gallery (up to 5 images)</li>
              </ul>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData({ ...formData, pricingTier: formData.pricingTier === 'professional' ? '' : 'professional' });
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: formData.pricingTier === 'professional' ? '#166534' : '#fbbf24',
                  color: formData.pricingTier === 'professional' ? '#fff' : '#000',
                  border: '2px solid #000',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
                data-testid="button-select-professional"
              >
                {formData.pricingTier === 'professional' ? 'SELECTED' : 'SELECT'}
              </button>
            </div>

            <div
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('[data-city-checker]')) return;
                setFormData({ ...formData, pricingTier: 'featured' });
              }}
              style={{
                background: formData.pricingTier === 'featured' ? '#fef3c7' : '#fff',
                border: `2px solid ${formData.pricingTier === 'featured' ? '#fbbf24' : '#e5e5e5'}`,
                borderRadius: '8px',
                padding: '24px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                textAlign: 'center',
                boxSizing: 'border-box',
              }}
              data-testid="tier-featured"
            >
              <div style={{
                display: 'inline-block',
                background: '#fbbf24',
                color: '#000',
                padding: '4px 12px',
                fontSize: '14px',
                fontWeight: '700',
                borderRadius: '4px',
                marginBottom: '12px',
              }}>
                3
              </div>
              <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '8px' }}>
                Featured Listing - $49/month
              </h3>
              <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', marginBottom: '12px' }}>
                Maximum visibility and all professional tools combined
              </p>
              <ul style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', paddingLeft: '0', lineHeight: '1.8', marginBottom: '20px', listStyle: 'none', textAlign: 'center' }}>
                <li>Everything in Professional</li>
                <li>Top placement in search results</li>
                <li>Featured badge on your profile</li>
                <li>Photo gallery (up to 15 images)</li>
                <li>Priority customer support</li>
              </ul>

              {/* City Availability Checker */}
              <div data-city-checker onClick={(e) => e.stopPropagation()} style={{
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
                
                <form onSubmit={handleCheckAvailability} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={checkCity}
                      onChange={(e) => setCheckCity(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData({ ...formData, pricingTier: formData.pricingTier === 'featured' ? '' : 'featured' });
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: formData.pricingTier === 'featured' ? '#166534' : '#fbbf24',
                  color: formData.pricingTier === 'featured' ? '#fff' : '#000',
                  border: '2px solid #000',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '16px',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
                data-testid="button-select-featured"
              >
                {formData.pricingTier === 'featured' ? 'SELECTED' : 'SELECT'}
              </button>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} style={{
          background: '#fff',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          padding: '24px 16px',
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
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px', textAlign: 'center' }}>
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
                boxSizing: 'border-box',
                padding: '14px 16px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#000',
                textAlign: 'center',
                background: '#fff',
              }}
              data-testid="input-business-name"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px', textAlign: 'center' }}>
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
                boxSizing: 'border-box',
                padding: '14px 16px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#000',
                textAlign: 'center',
                background: '#fff',
              }}
              data-testid="input-email"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px', textAlign: 'center' }}>
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
                boxSizing: 'border-box',
                padding: '14px 16px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#000',
                textAlign: 'center',
                background: '#fff',
              }}
              data-testid="input-password"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px', textAlign: 'center' }}>
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
                boxSizing: 'border-box',
                padding: '14px 16px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#000',
                textAlign: 'center',
                background: '#fff',
              }}
              data-testid="input-phone"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px', textAlign: 'center' }}>
              State *
            </label>
            <select
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '14px 16px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '16px',
                color: formData.state ? '#000' : '#9ca3af',
                textAlign: 'center',
                background: '#fff',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '16px',
                paddingRight: '40px',
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
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#000', marginBottom: '8px', textAlign: 'center' }}>
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
                boxSizing: 'border-box',
                padding: '14px 16px',
                border: '2px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#000',
                textAlign: 'center',
                background: '#fff',
              }}
              data-testid="input-city"
            />
            <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '12px', color: '#666', marginTop: '8px', textAlign: 'center' }}>
              You can add more cities after signup
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '14px',
              color: '#000',
              cursor: 'pointer',
              lineHeight: '1.4',
            }}>
              <input
                type="checkbox"
                required
                checked={formData.confirmPricing}
                onChange={(e) => setFormData({ ...formData, confirmPricing: e.target.checked })}
                style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }}
                data-testid="checkbox-pricing"
              />
              I confirm my pricing meets the $38/cubic yard minimum standard
            </label>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontSize: '14px',
              color: '#000',
              cursor: 'pointer',
              lineHeight: '1.4',
            }}>
              <input
                type="checkbox"
                required
                checked={formData.confirmNoFranchise}
                onChange={(e) => setFormData({ ...formData, confirmNoFranchise: e.target.checked })}
                style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }}
                data-testid="checkbox-franchise"
              />
              I confirm this is an independent business, not a franchise
            </label>
          </div>

          {/* Stripe Note for Paid Tiers */}
          {(formData.pricingTier === 'professional' || formData.pricingTier === 'featured') && (
            <p style={{ 
              fontFamily: "'Helvetica Neue', Arial, sans-serif", 
              fontSize: '12px', 
              color: '#666',
              textAlign: 'center',
              marginBottom: '16px',
            }}>
              Payments powered by Stripe
            </p>
          )}

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
            {formData.pricingTier === 'professional' 
              ? 'Create Professional Profile - $10/mo' 
              : formData.pricingTier === 'featured' 
                ? 'Create Featured Listing - $49/mo' 
                : 'Create Free Profile'}
          </button>

          {!formData.pricingTier && (
            <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '12px', color: '#000', marginTop: '8px', textAlign: 'center' }}>
              Please select a pricing plan above
            </p>
          )}
        </form>

        {/* Trust Signals */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          padding: '24px 16px',
          background: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #e5e5e5',
        }}>
          <Award size={32} color="#fbbf24" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            Join the Community
          </h3>
          <p style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: '14px', color: '#000', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Thousands of homeowners use our directory every month to find trusted local junk removal professionals. Get your share of local SEO traffic and exposure to grow your business.
          </p>
        </div>
      </div>
    </div>
  );
}
