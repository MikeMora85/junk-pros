import { useState } from "react";
import { Calculator } from "lucide-react";

export default function EstimateBuilderInline() {
  const [yards, setYards] = useState(7);
  const truckCapacity = 14;
  const low = yards * 45;
  const high = yards * 60;
  const percentage = (yards / truckCapacity) * 100;

  const presets = [
    { label: "¼ Load", value: Math.round(truckCapacity * 0.25) },
    { label: "½ Load", value: Math.round(truckCapacity * 0.5) },
    { label: "¾ Load", value: Math.round(truckCapacity * 0.75) },
    { label: "Full", value: truckCapacity },
  ];

  return (
    <div style={{ 
      backgroundColor: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Calculator size={20} color="#059669" />
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#111827' }}>Price Estimator</h3>
      </div>
      
      <p style={{ fontSize: '14px', marginBottom: '20px', color: '#6b7280', lineHeight: '1.5' }}>
        Get an instant estimate based on your junk volume. Most trucks hold 12-15 cubic yards.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setYards(p.value)}
            style={{
              padding: '8px 4px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              backgroundColor: yards === p.value ? '#059669' : '#f9fafb',
              color: yards === p.value ? 'white' : '#374151',
              border: yards === p.value ? 'none' : '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            data-testid={`button-preset-${p.label.replace(/\s/g, '-')}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
            Load Size
          </label>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
            {yards} cubic yards
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
            height: '6px',
            borderRadius: '3px',
            outline: 'none',
            background: `linear-gradient(to right, #059669 0%, #059669 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
          data-testid="input-load-size"
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Empty</span>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Full ({truckCapacity} yd³)</span>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <div style={{ fontSize: '13px', color: '#059669', fontWeight: '600', marginBottom: '4px' }}>
          Estimated Cost
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#047857' }} data-testid="text-estimated-cost">
          ${low} - ${high}
        </div>
        <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>
          Based on {yards} cubic yards
        </div>
      </div>

      <button 
        style={{ 
          width: '100%',
          backgroundColor: '#059669',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
        data-testid="button-request-quote"
      >
        Get Accurate Quote
      </button>
      
      <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
        Final price may vary based on items and location
      </p>
    </div>
  );
}
