import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <header style={{
        background: '#000',
        padding: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/">
            <span style={{ color: '#fbbf24', fontSize: '20px', fontWeight: '700', cursor: 'pointer' }}>
              FindLocalJunkPros.com
            </span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#000', 
          marginBottom: '8px' 
        }}>
          Terms of Service
        </h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>
          Last Updated: November 26, 2025
        </p>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            1. Agreement to Terms
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            By accessing or using FindLocalJunkPros.com ("the Platform"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            2. Description of Service
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            FindLocalJunkPros.com is a directory platform that connects consumers with independent, locally-owned junk removal companies. 
            We provide listing services for junk removal businesses and search functionality for consumers seeking junk removal services.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            3. Business Listing Subscriptions
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            We offer the following subscription tiers for business listings:
          </p>
          <ul style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', paddingLeft: '24px', marginBottom: '12px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Basic (FREE):</strong> Free listing with standard visibility</li>
            <li style={{ marginBottom: '8px' }}><strong>Professional ($10/month):</strong> Enhanced listing with priority placement</li>
            <li style={{ marginBottom: '8px' }}><strong>Featured ($49/month):</strong> Premium listing with maximum visibility and featured placement</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px', background: '#fef3c7', border: '2px solid #fbbf24', borderRadius: '8px', padding: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            4. Recurring Billing & Payments
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            <strong>IMPORTANT: AUTOMATIC RECURRING CHARGES</strong>
          </p>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            By subscribing to a paid plan (Professional or Featured), you authorize FindLocalJunkPros.com to charge your payment method on a <strong>recurring monthly basis</strong> until you cancel your subscription.
          </p>
          <ul style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', paddingLeft: '24px', marginBottom: '12px' }}>
            <li style={{ marginBottom: '8px' }}>Professional Plan: <strong>$10.00 charged automatically every month</strong></li>
            <li style={{ marginBottom: '8px' }}>Featured Plan: <strong>$49.00 charged automatically every month</strong></li>
          </ul>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            Your subscription will automatically renew each month on the same date you originally subscribed. 
            Your payment method will be charged automatically at the beginning of each billing cycle.
          </p>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '0' }}>
            You may cancel your subscription at any time. Upon cancellation, you will retain access to your paid features until the end of your current billing period.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            5. Cancellation Policy
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            You may cancel your subscription at any time by contacting us at support@findlocaljunkpros.com or through your account settings. 
            Cancellations take effect at the end of your current billing period. No partial refunds are provided for unused portions of a billing cycle.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            6. Refund Policy
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            All subscription payments are non-refundable except in cases where required by law. 
            If you believe you have been charged in error, please contact us within 30 days of the charge.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            7. Business Listing Requirements
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            To maintain a listing on FindLocalJunkPros.com, businesses must:
          </p>
          <ul style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', paddingLeft: '24px', marginBottom: '12px' }}>
            <li style={{ marginBottom: '8px' }}>Be an independent, locally-owned and operated junk removal business (no franchises)</li>
            <li style={{ marginBottom: '8px' }}>Provide accurate contact information and business details</li>
            <li style={{ marginBottom: '8px' }}>Maintain competitive, transparent pricing</li>
            <li style={{ marginBottom: '8px' }}>Respond professionally to customer inquiries</li>
            <li style={{ marginBottom: '8px' }}>Comply with all applicable local, state, and federal laws</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            8. Platform Standards
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            We reserve the right to remove any listing that violates our platform standards, including but not limited to:
          </p>
          <ul style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', paddingLeft: '24px', marginBottom: '12px' }}>
            <li style={{ marginBottom: '8px' }}>Fraudulent or misleading business information</li>
            <li style={{ marginBottom: '8px' }}>Predatory pricing practices</li>
            <li style={{ marginBottom: '8px' }}>Poor customer service or unresponsiveness</li>
            <li style={{ marginBottom: '8px' }}>Violation of any terms in this agreement</li>
          </ul>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            9. Limitation of Liability
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            FindLocalJunkPros.com is a directory service and does not provide junk removal services directly. 
            We are not responsible for the actions, services, or conduct of any business listed on our platform. 
            All transactions and interactions between consumers and listed businesses are solely between those parties.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            10. Changes to Terms
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            We reserve the right to modify these Terms of Service at any time. 
            Continued use of the Platform after any changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
            11. Contact Information
          </h2>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7', marginBottom: '12px' }}>
            For questions about these Terms of Service or your subscription, please contact us at:
          </p>
          <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.7' }}>
            <strong>Email:</strong> support@findlocaljunkpros.com
          </p>
        </section>

        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '24px', marginTop: '40px' }}>
          <Link href="/">
            <span style={{ 
              color: '#fbbf24', 
              fontWeight: '600', 
              cursor: 'pointer',
              textDecoration: 'underline',
            }}>
              ← Back to Home
            </span>
          </Link>
        </div>
      </main>

      <footer style={{
        background: '#000',
        color: '#fff',
        padding: '24px 20px',
        textAlign: 'center',
        marginTop: '40px',
      }}>
        <p style={{ fontSize: '14px', color: '#999' }}>
          © 2025 FindLocalJunkPros.com. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
