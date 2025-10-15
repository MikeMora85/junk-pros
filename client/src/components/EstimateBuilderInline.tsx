import { useState } from "react";
import { Calculator } from "lucide-react";

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
  const [cubicYards, setCubicYards] = useState<string>("");
  
  // Extract truck capacity number from string like "13 cubic yards"
  const getTruckCapacity = () => {
    if (vehicleCapacity) {
      const match = vehicleCapacity.match(/(\d+)/);
      return match ? parseInt(match[1]) : 13;
    }
    return 13; // Default truck capacity
  };
  
  const truckCapacity = getTruckCapacity();
  
  // Calculate percentage of truck filled
  const getPercentage = () => {
    const yards = parseFloat(cubicYards) || 0;
    const percentage = (yards / truckCapacity) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
  };
  
  // Calculate price based on cubic yards
  const getPrice = () => {
    const percentage = getPercentage();
    const yards = parseFloat(cubicYards) || 0;
    
    // If no input, show minimum
    if (yards === 0) {
      return companyPrices?.minimum || 75;
    }
    
    // Get prices with defaults
    const prices = {
      quarter: companyPrices?.quarterLoad || 150,
      half: companyPrices?.halfLoad || 500,
      threeQuarter: companyPrices?.threeQuarterLoad || 750,
      full: companyPrices?.fullLoad || 1000,
    };
    
    // Calculate price based on percentage
    if (percentage <= 25) {
      return prices.quarter;
    } else if (percentage <= 50) {
      // Interpolate between quarter and half
      const ratio = (percentage - 25) / 25;
      return Math.round(prices.quarter + (prices.half - prices.quarter) * ratio);
    } else if (percentage <= 75) {
      // Interpolate between half and three-quarter
      const ratio = (percentage - 50) / 25;
      return Math.round(prices.half + (prices.threeQuarter - prices.half) * ratio);
    } else {
      // Interpolate between three-quarter and full
      const ratio = (percentage - 75) / 25;
      return Math.round(prices.threeQuarter + (prices.full - prices.threeQuarter) * ratio);
    }
  };
  
  const price = getPrice();
  const percentage = getPercentage();

  // Quick preset buttons based on truck capacity
  const presets = [
    { label: "¼", yards: Math.round(truckCapacity * 0.25) },
    { label: "½", yards: Math.round(truckCapacity * 0.5) },
    { label: "¾", yards: Math.round(truckCapacity * 0.75) },
    { label: "Full", yards: truckCapacity },
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
        <Calculator size={24} color="#fbbf24" />
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          margin: 0, 
          color: '#1a1a1a',
          letterSpacing: '-0.02em',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
        }}>
          Instant Price Calculator
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

      <p style={{ fontSize: '14px', marginBottom: '16px', color: '#333333', lineHeight: '1.5' }}>
        Enter how many cubic yards of junk you have for an instant estimate.
      </p>

      {/* Cubic Yards Input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '8px',
          color: '#000',
        }}>
          How many cubic yards?
        </label>
        <input
          type="number"
          value={cubicYards}
          onChange={(e) => setCubicYards(e.target.value)}
          placeholder={`Enter 1-${truckCapacity}`}
          min="0"
          max={truckCapacity}
          step="0.5"
          data-testid="input-cubic-yards"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            outline: 'none',
            fontWeight: '600',
          }}
        />
      </div>

      {/* Quick Preset Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#666' }}>
          Quick Select:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setCubicYards(p.yards.toString())}
              style={{
                padding: '8px 4px',
                borderRadius: '0',
                fontSize: '12px',
                fontWeight: '700',
                backgroundColor: cubicYards === p.yards.toString() ? '#fbbf24' : '#ffffff',
                color: cubicYards === p.yards.toString() ? '#000' : '#1a1a1a',
                border: `2px solid ${cubicYards === p.yards.toString() ? '#fbbf24' : '#cccccc'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              data-testid={`button-preset-${p.label.replace(/\s/g, '-')}`}
            >
              {p.label} ({p.yards} yd³)
            </button>
          ))}
        </div>
      </div>

      {/* Truck Fill Visual */}
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
            Truck: {Math.round(percentage)}% Full
          </div>
        </div>
      </div>

      {/* Price Display */}
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
          {cubicYards ? `For ${cubicYards} cubic yards` : 'Enter cubic yards for estimate'}
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

      {showDisclaimers && (
        <>
          {/* Industry Pricing Info */}
          <div style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '0',
            padding: '14px',
            marginBottom: '16px',
            border: '1px solid #cccccc',
          }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>
              Industry Pricing Guide
            </h4>
            <div style={{ fontSize: '12px', color: '#333333', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '4px' }}>• Minimum load (¼ truck): $150-$250</div>
              <div style={{ marginBottom: '4px' }}>• Half truck: $300-$450</div>
              <div style={{ marginBottom: '4px' }}>• ¾ truck: $450-$650</div>
              <div>• Full truck: $600-$850+</div>
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div style={{
            backgroundColor: '#fff3cd',
            borderRadius: '0',
            padding: '16px',
            marginBottom: '16px',
            border: '2px solid #fbbf24',
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#000',
              marginBottom: '8px',
            }}>
              Educational Tool Only
            </div>
            <div style={{
              fontSize: '12px',
              color: '#000',
              lineHeight: '1.6',
            }}>
              This calculator provides estimates for <strong>basic junk removal</strong> to help you understand typical pricing. Contact companies directly for accurate quotes based on your specific situation.
            </div>
          </div>

          {/* Common Upcharges */}
          <div style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '0',
            padding: '14px',
            border: '1px solid #cccccc',
          }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>
              Common Upcharges
            </h4>
            <div style={{ fontSize: '12px', color: '#333333', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '4px' }}>• Stairs and difficult access</div>
              <div style={{ marginBottom: '4px' }}>• Estate cleanouts (additional labor)</div>
              <div style={{ marginBottom: '4px' }}>• Obstacles or narrow pathways</div>
              <div style={{ marginBottom: '4px' }}>• Hazardous items (paint, tires, bed bugs)</div>
              <div>• Soiled or contaminated materials</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
