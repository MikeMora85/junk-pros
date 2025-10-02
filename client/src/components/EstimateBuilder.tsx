import { useState } from "react";

const WasherIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-6 h-6 text-blue-500"
    fill="currentColor"
  >
    <rect
      x="4"
      y="2"
      width="16"
      height="20"
      rx="2"
      ry="2"
      className="fill-blue-200 stroke-blue-500"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="5"
      className="fill-white stroke-blue-700"
      strokeWidth="2"
    />
  </svg>
);

export default function EstimateBuilder() {
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
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="font-bold text-lg mb-3">Estimate Builder</h3>
      <p className="text-sm mb-4 text-gray-700">
        Junk removal is usually priced by cubic yard (about the size of a washing
        machine). Most trucks hold 12–15 cubic yards — about 14 washing machines.
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setYards(p.value)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              yards === p.value
                ? "bg-brand-green text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            data-testid={`button-preset-${p.label.replace(/\s/g, '-')}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative w-full h-40 mb-4 flex items-end">
        <div className="w-20 h-20 bg-gray-700 rounded-md relative">
          <div className="absolute bottom-0 left-2 w-8 h-8 bg-gray-900 rounded-full" />
        </div>

        <div className="flex-1 h-28 border-4 border-gray-400 bg-gray-100 rounded-md flex flex-wrap p-2 relative">
          {washers.map((_, i) => (
            <div
              key={i}
              className="w-1/6 flex justify-center items-center"
            >
              <WasherIcon />
            </div>
          ))}
          <div className="absolute -bottom-6 left-1/4 w-10 h-10 bg-gray-900 rounded-full" />
          <div className="absolute -bottom-6 right-1/4 w-10 h-10 bg-gray-900 rounded-full" />
        </div>
      </div>

      <label className="block text-sm font-semibold mb-1">
        Select load size ({yards} cubic yards)
      </label>
      <input
        type="range"
        min="1"
        max={truckCapacity}
        value={yards}
        onChange={(e) => setYards(parseInt(e.target.value))}
        className="w-full mb-3"
        data-testid="input-load-size"
      />

      <p className="text-sm" data-testid="text-estimated-cost">
        Estimated Cost:{" "}
        <span className="font-bold">
          ${low.toLocaleString()} – ${high.toLocaleString()}
        </span>
      </p>

      <p className="text-xs text-gray-600">
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
        className="mt-4 bg-brand-green text-white px-4 py-2 rounded-md hover:bg-deep-forest w-full"
        data-testid="button-request-quote"
      >
        Request Real Quote
      </button>
    </div>
  );
}
