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
      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 8px 24px rgba(251,191,36,0.25)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', position: 'relative' }}>
        <Calculator size={24} color="#fff" />
        <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>
          Instant Price Calculator
        </h3>
      </div>
      
      <p style={{ fontSize: '14px', marginBottom: '20px', color: 'rgba(255,255,255,0.95)', lineHeight: '1.5' }}>
        🚛 Get your estimate in seconds! Most trucks hold 12-15 cubic yards.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setYards(p.value)}
            style={{
              padding: '10px 4px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              backgroundColor: yards === p.value ? '#fff' : 'rgba(255,255,255,0.2)',
              color: yards === p.value ? '#f59e0b' : '#fff',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: yards === p.value ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            }}
            data-testid={`button-preset-${p.label.replace(/\s/g, '-')}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
            Load Size
          </label>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
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
            background: `linear-gradient(to right, #fff 0%, #fff ${percentage}%, rgba(255,255,255,0.3) ${percentage}%, rgba(255,255,255,0.3) 100%)`,
            cursor: 'pointer',
          }}
          data-testid="input-load-size"
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Empty</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Full</span>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px' }}>
          💰 Estimated Cost
        </div>
        <div style={{
          fontSize: '32px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }} data-testid="text-estimated-cost">
          ${low} - ${high}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          Based on {yards} cubic yards • Industry average
        </div>
      </div>

      {/* Education Section */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
          <Info size={16} color="#fff" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#fff', margin: '0 0 8px 0' }}>
              What is a Cubic Yard?
            </h4>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.95)', margin: 0, lineHeight: '1.5' }}>
              A cubic yard is 3ft × 3ft × 3ft - about the size of a standard washing machine or dryer. Use this as your reference point when estimating your load.
            </p>
          </div>
        </div>
      </div>

      {/* Industry Pricing Info */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '16px',
      }}>
        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#fff', margin: '0 0 8px 0' }}>
          📊 Industry Pricing Guide
        </h4>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.95)', lineHeight: '1.6' }}>
          <div style={{ marginBottom: '4px' }}>• Minimum load (¼ truck): $150-$250</div>
          <div style={{ marginBottom: '4px' }}>• Half truck: $300-$450</div>
          <div style={{ marginBottom: '4px' }}>• ¾ truck: $450-$650</div>
          <div>• Full truck: $600-$850+</div>
        </div>
      </div>

      <button 
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #fff 0%, #f3f4f6 100%)',
          color: '#f59e0b',
          padding: '14px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '800',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.2s',
          marginBottom: '12px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        data-testid="button-request-quote"
      >
        🎯 Get Accurate Quote Now
      </button>

      {/* Disclaimer */}
      <div style={{
        fontSize: '11px',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: '1.5',
      }}>
        ⚠️ For education only. Actual pricing varies by company, location, and specific requirements. Contact companies directly for accurate quotes.
      </div>
    </div>
  );
}
