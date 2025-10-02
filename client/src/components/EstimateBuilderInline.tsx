import { useState } from "react";

const WasherIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    style={{ width: '24px', height: '24px', color: '#3b82f6' }}
    fill="currentColor"
  >
    <rect
      x="4"
      y="2"
      width="16"
      height="20"
      rx="2"
      ry="2"
      fill="#bfdbfe"
      stroke="#1d4ed8"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="5"
      fill="white"
      stroke="#1e40af"
      strokeWidth="2"
    />
  </svg>
);

export default function EstimateBuilderInline() {
  const [yards, setYards] = useState(7);
  const truckCapacity = 14;
  const low = yards * 45;
  const high = yards * 60;
  const loadFraction = yards / truckCapacity;

  const washers = Array.from({ length: yards }, (_, i) => i);

  const presets = [
    { label: "¼ Truck", value: Math.round(truckCapacity * 0.25) },
    { label: "½ Truck", value: Math.round(truckCapacity * 0.5) },
    { label: "¾ Truck", value: Math.round(truckCapacity * 0.75) },
    { label: "Full Truck", value: truckCapacity },
  ];

  return (
    <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '24px', marginBottom: '16px' }}>
      <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>Estimate Builder</h3>
      <p style={{ fontSize: '14px', marginBottom: '16px', color: '#374151' }}>
        Junk removal is usually priced by cubic yard (about the size of a washing
        machine). Most trucks hold 12–15 cubic yards — about 14 washing machines.
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setYards(p.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: yards === p.value ? 'hsl(142 72% 20%)' : '#e5e7eb',
              color: yards === p.value ? 'white' : '#374151',
              border: 'none',
              cursor: 'pointer',
            }}
            data-testid={`button-preset-${p.label.replace(/\s/g, '-')}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', width: '100%', height: '160px', marginBottom: '16px', display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#374151', borderRadius: '6px', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, left: '8px', width: '32px', height: '32px', backgroundColor: '#111827', borderRadius: '50%' }} />
        </div>

        <div style={{ flex: 1, height: '112px', border: '4px solid #9ca3af', backgroundColor: '#f3f4f6', borderRadius: '6px', display: 'flex', flexWrap: 'wrap', padding: '8px', position: 'relative' }}>
          {washers.map((_, i) => (
            <div
              key={i}
              style={{ width: '16.666%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <WasherIcon />
            </div>
          ))}
          <div style={{ position: 'absolute', bottom: '-24px', left: '25%', width: '40px', height: '40px', backgroundColor: '#111827', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-24px', right: '25%', width: '40px', height: '40px', backgroundColor: '#111827', borderRadius: '50%' }} />
        </div>
      </div>

      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
        Select load size ({yards} cubic yards)
      </label>
      <input
        type="range"
        min="1"
        max={truckCapacity}
        value={yards}
        onChange={(e) => setYards(parseInt(e.target.value))}
        style={{ width: '100%', marginBottom: '12px' }}
        data-testid="input-load-size"
      />

      <p style={{ fontSize: '14px' }} data-testid="text-estimated-cost">
        Estimated Cost:{" "}
        <span style={{ fontWeight: 'bold' }}>
          ${low.toLocaleString()} – ${high.toLocaleString()}
        </span>
      </p>

      <p style={{ fontSize: '12px', color: '#6b7280' }}>
        That's about{" "}
        {loadFraction <= 0.25
          ? "¼ load"
          : loadFraction <= 0.5
          ? "½ load"
          : loadFraction < 1
          ? "¾ load"
          : "a full truck"}
        .
      </p>

      <button 
        style={{
          marginTop: '16px',
          backgroundColor: 'hsl(142 72% 20%)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '6px',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          fontWeight: '600',
        }}
        data-testid="button-request-quote"
      >
        Request Real Quote
      </button>
    </div>
  );
}
