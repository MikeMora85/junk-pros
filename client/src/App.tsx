import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Route, Router, Switch } from "wouter";
import { apiRequest, queryClient } from "./lib/queryClient";
import { MapPin, Phone, Star, Plus, X, Camera, Calendar, Search, TrendingUp, Home, Truck, Recycle, Dumbbell, DollarSign, Building2, TreeDeciduous, HardHat, Briefcase, Users, Clock, Shield, FileText, CheckCircle, LogIn, LogOut, UserCircle, Menu, ChevronDown, ChevronUp, Trash2, Globe, Mail, Refrigerator, Sofa, Package, Trees, Tv, CreditCard, Smartphone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaGoogle } from "react-icons/fa";
import type { Company } from "@shared/schema";
import EstimateBuilderInline from "./components/EstimateBuilderInline";
import AddBusiness from "./pages/AddBusiness";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import ExampleProfile from "./pages/ExampleProfile";
import CompanyDetail from "./pages/CompanyDetail";
import ProfileEditor from "./pages/ProfileEditor";
import ItemRemovalPage from "./pages/ItemRemovalPage";
import ServicePage from "./pages/ServicePage";
import { useAuth } from "./hooks/useAuth";
import { trackBusinessEvent } from "./lib/tracking";
import img1 from "@assets/stock_images/junk_removal_truck_s_8d89f5e0.jpg";
import img2 from "@assets/stock_images/junk_removal_truck_s_08e95c57.jpg";
import img3 from "@assets/stock_images/junk_removal_truck_s_6100f5f9.jpg";
import img4 from "@assets/stock_images/junk_removal_truck_s_20fde47d.jpg";
import img5 from "@assets/stock_images/junk_removal_truck_s_8e2ece45.jpg";
import img6 from "@assets/stock_images/junk_removal_truck_s_7e78a264.jpg";
import arizonaHero from "@assets/stock_images/grand_canyon_arizona_c5218ef2.jpg";
import californiaHero from "@assets/stock_images/golden_gate_bridge_s_7e39867c.jpg";
import texasHero from "@assets/stock_images/texas_state_capitol__62bb1fcf.jpg";
import floridaHero from "@assets/stock_images/miami_beach_south_be_3f10b0ca.jpg";
import newYorkHero from "@assets/stock_images/statue_of_liberty_ne_70f49b5f.jpg";
import washingtonHero from "@assets/stock_images/space_needle_seattle_e0d9ac78.jpg";
import coloradoHero from "@assets/stock_images/rocky_mountains_colo_f5782bd2.jpg";
import illinoisHero from "@assets/stock_images/willis_tower_chicago_08709be4.jpg";
import massachusettsHero from "@assets/stock_images/boston_massachusetts_495b1661.jpg";
import pennsylvaniaHero from "@assets/stock_images/liberty_bell_philade_94af1290.jpg";
import nevadaHero from "@assets/stock_images/las_vegas_strip_neva_9810840d.jpg";
import tennesseeHero from "@assets/stock_images/great_smoky_mountain_04319b2a.jpg";
import georgiaHero from "@assets/stock_images/atlanta_georgia_skyl_42af1e19.jpg";
import louisianaHero from "@assets/stock_images/french_quarter_new_o_97be723e.jpg";
import oregonHero from "@assets/stock_images/crater_lake_oregon_s_dbd956cd.jpg";
import wyomingHero from "@assets/stock_images/old_faithful_geyser__6269315a.jpg";
import montanaHero from "@assets/stock_images/glacier_national_par_ca533513.jpg";
import utahHero from "@assets/stock_images/arches_national_park_c92ce949.jpg";
import indianaHero from "@assets/stock_images/indianapolis_motor_s_076178bf.jpg";
import michiganHero from "@assets/stock_images/mackinac_bridge_mich_70f90f84.jpg";
import kentuckyHero from "@assets/stock_images/churchill_downs_kent_993eabc9.jpg";
import northCarolinaHero from "@assets/stock_images/blue_ridge_parkway_n_536d613b.jpg";
import southCarolinaHero from "@assets/stock_images/fort_sumter_charlest_156df300.jpg";
import alabamaHero from "@assets/stock_images/uss_alabama_battlesh_57cdea2a.jpg";
import arkansasHero from "@assets/stock_images/hot_springs_national_148b5220.jpg";
import mississippiHero from "@assets/stock_images/mississippi_river_de_f2f97e59.jpg";
import oklahomaHero from "@assets/stock_images/oklahoma_city_nation_f762f0dd.jpg";
import missouriHero from "@assets/stock_images/gateway_arch_st_loui_fd4c11b6.jpg";
import southDakotaHero from "@assets/stock_images/mount_rushmore_south_6dd9fb61.jpg";
import minnesotaHero from "@assets/stock_images/mall_of_america_minn_c6b98b05.jpg";
import iowaHero from "@assets/stock_images/iowa_state_capitol_d_03687da2.jpg";
import wisconsinHero from "@assets/stock_images/wisconsin_state_capi_f9c6451e.jpg";
import idahoHero from "@assets/stock_images/boise_idaho_state_ca_f5997fd7.jpg";
import alaskaHero from "@assets/stock_images/denali_national_park_280a8832.jpg";
import hawaiiHero from "@assets/stock_images/diamond_head_waikiki_2fdf0db0.jpg";
import newMexicoHero from "@assets/stock_images/carlsbad_caverns_new_5adf76a1.jpg";
import northDakotaHero from "@assets/stock_images/fargo_north_dakota_d_760e03a9.jpg";
import nebraskaHero from "@assets/stock_images/omaha_nebraska_old_m_16e3ae04.jpg";
import rhodeIslandHero from "@assets/stock_images/providence_rhode_isl_fd73a38e.jpg";
import connecticutHero from "@assets/stock_images/mystic_seaport_conne_0a29993f.jpg";
import delawareHero from "@assets/stock_images/dover_delaware_state_8f01671f.jpg";
import marylandHero from "@assets/stock_images/annapolis_maryland_s_2fc6a27b.jpg";
import westVirginiaHero from "@assets/stock_images/charleston_west_virg_ddca95e8.jpg";
import vermontHero from "@assets/stock_images/burlington_vermont_l_4c114d59.jpg";
import newHampshireHero from "@assets/stock_images/portsmouth_new_hamps_6e40cb8c.jpg";
import curbsideJunkHero from "@assets/662A4A2C-FCD0-43E0-9DC4-2ABCD8C1DC69_1759626202147.png";
import profilePhoto1 from "@assets/stock_images/junk_removal_truck_l_09aca246.jpg";
import profilePhoto2 from "@assets/stock_images/junk_removal_truck_l_d830abe1.jpg";
import profilePhoto3 from "@assets/stock_images/junk_removal_truck_l_edd9160e.jpg";
import profilePhoto4 from "@assets/stock_images/junk_removal_truck_l_163f0dce.jpg";

const defaultImages = [img1, img2, img3, img4, img5, img6];

// Format phone number to (XXX) XXX-XXXX
const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// Grey placeholder component for companies without images
const PlaceholderImage = ({ index }: { index: number }) => (
  <div style={{
    width: '100%',
    height: '140px',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    fontSize: '14px',
    fontWeight: '600',
  }}>
    <div style={{ textAlign: 'center' }}>
      <Camera size={32} style={{ margin: '0 auto 8px' }} />
      <div>Photo {index + 1}</div>
    </div>
  </div>
);

// Rotating Banner Component
function RotatingBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const messages = [
    'All 50 States • Local Independent Companies Only • No Franchises',
    'Find Trusted Local Pros',
    'Same Day Service Available',
    'Licensed & Insured Professionals',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', height: '28px', overflow: 'hidden' }}>
      {messages.map((message, index) => (
        <p
          key={index}
          style={{
            color: '#000',
            fontSize: '24px',
            margin: '0',
            fontWeight: '600',
            position: 'absolute',
            width: '100%',
            top: '0',
            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
            transform: `translateY(${(index - currentIndex) * 100}%)`,
            opacity: index === currentIndex ? 1 : 0,
          }}
        >
          {message}
        </p>
      ))}
    </div>
  );
}

// Hamburger Menu Component
function HamburgerMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [townSearch, setTownSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const allStates = [
    { name: 'Alabama', slug: 'alabama' },
    { name: 'Alaska', slug: 'alaska' },
    { name: 'Arizona', slug: 'arizona' },
    { name: 'Arkansas', slug: 'arkansas' },
    { name: 'California', slug: 'california' },
    { name: 'Colorado', slug: 'colorado' },
    { name: 'Connecticut', slug: 'connecticut' },
    { name: 'Delaware', slug: 'delaware' },
    { name: 'Florida', slug: 'florida' },
    { name: 'Georgia', slug: 'georgia' },
    { name: 'Hawaii', slug: 'hawaii' },
    { name: 'Idaho', slug: 'idaho' },
    { name: 'Illinois', slug: 'illinois' },
    { name: 'Indiana', slug: 'indiana' },
    { name: 'Iowa', slug: 'iowa' },
    { name: 'Kansas', slug: 'kansas' },
    { name: 'Kentucky', slug: 'kentucky' },
    { name: 'Louisiana', slug: 'louisiana' },
    { name: 'Maine', slug: 'maine' },
    { name: 'Maryland', slug: 'maryland' },
    { name: 'Massachusetts', slug: 'massachusetts' },
    { name: 'Michigan', slug: 'michigan' },
    { name: 'Minnesota', slug: 'minnesota' },
    { name: 'Mississippi', slug: 'mississippi' },
    { name: 'Missouri', slug: 'missouri' },
    { name: 'Montana', slug: 'montana' },
    { name: 'Nebraska', slug: 'nebraska' },
    { name: 'Nevada', slug: 'nevada' },
    { name: 'New Hampshire', slug: 'new-hampshire' },
    { name: 'New Jersey', slug: 'new-jersey' },
    { name: 'New Mexico', slug: 'new-mexico' },
    { name: 'New York', slug: 'new-york' },
    { name: 'North Carolina', slug: 'north-carolina' },
    { name: 'North Dakota', slug: 'north-dakota' },
    { name: 'Ohio', slug: 'ohio' },
    { name: 'Oklahoma', slug: 'oklahoma' },
    { name: 'Oregon', slug: 'oregon' },
    { name: 'Pennsylvania', slug: 'pennsylvania' },
    { name: 'Rhode Island', slug: 'rhode-island' },
    { name: 'South Carolina', slug: 'south-carolina' },
    { name: 'South Dakota', slug: 'south-dakota' },
    { name: 'Tennessee', slug: 'tennessee' },
    { name: 'Texas', slug: 'texas' },
    { name: 'Utah', slug: 'utah' },
    { name: 'Vermont', slug: 'vermont' },
    { name: 'Virginia', slug: 'virginia' },
    { name: 'Washington', slug: 'washington' },
    { name: 'West Virginia', slug: 'west-virginia' },
    { name: 'Wisconsin', slug: 'wisconsin' },
    { name: 'Wyoming', slug: 'wyoming' },
  ];

  const majorCities = [
    'Phoenix, AZ', 'Los Angeles, CA', 'San Diego, CA', 'San Francisco, CA',
    'Houston, TX', 'Dallas, TX', 'Austin, TX', 'Chicago, IL', 'New York, NY',
    'Miami, FL', 'Tampa, FL', 'Seattle, WA', 'Denver, CO', 'Las Vegas, NV',
    'Portland, OR', 'Boston, MA', 'Atlanta, GA', 'Philadelphia, PA',
  ];

  const majorTowns = [
    'Scottsdale, AZ', 'Gilbert, AZ', 'Chandler, AZ', 'Tempe, AZ',
    'Boulder, CO', 'Sedona, AZ', 'Aspen, CO', 'Park City, UT',
    'Napa, CA', 'Carmel, CA', 'Santa Barbara, CA', 'Savannah, GA',
  ];

  const serviceTypes = {
    commercial: ['Office Cleanouts', 'Warehouse Clearing', 'Retail Space', 'Restaurant Equipment'],
    residential: ['Home Cleanouts', 'Garage Cleanouts', 'Attic/Basement', 'Yard Debris'],
    estates: ['Estate Cleanouts', 'Foreclosure Cleanouts', 'Hoarding Cleanup', 'Downsizing'],
    specialty: ['Storage Unit Cleanouts', 'Construction Debris', 'Electronic Waste', 'Appliance Removal'],
  };

  const commonItems = [
    'Refrigerator', 'Washing Machine', 'Dryer', 'Dishwasher', 'Oven', 'Stove',
    'Sofa', 'Couch', 'Mattress', 'Box Spring', 'Bed Frame', 'Dresser',
    'Hot Tub', 'Piano', 'Pool Table', 'Treadmill', 'Exercise Equipment',
    'TV', 'Computer', 'Desk', 'Office Chair', 'Filing Cabinet',
    'Shed', 'Deck', 'Fence', 'Swing Set', 'Trampoline',
    'Carpet', 'Tile', 'Drywall', 'Lumber', 'Concrete',
    'Lawn Mower', 'Grill', 'Patio Furniture', 'Garden Tools',
    'Toys', 'Books', 'Clothing', 'Boxes', 'E-Waste',
  ];

  const filteredStates = allStates.filter(state =>
    state.name.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const filteredCities = majorCities.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredTowns = majorTowns.filter(town =>
    town.toLowerCase().includes(townSearch.toLowerCase())
  );

  const filteredItems = commonItems.filter(item =>
    item.toLowerCase().includes(itemSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
        onClick={onClose}
        data-testid="menu-overlay"
      />

      {/* Side Menu */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '75%',
          maxWidth: '600px',
          backgroundColor: '#ffffff',
          zIndex: 1001,
          overflowY: 'auto',
          boxShadow: '4px 0 16px rgba(0,0,0,0.2)',
        }}
        data-testid="side-menu"
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '2px solid #fbbf24',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: '#ffffff',
          zIndex: 10,
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#000', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>Menu</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
            }}
            data-testid="button-close-menu"
          >
            <X size={24} color="#000" />
          </button>
        </div>

        {/* Menu Content */}
        <div style={{ padding: '20px' }}>
          {/* Home */}
          <a
            href="/"
            style={{
              display: 'block',
              padding: '16px',
              color: '#000',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              borderBottom: '1px solid #e5e5e5',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
            data-testid="link-home"
          >
            Home
          </a>

          {/* Areas Served - Section Title */}
          <div style={{ borderBottom: '1px solid #e5e5e5' }}>
            <div
              style={{
                padding: '16px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#000',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Areas Served
            </div>

            {/* States */}
            <div style={{ paddingLeft: '16px' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === 'states' ? null : 'states')}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'left',
                }}
                data-testid="button-states"
              >
                <span>States</span>
                <ChevronDown size={16} style={{ transform: expandedSection === 'states' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {expandedSection === 'states' && (
                <div style={{ paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '0', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      style={{
                        width: '100px',
                        padding: '8px',
                        border: '2px solid #fbbf24',
                        borderRadius: '6px 0 0 6px',
                        fontSize: '14px',
                        borderRight: 'none',
                      }}
                      data-testid="input-state-search"
                    />
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      backgroundColor: '#fbbf24',
                      border: '2px solid #fbbf24',
                      borderLeft: 'none',
                      borderRadius: '0 6px 6px 0',
                    }}>
                      <Search size={16} color="#000" />
                    </div>
                  </div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredStates.map(state => (
                      <a
                        key={state.slug}
                        href={`/${state.slug}`}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          color: '#000',
                          textDecoration: 'none',
                          fontSize: '15px',
                          borderRadius: '4px',
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        data-testid={`link-state-${state.slug}`}
                      >
                        {state.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cities */}
            <div style={{ paddingLeft: '16px' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === 'cities' ? null : 'cities')}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'left',
                }}
                data-testid="button-cities"
              >
                <span>Cities</span>
                <ChevronDown size={16} style={{ transform: expandedSection === 'cities' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {expandedSection === 'cities' && (
                <div style={{ paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '0', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      style={{
                        width: '100px',
                        padding: '8px',
                        border: '2px solid #fbbf24',
                        borderRadius: '6px 0 0 6px',
                        fontSize: '14px',
                        borderRight: 'none',
                      }}
                      data-testid="input-city-search"
                    />
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      backgroundColor: '#fbbf24',
                      border: '2px solid #fbbf24',
                      borderLeft: 'none',
                      borderRadius: '0 6px 6px 0',
                    }}>
                      <Search size={16} color="#000" />
                    </div>
                  </div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredCities.map(city => {
                      const [cityName, stateAbbr] = city.split(', ');
                      const stateName = allStates.find(s => s.name.startsWith(stateAbbr))?.slug || stateAbbr.toLowerCase();
                      const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <a
                          key={city}
                          href={`/${stateName}/${citySlug}`}
                          style={{
                            display: 'block',
                            padding: '8px 12px',
                            color: '#000',
                            textDecoration: 'none',
                            fontSize: '15px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          data-testid={`item-city-${city.toLowerCase().replace(/[,\s]+/g, '-')}`}
                        >
                          {city}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Towns */}
            <div style={{ paddingLeft: '16px' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === 'towns' ? null : 'towns')}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'left',
                }}
                data-testid="button-towns"
              >
                <span>Towns</span>
                <ChevronDown size={16} style={{ transform: expandedSection === 'towns' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {expandedSection === 'towns' && (
                <div style={{ paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '0', marginBottom: '12px' }}>
                    <input
                      type="text"
                      value={townSearch}
                      onChange={(e) => setTownSearch(e.target.value)}
                      style={{
                        width: '100px',
                        padding: '8px',
                        border: '2px solid #fbbf24',
                        borderRadius: '6px 0 0 6px',
                        fontSize: '14px',
                        borderRight: 'none',
                      }}
                      data-testid="input-town-search"
                    />
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      backgroundColor: '#fbbf24',
                      border: '2px solid #fbbf24',
                      borderLeft: 'none',
                      borderRadius: '0 6px 6px 0',
                    }}>
                      <Search size={16} color="#000" />
                    </div>
                  </div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredTowns.map(town => {
                      const [townName, stateAbbr] = town.split(', ');
                      const stateName = allStates.find(s => s.name.startsWith(stateAbbr))?.slug || stateAbbr.toLowerCase();
                      const townSlug = townName.toLowerCase().replace(/\s+/g, '-');
                      return (
                        <a
                          key={town}
                          href={`/${stateName}/${townSlug}`}
                          style={{
                            display: 'block',
                            padding: '8px 12px',
                            color: '#000',
                            textDecoration: 'none',
                            fontSize: '15px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          data-testid={`item-town-${town.toLowerCase().replace(/[,\s]+/g, '-')}`}
                        >
                          {town}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Junk Removal Services - Section Title */}
          <div style={{ borderBottom: '1px solid #e5e5e5' }}>
            <div
              style={{
                padding: '16px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#000',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Junk Removal Services
            </div>

            {/* Commercial */}
            <div style={{ paddingLeft: '16px' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === 'commercial' ? null : 'commercial')}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'left',
                }}
                data-testid="button-commercial"
              >
                <span>Commercial</span>
                <ChevronDown size={16} style={{ transform: expandedSection === 'commercial' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {expandedSection === 'commercial' && (
                <div style={{ paddingBottom: '12px' }}>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {serviceTypes.commercial.map(service => (
                      <a
                        key={service}
                        href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          color: '#000',
                          textDecoration: 'none',
                          fontSize: '15px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        data-testid={`item-commercial-${service.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {service}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Residential */}
            <div style={{ paddingLeft: '16px' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === 'residential' ? null : 'residential')}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'left',
                }}
                data-testid="button-residential"
              >
                <span>Residential</span>
                <ChevronDown size={16} style={{ transform: expandedSection === 'residential' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {expandedSection === 'residential' && (
                <div style={{ paddingBottom: '12px' }}>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {serviceTypes.residential.map(service => (
                      <a
                        key={service}
                        href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          color: '#000',
                          textDecoration: 'none',
                          fontSize: '15px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        data-testid={`item-residential-${service.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {service}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Estate Cleanouts */}
            <div style={{ paddingLeft: '16px' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === 'estates' ? null : 'estates')}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'left',
                }}
                data-testid="button-estates"
              >
                <span>Estate Cleanouts</span>
                <ChevronDown size={16} style={{ transform: expandedSection === 'estates' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {expandedSection === 'estates' && (
                <div style={{ paddingBottom: '12px' }}>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {serviceTypes.estates.map(service => (
                      <a
                        key={service}
                        href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          color: '#000',
                          textDecoration: 'none',
                          fontSize: '15px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        data-testid={`item-estates-${service.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {service}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specialty */}
            <div style={{ paddingLeft: '16px' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === 'specialty' ? null : 'specialty')}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#000',
                  textAlign: 'left',
                }}
                data-testid="button-specialty"
              >
                <span>Specialty</span>
                <ChevronDown size={16} style={{ transform: expandedSection === 'specialty' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {expandedSection === 'specialty' && (
                <div style={{ paddingBottom: '12px' }}>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {serviceTypes.specialty.map(service => (
                      <a
                        key={service}
                        href={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          color: '#000',
                          textDecoration: 'none',
                          fontSize: '15px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontFamily: "'Helvetica Neue', Arial, sans-serif",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        data-testid={`item-specialty-${service.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {service}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Common Items Removed */}
          <div style={{ borderBottom: '1px solid #e5e5e5' }}>
            <button
              onClick={() => setExpandedSection(expandedSection === 'items' ? null : 'items')}
              style={{
                width: '100%',
                padding: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '18px',
                fontWeight: '600',
                color: '#000',
                textAlign: 'left',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              data-testid="button-common-items"
            >
              <span>Common Items Removed</span>
              <ChevronDown size={18} style={{ transform: expandedSection === 'items' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {expandedSection === 'items' && (
              <div style={{ padding: '0 16px 12px 16px' }}>
                <div style={{ display: 'flex', gap: '0', marginBottom: '12px' }}>
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) => setItemSearch(e.target.value)}
                    style={{
                      width: '100px',
                      padding: '8px',
                      border: '2px solid #fbbf24',
                      borderRadius: '6px 0 0 6px',
                      fontSize: '14px',
                      borderRight: 'none',
                    }}
                    data-testid="input-item-search"
                  />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    backgroundColor: '#fbbf24',
                    border: '2px solid #fbbf24',
                    borderLeft: 'none',
                    borderRadius: '0 6px 6px 0',
                  }}>
                    <Search size={16} color="#000" />
                  </div>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredItems.map(item => (
                    <a
                      key={item}
                      href={`/items/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      style={{
                        display: 'block',
                        padding: '8px 12px',
                        color: '#000',
                        textDecoration: 'none',
                        fontSize: '15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      data-testid={`item-common-${item.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blog */}
          <a
            href="/blog"
            style={{
              display: 'block',
              padding: '16px',
              color: '#000',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              borderBottom: '1px solid #e5e5e5',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}
            data-testid="link-blog"
          >
            Blog
          </a>

          {/* Login/Profile/Logout */}
          {user ? (
            <>
              <Link
                href="/profile/edit"
                style={{
                  display: 'block',
                  padding: '16px',
                  color: '#000',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  borderBottom: '1px solid #e5e5e5',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}
                data-testid="link-menu-profile"
              >
                My Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'block',
                  padding: '16px',
                  color: '#000',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  borderBottom: '1px solid #e5e5e5',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  cursor: 'pointer',
                }}
                data-testid="button-menu-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              style={{
                display: 'block',
                padding: '16px',
                color: '#000',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '600',
                borderBottom: '1px solid #e5e5e5',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              data-testid="link-menu-login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

// Blog Page Component
function BlogPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const blogPosts = [
    {
      id: 1,
      title: "How to Choose the Right Junk Removal Company",
      excerpt: "Finding a reliable junk removal service doesn't have to be difficult. Learn the key factors to consider when selecting a company for your needs.",
      date: "March 15, 2024",
      category: "Tips & Guides"
    },
    {
      id: 2,
      title: "What Can and Cannot Be Removed by Junk Haulers",
      excerpt: "Understanding what items junk removal companies can legally and safely haul away will help you prepare for your appointment and avoid surprises.",
      date: "March 10, 2024",
      category: "Industry Info"
    },
    {
      id: 3,
      title: "Preparing Your Home for Junk Removal Service",
      excerpt: "Get the most out of your junk removal service with these simple preparation tips that will save you time and money.",
      date: "March 5, 2024",
      category: "Tips & Guides"
    },
    {
      id: 4,
      title: "The Environmental Benefits of Professional Junk Removal",
      excerpt: "Learn how professional junk removal companies help reduce landfill waste through responsible recycling and donation practices.",
      date: "February 28, 2024",
      category: "Sustainability"
    },
    {
      id: 5,
      title: "Estate Cleanouts: A Complete Guide",
      excerpt: "Estate cleanouts can be overwhelming. This comprehensive guide walks you through the process and helps you find the right assistance.",
      date: "February 20, 2024",
      category: "Services"
    },
    {
      id: 6,
      title: "Commercial vs. Residential Junk Removal: Key Differences",
      excerpt: "Understanding the differences between commercial and residential junk removal services will help you choose the right provider for your project.",
      date: "February 15, 2024",
      category: "Industry Info"
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#d3d3d3',
    }}>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        background: '#ffffff',
        minHeight: '100vh',
      }}>
        {/* Header with Menu */}
        <div style={{
          position: 'relative',
          background: '#ffffff',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              backgroundColor: '#fbbf24',
              color: '#000',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
            data-testid="button-menu"
          >
            <Menu size={24} color="#000" />
          </button>
        </div>

        {/* Yellow Banner */}
        <header style={{
          background: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)',
          padding: '32px 16px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'clamp(32px, 8vw, 48px)',
            fontWeight: '700',
            color: '#000',
            marginBottom: '12px',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Blog
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            color: '#333',
            maxWidth: '700px',
            margin: '0 auto',
            padding: '0 8px',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Expert advice, industry insights, and helpful tips for all your junk removal needs
          </p>
        </header>

        {/* Blog Posts Grid */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 16px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '24px',
          }}>
            {blogPosts.map((post) => (
              <article
                key={post.id}
                style={{
                  background: '#fff',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  padding: '24px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                data-testid={`article-blog-${post.id}`}
              >
                <div style={{
                  display: 'inline-block',
                  background: '#fbbf24',
                  color: '#000',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  border: '1px solid #000',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {post.category}
                </div>
                <h2 style={{
                  fontSize: 'clamp(20px, 5vw, 24px)',
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: '12px',
                  lineHeight: '1.3',
                  wordWrap: 'break-word',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {post.title}
                </h2>
                <p style={{
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  color: '#666',
                  marginBottom: '16px',
                  lineHeight: '1.6',
                  wordWrap: 'break-word',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {post.excerpt}
                </p>
                <div style={{
                  fontSize: '14px',
                  color: '#999',
                  fontWeight: '500',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {post.date}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Footer Section */}
        <div style={{
          background: '#166534',
          color: '#fff',
          padding: '40px 16px',
          marginTop: '40px',
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
          }}>
            <h3 style={{
              fontSize: 'clamp(22px, 6vw, 28px)',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#fff',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}>
              Ready to Find Your Local Hauler?
            </h3>
            <p style={{
              fontSize: 'clamp(16px, 4vw, 18px)',
              marginBottom: '24px',
              color: '#fff',
              padding: '0 8px',
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
            }}>
              Search by zip code to find vetted junk removal companies near you
            </p>
            <a
              href="/"
              style={{
                display: 'inline-block',
                background: '#fbbf24',
                color: '#000',
                padding: '14px 28px',
                borderRadius: '8px',
                border: '2px solid #000',
                fontSize: 'clamp(16px, 4vw, 18px)',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              data-testid="link-blog-to-home"
            >
              Start Your Search
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Landing Page Component
function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.trim().toLowerCase();
    
    // Check if it's a zip code (5 digits)
    const zipCodePattern = /^\d{5}$/;
    if (zipCodePattern.test(query)) {
      // Navigate to zip code search page
      window.location.href = `/zip/${query}`;
      return;
    }
    
    const slug = query.replace(/\s+/g, '-');
    
    // Check if it's a state name
    const isState = Object.keys(stateNames).includes(slug) || 
                    Object.values(stateNames).map(s => s.toLowerCase()).includes(query);
    
    if (isState) {
      // Navigate to state page
      const stateSlug = Object.keys(stateNames).find(key => 
        key === slug || stateNames[key].toLowerCase() === query
      );
      window.location.href = `/${stateSlug}`;
    } else {
      // It's a city - search across all states to find which one has it
      try {
        // Pass the original query (with spaces) to the API, not the slug
        const response = await fetch(`/api/search-city?city=${encodeURIComponent(query)}`);
        const result = await response.json();
        
        if (result.state) {
          // Found the city in a specific state
          window.location.href = `/${result.state}/${slug}`;
        } else {
          // City not found, default to Arizona for now
          window.location.href = `/arizona/${slug}`;
        }
      } catch (error) {
        // On error, default to Arizona
        window.location.href = `/arizona/${slug}`;
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#d3d3d3',
    }}>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      <div style={{
        background: '#ffffff',
        minHeight: '100vh',
      }}>
      {/* Header Buttons */}
      <div style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        display: 'flex',
        gap: '12px',
        zIndex: 1000,
      }}>
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            backgroundColor: '#fbbf24',
            color: '#000',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
          data-testid="button-menu"
        >
          <Menu size={24} color="#000" />
        </button>
        
        {isAuthenticated && user && (
          <button
            onClick={() => window.location.href = '/profile/edit'}
            style={{
              backgroundColor: '#166534',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              fontSize: '14px',
              fontWeight: '600',
            }}
            data-testid="button-profile"
          >
            <UserCircle size={18} />
            Profile
          </button>
        )}
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 20px 30px 20px',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px',
        }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: '0 0 16px 0',
            letterSpacing: '-0.02em',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Search Your Zip Code
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#6b7280',
            margin: '0 0 40px 0',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            No National Franchises, Local Vetted Junk Haulers Only.
          </p>

          <form onSubmit={handleSearch} style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            gap: '6px',
            backgroundColor: '#fff',
            padding: '5px',
            borderRadius: '10px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
            border: '2px solid transparent',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '2px solid #fbbf24';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '2px solid transparent';
          }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search by zip code, city, state"
              style={{
                flex: 1,
                minWidth: '0',
                width: '1px',
                padding: '10px 8px',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                borderRadius: '8px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                backgroundColor: 'transparent',
                WebkitTextSizeAdjust: '100%',
                touchAction: 'manipulation',
              }}
              data-testid="input-homepage-search"
            />
            <button
              type="submit"
              style={{
                padding: '10px 14px',
                background: '#fbbf24',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}
              data-testid="button-homepage-search"
            >
              <Search size={18} />
            </button>
          </form>
          
          {/* Rotating message below search */}
          <div style={{
            marginTop: '24px',
            textAlign: 'center',
          }}>
            <RotatingBanner />
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#374151',
            marginBottom: '20px',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Browse by State
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            {[
              { name: 'Alabama', slug: 'alabama' },
              { name: 'Alaska', slug: 'alaska' },
              { name: 'Arizona', slug: 'arizona' },
              { name: 'Arkansas', slug: 'arkansas' },
              { name: 'California', slug: 'california' },
              { name: 'Colorado', slug: 'colorado' },
              { name: 'Connecticut', slug: 'connecticut' },
              { name: 'Delaware', slug: 'delaware' },
              { name: 'Florida', slug: 'florida' },
              { name: 'Georgia', slug: 'georgia' },
              { name: 'Hawaii', slug: 'hawaii' },
              { name: 'Idaho', slug: 'idaho' },
              { name: 'Illinois', slug: 'illinois' },
              { name: 'Indiana', slug: 'indiana' },
              { name: 'Iowa', slug: 'iowa' },
              { name: 'Kansas', slug: 'kansas' },
              { name: 'Kentucky', slug: 'kentucky' },
              { name: 'Louisiana', slug: 'louisiana' },
              { name: 'Maine', slug: 'maine' },
              { name: 'Maryland', slug: 'maryland' },
              { name: 'Massachusetts', slug: 'massachusetts' },
              { name: 'Michigan', slug: 'michigan' },
              { name: 'Minnesota', slug: 'minnesota' },
              { name: 'Mississippi', slug: 'mississippi' },
              { name: 'Missouri', slug: 'missouri' },
              { name: 'Montana', slug: 'montana' },
              { name: 'Nebraska', slug: 'nebraska' },
              { name: 'Nevada', slug: 'nevada' },
              { name: 'New Hampshire', slug: 'new-hampshire' },
              { name: 'New Jersey', slug: 'new-jersey' },
              { name: 'New Mexico', slug: 'new-mexico' },
              { name: 'New York', slug: 'new-york' },
              { name: 'North Carolina', slug: 'north-carolina' },
              { name: 'North Dakota', slug: 'north-dakota' },
              { name: 'Ohio', slug: 'ohio' },
              { name: 'Oklahoma', slug: 'oklahoma' },
              { name: 'Oregon', slug: 'oregon' },
              { name: 'Pennsylvania', slug: 'pennsylvania' },
              { name: 'Rhode Island', slug: 'rhode-island' },
              { name: 'South Carolina', slug: 'south-carolina' },
              { name: 'South Dakota', slug: 'south-dakota' },
              { name: 'Tennessee', slug: 'tennessee' },
              { name: 'Texas', slug: 'texas' },
              { name: 'Utah', slug: 'utah' },
              { name: 'Vermont', slug: 'vermont' },
              { name: 'Virginia', slug: 'virginia' },
              { name: 'Washington', slug: 'washington' },
              { name: 'West Virginia', slug: 'west-virginia' },
              { name: 'Wisconsin', slug: 'wisconsin' },
              { name: 'Wyoming', slug: 'wyoming' },
            ].map((state) => (
              <a
                key={state.slug}
                href={`/${state.slug}`}
                style={{
                  padding: '12px 8px',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  transform: 'translateY(-1px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 5px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                data-testid={`link-state-${state.slug}`}
              >
                {state.name}
              </a>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '48px',
        }}>
          {[
            {
              icon: <Star size={32} />,
              title: 'Local & Independent',
              description: 'Only locally-owned companies based in your city - no franchises',
            },
            {
              icon: <TrendingUp size={32} />,
              title: 'Instant Quotes',
              description: 'Get free estimates from multiple local companies in minutes',
            },
            {
              icon: <MapPin size={32} color="#fbbf24" />,
              title: 'Your Neighborhood Crew',
              description: 'Support independent businesses located right in your community',
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#fff',
                padding: '32px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 5px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
            >
              <div style={{
                display: 'inline-flex',
                padding: '16px',
                background: '#f5f5f5',
                borderRadius: '12px',
                color: '#fbbf24',
                marginBottom: '16px',
              }}>
                {feature.icon}
              </div>
              <h4 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#374151',
                margin: '0 0 8px 0',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                {feature.title}
              </h4>
              <p style={{
                fontSize: '15px',
                color: '#6b7280',
                margin: '0',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

// State Page Component
function StatePage({ stateName, stateSlug }: { stateName: string; stateSlug: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const stateData: Record<string, { 
    cities: string[];
    heroImage: string;
    landmark: string;
    population: string;
    fact: string;
    climate: string;
  }> = {
    'arizona': {
      cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale', 'Glendale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise', 'Flagstaff', 'Yuma', 'Avondale', 'Goodyear', 'Lake Havasu City'],
      heroImage: arizonaHero,
      landmark: 'Grand Canyon',
      population: '7.3 million',
      fact: 'Arizona has one of the highest rates of junk removal due to frequent home renovations in the growing Phoenix metro area.',
      climate: 'Hot desert climate with mild winters - ideal for year-round junk removal services',
    },
    'california': {
      cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Irvine', 'Stockton', 'Chula Vista'],
      heroImage: californiaHero,
      landmark: 'Golden Gate Bridge',
      population: '39.5 million',
      fact: 'California leads the nation in eco-friendly junk removal with over 75% of waste diverted from landfills.',
      climate: 'Mediterranean climate with year-round service availability',
    },
    'texas': {
      cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Laredo', 'Lubbock', 'Garland', 'Irving', 'Amarillo', 'Grand Prairie'],
      heroImage: texasHero,
      landmark: 'State Capitol',
      population: '30.3 million',
      fact: 'Texas has the second-largest junk removal market in the US, driven by rapid population growth.',
      climate: 'Varied climate from humid subtropical to semi-arid - services available year-round',
    },
    'florida': {
      cities: ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Port St. Lucie', 'Cape Coral', 'Tallahassee', 'Fort Lauderdale', 'Pembroke Pines', 'Hollywood', 'Gainesville', 'Coral Springs', 'Clearwater'],
      heroImage: floridaHero,
      landmark: 'Miami Beach',
      population: '22.6 million',
      fact: 'Florida\'s hurricane preparedness drives high demand for debris removal and storm cleanup services.',
      climate: 'Tropical and subtropical climate with peak service season after hurricane season',
    },
    'new-york': {
      cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica', 'White Plains', 'Hempstead', 'Troy', 'Niagara Falls', 'Binghamton'],
      heroImage: newYorkHero,
      landmark: 'Statue of Liberty',
      population: '19.8 million',
      fact: 'NYC alone generates over 12,000 tons of residential waste daily, making junk removal essential.',
      climate: 'Four-season climate with peak demand during spring cleaning and fall preparation',
    },
    'washington': {
      cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Spokane Valley', 'Federal Way', 'Yakima', 'Bellingham', 'Kennewick', 'Auburn', 'Pasco'],
      heroImage: washingtonHero,
      landmark: 'Space Needle',
      population: '7.7 million',
      fact: 'Washington leads in eco-conscious junk removal with strict recycling and composting requirements.',
      climate: 'Temperate oceanic climate - year-round services available',
    },
    'colorado': {
      cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Centennial', 'Boulder', 'Greeley', 'Longmont', 'Loveland', 'Grand Junction'],
      heroImage: coloradoHero,
      landmark: 'Rocky Mountains',
      population: '5.8 million',
      fact: 'Colorado\'s outdoor lifestyle creates high demand for estate and garage cleanout services.',
      climate: 'Semi-arid climate with four distinct seasons',
    },
    'illinois': {
      cities: ['Chicago', 'Aurora', 'Naperville', 'Joliet', 'Rockford', 'Springfield', 'Elgin', 'Peoria', 'Champaign', 'Waukegan', 'Cicero', 'Bloomington', 'Decatur', 'Evanston', 'Des Plaines'],
      heroImage: illinoisHero,
      landmark: 'Willis Tower',
      population: '12.6 million',
      fact: 'Chicago is the third-largest junk removal market in the US after NYC and LA.',
      climate: 'Humid continental climate with peak demand in spring and fall',
    },
    'massachusetts': {
      cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'New Bedford', 'Quincy', 'Lynn', 'Fall River', 'Newton', 'Lawrence', 'Somerville', 'Framingham', 'Haverhill'],
      heroImage: massachusettsHero,
      landmark: 'Freedom Trail',
      population: '7 million',
      fact: 'Massachusetts has some of the strictest waste disposal regulations in the nation.',
      climate: 'Humid continental with distinct four seasons',
    },
    'pennsylvania': {
      cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Reading', 'Erie', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona', 'York', 'State College', 'Wilkes-Barre', 'Chester', 'Williamsport'],
      heroImage: pennsylvaniaHero,
      landmark: 'Liberty Bell',
      population: '12.9 million',
      fact: 'Pennsylvania\'s renovation boom has increased junk removal demand by 40% in recent years.',
      climate: 'Humid continental with moderate seasonal changes',
    },
    'nevada': {
      cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City', 'Fernley', 'Elko', 'Mesquite', 'Boulder City', 'Fallon', 'Winnemucca', 'West Wendover', 'Ely', 'Yerington'],
      heroImage: nevadaHero,
      landmark: 'Las Vegas Strip',
      population: '3.1 million',
      fact: 'Las Vegas generates massive commercial junk removal needs from hotels and casinos.',
      climate: 'Desert climate - services available year-round',
    },
    'tennessee': {
      cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville', 'Murfreesboro', 'Franklin', 'Jackson', 'Johnson City', 'Bartlett', 'Hendersonville', 'Kingsport', 'Collierville', 'Cleveland', 'Smyrna'],
      heroImage: tennesseeHero,
      landmark: 'Great Smoky Mountains',
      population: '7 million',
      fact: 'Tennessee\'s growing population drives consistent demand for residential junk removal.',
      climate: 'Humid subtropical with mild winters',
    },
    'georgia': {
      cities: ['Atlanta', 'Columbus', 'Augusta', 'Macon', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 'Albany', 'Johns Creek', 'Warner Robins', 'Alpharetta', 'Marietta', 'Valdosta', 'Smyrna'],
      heroImage: georgiaHero,
      landmark: 'Atlanta Skyline',
      population: '10.9 million',
      fact: 'Atlanta\'s booming construction industry creates high demand for debris removal services.',
      climate: 'Humid subtropical - services peak in spring and summer',
    },
    'louisiana': {
      cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles', 'Kenner', 'Bossier City', 'Monroe', 'Alexandria', 'Houma', 'New Iberia', 'Slidell', 'Prairieville', 'Central', 'Ruston'],
      heroImage: louisianaHero,
      landmark: 'French Quarter',
      population: '4.6 million',
      fact: 'Storm cleanup and hurricane debris removal are essential services in Louisiana.',
      climate: 'Humid subtropical with hurricane season considerations',
    },
    'oregon': {
      cities: ['Portland', 'Eugene', 'Salem', 'Gresham', 'Hillsboro', 'Beaverton', 'Bend', 'Medford', 'Springfield', 'Corvallis', 'Albany', 'Tigard', 'Lake Oswego', 'Keizer', 'Grants Pass'],
      heroImage: oregonHero,
      landmark: 'Crater Lake',
      population: '4.2 million',
      fact: 'Oregon requires eco-friendly disposal practices with emphasis on recycling and donation.',
      climate: 'Marine west coast climate - services available year-round',
    },
    'wyoming': {
      cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs', 'Sheridan', 'Green River', 'Evanston', 'Riverton', 'Jackson', 'Cody', 'Rawlins', 'Lander', 'Torrington', 'Powell'],
      heroImage: wyomingHero,
      landmark: 'Yellowstone',
      population: '580,000',
      fact: 'Wyoming\'s rural landscape requires specialized long-distance junk removal services.',
      climate: 'Semi-arid and continental - services year-round',
    },
    'montana': {
      cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte', 'Helena', 'Kalispell', 'Havre', 'Anaconda', 'Miles City', 'Belgrade', 'Livingston', 'Laurel', 'Whitefish', 'Lewistown'],
      heroImage: montanaHero,
      landmark: 'Glacier National Park',
      population: '1.1 million',
      fact: 'Montana\'s outdoor recreation economy creates unique junk removal needs for lodges and resorts.',
      climate: 'Continental climate with cold winters',
    },
    'utah': {
      cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem', 'Sandy', 'Ogden', 'St. George', 'Layton', 'Taylorsville', 'South Jordan', 'Lehi', 'Logan', 'Murray', 'Draper'],
      heroImage: utahHero,
      landmark: 'Arches National Park',
      population: '3.3 million',
      fact: 'Utah\'s rapid growth makes it one of the fastest-growing junk removal markets.',
      climate: 'Semi-arid climate - services available year-round',
    },
    'indiana': {
      cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel', 'Fishers', 'Bloomington', 'Hammond', 'Gary', 'Muncie', 'Lafayette', 'Terre Haute', 'Kokomo', 'Anderson', 'Noblesville'],
      heroImage: indianaHero,
      landmark: 'Indianapolis Motor Speedway',
      population: '6.8 million',
      fact: 'Indiana\'s manufacturing sector creates high demand for commercial cleanout services.',
      climate: 'Humid continental with four distinct seasons',
    },
    'michigan': {
      cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Troy', 'Westland', 'Farmington Hills', 'Kalamazoo', 'Wyoming', 'Southfield'],
      heroImage: michiganHero,
      landmark: 'Mackinac Bridge',
      population: '10 million',
      fact: 'Michigan\'s renovation boom drives strong demand for construction debris removal.',
      climate: 'Humid continental - services peak in spring through fall',
    },
    'kentucky': {
      cities: ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington', 'Richmond', 'Georgetown', 'Florence', 'Elizabethtown', 'Nicholasville', 'Henderson', 'Jeffersontown', 'Frankfort', 'Paducah', 'Hopkinsville'],
      heroImage: kentuckyHero,
      landmark: 'Churchill Downs',
      population: '4.5 million',
      fact: 'Kentucky\'s horse country estates require specialized large-property cleanout services.',
      climate: 'Humid subtropical with mild winters',
    },
    'north-carolina': {
      cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Concord', 'Asheville', 'Gastonia', 'Greenville', 'Jacksonville', 'Chapel Hill'],
      heroImage: northCarolinaHero,
      landmark: 'Blue Ridge Parkway',
      population: '10.6 million',
      fact: 'The Research Triangle drives high demand for office and commercial cleanouts.',
      climate: 'Humid subtropical with mountain and coastal variations',
    },
    'south-carolina': {
      cities: ['Charleston', 'Columbia', 'North Charleston', 'Mount Pleasant', 'Rock Hill', 'Greenville', 'Summerville', 'Goose Creek', 'Hilton Head Island', 'Florence', 'Spartanburg', 'Myrtle Beach', 'Sumter', 'Anderson', 'Greer'],
      heroImage: southCarolinaHero,
      landmark: 'Fort Sumter',
      population: '5.2 million',
      fact: 'Coastal hurricane preparedness makes storm debris removal essential in South Carolina.',
      climate: 'Humid subtropical - services peak after storm season',
    },
    'alabama': {
      cities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa', 'Hoover', 'Dothan', 'Auburn', 'Decatur', 'Madison', 'Florence', 'Gadsden', 'Vestavia Hills', 'Prattville', 'Phenix City'],
      heroImage: alabamaHero,
      landmark: 'USS Alabama',
      population: '5 million',
      fact: 'Alabama\'s growing economy increases demand for residential and commercial junk removal.',
      climate: 'Humid subtropical - services available year-round',
    },
    'arkansas': {
      cities: ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro', 'North Little Rock', 'Conway', 'Rogers', 'Pine Bluff', 'Bentonville', 'Hot Springs', 'Benton', 'Texarkana', 'Sherwood', 'Jacksonville'],
      heroImage: arkansasHero,
      landmark: 'Hot Springs National Park',
      population: '3 million',
      fact: 'Arkansas\'s expanding retail sector drives commercial cleanout demand.',
      climate: 'Humid subtropical with hot summers',
    },
    'mississippi': {
      cities: ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi', 'Meridian', 'Tupelo', 'Olive Branch', 'Greenville', 'Horn Lake', 'Clinton', 'Pearl', 'Madison', 'Ridgeland', 'Starkville'],
      heroImage: mississippiHero,
      landmark: 'Mississippi River Delta',
      population: '2.9 million',
      fact: 'Coastal properties require specialized hurricane debris removal services.',
      climate: 'Humid subtropical - services peak post-hurricane season',
    },
    'oklahoma': {
      cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond', 'Lawton', 'Moore', 'Midwest City', 'Enid', 'Stillwater', 'Muskogee', 'Bartlesville', 'Owasso', 'Shawnee', 'Ponca City'],
      heroImage: oklahomaHero,
      landmark: 'Oklahoma City National Memorial',
      population: '4 million',
      fact: 'Oklahoma\'s energy sector creates demand for commercial and industrial cleanouts.',
      climate: 'Humid subtropical to semi-arid',
    },
    'missouri': {
      cities: ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence', 'Lee\'s Summit', 'O\'Fallon', 'St. Joseph', 'St. Charles', 'St. Peters', 'Blue Springs', 'Florissant', 'Joplin', 'Chesterfield', 'Jefferson City'],
      heroImage: missouriHero,
      landmark: 'Gateway Arch',
      population: '6.2 million',
      fact: 'Missouri\'s two major metros drive strong commercial junk removal demand.',
      climate: 'Humid continental - services peak in spring and fall',
    },
    'south-dakota': {
      cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown', 'Mitchell', 'Yankton', 'Pierre', 'Huron', 'Vermillion', 'Spearfish', 'Box Elder', 'Brandon', 'Harrisburg', 'Sturgis'],
      heroImage: southDakotaHero,
      landmark: 'Mount Rushmore',
      population: '900,000',
      fact: 'Tourism-driven economy creates seasonal junk removal needs around national parks.',
      climate: 'Continental - services peak spring through fall',
    },
    'minnesota': {
      cities: ['Minneapolis', 'St. Paul', 'Rochester', 'Duluth', 'Bloomington', 'Brooklyn Park', 'Plymouth', 'Woodbury', 'Maple Grove', 'St. Cloud', 'Eagan', 'Eden Prairie', 'Coon Rapids', 'Burnsville', 'Blaine'],
      heroImage: minnesotaHero,
      landmark: 'Mall of America',
      population: '5.7 million',
      fact: 'Minnesota\'s harsh winters create spring cleanout surges for junk removal services.',
      climate: 'Continental with cold winters - peak demand in spring',
    },
    'iowa': {
      cities: ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City', 'Waterloo', 'Council Bluffs', 'Ames', 'West Des Moines', 'Dubuque', 'Ankeny', 'Urbandale', 'Cedar Falls', 'Marion', 'Bettendorf'],
      heroImage: iowaHero,
      landmark: 'Iowa State Capitol',
      population: '3.2 million',
      fact: 'Iowa\'s agricultural sector creates unique farm and estate cleanout needs.',
      climate: 'Humid continental - services peak in spring and fall',
    },
    'wisconsin': {
      cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine', 'Appleton', 'Waukesha', 'Eau Claire', 'Oshkosh', 'Janesville', 'West Allis', 'La Crosse', 'Sheboygan', 'Wauwatosa', 'Fond du Lac'],
      heroImage: wisconsinHero,
      landmark: 'Wisconsin State Capitol',
      population: '5.9 million',
      fact: 'Wisconsin\'s manufacturing heritage creates demand for industrial cleanout services.',
      climate: 'Humid continental - services peak in spring',
    },
    'idaho': {
      cities: ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Pocatello', 'Caldwell', 'Coeur d\'Alene', 'Twin Falls', 'Post Falls', 'Lewiston', 'Rexburg', 'Eagle', 'Kuna', 'Ammon', 'Chubbuck'],
      heroImage: idahoHero,
      landmark: 'Boise State Capitol',
      population: '1.9 million',
      fact: 'Idaho\'s rapid growth makes it one of America\'s fastest-growing junk removal markets.',
      climate: 'Continental - services available year-round',
    },
    'alaska': {
      cities: ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan', 'Wasilla', 'Kenai', 'Kodiak', 'Bethel', 'Palmer', 'Homer', 'Soldotna', 'Barrow', 'Nome', 'Valdez'],
      heroImage: alaskaHero,
      landmark: 'Denali',
      population: '730,000',
      fact: 'Alaska\'s remote locations require specialized logistics for junk removal services.',
      climate: 'Subarctic - services peak in short summer months',
    },
    'hawaii': {
      cities: ['Honolulu', 'East Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Waipahu', 'Kaneohe', 'Mililani Town', 'Kahului', 'Ewa Gentry', 'Mililani Mauka', 'Kihei', 'Makakilo', 'Wahiawa', 'Schofield Barracks'],
      heroImage: hawaiiHero,
      landmark: 'Diamond Head',
      population: '1.4 million',
      fact: 'Island logistics make eco-friendly waste disposal especially important in Hawaii.',
      climate: 'Tropical - services available year-round',
    },
    'new-mexico': {
      cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell', 'Farmington', 'South Valley', 'Clovis', 'Hobbs', 'Alamogordo', 'Carlsbad', 'Gallup', 'Deming', 'Los Lunas', 'Chaparral'],
      heroImage: newMexicoHero,
      landmark: 'Carlsbad Caverns',
      population: '2.1 million',
      fact: 'New Mexico\'s desert climate requires specialized handling of certain materials.',
      climate: 'Semi-arid and arid - services available year-round',
    },
    'north-dakota': {
      cities: ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo', 'Williston', 'Dickinson', 'Mandan', 'Jamestown', 'Wahpeton', 'Devils Lake', 'Valley City', 'Grafton', 'Watford City', 'Lincoln'],
      heroImage: northDakotaHero,
      landmark: 'Fargo Downtown',
      population: '780,000',
      fact: 'North Dakota\'s energy boom creates commercial junk removal opportunities.',
      climate: 'Continental with harsh winters - services peak in warmer months',
    },
    'nebraska': {
      cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney', 'Fremont', 'Hastings', 'Norfolk', 'Columbus', 'Papillion', 'North Platte', 'La Vista', 'Scottsbluff', 'South Sioux City', 'Beatrice'],
      heroImage: nebraskaHero,
      landmark: 'Old Market Omaha',
      population: '2 million',
      fact: 'Nebraska\'s agricultural economy creates unique rural junk removal needs.',
      climate: 'Humid continental - services peak in spring and fall',
    },
    'rhode-island': {
      cities: ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence', 'Woonsocket', 'Coventry', 'Cumberland', 'North Providence', 'South Kingstown', 'West Warwick', 'Johnston', 'North Kingstown', 'Newport', 'Bristol'],
      heroImage: rhodeIslandHero,
      landmark: 'WaterFire Providence',
      population: '1.1 million',
      fact: 'Rhode Island\'s dense population creates high demand for residential cleanouts.',
      climate: 'Humid continental - services available year-round',
    },
    'connecticut': {
      cities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford', 'Waterbury', 'Norwalk', 'Danbury', 'New Britain', 'Bristol', 'Meriden', 'Milford', 'West Haven', 'Middletown', 'Norwich', 'Shelton'],
      heroImage: connecticutHero,
      landmark: 'Mystic Seaport',
      population: '3.6 million',
      fact: 'Connecticut\'s affluent communities drive demand for estate cleanout services.',
      climate: 'Humid continental with four seasons',
    },
    'delaware': {
      cities: ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna', 'Milford', 'Seaford', 'Georgetown', 'Elsmere', 'New Castle', 'Millsboro', 'Bear', 'Pike Creek', 'Brookside', 'Hockessin'],
      heroImage: delawareHero,
      landmark: 'Delaware State Capitol',
      population: '1 million',
      fact: 'Delaware\'s small size enables efficient statewide junk removal services.',
      climate: 'Humid subtropical - services available year-round',
    },
    'maryland': {
      cities: ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Hagerstown', 'Annapolis', 'College Park', 'Salisbury', 'Laurel', 'Greenbelt', 'Cumberland', 'Westminster', 'Hyattsville', 'Takoma Park'],
      heroImage: marylandHero,
      landmark: 'Annapolis State House',
      population: '6.2 million',
      fact: 'Maryland\'s proximity to DC creates high demand for government facility cleanouts.',
      climate: 'Humid subtropical - services available year-round',
    },
    'west-virginia': {
      cities: ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling', 'Weirton', 'Fairmont', 'Beckley', 'Martinsburg', 'Clarksburg', 'South Charleston', 'St. Albans', 'Vienna', 'Bluefield', 'Moundsville'],
      heroImage: westVirginiaHero,
      landmark: 'West Virginia State Capitol',
      population: '1.8 million',
      fact: 'West Virginia\'s mountainous terrain requires specialized hauling equipment.',
      climate: 'Humid subtropical to humid continental',
    },
    'vermont': {
      cities: ['Burlington', 'South Burlington', 'Rutland', 'Barre', 'Montpelier', 'Winooski', 'St. Albans', 'Newport', 'Vergennes', 'Brattleboro', 'Hartford', 'Springfield', 'Bennington', 'Colchester', 'Essex'],
      heroImage: vermontHero,
      landmark: 'Lake Champlain',
      population: '645,000',
      fact: 'Vermont\'s environmental focus requires eco-friendly junk removal practices.',
      climate: 'Humid continental with cold winters',
    },
    'new-hampshire': {
      cities: ['Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester', 'Salem', 'Dover', 'Merrimack', 'Londonderry', 'Hudson', 'Keene', 'Bedford', 'Portsmouth', 'Goffstown', 'Laconia'],
      heroImage: newHampshireHero,
      landmark: 'Portsmouth Harbor',
      population: '1.4 million',
      fact: 'New Hampshire\'s "Live Free or Die" spirit extends to flexible junk removal options.',
      climate: 'Humid continental - services peak in spring and fall',
    },
  };

  const currentState = stateData[stateSlug] || {
    cities: [],
    heroImage: '',
    landmark: stateName,
    population: 'N/A',
    fact: 'Professional junk removal services available throughout the state.',
    climate: 'Services available year-round',
  };

  // Use the hardcoded cities list for the state
  const cities = currentState.cities;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/${stateSlug}/${searchQuery.toLowerCase().replace(/\s+/g, '-')}`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
    }}>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      {/* Sticky Navigation Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '16px',
        display: 'flex',
        gap: '12px',
      }}>
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            backgroundColor: '#fbbf24',
            color: '#000',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.18)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          data-testid="button-menu-state"
        >
          <Menu size={18} color="#000" />
        </button>
        
        {isAuthenticated && user && (
          <button
            onClick={() => window.location.href = '/profile/edit'}
            style={{
              backgroundColor: '#166534',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s',
              fontSize: '14px',
              fontWeight: '600',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.18)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            data-testid="button-profile-state"
          >
            <UserCircle size={16} />
            Profile
          </button>
        )}
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 16px 40px 16px',
      }}>
        {/* Search Bar */}
        <div style={{
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '32px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '16px',
            textAlign: 'center',
            letterSpacing: '-0.02em',
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}>
            Find Junk Removal Services in {stateName}
          </h2>
          <form onSubmit={handleSearch} style={{
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto',
            display: 'flex',
            gap: '6px',
            backgroundColor: '#f9fafb',
            padding: '5px',
            borderRadius: '10px',
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your city"
              style={{
                flex: 1,
                minWidth: '0',
                padding: '10px 12px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}
              data-testid="input-state-search"
            />
            <button
              type="submit"
              style={{
                padding: '10px 14px',
                background: '#fbbf24',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
              data-testid="button-state-search"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid #cccccc',
          overflowX: 'auto',
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'cities', label: 'Cities' },
            { id: 'pricing', label: 'Pricing Guide' },
            { id: 'tips', label: 'Tips & Advice' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab.id ? '#e5e7eb' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #fbbf24' : '3px solid transparent',
                color: activeTab === tab.id ? '#1a1a1a' : '#6b7280',
                fontSize: '15px',
                fontWeight: activeTab === tab.id ? '700' : '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                borderRadius: '8px 8px 0 0',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                About Junk Removal Services in {stateName}
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#000',
                lineHeight: '1.8',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                {stateName} residents and businesses rely on professional junk removal services for efficient, eco-friendly disposal. Whether you're doing a home cleanout, office renovation, or construction project, local junk removal companies provide same-day service with upfront pricing.
              </p>
              <p style={{
                fontSize: '16px',
                color: '#000',
                lineHeight: '1.8',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Most {stateName} junk removal companies recycle or donate 60-80% of collected items, helping reduce landfill waste while giving back to local communities.
              </p>
              <div style={{
                padding: '20px',
                backgroundColor: '#f5f5f5',
                borderRadius: '10px',
                marginTop: '16px',
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: '8px',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  {stateName} Junk Removal Facts
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#000',
                  margin: '0 0 8px 0',
                  lineHeight: '1.6',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  <strong>Population:</strong> {currentState.population}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#000',
                  margin: '0 0 8px 0',
                  lineHeight: '1.6',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  <strong>Climate:</strong> {currentState.climate}
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#000',
                  margin: '0',
                  lineHeight: '1.6',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  <strong>Local Insight:</strong> {currentState.fact}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}>
              {[
                {
                  title: 'Same-Day Service',
                  description: 'Most companies offer same-day or next-day pickup throughout ' + stateName,
                  Icon: Truck,
                },
                {
                  title: 'Eco-Friendly',
                  description: 'Items are sorted for recycling, donation, or proper disposal',
                  Icon: Recycle,
                },
                {
                  title: 'Full-Service',
                  description: 'Teams handle all loading and hauling - you don\'t lift a finger',
                  Icon: Dumbbell,
                },
                {
                  title: 'Upfront Pricing',
                  description: 'Get free estimates with transparent, volume-based pricing',
                  Icon: DollarSign,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#fff',
                    padding: '24px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <item.Icon size={32} style={{ color: '#fbbf24', marginBottom: '12px' }} />
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#374151',
                    marginBottom: '8px',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#000',
                    margin: '0',
                    lineHeight: '1.6',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Common Junk Removal Services */}
            <div style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '20px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Common Junk Removal Services in {stateName}
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                {/* Furniture Removal */}
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/items/furniture" style={{ textDecoration: 'none' }} data-testid="link-furniture-removal">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0 0 6px 0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Furniture Removal
                    </h4>
                  </Link>
                  <details>
                    <summary style={{
                      fontSize: '16px',
                      color: '#fbbf24',
                      cursor: 'pointer',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      listStyle: 'none',
                      margin: '0',
                    }}>
                      ▾
                    </summary>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', textAlign: 'left' }}>
                      {['Sofa', 'Bed', 'Dresser', 'Table', 'Desk', 'Recliner'].map((item) => (
                        <Link key={item} href={`/items/${item.toLowerCase()}`} style={{ textDecoration: 'none' }} data-testid={`link-item-${item.toLowerCase()}`}>
                          <span style={{ fontSize: '14px', color: '#6b7280', fontFamily: "'Helvetica Neue', Arial, sans-serif", cursor: 'pointer' }}>• {item}</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                </div>

                {/* Appliance Disposal */}
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/items/appliances" style={{ textDecoration: 'none' }} data-testid="link-appliance-disposal">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0 0 6px 0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Appliance Disposal
                    </h4>
                  </Link>
                  <details>
                    <summary style={{
                      fontSize: '16px',
                      color: '#fbbf24',
                      cursor: 'pointer',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      listStyle: 'none',
                      margin: '0',
                    }}>
                      ▾
                    </summary>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', textAlign: 'left' }}>
                      {['Refrigerator', 'Washer', 'Dryer', 'Stove', 'Dishwasher', 'Freezer'].map((item) => (
                        <Link key={item} href={`/items/${item.toLowerCase()}`} style={{ textDecoration: 'none' }} data-testid={`link-item-${item.toLowerCase()}`}>
                          <span style={{ fontSize: '14px', color: '#6b7280', fontFamily: "'Helvetica Neue', Arial, sans-serif", cursor: 'pointer' }}>• {item}</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                </div>

                {/* Electronics Recycling */}
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/items/electronics" style={{ textDecoration: 'none' }} data-testid="link-electronics-recycling">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0 0 6px 0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Electronics Recycling
                    </h4>
                  </Link>
                  <details>
                    <summary style={{
                      fontSize: '16px',
                      color: '#fbbf24',
                      cursor: 'pointer',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      listStyle: 'none',
                      margin: '0',
                    }}>
                      ▾
                    </summary>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', textAlign: 'left' }}>
                      {['TV', 'Computer', 'Laptop', 'Monitor', 'Printer', 'Phone'].map((item) => (
                        <Link key={item} href={`/items/${item.toLowerCase()}`} style={{ textDecoration: 'none' }} data-testid={`link-item-${item.toLowerCase()}`}>
                          <span style={{ fontSize: '14px', color: '#6b7280', fontFamily: "'Helvetica Neue', Arial, sans-serif", cursor: 'pointer' }}>• {item}</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                </div>

                {/* Yard Waste Removal */}
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/items/yard-waste" style={{ textDecoration: 'none' }} data-testid="link-yard-waste">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0 0 6px 0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Yard Waste Removal
                    </h4>
                  </Link>
                  <details>
                    <summary style={{
                      fontSize: '16px',
                      color: '#fbbf24',
                      cursor: 'pointer',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      listStyle: 'none',
                      margin: '0',
                    }}>
                      ▾
                    </summary>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', textAlign: 'left' }}>
                      {['Branches', 'Leaves', 'Grass', 'Tree Stumps', 'Bushes'].map((item) => (
                        <Link key={item} href={`/items/${item.toLowerCase().replace(/\s+/g, '-')}`} style={{ textDecoration: 'none' }} data-testid={`link-item-${item.toLowerCase().replace(/\s+/g, '-')}`}>
                          <span style={{ fontSize: '14px', color: '#6b7280', fontFamily: "'Helvetica Neue', Arial, sans-serif", cursor: 'pointer' }}>• {item}</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                </div>

                {/* Garage Cleanouts */}
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/services/garage-cleanouts" style={{ textDecoration: 'none' }} data-testid="link-garage-cleanouts">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0 0 6px 0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Garage Cleanouts
                    </h4>
                  </Link>
                  <div style={{
                    fontSize: '16px',
                    color: '#fbbf24',
                    margin: '0',
                  }}>
                    ▾
                  </div>
                </div>

                {/* Estate Cleanouts */}
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/services/estate-cleanouts" style={{ textDecoration: 'none' }} data-testid="link-estate-cleanouts">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0 0 6px 0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Estate Cleanouts
                    </h4>
                  </Link>
                  <div style={{
                    fontSize: '16px',
                    color: '#fbbf24',
                    margin: '0',
                  }}>
                    ▾
                  </div>
                </div>

                {/* Office Cleanouts */}
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/services/office-cleanouts" style={{ textDecoration: 'none' }} data-testid="link-office-cleanouts">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0 0 6px 0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Office Cleanouts
                    </h4>
                  </Link>
                  <div style={{
                    fontSize: '16px',
                    color: '#fbbf24',
                    margin: '0',
                  }}>
                    ▾
                  </div>
                </div>

                {/* Construction Debris */}
                <div style={{
                  padding: '14px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}>
                  <Link href="/services/construction-debris" style={{ textDecoration: 'none' }} data-testid="link-construction-debris">
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: '0 0 6px 0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      cursor: 'pointer',
                    }}>
                      Construction Debris
                    </h4>
                  </Link>
                  <div style={{
                    fontSize: '16px',
                    color: '#fbbf24',
                    margin: '0',
                  }}>
                    ▾
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '16px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Environmental Impact & Sustainability
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#000',
                lineHeight: '1.8',
                marginBottom: '20px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Professional junk removal companies in {stateName} are committed to reducing landfill waste through recycling and donation programs. Here's how they make a difference:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#000',
                    marginBottom: '8px',
                  }}>
                    60-80%
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#000',
                    margin: '0',
                    fontWeight: '600',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    Items Recycled or Donated
                  </p>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#000',
                    marginBottom: '8px',
                  }}>
                    100+
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#000',
                    margin: '0',
                    fontWeight: '600',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    Local Charities Supported
                  </p>
                </div>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '10px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#000',
                    marginBottom: '8px',
                  }}>
                    90%
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#000',
                    margin: '0',
                    fontWeight: '600',
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    Customer Satisfaction
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Cities Tab */}
        {activeTab === 'cities' && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#374151',
              marginBottom: '20px',
            }}>
              Popular Cities in {stateName}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}>
              {cities.map((city) => (
                <a
                  key={city}
                  href={`/${stateSlug}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    padding: '16px',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#374151',
                    fontWeight: '600',
                    fontSize: '15px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  data-testid={`link-city-${city.toLowerCase()}`}
                >
                  {city}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '20px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                {stateName} Junk Removal Pricing Guide
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
              }}>
                {[
                  { size: '1/8 Truck Load', price: '$100-$200', items: 'Single item or small pile' },
                  { size: '1/4 Truck Load', price: '$200-$350', items: 'Several items or room cleanout' },
                  { size: '1/2 Truck Load', price: '$350-$550', items: 'Multiple rooms or garage' },
                  { size: 'Full Truck Load', price: '$550-$800', items: 'Whole house or large project' },
                ].map((tier, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '14px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      border: '2px solid #fbbf24',
                      width: '100%',
                      maxWidth: '360px',
                    }}
                  >
                    <h4 style={{
                      fontSize: '26px',
                      fontWeight: '700',
                      color: '#fbbf24',
                      marginBottom: '12px',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    }}>
                      {tier.size}
                    </h4>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#374151',
                      marginBottom: '8px',
                    }}>
                      {tier.price}
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#000',
                      margin: '0',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    }}>
                      {tier.items}
                    </p>
                  </div>
                ))}
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                borderLeft: '4px solid #fbbf24',
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#000',
                  margin: '0',
                  lineHeight: '1.6',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                }}>
                  <strong>💡 Pro Tip:</strong> Most {stateName} companies offer free, no-obligation estimates. Get quotes from 2-3 companies to compare pricing and services.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '20px',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
              }}>
                Expert Tips for Hiring Junk Removal in {stateName}
              </h3>
              <div style={{
                display: 'grid',
                gap: '20px',
              }}>
                {[
                  {
                    title: '1. Sort Before They Arrive',
                    description: 'Separate items you want removed from keepers. This speeds up the process and may reduce costs.',
                  },
                  {
                    title: '2. Get Multiple Quotes',
                    description: 'Contact 2-3 companies for estimates. Most offer free quotes and same-day service in ' + stateName + '.',
                  },
                  {
                    title: '3. Ask About Recycling',
                    description: 'Choose companies that donate usable items and recycle materials rather than sending everything to landfills.',
                  },
                  {
                    title: '4. Check Insurance & Licensing',
                    description: 'Verify the company is licensed and insured to protect yourself from liability.',
                  },
                  {
                    title: '5. Read Reviews',
                    description: 'Check online reviews from other ' + stateName + ' customers to gauge reliability and service quality.',
                  },
                  {
                    title: '6. Understand Pricing',
                    description: 'Most companies charge by volume (truck space), not weight. Get clarity on final costs before work begins.',
                  },
                  {
                    title: '7. Schedule Smart',
                    description: 'Book early morning or weekday appointments for potentially better rates and availability.',
                  },
                  {
                    title: '8. Know What They Won\'t Take',
                    description: 'Most companies can\'t accept hazardous materials like paint, chemicals, or asbestos. Ask beforehand.',
                  },
                ].map((tip, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '20px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '10px',
                      borderLeft: '4px solid #fbbf24',
                    }}
                  >
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#374151',
                      marginBottom: '8px',
                    }}>
                      {tip.title}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#000',
                      margin: '0',
                      lineHeight: '1.6',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    }}>
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div style={{
              backgroundColor: '#fff',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#374151',
                marginBottom: '20px',
              }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  {
                    q: 'How much does junk removal cost in ' + stateName + '?',
                    a: 'Prices typically range from $100-$800 depending on the volume of junk. Most companies charge by how much space your items take up in their truck. A single item costs $100-$200, while a full truck load runs $550-$800.',
                  },
                  {
                    q: 'Do I need to be home during junk removal?',
                    a: 'Not necessarily. As long as the items are accessible and you\'ve provided clear instructions, many companies can complete the job without you present. However, it\'s recommended to be available for any questions.',
                  },
                  {
                    q: 'What items cannot be removed?',
                    a: 'Most companies cannot accept hazardous materials including paint, chemicals, asbestos, medical waste, or anything considered toxic. Check with your local provider for their specific restrictions.',
                  },
                  {
                    q: 'How quickly can junk be removed?',
                    a: 'Many ' + stateName + ' junk removal companies offer same-day or next-day service. During busy seasons, you may need to book 2-3 days in advance.',
                  },
                  {
                    q: 'Is junk removal eco-friendly?',
                    a: 'Most professional companies recycle 60-80% of collected items and donate usable goods to local charities. Only non-recyclable waste goes to landfills.',
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '20px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                    }}
                  >
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#fbbf24',
                      marginBottom: '8px',
                    }}>
                      {faq.q}
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#000',
                      margin: '0',
                      lineHeight: '1.6',
                      fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// City Page Component
function CityPage({ city, state }: { city: string; state: string }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null);
  const [carouselOffsets, setCarouselOffsets] = useState<Record<number, number>>({});
  const [carouselTransitions, setCarouselTransitions] = useState<Record<number, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  // Helper function to format city name: remove dashes and capitalize each word
  const formatCityName = (citySlug: string) => {
    return citySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const displayCityName = formatCityName(city);
  const formattedCity = formatCityName(city);
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };
  
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies", { city: formattedCity, state }],
    queryFn: async () => {
      const response = await fetch(`/api/companies?city=${encodeURIComponent(formattedCity)}&state=${encodeURIComponent(state)}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselOffsets((prev) => {
        const next: Record<number, number> = {};
        companies.forEach((c) => {
          const hasGallery = c.galleryImages && c.galleryImages.length > 0;
          const hasImages = c.logoUrl || c.reviews > 0;
          
          if (hasGallery) {
            const imageCount = c.galleryImages!.length;
            const currentOffset = prev[c.id] || 0;
            const nextOffset = currentOffset + 1;
            
            // When we reach the end of the first set, reset to 0 without transition
            if (nextOffset >= imageCount) {
              next[c.id] = 0;
              // Disable transition for this carousel
              setCarouselTransitions(t => ({ ...t, [c.id]: false }));
              // Re-enable transition after a brief moment
              setTimeout(() => {
                setCarouselTransitions(t => ({ ...t, [c.id]: true }));
              }, 50);
            } else {
              next[c.id] = nextOffset;
            }
          } else if (hasImages) {
            const imageCount = defaultImages.length;
            const currentOffset = prev[c.id] || 0;
            const nextOffset = currentOffset + 1;
            
            if (nextOffset >= imageCount) {
              next[c.id] = 0;
              setCarouselTransitions(t => ({ ...t, [c.id]: false }));
              setTimeout(() => {
                setCarouselTransitions(t => ({ ...t, [c.id]: true }));
              }, 50);
            } else {
              next[c.id] = nextOffset;
            }
          } else {
            next[c.id] = 0;
          }
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [companies]);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  // Helper function to convert YouTube URL to embed URL
  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url; // Return as-is if format not recognized
  };

  return (
    <>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      {/* Video Modal */}
      {videoModalUrl && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }} 
          onClick={() => setVideoModalUrl(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1200px',
              aspectRatio: '16/9',
            }}
          >
            <button
              onClick={() => setVideoModalUrl(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '32px',
                cursor: 'pointer',
                padding: '8px',
                zIndex: 1,
              }}
              data-testid="button-close-video"
            >
              ×
            </button>
            <iframe
              src={getVideoEmbedUrl(videoModalUrl)}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '8px',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
      
      {selectedCompany && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 2000,
          overflow: 'auto',
        }} onClick={() => setSelectedCompanyId(null)}>
          <div>
            <CompanyDetailInline company={selectedCompany} onClose={() => setSelectedCompanyId(null)} />
          </div>
        </div>
      )}
    
    <div style={{ 
      minHeight: '100vh', 
      background: '#ffffff',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      margin: '0',
      padding: '0',
      width: '100%',
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes breatheGlow {
          0%, 100% { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          50% { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        }
        .breathing-button {
          animation: breatheGlow 2s ease-in-out infinite;
        }
        .header-title-responsive {
          font-size: 20px;
        }
        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 1024px) {
          .main-grid {
            grid-template-columns: 2fr 1fr;
            gap: 20px;
          }
        }
        @media (max-width: 768px) {
          .header-title-responsive {
            font-size: 18px;
            word-break: break-word;
            max-width: 100%;
          }
        }
      `}} />
      {/* Sticky Navigation Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(251, 191, 36, 0.15)',
        backdropFilter: 'blur(10px)',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            backgroundColor: '#fbbf24',
            color: '#000',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #000',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.18)';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          data-testid="button-menu-city"
        >
          <Menu size={18} color="#000" />
        </button>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {isAuthenticated && user && (
            <button
              onClick={() => window.location.href = '/profile/edit'}
              style={{
                backgroundColor: '#166534',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.18)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              data-testid="button-profile-city"
            >
              <UserCircle size={16} />
              Profile
            </button>
          )}
          
          <button
            onClick={() => window.location.href = '/add-business'}
            className="breathing-button"
            style={{
              background: '#fbbf24',
              color: '#000',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.18)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            data-testid="button-add-business"
          >
            <Plus size={18} />
          </button>

        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px 0 0 0', margin: '0', width: '100%' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '12px', padding: '0 16px', margin: '0 0 12px 0' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
          }} data-testid="text-page-title">
            {displayCityName}<br />Junk Removal
          </h2>
          <p style={{ fontSize: '15px', color: '#000', margin: 0 }}>
            {companies.length} local independent pro{companies.length !== 1 ? 's' : ''} based in {displayCityName}
          </p>
        </div>

        {/* Two Column Layout - Stacks on Mobile */}
        <div style={{ padding: '0', margin: '0', width: '100%' }}>
          <div className="main-grid" style={{ margin: '0', padding: '0', width: '100%', gap: '0' }}>
              {/* Left - Company Listings */}
              <div style={{ width: '100%', maxWidth: '100%', overflow: 'visible', margin: '0 auto', padding: '0' }}>
                <style dangerouslySetInnerHTML={{__html: `
                  .company-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                  }
                  @media (min-width: 1024px) {
                    .company-grid {
                      grid-template-columns: 1fr 1fr;
                    }
                    .full-width-card {
                      grid-column: span 2;
                    }
                    .video-thumbnail-desktop {
                      display: block !important;
                    }
                  }
                `}} />
                <div className="company-grid">
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280', gridColumn: 'span 2' }} data-testid="text-loading">
                    Loading...
                  </div>
                ) : (
                  companies
                    .sort((a, b) => {
                      // Tier-based sorting: premium > standard > basic (claimed) > unclaimed
                      const getTierPriority = (company: any) => {
                        if (!company.claimed) return 4; // Unclaimed last
                        if (company.subscriptionTier === 'premium') return 1; // Premium first
                        if (company.subscriptionTier === 'standard') return 2; // Standard second
                        return 3; // Basic (claimed) third
                      };
                      
                      const priorityDiff = getTierPriority(a) - getTierPriority(b);
                      if (priorityDiff !== 0) return priorityDiff;
                      
                      // Within same tier, sort by displayOrder
                      return (a.displayOrder || 999) - (b.displayOrder || 999);
                    })
                    .map((c, index) => {
                    const isUnclaimed = !c.claimed;
                    const isPremium = c.subscriptionTier === 'premium';
                    const isStandard = c.subscriptionTier === 'standard';
                    const isBasic = c.claimed && c.subscriptionTier === 'basic';
                    const hasFullFeatures = isPremium || isStandard; // Both get all features
                    const isFirstPremium = index === 0 && isPremium; // First profile and is premium
                    
                    return (
                <div 
                  key={c.id}
                  onClick={!hasFullFeatures ? undefined : (e) => {
                    // Don't open modal if clicking on a link or button
                    if ((e.target as HTMLElement).tagName === 'A' || 
                        (e.target as HTMLElement).closest('a') ||
                        (e.target as HTMLElement).tagName === 'BUTTON' ||
                        (e.target as HTMLElement).closest('button')) {
                      return;
                    }
                    trackBusinessEvent(c.id, 'click');
                    setSelectedCompanyId(c.id);
                  }} 
                  id={`company-${c.id}`}
                  className={isFirstPremium ? 'full-width-card' : ''}
                  style={{
                    position: 'relative',
                    backgroundColor: isUnclaimed ? '#f9f9f9' : '#fff',
                    borderRadius: '0',
                    padding: '16px',
                    marginBottom: '0',
                    marginLeft: '0',
                    marginRight: '0',
                    boxShadow: 'none',
                    border: isUnclaimed ? '1px solid #e5e5e5' : '1px solid #fbbf24',
                    borderBottom: index < companies.length - 1 ? '2px solid #000' : (isUnclaimed ? '1px solid #e5e5e5' : '1px solid #fbbf24'),
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'visible',
                    cursor: hasFullFeatures ? 'pointer' : 'default',
                    transition: 'background-color 0.2s',
                    opacity: isUnclaimed ? 0.7 : 1,
                  }}
                  data-testid={`card-company-${c.id}`}
                >
                  {/* Top Right Badge - sits on top of card border */}
                  {isPremium && c.badge && !isUnclaimed && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '16px',
                      background: '#16a34a',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 10,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    }}>
                      <CheckCircle size={14} color="#fff" fill="#16a34a" />
                      {c.badge}
                    </div>
                  )}
                  
                  {isUnclaimed && (
                    <div style={{
                      background: '#f5f5f5',
                      color: '#666',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}>
                      Unclaimed Listing - Basic Info Only
                    </div>
                  )}
                  
                  {isUnclaimed ? (
                    // Simplified unclaimed business display
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        margin: '0 0 12px 0',
                        color: '#111827',
                      }} data-testid={`text-company-name-${c.id}`}>
                        {c.name}
                      </h3>
                      <div style={{ fontSize: '16px', color: '#666', marginBottom: '16px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
                        <Phone size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                        {formatPhoneNumber(c.phone)}
                      </div>
                      
                      <Link 
                        href={`/add-business?claim=true&name=${encodeURIComponent(c.name)}&phone=${encodeURIComponent(c.phone)}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <button
                          style={{
                            width: '100%',
                            background: '#fbbf24',
                            color: '#000',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            border: '2px solid #000',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '700',
                            marginBottom: '12px',
                            fontFamily: "'Helvetica Neue', Arial, sans-serif",
                          }}
                          data-testid={`button-claim-${c.id}`}
                        >
                          Claim Your Profile
                        </button>
                      </Link>
                      
                      <div style={{
                        background: '#f5f5f5',
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#666',
                      }}>
                        Is this your business? Claim your profile to add photos, pricing, and get more customers!
                      </div>
                    </div>
                  ) : (
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', padding: '0' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '10px',
                      background: c.logoUrl ? '#fff' : '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#fff',
                      flexShrink: 0,
                      boxShadow: c.logoUrl ? 'none' : '0 2px 6px rgba(0,0,0,0.1)',
                      padding: c.logoUrl ? '4px' : '0',
                      border: c.logoUrl ? 'none' : '2px solid #fbbf24',
                      overflow: 'hidden',
                    }}>
                      {c.logoUrl ? (
                        <img
                          src={c.logoUrl}
                          alt={`${c.name} logo`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.style.background = '#fbbf24';
                              parent.style.boxShadow = '0 4px 12px rgba(168,85,247,0.3)';
                              parent.style.border = '2px solid #fbbf24';
                              parent.style.padding = '0';
                              parent.textContent = c.name.charAt(0);
                            }
                          }}
                        />
                      ) : (
                        c.name.charAt(0)
                      )}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '60px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        margin: '0',
                        color: '#111827',
                      }} data-testid={`text-company-name-${c.id}`}>
                        {c.name}
                      </h3>
                      
                      {!isBasic ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < Math.floor(parseFloat(c.rating || "0")) ? "#fbbf24" : "none"}
                              stroke="#fbbf24"
                            />
                          ))}
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>{c.rating || "0"}</span>
                        <span style={{ color: '#000', fontSize: '15px' }}>({c.reviews})</span>
                      </div>
                      ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={16} color="#000" />
                        <a href={`tel:${c.phone}`} style={{ fontSize: '16px', fontWeight: '600', color: '#000', textDecoration: 'none' }}>{formatPhoneNumber(c.phone)}</a>
                      </div>
                      )}
                    </div>
                  </div>
                  )}
                  
                  {/* Image Carousel - Premium & Standard only (moved below contact info) */}
                  {hasFullFeatures && (
                  <div style={{
                    marginBottom: '16px',
                    marginTop: '0',
                    overflow: 'hidden',
                    borderRadius: '0',
                    border: '2px solid #fbbf24',
                  }}>
                    <style dangerouslySetInnerHTML={{__html: `
                      .carousel-item-${c.id} {
                        min-width: calc(100% / 5.6);
                      }
                      @media (max-width: 768px) {
                        .carousel-item-${c.id} {
                          min-width: calc(100% / 3.5);
                        }
                      }
                    `}} />
                    <div style={{
                      display: 'flex',
                      transition: carouselTransitions[c.id] !== false ? 'transform 1.5s ease-in-out' : 'none',
                      transform: `translateX(-${(carouselOffsets[c.id] || 0) * (window.innerWidth > 768 ? 100 / 5.6 : 100 / 3.5)}%)`,
                    }}>
                      {(() => {
                        // Priority: Use gallery images if available, otherwise use logo or defaults
                        const hasGallery = c.galleryImages && c.galleryImages.length > 0;
                        const hasLogo = c.logoUrl;
                        const hasReviews = c.reviews > 0;
                        
                        let imagesToShow: (string | number)[] = [];
                        
                        if (hasGallery) {
                          // Duplicate 3x for endless loop
                          imagesToShow = [...c.galleryImages!, ...c.galleryImages!, ...c.galleryImages!];
                        } else if (hasLogo || hasReviews) {
                          // Use default images 3x
                          imagesToShow = [...defaultImages, ...defaultImages, ...defaultImages];
                        } else {
                          // New businesses - show placeholders 3x
                          imagesToShow = [0, 1, 2, 0, 1, 2, 0, 1, 2];
                        }
                        
                        return imagesToShow.map((item, i) => (
                          <div
                            key={i}
                            className={`carousel-item-${c.id}`}
                            style={{
                              padding: '0',
                              aspectRatio: '1',
                            }}
                          >
                            {typeof item === 'string' ? (
                              <img
                                src={item}
                                alt="Service photo"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: '0',
                                  border: '2px solid #fbbf24',
                                }}
                              />
                            ) : (
                              <PlaceholderImage index={item} />
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                  )}
                  
                  {/* Video Thumbnail - Desktop Only, Premium & Standard only */}
                  {!isUnclaimed && !isBasic && c.videoUrl && (
                    <div style={{
                      display: 'none',
                      marginBottom: '12px',
                      position: 'relative',
                    }}
                    className="video-thumbnail-desktop"
                    >
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoModalUrl(c.videoUrl || null);
                        }}
                        style={{
                          position: 'relative',
                          width: '100%',
                          paddingBottom: '56.25%', // 16:9 aspect ratio
                          backgroundColor: '#000',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '2px solid #fbbf24',
                        }}
                      >
                        {/* Video Thumbnail - Extract from YouTube/Vimeo URL or use placeholder */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: c.videoUrl.includes('youtube') || c.videoUrl.includes('youtu.be')
                            ? `url(https://img.youtube.com/vi/${c.videoUrl.split('v=')[1]?.split('&')[0] || c.videoUrl.split('youtu.be/')[1]?.split('?')[0]}/maxresdefault.jpg) center/cover`
                            : '#1a1a1a',
                        }} />
                        
                        {/* Play Icon Overlay */}
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(251, 191, 36, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
                        >
                          <div style={{
                            width: 0,
                            height: 0,
                            borderLeft: '20px solid #000',
                            borderTop: '12px solid transparent',
                            borderBottom: '12px solid transparent',
                            marginLeft: '4px',
                          }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  
                  {/* Quote Section - Premium & Standard only */}
                  {hasFullFeatures && (
                  <div 
                    style={{
                      backgroundColor: '#f5f5f5',
                      borderRadius: '0',
                      padding: '16px 0',
                      marginLeft: '0',
                      marginRight: '0',
                      marginBottom: '0',
                      border: 'none',
                      borderTop: '1px solid #e5e5e5',
                    }}>
                    <h4 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      margin: '0 0 16px 0',
                      color: '#374151',
                      width: '100%',
                      textAlign: 'center',
                    }}>
                      Ways To Get A Quote
                    </h4>
                    
                    <div 
                      style={{ 
                        display: 'flex', 
                        gap: '10px',
                        justifyContent: 'center',
                        padding: '0',
                      }}>
                      {/* Call Now Icon */}
                      <a
                        href={`tel:${c.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '75px',
                          height: '75px',
                          background: '#fbbf24',
                          color: '#000',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                        }}
                        data-testid={`button-call-${c.id}`}
                      >
                        <Phone size={26} />
                      </a>

                      {/* Send Photos Icon */}
                      <a
                        href={`sms:${c.phone}?body=Hi! I'd like to get a quote for junk removal. Here are some photos:`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '75px',
                          height: '75px',
                          background: '#fbbf24',
                          color: '#000',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                        }}
                        data-testid={`button-send-photos-${c.id}`}
                      >
                        <Camera size={26} />
                      </a>
                      
                      {/* In Person Estimate Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          trackBusinessEvent(c.id, 'book_quote');
                          setExpandedQuote(expandedQuote === c.id ? null : c.id);
                        }}
                        style={{
                          width: '75px',
                          height: '75px',
                          background: '#fbbf24',
                          color: '#000',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                        }}
                        data-testid={`button-in-person-${c.id}`}
                      >
                        <Calendar size={26} />
                      </button>
                    </div>

                    {/* Calendar/Availability Section */}
                    {expandedQuote === c.id && (
                      <div style={{
                        marginTop: '16px',
                        padding: '16px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '2px solid #2563eb',
                      }}>
                        <h5 style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          margin: '0 0 12px 0',
                          color: '#fbbf24',
                        }}>
                          Available Times
                        </h5>
                        
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {['Today 2:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 3:00 PM', 'Friday 9:00 AM'].map((time, i) => (
                            <button
                              key={i}
                              style={{
                                padding: '10px 16px',
                                backgroundColor: '#f5f5f5',
                                border: '2px solid #e5e5e5',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#fbbf24',
                                textAlign: 'left',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Appointment scheduled for ${time}`);
                              }}
                              data-testid={`button-time-slot-${c.id}-${i}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  )}
                </div>
                  );
                  })
                )}
                </div>
              </div>

              {/* Estimator and Ads Section - Full Width */}
              <div style={{
                gridColumn: 'span 2',
                paddingTop: '16px',
                borderTop: '2px solid #000',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                  gap: '16px',
                }}>
                  <EstimateBuilderInline />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Ad Placeholder 1 */}
                    <div style={{
                      backgroundColor: '#f5f5f5',
                      border: '2px solid #fbbf24',
                      borderRadius: '0',
                      padding: '40px 20px',
                      textAlign: 'center',
                      borderTop: '2px solid #000',
                      paddingTop: '56px',
                    }}>
                      <h3 style={{ 
                        fontSize: '24px', 
                        fontWeight: '700', 
                        margin: '0 0 16px 0',
                        color: '#1a1a1a',
                        letterSpacing: '-0.02em',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      }}>
                        ADVERTISE HERE
                      </h3>
                      <p style={{ 
                        fontSize: '16px', 
                        margin: '0 0 12px 0', 
                        lineHeight: '1.5', 
                        color: '#333333',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      }}>
                        Reach thousands of customers looking for junk removal services
                      </p>
                      <p style={{ 
                        fontSize: '14px', 
                        margin: 0, 
                        color: '#fbbf24',
                        fontWeight: '700',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      }}>
                        morasjunk@gmail.com
                      </p>
                    </div>

                    {/* Ad Placeholder 2 */}
                    <div style={{
                      backgroundColor: '#f5f5f5',
                      border: '2px solid #fbbf24',
                      borderRadius: '0',
                      padding: '40px 20px',
                      textAlign: 'center',
                      borderTop: '2px solid #000',
                      paddingTop: '56px',
                    }}>
                      <h3 style={{ 
                        fontSize: '24px', 
                        fontWeight: '700', 
                        margin: '0 0 16px 0',
                        color: '#1a1a1a',
                        letterSpacing: '-0.02em',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      }}>
                        ADVERTISE HERE
                      </h3>
                      <p style={{ 
                        fontSize: '16px', 
                        margin: '0 0 12px 0', 
                        lineHeight: '1.5', 
                        color: '#333333',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      }}>
                        Promote your business to local customers
                      </p>
                      <p style={{ 
                        fontSize: '14px', 
                        margin: 0, 
                        color: '#fbbf24',
                        fontWeight: '700',
                        fontFamily: "'Helvetica Neue', Arial, sans-serif",
                      }}>
                        morasjunk@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function CompanyDetailInline({ company, onClose }: { company: Company; onClose: () => void }) {
  const [socialTabOpen, setSocialTabOpen] = useState(false);
  
  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#fff',
        zIndex: 1000,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
      {/* Floating X Close Button */}
      <button
        onClick={onClose}
        data-testid="button-close-profile"
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          fontWeight: '300',
        }}
      >
        ×
      </button>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 16px 80px' }}>
        {/* Header with watermark logo */}
        <div style={{
          position: 'relative',
          marginBottom: '16px',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Watermark Logo Background */}
          {company.logoUrl && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '160px',
              height: '160px',
              opacity: 0.15,
              zIndex: 0,
            }}>
              <img 
                src={company.logoUrl} 
                alt={`${company.name} logo watermark`} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
          )}
          
          {/* Company name */}
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            margin: 0,
            color: '#000',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }} data-testid="text-company-name">
            {company.name}
          </h1>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} style={{ color: '#fbbf24', fontSize: '20px' }}>★</span>
          ))}
          <span style={{ fontWeight: '700', fontSize: '18px', color: '#000', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {company.rating}
          </span>
          <span style={{ color: '#6b7280', fontSize: '14px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {company.reviews} reviews
          </span>
        </div>

        {/* Call Now Button */}
        <button
          style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto 16px',
            padding: '16px 24px',
            background: '#fbbf24',
            color: '#000',
            border: '2px solid #000',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '700',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'block',
          }}
          onClick={() => {
            trackBusinessEvent(company.id, 'call');
            window.open(`tel:${company.phone}`, '_self');
          }}
          data-testid="button-call-now"
        >
          Call Now
        </button>

        {/* View on Google Button */}
        {company.gmbUrl && (
          <a
            href={company.gmbUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%',
              maxWidth: '400px',
              margin: '0 auto 24px',
              padding: '12px 24px',
              backgroundColor: '#fff',
              color: '#000',
              border: '2px solid #000',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
            onClick={() => trackBusinessEvent(company.id, 'google_reviews')}
            data-testid="button-view-on-google"
          >
            <FaGoogle size={18} />
            View Reviews on Google
          </a>
        )}

        {/* Social Media Bottom Tab */}
        {(company.website || company.facebookUrl || company.instagramUrl || company.gmbUrl || company.youtubeUrl) && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
          }}>
            {/* Collapsible Icons Row */}
            {socialTabOpen && (
              <div style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 20px',
                backgroundColor: '#fbbf24',
                borderRadius: '12px 12px 0 0',
                marginBottom: '-2px',
              }}>
                {company.website && (
                  <a
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-website-modal-${company.id}`}
                    style={{ color: '#000' }}
                  >
                    <Globe size={24} />
                  </a>
                )}
                {company.facebookUrl && (
                  <a
                    href={company.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-facebook-modal-${company.id}`}
                    style={{ color: '#000' }}
                  >
                    <FaFacebook size={24} />
                  </a>
                )}
                {company.instagramUrl && (
                  <a
                    href={company.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-instagram-modal-${company.id}`}
                    style={{ color: '#000' }}
                  >
                    <FaInstagram size={24} />
                  </a>
                )}
                {company.gmbUrl && (
                  <a
                    href={company.gmbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-gmb-modal-${company.id}`}
                    style={{ color: '#000' }}
                  >
                    <FaGoogle size={24} />
                  </a>
                )}
                {company.youtubeUrl && (
                  <a
                    href={company.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-youtube-modal-${company.id}`}
                    style={{ color: '#000' }}
                  >
                    <FaYoutube size={24} />
                  </a>
                )}
              </div>
            )}
            
            {/* Tab Button with Arrow */}
            <button
              onClick={() => setSocialTabOpen(!socialTabOpen)}
              data-testid="button-social-tab"
              style={{
                backgroundColor: '#fbbf24',
                border: 'none',
                borderRadius: socialTabOpen ? '0' : '12px 12px 0 0',
                padding: '8px 24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <ChevronUp size={20} color="#000" style={{
                transform: socialTabOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.2s',
              }} />
            </button>
          </div>
        )}

        {/* Services Icons */}
        {company.services && company.services.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '32px',
            padding: '0 12px',
            textAlign: 'center',
          }}>
            {company.services.map((serviceId, i) => {
              // Map service IDs to icons and labels
              const serviceMap: Record<string, { icon: any; label: string }> = {
                'residential': { icon: <Home size={32} />, label: 'Residential' },
                'commercial': { icon: <Building2 size={32} />, label: 'Commercial' },
                'furniture': { icon: <Sofa size={32} />, label: 'Furniture Removal' },
                'appliances': { icon: <Refrigerator size={32} />, label: 'Appliance Removal' },
                'electronics': { icon: <Tv size={32} />, label: 'Electronics' },
                'yard-waste': { icon: <Trees size={32} />, label: 'Yard Waste' },
                'construction': { icon: <Dumbbell size={32} />, label: 'Construction' },
                'moving': { icon: <Truck size={32} />, label: 'Moving/Hauling' },
                'general': { icon: <Package size={32} />, label: 'General Junk' },
              };
              
              const service = serviceMap[serviceId] || { icon: <Trash2 size={32} />, label: serviceId };
              
              return (
                <div key={i}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    margin: '0 auto 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #000',
                    borderRadius: '50%',
                  }}>
                    {service.icon}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '500', 
                    color: '#000', 
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                    lineHeight: '1.3',
                  }}>
                    {service.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Two Column Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 300px' : '1fr', 
          gap: '24px' 
        }}>
          {/* Left Column */}
          <div>
            {/* About Us */}
            {company.description && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  About Us
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#000',
                  lineHeight: '1.6',
                  margin: 0,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  {company.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Full Width Photo Gallery with Navigation */}
        {((company.galleryImages && company.galleryImages.length > 0) || company.logoUrl || company.reviews > 0) && (
          <div style={{
            position: 'relative',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginBottom: '32px',
            marginTop: '32px',
          }}>
            <div 
              ref={(el) => {
                if (el) (el as any).carouselScroll = el;
              }}
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                padding: '0 16px',
              }} 
              className="hide-scrollbar"
            >
              <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar { display: none; }`}} />
              {(() => {
                const hasGallery = company.galleryImages && company.galleryImages.length > 0;
                const hasLogo = company.logoUrl;
                const hasReviews = company.reviews > 0;
                
                let imagesToShow: (string | number)[] = [];
                
                if (hasGallery) {
                  const originalImages = company.galleryImages!;
                  imagesToShow = [...originalImages, ...originalImages, ...originalImages];
                } else if (hasLogo || hasReviews) {
                  imagesToShow = [1, 2, 3, 1, 2, 3, 1, 2, 3];
                }
                
                return imagesToShow.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: '0 0 100%',
                      width: '100%',
                      height: '400px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#f3f4f6',
                      border: '2px solid #fbbf24',
                    }}
                  >
                    <img
                      src={typeof img === 'string' ? img : `https://picsum.photos/400/600?random=${img}`}
                      alt={`Gallery ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ));
              })()}
            </div>
            
            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                const carousel = e.currentTarget.parentElement?.querySelector('.hide-scrollbar') as HTMLElement;
                if (carousel) carousel.scrollLeft -= 300;
              }}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                zIndex: 10,
              }}
              data-testid="button-carousel-prev"
            >
              ‹
            </button>
            
            <button
              onClick={(e) => {
                const carousel = e.currentTarget.parentElement?.querySelector('.hide-scrollbar') as HTMLElement;
                if (carousel) carousel.scrollLeft += 300;
              }}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.6)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                zIndex: 10,
              }}
              data-testid="button-carousel-next"
            >
              ›
            </button>
          </div>
        )}

        {/* Continue with Two Column Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth > 768 ? '1fr 300px' : '1fr', 
          gap: '24px',
          maxWidth: '100%',
        }}>
          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#000',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                Reviews
              </h2>
              {[
                { name: 'Michael D.', location: 'Downtown Phoenix', text: "Great experience! The team was on time, worked quickly, and left the area spotless. Highly recommend!" },
                { name: 'Sarah M.', location: 'Tempe', text: "Very professional and reasonably priced. Will definitely use them again for future junk removal projects." },
                { name: 'John R.', location: 'Old Town Scottsdale', text: "Excellent service from start to finish! The crew was courteous and efficient." }
              ].map((review, i) => (
                <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < 2 ? '1px solid #e5e7eb' : 'none', maxWidth: '100%', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{review.name}</div>
                      <div style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{review.location}</div>
                    </div>
                    <div style={{ display: 'flex', flexShrink: 0 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#000', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
                    {review.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Meet the Team */}
            {company.teamMembers && Array.isArray(company.teamMembers) && company.teamMembers.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  color: '#000',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  Meet the Team
                </h2>
                <div style={{
                  display: 'grid',
                  gap: '20px',
                }}>
                  {company.teamMembers.map((member: any, i: number) => (
                    <div key={i} style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                        {(member.photoUrl || member.imageUrl) ? (
                          <img 
                            src={member.photoUrl || member.imageUrl} 
                            alt={member.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <UserCircle size={48} color="#9ca3af" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          margin: '0 0 4px 0',
                          color: '#000',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}>
                          {member.name}
                        </h3>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          margin: '0 0 8px 0',
                          color: '#fbbf24',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}>
                          {member.role}
                        </p>
                        <p style={{
                          fontSize: '14px',
                          color: '#4b5563',
                          margin: 0,
                          lineHeight: '1.5',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                        }}>
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {company.faqs && Array.isArray(company.faqs) && company.faqs.length > 0 && (
              <FAQSection faqs={company.faqs} />
            )}
          </div>

          {/* Right Column */}
          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
            {/* Pricing Estimator */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#000',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                Get Your Estimate
              </h2>
              <EstimateBuilderInline 
                companyPrices={{
                  minimum: company.minimumPrice ? parseFloat(company.minimumPrice) : 75,
                  quarterLoad: company.quarterLoadPrice ? parseFloat(company.quarterLoadPrice) : 150,
                  halfLoad: company.halfLoadPrice ? parseFloat(company.halfLoadPrice) : 500,
                  threeQuarterLoad: company.threeQuarterLoadPrice ? parseFloat(company.threeQuarterLoadPrice) : 750,
                  fullLoad: company.fullLoadPrice ? parseFloat(company.fullLoadPrice) : 1000,
                }}
                showDisclaimers={false}
                vehicleCapacity={company.trailerSize || undefined}
                singleItemMinimum={company.singleItemMinimum ? parseFloat(company.singleItemMinimum) : undefined}
              />
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#000',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                Amenities
              </h2>
              <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <div>• Free Estimates</div>
                <div>• Same-Day Service</div>
                <div>• Eco-Friendly</div>
              </div>
            </div>

            {/* Items We Don't Take */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#000',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                Items We Don't Take
              </h2>
              <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <div>• Hazardous Materials</div>
                <div>• Chemicals & Paint</div>
                <div>• Asbestos</div>
                <div>• Medical Waste</div>
              </div>
            </div>

            {/* Payment Methods */}
            {company.paymentMethods && company.paymentMethods.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  Payment Methods
                </h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {company.paymentMethods.map((method) => {
                    const getMethodIcon = () => {
                      switch(method.toLowerCase()) {
                        case 'cash':
                          return <DollarSign size={20} />;
                        case 'card':
                          return <CreditCard size={20} />;
                        case 'zelle':
                          return <span style={{ fontSize: '18px', fontWeight: '700' }}>Z</span>;
                        case 'venmo':
                          return <span style={{ fontSize: '18px', fontWeight: '700' }}>V</span>;
                        case 'apple pay':
                          return <Smartphone size={20} />;
                        case 'cash app':
                          return <span style={{ fontSize: '18px', fontWeight: '700' }}>$</span>;
                        case 'check':
                          return <FileText size={20} />;
                        default:
                          return <DollarSign size={20} />;
                      }
                    };
                    
                    return (
                      <div key={method} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: '#f3f4f6',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}>
                        {getMethodIcon()}
                        {method}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Business Hours */}
            {(company.businessHours || company.hours) && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  Business Hours
                </h2>
                <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {company.businessHours ? (
                    (() => {
                      const formatTime = (time: string) => {
                        const [h, m] = time.split(':');
                        const hour = parseInt(h);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const hour12 = hour % 12 || 12;
                        return `${hour12}:${m} ${ampm}`;
                      };
                      
                      const bh = company.businessHours as Record<string, { open: string; close: string; closed: boolean }>;
                      const mon = bh.monday;
                      const tue = bh.tuesday;
                      const wed = bh.wednesday;
                      const thu = bh.thursday;
                      const fri = bh.friday;
                      const sat = bh.saturday;
                      const sun = bh.sunday;
                      
                      const isSame = (a: any, b: any) => 
                        a && b && a.open === b.open && a.close === b.close && a.closed === b.closed;
                      
                      const weekdaysSame = mon && tue && wed && thu && fri &&
                        isSame(mon, tue) && isSame(mon, wed) && isSame(mon, thu) && isSame(mon, fri);
                      
                      return (
                        <>
                          {weekdaysSame && mon && (
                            <div style={{ marginBottom: '4px' }}>
                              <strong>Monday - Friday:</strong> {mon.closed ? 'Closed' : `${formatTime(mon.open)} - ${formatTime(mon.close)}`}
                            </div>
                          )}
                          {!weekdaysSame && (
                            <>
                              {mon && <div style={{ marginBottom: '4px' }}><strong>Monday:</strong> {mon.closed ? 'Closed' : `${formatTime(mon.open)} - ${formatTime(mon.close)}`}</div>}
                              {tue && <div style={{ marginBottom: '4px' }}><strong>Tuesday:</strong> {tue.closed ? 'Closed' : `${formatTime(tue.open)} - ${formatTime(tue.close)}`}</div>}
                              {wed && <div style={{ marginBottom: '4px' }}><strong>Wednesday:</strong> {wed.closed ? 'Closed' : `${formatTime(wed.open)} - ${formatTime(wed.close)}`}</div>}
                              {thu && <div style={{ marginBottom: '4px' }}><strong>Thursday:</strong> {thu.closed ? 'Closed' : `${formatTime(thu.open)} - ${formatTime(thu.close)}`}</div>}
                              {fri && <div style={{ marginBottom: '4px' }}><strong>Friday:</strong> {fri.closed ? 'Closed' : `${formatTime(fri.open)} - ${formatTime(fri.close)}`}</div>}
                            </>
                          )}
                          {sat && (
                            <div style={{ marginBottom: '4px' }}>
                              <strong>Saturday:</strong> {sat.closed ? 'Closed' : `${formatTime(sat.open)} - ${formatTime(sat.close)}`}
                            </div>
                          )}
                          {sun && (
                            <div style={{ marginBottom: '4px' }}>
                              <strong>Sunday:</strong> {sun.closed ? 'Closed' : `${formatTime(sun.open)} - ${formatTime(sun.close)}`}
                            </div>
                          )}
                        </>
                      );
                    })()
                  ) : (
                    company.hours
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {company.address && (
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: '#000',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  Location
                </h2>
                <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  <div>{company.address}</div>
                  <div>{company.city}, {company.state}</div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#000',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                Contact Information
              </h2>
              <button
                onClick={() => window.location.href = `tel:${company.phone}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '8px',
                  fontSize: '14px', 
                  color: '#000', 
                  textDecoration: 'none',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
                data-testid="button-call-phone"
              >
                <Phone size={16} color="#000" />
                <span>{company.phone}</span>
              </button>
              {company.contactEmail && (
                <button
                  onClick={() => window.location.href = `mailto:${company.contactEmail}`}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px',
                    fontSize: '14px', 
                    color: '#000', 
                    textDecoration: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                  data-testid="button-email"
                >
                  <Mail size={16} color="#000" />
                  <span>{company.contactEmail}</span>
                </button>
              )}
              {company.website && (
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '16px',
                    fontSize: '14px', 
                    color: '#000', 
                    textDecoration: 'none', 
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  <Globe size={16} color="#000" />
                  <span>Visit Website</span>
                </a>
              )}
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#fbbf24',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  boxSizing: 'border-box',
                }}
                onClick={() => {
                  trackBusinessEvent(company.id, 'call');
                  window.open(`tel:${company.phone}`, '_self');
                }}
                data-testid="button-request-quote-bottom"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>

        {/* Map Location */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '12px',
            color: '#000',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            Map
          </h2>
          <div style={{
            width: '100%',
            height: '250px',
            background: '#e8f0e3',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #d1d5db',
          }}>
            {/* Map background with streets */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
              {/* Park/green space */}
              <rect x="60" y="40" width="80" height="70" fill="#c7e6bd" />
              {/* Streets - horizontal */}
              <rect x="0" y="80" width="100%" height="4" fill="#fff" />
              <rect x="0" y="160" width="100%" height="4" fill="#fff" />
              {/* Streets - vertical */}
              <rect x="120" y="0" width="4" height="100%" fill="#fff" />
              <rect x="240" y="0" width="4" height="100%" fill="#fff" />
              <rect x="360" y="0" width="4" height="100%" fill="#fff" />
              {/* Street labels */}
              <text x="10" y="75" fontSize="10" fill="#6b7280" fontFamily="system-ui">Main St</text>
              <text x="10" y="155" fontSize="10" fill="#6b7280" fontFamily="system-ui">Elm St</text>
              <text x="128" y="20" fontSize="10" fill="#6b7280" fontFamily="system-ui">1st Ave</text>
              {/* Buildings */}
              <rect x="30" y="90" width="25" height="30" fill="#d1d5db" opacity="0.7" />
              <rect x="140" y="90" width="30" height="35" fill="#d1d5db" opacity="0.7" />
              <rect x="250" y="100" width="28" height="30" fill="#d1d5db" opacity="0.7" />
              <rect x="150" y="175" width="35" height="40" fill="#d1d5db" opacity="0.7" />
            </svg>
            
            {/* Location marker */}
            <div style={{
              position: 'absolute',
              top: '45%',
              left: '55%',
              transform: 'translate(-50%, -100%)',
              zIndex: 10,
            }}>
              <MapPin size={40} color="#ef4444" fill="#ef4444" strokeWidth={2} />
            </div>
            
            {/* Address label */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#374151',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              {company.address || '1234 Elm St, Springfield, IL 62701'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQSection({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '12px',
        color: '#000',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        Frequently Asked Questions
      </h2>
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{
            marginBottom: '12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                padding: '16px',
                background: isOpen ? '#f9fafb' : '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'left',
                boxSizing: 'border-box',
              }}
              data-testid={`button-faq-${i}`}
            >
              <span style={{
                fontWeight: '600',
                fontSize: '14px',
                color: '#000',
                fontFamily: 'system-ui, -apple-system, sans-serif',
              }}>
                {faq.question}
              </span>
              <ChevronDown
                size={20}
                color="#fbbf24"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            {isOpen && (
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                boxSizing: 'border-box',
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.6',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}>
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Zip Code Search Page Component
function ZipSearchPage({ zipCode }: { zipCode: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [closestHauler, setClosestHauler] = useState<any>(null);
  const [nearbyHaulers, setNearbyHaulers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  useEffect(() => {
    async function searchByZipCode() {
      setIsLoading(true);
      setError(null);

      // Dynamically import geocoding utilities
      const { geocodeZipCode, sortCompaniesByDistance, filterCompaniesByRadius } = await import('./lib/geocoding');

      // Geocode the zip code
      const coordinates = await geocodeZipCode(zipCode);

      if (!coordinates) {
        setError('Unable to find location for this zip code. Please add GOOGLE_MAPS_API_KEY environment variable or try searching by city/state.');
        setIsLoading(false);
        return;
      }

      if (companies.length === 0) {
        setError('No haulers found in our directory yet. Check back soon!');
        setIsLoading(false);
        return;
      }

      // Sort companies by distance
      const companiesWithDistance = sortCompaniesByDistance(companies, coordinates);

      // Get closest hauler
      if (companiesWithDistance.length > 0) {
        setClosestHauler(companiesWithDistance[0]);
        setShowOverlay(true);
      }

      // Get other nearby haulers within 15 miles (excluding the closest one)
      const nearby = filterCompaniesByRadius(companiesWithDistance.slice(1), 15);
      setNearbyHaulers(nearby.slice(0, 5)); // Max 5

      setIsLoading(false);
    }

    if (companies.length > 0) {
      searchByZipCode();
    }
  }, [zipCode, companies]);

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #fbbf24',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
          }}></div>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>Finding your closest vetted hauler...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px',
          }}>⚠️</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#1a1a1a',
          }}>{error}</h2>
          <Link href="/">
            <button style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#fbbf24',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
            }} data-testid="button-back-home">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
    }}>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Congratulations Overlay */}
      {showOverlay && closestHauler && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 3000,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            maxWidth: '900px',
            width: '100%',
            margin: '20px',
            backgroundColor: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowOverlay(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#fbbf24',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 3001,
              }}
              data-testid="button-close-overlay"
            >
              <X size={24} color="#000" />
            </button>

            {/* Congratulations Header */}
            <div style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              padding: '40px 20px',
              textAlign: 'center',
              color: '#fff',
            }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '12px',
              }}>
                Congratulations!
              </h1>
              <p style={{
                fontSize: '20px',
                opacity: 0.95,
              }}>
                You found your local vetted hauler
              </p>
            </div>

            {/* Closest Hauler Info */}
            <div style={{ padding: '32px 20px' }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '24px',
                borderRadius: '12px',
                marginBottom: '24px',
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '8px',
                }}>
                  {closestHauler.company.name}
                </h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  marginBottom: '16px',
                }}>
                  📍 {closestHauler.distance} miles away
                </p>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '20px',
                  flexWrap: 'wrap',
                }}>
                  <a
                    href={`tel:${closestHauler.company.phone}`}
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      padding: '14px 20px',
                      backgroundColor: '#16a34a',
                      color: '#fff',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '700',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    data-testid="button-call-closest"
                  >
                    <Phone size={20} /> Call Now
                  </a>
                  <Link
                    href={`/company/${closestHauler.company.id}`}
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      padding: '14px 20px',
                      backgroundColor: '#fbbf24',
                      color: '#000',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '700',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    data-testid="button-view-profile-closest"
                  >
                    <FileText size={20} /> View Full Profile
                  </Link>
                </div>
              </div>

              <button
                onClick={() => setShowOverlay(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#e5e7eb',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                data-testid="button-see-alternatives"
              >
                See {nearbyHaulers.length} Other Nearby Options
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '12px',
          }}>
            Haulers Near Zip Code {zipCode}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
          }}>
            Sorted by distance from your location
          </p>
        </div>

        {/* Nearby Haulers List */}
        {nearbyHaulers.length > 0 ? (
          <div style={{
            display: 'grid',
            gap: '20px',
          }}>
            {nearbyHaulers.map((item, index) => (
              <div
                key={item.company.id}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '20px',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '8px',
                    }}>
                      {item.company.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '12px',
                    }}>
                      📍 {item.distance} miles away
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                        <span style={{ fontWeight: '600' }}>{item.company.rating}</span>
                      </div>
                      <span style={{ color: '#6b7280' }}>({item.company.reviews} reviews)</span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}>
                    <a
                      href={`tel:${item.company.phone}`}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#16a34a',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      data-testid={`button-call-${index}`}
                    >
                      <Phone size={16} /> Call
                    </a>
                    <Link
                      href={`/company/${item.company.id}`}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#fbbf24',
                        color: '#000',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      data-testid={`button-view-${index}`}
                    >
                      <FileText size={16} /> View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
          }}>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
            }}>
              No other haulers found within 15 miles. The closest one is shown above!
            </p>
          </div>
        )}

        <div style={{
          marginTop: '40px',
          textAlign: 'center',
        }}>
          <Link href="/">
            <button style={{
              padding: '12px 24px',
              backgroundColor: '#e5e7eb',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }} data-testid="button-new-search">
              Try Another Search
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

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
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/add-business" component={AddBusiness} />
        <Route path="/profile/edit" component={ProfileEditor} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/example-profile" component={ExampleProfile} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/items/:item" component={ItemRemovalPage} />
        <Route path="/services/:service" component={ServicePage} />
        <Route path="/zip/:zipCode">
          {(params) => <ZipSearchPage zipCode={params.zipCode} />}
        </Route>
        <Route path="/company/:id" component={CompanyDetail} />
        <Route path="/:state/:city/:id" component={CompanyDetail} />
        <Route path="/:state/:city">
          {(params) => <CityPage city={params.city} state={params.state} />}
        </Route>
        <Route path="/:state">
          {(params) => <StatePage stateName={stateNames[params.state] || 'Unknown'} stateSlug={params.state} />}
        </Route>
        <Route>404 - Page Not Found</Route>
      </Switch>
    </Router>
  );
}

export default App;
