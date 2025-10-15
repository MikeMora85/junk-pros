import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CompanyPrices {
  minimum?: number;
  quarterLoad?: number;
  halfLoad?: number;
  threeQuarterLoad?: number;
  fullLoad?: number;
}

interface EstimateBuilderInlineProps {
  companyPrices?: CompanyPrices;
  showDisclaimers?: boolean;
  vehicleCapacity?: string;
  singleItemMinimum?: number;
}

export default function EstimateBuilderInline({ companyPrices, showDisclaimers = true, vehicleCapacity, singleItemMinimum }: EstimateBuilderInlineProps) {
  const [loadSize, setLoadSize] = useState<'quarter' | 'half' | 'threeQuarter' | 'full'>('half');
  const [pricingGuideOpen, setPricingGuideOpen] = useState(false);
  const [educationalOpen, setEducationalOpen] = useState(false);
  const [upchargesOpen, setUpchargesOpen] = useState(false);
  
  // Calculate price based on load size and company prices
  const getPrice = () => {
    const prices = {
      quarter: companyPrices?.quarterLoad || 150,
      half: companyPrices?.halfLoad || 500,
      threeQuarter: companyPrices?.threeQuarterLoad || 750,
      full: companyPrices?.fullLoad || 1000,
    };
    return prices[loadSize];
  };
  
  const price = getPrice();
  const percentage = loadSize === 'quarter' ? 25 : loadSize === 'half' ? 50 : loadSize === 'threeQuarter' ? 75 : 100;

  const presets = [
    { label: "¼", value: 'quarter' as const },
    { label: "½", value: 'half' as const },
    { label: "¾", value: 'threeQuarter' as const },
    { label: "Full", value: 'full' as const },
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #fbbf24',
      borderRadius: '0',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: 'none',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', position: 'relative' }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          margin: 0, 
          color: '#1a1a1a',
          letterSpacing: '-0.02em',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}>
          Junk Removal Pricing
        </h3>
      </div>
      
      {vehicleCapacity && (
        <div style={{
          backgroundColor: '#fbbf24',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '16px',
          textAlign: 'center',
          border: '2px solid #f59e0b',
        }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#000', marginBottom: '4px' }}>
            Our Truck Capacity
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#000' }}>
            {vehicleCapacity}
          </div>
        </div>
      )}

      <p style={{ fontSize: '14px', marginBottom: '20px', color: '#333333', lineHeight: '1.5' }}>
        {vehicleCapacity ? (
          <>Send photos or book an in-person estimate to confirm your volume and final price.</>
        ) : (
          <>Learn how most haulers price your job.</>
        )}
      </p>

      {showDisclaimers && !vehicleCapacity && (
        <>
          {/* Industry Pricing Guide - Collapsible */}
          <div style={{
            backgroundColor: '#fbbf24',
            borderRadius: '8px',
            marginBottom: '12px',
            border: 'none',
          }}>
            <button
              onClick={() => setPricingGuideOpen(!pricingGuideOpen)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              data-testid="button-pricing-guide"
            >
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                Industry Pricing Guide
              </h4>
              {pricingGuideOpen ? <ChevronUp size={18} color="#000" /> : <ChevronDown size={18} color="#000" />}
            </button>
            {pricingGuideOpen && (
              <div style={{ padding: '0 14px 12px 14px', fontSize: '12px', color: '#333333', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '4px' }}>• Minimum load (¼ truck): $150-$250</div>
                <div style={{ marginBottom: '4px' }}>• Half truck: $300-$450</div>
                <div style={{ marginBottom: '4px' }}>• ¾ truck: $450-$650</div>
                <div>• Full truck: $600-$850+</div>
              </div>
            )}
          </div>

          {/* Educational Disclaimer - Collapsible */}
          <div style={{
            backgroundColor: '#fbbf24',
            borderRadius: '8px',
            marginBottom: '12px',
            border: 'none',
          }}>
            <button
              onClick={() => setEducationalOpen(!educationalOpen)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              data-testid="button-educational"
            >
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#000', margin: 0 }}>
                Educational Tool Only
              </div>
              {educationalOpen ? <ChevronUp size={18} color="#000" /> : <ChevronDown size={18} color="#000" />}
            </button>
            {educationalOpen && (
              <div style={{
                padding: '0 16px 16px 16px',
                fontSize: '12px',
                color: '#000',
                lineHeight: '1.6',
              }}>
                This calculator provides estimates for <strong>basic junk removal</strong> to help you understand typical pricing. Contact companies directly for accurate quotes based on your specific situation.
              </div>
            )}
          </div>

          {/* Common Upcharges - Collapsible */}
          <div style={{
            backgroundColor: '#fbbf24',
            borderRadius: '8px',
            marginBottom: '20px',
            border: 'none',
          }}>
            <button
              onClick={() => setUpchargesOpen(!upchargesOpen)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              data-testid="button-upcharges"
            >
              <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                Common Upcharges
              </h4>
              {upchargesOpen ? <ChevronUp size={18} color="#000" /> : <ChevronDown size={18} color="#000" />}
            </button>
            {upchargesOpen && (
              <div style={{ padding: '0 14px 12px 14px', fontSize: '12px', color: '#333333', lineHeight: '1.6' }}>
                <div style={{ marginBottom: '4px' }}>• Stairs and difficult access</div>
                <div style={{ marginBottom: '4px' }}>• Estate cleanouts (additional labor)</div>
                <div style={{ marginBottom: '4px' }}>• Obstacles or narrow pathways</div>
                <div style={{ marginBottom: '4px' }}>• Hazardous items (paint, tires, bed bugs)</div>
                <div>• Soiled or contaminated materials</div>
              </div>
            )}
          </div>
        </>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setLoadSize(p.value)}
            style={{
              padding: '10px 4px',
              borderRadius: '0',
              fontSize: '14px',
              fontWeight: '700',
              backgroundColor: loadSize === p.value ? '#fbbf24' : '#ffffff',
              color: loadSize === p.value ? '#000' : '#1a1a1a',
              border: `2px solid ${loadSize === p.value ? '#fbbf24' : '#cccccc'}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'uppercase',
            }}
            data-testid={`button-preset-${p.label.replace(/\s/g, '-')}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          width: '100%',
          height: '40px',
          background: '#f3f4f6',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #000',
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${percentage}%`,
            background: '#fbbf24',
            transition: 'width 0.3s ease',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '14px',
            fontWeight: '700',
            color: '#000',
            zIndex: 1,
          }}>
            Truck: {percentage}% Full
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '0',
        padding: '20px',
        marginBottom: '16px',
        border: '1px solid #cccccc',
      }}>
        <div style={{ fontSize: '13px', color: '#000', fontWeight: '600', marginBottom: '4px' }}>
          Estimated Cost
        </div>
        <div style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#fbbf24',
          letterSpacing: '-0.02em',
        }} data-testid="text-estimated-cost">
          ${price}
        </div>
        <div style={{ fontSize: '12px', color: '#000', marginTop: '4px' }}>
          For a {loadSize === 'quarter' ? '¼' : loadSize === 'half' ? '½' : loadSize === 'threeQuarter' ? '¾' : 'full'} load
        </div>
        {singleItemMinimum && (
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #e5e7eb'
          }}>
            Single item minimum: ${singleItemMinimum}
          </div>
        )}
      </div>
    </div>
  );
}
