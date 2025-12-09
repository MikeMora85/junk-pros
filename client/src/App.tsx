import { Route, Router, Switch } from "wouter";
import AddBusiness from "./pages/AddBusiness";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import ExampleProfile from "./pages/ExampleProfile";
import CompanyDetail from "./pages/CompanyDetail";
import ProfileEditor from "./pages/ProfileEditor";
import ItemRemovalPage from "./pages/ItemRemovalPage";
import ServicePage from "./pages/ServicePage";
import StripeCheckout from "./pages/StripeCheckout";
import TermsOfService from "./pages/TermsOfService";
import LandingPage from "./pages/LandingPage";
import StatePage from "./pages/StatePage";
import CityPage from "./pages/CityPage";
import { BlogPage, BlogPostPage } from "./pages/BlogPages";

// State slug to proper name mapping (for routing)
const stateNames: Record<string, string> = {
  'alabama': 'Alabama', 'alaska': 'Alaska', 'arizona': 'Arizona', 'arkansas': 'Arkansas',
  'california': 'California', 'colorado': 'Colorado', 'connecticut': 'Connecticut', 'delaware': 'Delaware',
  'florida': 'Florida', 'georgia': 'Georgia', 'hawaii': 'Hawaii', 'idaho': 'Idaho',
  'illinois': 'Illinois', 'indiana': 'Indiana', 'iowa': 'Iowa', 'kansas': 'Kansas',
  'kentucky': 'Kentucky', 'louisiana': 'Louisiana', 'maine': 'Maine', 'maryland': 'Maryland',
  'massachusetts': 'Massachusetts', 'michigan': 'Michigan', 'minnesota': 'Minnesota', 'mississippi': 'Mississippi',
  'missouri': 'Missouri', 'montana': 'Montana', 'nebraska': 'Nebraska', 'nevada': 'Nevada',
  'new-hampshire': 'New Hampshire', 'new-jersey': 'New Jersey', 'new-mexico': 'New Mexico', 'new-york': 'New York',
  'north-carolina': 'North Carolina', 'north-dakota': 'North Dakota', 'ohio': 'Ohio', 'oklahoma': 'Oklahoma',
  'oregon': 'Oregon', 'pennsylvania': 'Pennsylvania', 'rhode-island': 'Rhode Island', 'south-carolina': 'South Carolina',
  'south-dakota': 'South Dakota', 'tennessee': 'Tennessee', 'texas': 'Texas', 'utah': 'Utah',
  'vermont': 'Vermont', 'virginia': 'Virginia', 'washington': 'Washington', 'west-virginia': 'West Virginia',
  'wisconsin': 'Wisconsin', 'wyoming': 'Wyoming',
};

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/add-business" component={AddBusiness} />
        <Route path="/stripe-checkout">
          {() => {
            const urlParams = new URLSearchParams(window.location.search);
            const tier = urlParams.get('tier') || '';
            const businessOwnerId = parseInt(urlParams.get('businessOwnerId') || '0');
            return <StripeCheckout tier={tier} businessOwnerId={businessOwnerId} />;
          }}
        </Route>
        <Route path="/profile/edit" component={ProfileEditor} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/example-profile" component={ExampleProfile} />
        <Route path="/blog/:slug">
          {(params) => <BlogPostPage slug={params.slug} />}
        </Route>
        <Route path="/blog" component={BlogPage} />
        <Route path="/items/:item" component={ItemRemovalPage} />
        <Route path="/services/:service" component={ServicePage} />
        <Route path="/company/:id" component={CompanyDetail} />
        <Route path="/:state/:city/:id" component={CompanyDetail} />
        <Route path="/:state/:city">
          {(params) => <CityPage city={params.city} state={params.state} />}
        </Route>
        <Route path="/:state">
          {(params) => <StatePage stateName={stateNames[params.state] || 'Unknown'} stateSlug={params.state} />}
        </Route>
        <Route path="/" component={LandingPage} />
        <Route>404 - Page Not Found</Route>
      </Switch>
    </Router>
  );
}

export default App;
