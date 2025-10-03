import { useState } from "react";
import { Calculator, Info } from "lucide-react";

export default function EstimateBuilderInline() {
  const [yards, setYards] = useState(7);
  const truckCapacity = 14;
  const low = yards * 45;
  const high = yards * 60;
  const percentage = (yards / truckCapacity) * 100;

  const presets = [
    { label: "¼", value: Math.round(truckCapacity * 0.25) },
    { label: "½", value: Math.round(truckCapacity * 0.5) },
    { label: "¾", value: Math.round(truckCapacity * 0.75) },
    { label: "Full", value: truckCapacity },
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #166534',
      borderRadius: '0',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: 'none',
      position: 'relative',
      overflow: 'hidden',
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', position: 'relative' }}>
        <Calculator size={24} color="#e63946" />
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
      
      <p style={{ fontSize: '14px', marginBottom: '20px', color: '#333333', lineHeight: '1.5' }}>
        Get your estimate in seconds! Most trucks hold 12-15 cubic yards.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setYards(p.value)}
            style={{
              padding: '10px 4px',
              borderRadius: '0',
              fontSize: '14px',
              fontWeight: '700',
              backgroundColor: yards === p.value ? '#e63946' : '#ffffff',
              color: yards === p.value ? '#ffffff' : '#1a1a1a',
              border: `2px solid ${yards === p.value ? '#e63946' : '#cccccc'}`,
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>
            Load Size
          </label>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#e63946' }}>
            {yards} yd³
          </span>
        </div>
        
        <input
          type="range"
          min="1"
          max={truckCapacity}
          value={yards}
          onChange={(e) => setYards(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            outline: 'none',
            background: `linear-gradient(to right, #e63946 0%, #e63946 ${percentage}%, #e5e5e5 ${percentage}%, #e5e5e5 100%)`,
            cursor: 'pointer',
          }}
          data-testid="input-load-size"
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Empty</span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Full</span>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '0',
        padding: '20px',
        marginBottom: '16px',
        border: '1px solid #cccccc',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>
          Estimated Cost
        </div>
        <div style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#e63946',
          letterSpacing: '-0.02em',
        }} data-testid="text-estimated-cost">
          ${low} - ${high}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          Based on {yards} cubic yards • Industry average
        </div>
      </div>

      {/* Education Section */}
      <div style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '0',
        padding: '14px',
        marginBottom: '16px',
        border: '1px solid #cccccc',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
          <Info size={16} color="#e63946" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 8px 0' }}>
              What is a Cubic Yard?
            </h4>
            <p style={{ fontSize: '12px', color: '#333333', margin: 0, lineHeight: '1.5' }}>
              A cubic yard is 3ft × 3ft × 3ft - about the size of a standard washing machine or dryer. Use this as your reference point when estimating your load.
            </p>
          </div>
        </div>
      </div>

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

      <button 
        style={{
          width: '100%',
          background: '#fbbf24',
          color: '#000',
          padding: '14px',
          borderRadius: '0',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '700',
          boxShadow: 'none',
          transition: 'all 0.2s',
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        data-testid="button-request-quote"
      >
        Get Accurate Quote Now
      </button>

      {/* Disclaimer */}
      <div style={{
        fontSize: '11px',
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: '1.5',
      }}>
        For education only. Actual pricing varies by company, location, and specific requirements. Contact companies directly for accurate quotes.
      </div>
    </div>
  );
}
