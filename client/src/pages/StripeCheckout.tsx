import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from 'wouter';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ tier, onSuccess, onError }: { tier: string; onSuccess: () => void; onError: (message: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/profile/edit`,
      },
    });

    setIsProcessing(false);

    if (error) {
      onError(`Payment Failed: ${error.message}`);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '16px',
        color: '#000',
      }}>
        Complete Your {tier === 'professional' ? 'Professional' : 'Featured'} Subscription
      </h2>
      <p style={{
        fontSize: '16px',
        marginBottom: '24px',
        color: '#666',
      }}>
        {tier === 'professional' ? '$10/month' : '$49/month'} - Cancel anytime
      </p>
      
      <PaymentElement />
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{
          width: '100%',
          padding: '16px',
          background: isProcessing ? '#ccc' : '#fbbf24',
          color: '#000',
          border: '2px solid #000',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '700',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          marginTop: '24px',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}
        data-testid="button-complete-payment"
      >
        {isProcessing ? 'Processing...' : 'Complete Payment'}
      </button>
    </form>
  );
}

export default function StripeCheckout({ tier, businessOwnerId }: { tier: string; businessOwnerId: number }) {
  const [clientSecret, setClientSecret] = useState("");
  const [, setLocation] = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Create subscription as soon as the page loads
    apiRequest("/api/create-subscription", {
      method: "POST",
      body: JSON.stringify({ tier, businessOwnerId }),
      headers: { 'Content-Type': 'application/json' }
    } as any)
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('No client secret returned');
        }
      })
      .catch((error) => {
        setToastMessage(`Setup Error: ${error.message || 'Failed to initialize payment. Please try again.'}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      });
  }, [tier, businessOwnerId]);

  if (!clientSecret) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}>
        <div style={{
          textAlign: 'center',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #fbbf24',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#666', fontSize: '16px' }}>Setting up payment...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      padding: '40px 16px',
    }}>
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#000',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '8px',
          border: '2px solid #fbbf24',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          maxWidth: '400px',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}>
          {toastMessage}
        </div>
      )}

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm
          tier={tier}
          onSuccess={() => {
            setToastMessage("Payment Successful! Your subscription is now active.");
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
              setLocation('/profile/edit');
            }, 2000);
          }}
          onError={(message) => {
            setToastMessage(message);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
          }}
        />
      </Elements>
    </div>
  );
}
