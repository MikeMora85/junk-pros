// Extract all cities from App.tsx stateData
const fs = require('fs');

const appContent = fs.readFileSync('client/src/App.tsx', 'utf8');

// Extract the stateData object
const stateDataMatch = appContent.match(/const stateData: Record<string[^}]+\}> = \{([\s\S]+?)\n  \};/);

if (!stateDataMatch) {
  console.error('Could not find stateData');
  process.exit(1);
}

const stateDataContent = stateDataMatch[1];

// Extract all state entries
const statePattern = /'([a-z-]+)':\s*\{[\s\S]+?cities:\s*\[([\s\S]+?)\],/g;
let match;
const stateCities = {};

while ((match = statePattern.exec(stateDataContent)) !== null) {
  const stateSlug = match[1];
  const citiesStr = match[2];
  
  // Extract city names
  const cities = citiesStr.match(/'([^']+)'/g)
    .map(c => c.replace(/'/g, ''));
  
  // Convert slug to proper state name
  const stateName = stateSlug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  stateCities[stateName] = cities;
}

// Output as JSON
console.log(JSON.stringify(stateCities, null, 2));
