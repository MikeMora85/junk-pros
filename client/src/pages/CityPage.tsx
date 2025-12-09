import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Phone, Star, Plus, Camera, Menu, ChevronDown, ChevronUp, UserCircle, FileText, CheckCircle, Home, Building2, Sofa, Refrigerator, Tv, Trees, Dumbbell, Truck, Package, Trash2, Globe, Mail, DollarSign, CreditCard, Smartphone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaGoogle } from "react-icons/fa";
import type { Company } from "@shared/schema";
import { useAuth } from "../hooks/useAuth";
import { useSEO, buildCityPageSEO } from "../lib/seo";
import { trackBusinessEvent } from "../lib/tracking";
import QuoteRequestForm from "../components/QuoteRequestForm";
import { HamburgerMenu } from "../components/SharedComponents";
import EstimateBuilderInline from "../components/EstimateBuilderInline";
import img1 from "@assets/stock_images/junk_removal_truck_s_8d89f5e0.jpg";
import img2 from "@assets/stock_images/junk_removal_truck_s_08e95c57.jpg";
import img3 from "@assets/stock_images/junk_removal_truck_s_6100f5f9.jpg";
import img4 from "@assets/stock_images/junk_removal_truck_s_20fde47d.jpg";
import img5 from "@assets/stock_images/junk_removal_truck_s_8e2ece45.jpg";
import img6 from "@assets/stock_images/junk_removal_truck_s_7e78a264.jpg";

const defaultImages = [img1, img2, img3, img4, img5, img6];

const stateAbbreviations: Record<string, string> = {
  'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas', 'ca': 'California',
  'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware', 'fl': 'Florida', 'ga': 'Georgia',
  'hi': 'Hawaii', 'id': 'Idaho', 'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa',
  'ks': 'Kansas', 'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland',
  'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota', 'ms': 'Mississippi', 'mo': 'Missouri',
  'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada', 'nh': 'New Hampshire', 'nj': 'New Jersey',
  'nm': 'New Mexico', 'ny': 'New York', 'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio',
  'ok': 'Oklahoma', 'or': 'Oregon', 'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina',
  'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas', 'ut': 'Utah', 'vt': 'Vermont',
  'va': 'Virginia', 'wa': 'Washington', 'wv': 'West Virginia', 'wi': 'Wisconsin', 'wy': 'Wyoming',
};

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

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

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

function GoogleMapEmbed({ address, lat, lng }: { address: string; lat?: number | null; lng?: number | null }) {
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!mapElement) return;
    
    const initMap = async () => {
      try {
        const configResponse = await fetch('/api/config');
        const config = await configResponse.json();
        const apiKey = config.googleMapsApiKey;
        
        if (!apiKey) {
          setError('Map unavailable');
          setIsLoading(false);
          return;
        }
        
        if (!window.google?.maps) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Google Maps'));
            document.head.appendChild(script);
          });
        }
        
        let coordinates = { lat: lat || 0, lng: lng || 0 };
        
        if (!lat || !lng) {
          const geocoder = new google.maps.Geocoder();
          const result = await geocoder.geocode({ address });
          if (result.results[0]) {
            coordinates = {
              lat: result.results[0].geometry.location.lat(),
              lng: result.results[0].geometry.location.lng(),
            };
          }
        }
        
        const map = new google.maps.Map(mapElement, {
          center: coordinates,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        
        new google.maps.Marker({
          position: coordinates,
          map,
          title: address,
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Map error:', err);
        setError('Failed to load map');
        setIsLoading(false);
      }
    };
    
    initMap();
  }, [mapElement, address, lat, lng]);
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '14px',
          color: '#6b7280',
        }}>
          Loading map...
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '14px',
          color: '#6b7280',
        }}>
          {error}
        </div>
      )}
      <div
        ref={setMapElement}
        style={{ width: '100%', height: '100%', borderRadius: '12px' }}
      />
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

function CompanyDetailInline({ company, onClose, setVideoModalUrl }: { company: Company; onClose: () => void; setVideoModalUrl: (url: string | null) => void }) {
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
        zIndex: 100000,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
      <style dangerouslySetInnerHTML={{__html: `
        .close-button-profile {
          position: fixed;
          top: 12px;
          right: 12px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #000;
          color: #fff;
          border: none;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          font-weight: 300;
        }
        @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
          .close-button-profile {
            right: calc((100vw - 1200px) / 2 + 16px);
          }
        }
      `}} />
      <button
        onClick={onClose}
        data-testid="button-close-profile"
        className="close-button-profile"
      >
        ×
      </button>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '100px 16px 80px',
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          .company-header-logo {
            position: 'absolute';
            top: '50%';
            left: '50%';
            transform: 'translate(-50%, -50%)';
            width: 160px;
            height: 160px;
            opacity: 0.15;
            z-index: 0;
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .company-header-logo {
              width: 300px;
              height: 300px;
            }
          }
          .company-name-title {
            font-size: 36px;
            font-weight: 700;
            margin: 0;
            color: #000;
            font-family: system-ui, -apple-system, sans-serif;
            text-align: center;
            position: relative;
            z-index: 1;
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .company-name-title {
              font-size: 64px;
            }
          }
          .rating-star {
            color: #fbbf24;
            font-size: 20px;
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .rating-star {
              font-size: 32px;
            }
          }
          .rating-number {
            font-weight: 700;
            font-size: 18px;
            color: #000;
            font-family: system-ui, -apple-system, sans-serif;
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .rating-number {
              font-size: 28px;
            }
          }
          .rating-reviews {
            color: #6b7280;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .rating-reviews {
              font-size: 22px;
            }
          }
          .company-header-container {
            position: relative;
            margin-bottom: 16px;
            min-height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .company-header-container {
              padding-top: 60px;
            }
          }
        `}} />
        <div className="company-header-container">
          {company.logoUrl && (
            <div className="company-header-logo" style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
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
          
          <h1 className="company-name-title" data-testid="text-company-name">
            {company.name}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="rating-star">★</span>
          ))}
          <span className="rating-number">
            {company.rating}
          </span>
          <span className="rating-reviews">
            {company.reviews} reviews
          </span>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .cta-buttons-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .cta-buttons-container {
              flex-direction: row;
              max-width: none;
              gap: 20px;
            }
          }
        `}} />
        <div className="cta-buttons-container">
          <button
            style={{
              width: '100%',
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

          {company.gmbUrl && (
            <a
              href={company.gmbUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%',
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
        </div>

        {(company.website || company.facebookUrl || company.instagramUrl || company.gmbUrl || company.youtubeUrl) && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
          }}>
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

        <style dangerouslySetInnerHTML={{__html: `
          .service-icons-container {
            display: grid;
            gap: 16px;
            margin-bottom: 32px;
            padding: 0 12px;
            text-align: center;
            max-width: 800px;
            margin: 0 auto 32px;
          }
          @media (max-width: 1023px) {
            .service-icons-container {
              grid-template-columns: repeat(3, 1fr);
              max-width: 400px;
              gap: 12px;
            }
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .service-icons-container {
              grid-template-columns: repeat(5, 1fr);
              max-width: none;
              padding: 0;
              gap: 20px;
            }
          }
          .service-icon-circle {
            width: 90px;
            height: 90px;
            margin: 0 auto 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #000;
            border-radius: 50%;
          }
          .service-icon-svg {
            transform: scale(1.4);
          }
          @media (max-width: 1023px) {
            .service-icon-circle {
              width: 75px;
              height: 75px;
            }
            .service-icon-svg {
              transform: scale(1.2);
            }
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .service-icon-circle {
              width: 130px;
              height: 130px;
            }
            .service-icon-svg {
              transform: scale(2);
            }
          }
        `}} />
        {company.services && company.services.length > 0 && (
          <div className="service-icons-container">
            {company.services.map((serviceId, i) => {
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
                  <div className="service-icon-circle">
                    <div className="service-icon-svg">
                      {service.icon}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
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

        {company.videoUrl && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '12px',
              color: '#000',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              Watch Our Video
            </h2>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setVideoModalUrl(company.videoUrl || null);
              }}
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
                backgroundColor: '#000',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid #fbbf24',
              }}
              data-testid="button-play-video"
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: company.videoUrl.includes('youtube') || company.videoUrl.includes('youtu.be')
                  ? `url(https://img.youtube.com/vi/${company.videoUrl.split('v=')[1]?.split('&')[0] || company.videoUrl.split('youtu.be/')[1]?.split('?')[0]}/maxresdefault.jpg) center/cover`
                  : '#1a1a1a',
                pointerEvents: 'none',
              }} />
              
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'rgba(251, 191, 36, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                pointerEvents: 'none',
              }}>
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '28px solid #000',
                  borderTop: '16px solid transparent',
                  borderBottom: '16px solid transparent',
                  marginLeft: '6px',
                }} />
              </div>
            </div>
          </div>
        )}

        <style dangerouslySetInnerHTML={{__html: `
          .photo-gallery-container {
            position: relative;
            margin-bottom: 32px !important;
            margin-top: 32px !important;
          }
          .photo-gallery-scroll {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            scroll-behavior: smooth;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 0 16px;
          }
          .photo-gallery-item {
            flex: 0 0 100%;
            width: 100%;
            height: 400px;
            border-radius: 8px;
            overflow: hidden;
            background: #f3f4f6;
            border: 2px solid #fbbf24;
            scroll-snap-align: start;
          }
          .photo-gallery-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          @media (max-width: 1023px) {
            .photo-gallery-container {
              margin-bottom: 12px !important;
              margin-top: 12px !important;
            }
            .photo-gallery-item {
              height: 300px;
            }
            .photo-gallery-img {
              object-fit: cover;
            }
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .photo-gallery-scroll {
              display: flex;
              gap: 16px;
              overflow-x: auto;
              padding: 0;
            }
            .photo-gallery-item {
              flex: 0 0 calc(25% - 12px);
              width: calc(25% - 12px);
              height: 300px;
            }
            .photo-gallery-img {
              object-fit: cover;
            }
          }
        `}} />
        {((company.galleryImages && company.galleryImages.length > 0) || company.logoUrl || company.reviews > 0) && (
          <div className="photo-gallery-container">
            <div 
              ref={(el) => {
                if (el) (el as any).carouselScroll = el;
              }}
              className="photo-gallery-scroll hide-scrollbar"
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
                    className="photo-gallery-item"
                  >
                    <img
                      src={typeof img === 'string' ? img : `https://picsum.photos/200/300?random=${img}`}
                      alt={`Gallery ${idx + 1}`}
                      className="photo-gallery-img"
                    />
                  </div>
                ));
              })()}
            </div>
            
            <button
              onClick={(e) => {
                const carousel = e.currentTarget.parentElement?.querySelector('.photo-gallery-scroll') as HTMLElement;
                if (carousel) {
                  const firstItem = carousel.querySelector('.photo-gallery-item') as HTMLElement;
                  if (firstItem) {
                    const computed = getComputedStyle(carousel);
                    const gapValue = computed.columnGap || computed.gap;
                    const gap = gapValue && gapValue !== 'normal' ? parseFloat(gapValue) : 0;
                    const scrollAmount = firstItem.offsetWidth + (Number.isFinite(gap) ? gap : 0);
                    carousel.scrollLeft -= scrollAmount;
                  } else {
                    carousel.scrollLeft -= carousel.clientWidth;
                  }
                }
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
                const carousel = e.currentTarget.parentElement?.querySelector('.photo-gallery-scroll') as HTMLElement;
                if (carousel) {
                  const firstItem = carousel.querySelector('.photo-gallery-item') as HTMLElement;
                  if (firstItem) {
                    const computed = getComputedStyle(carousel);
                    const gapValue = computed.columnGap || computed.gap;
                    const gap = gapValue && gapValue !== 'normal' ? parseFloat(gapValue) : 0;
                    const scrollAmount = firstItem.offsetWidth + (Number.isFinite(gap) ? gap : 0);
                    carousel.scrollLeft += scrollAmount;
                  } else {
                    carousel.scrollLeft += carousel.clientWidth;
                  }
                }
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

        <style dangerouslySetInnerHTML={{__html: `
          .expanded-two-column {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            max-width: 100%;
          }
          @media (min-width: 1024px) {
            .expanded-two-column {
              grid-template-columns: 1fr 350px;
              gap: 40px;
            }
          }
        `}} />
        <div className="expanded-two-column">
          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
            {(company as any).googleFeaturedReviews && Array.isArray((company as any).googleFeaturedReviews) && (company as any).googleFeaturedReviews.length > 0 && (
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
                {(company as any).googleFeaturedReviews.map((review: any, i: number) => (
                  <div key={i} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: i < (company as any).googleFeaturedReviews.length - 1 ? '1px solid #e5e7eb' : 'none', maxWidth: '100%', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{review.reviewerName || 'Anonymous'}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'system-ui, -apple-system, sans-serif' }}>{review.reviewerLocation || ''}</div>
                      </div>
                      <div style={{ display: 'flex', flexShrink: 0 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} style={{ color: star <= (review.rating || 5) ? '#fbbf24' : '#e5e7eb', fontSize: '14px' }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#000', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', overflowWrap: 'break-word', wordWrap: 'break-word' }}>
                      {review.reviewText}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {(company as any).teamMembers && Array.isArray((company as any).teamMembers) && (company as any).teamMembers.length > 0 && (
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
                  {(company as any).teamMembers.map((member: any, i: number) => (
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

            {(company as any).faqs && Array.isArray((company as any).faqs) && (company as any).faqs.length > 0 && (
              <FAQSection faqs={(company as any).faqs} />
            )}
          </div>

          <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
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

            {company.amenities && Array.isArray(company.amenities) && company.amenities.length > 0 && (
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
                  {company.amenities.map((amenity: string, i: number) => (
                    <div key={i}>• {amenity}</div>
                  ))}
                </div>
              </div>
            )}

            {company.itemsNotTaken && Array.isArray(company.itemsNotTaken) && company.itemsNotTaken.length > 0 && (
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
                  {company.itemsNotTaken.map((item: string, i: number) => (
                    <div key={i}>• {item}</div>
                  ))}
                </div>
              </div>
            )}

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

        <style dangerouslySetInnerHTML={{__html: `
          .map-container {
            width: 100%;
            height: 250px;
            background: #e8f0e3;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            border: 1px solid #d1d5db;
          }
          @media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
            .map-container {
              height: 500px;
            }
          }
        `}} />
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
          <div className="map-container">
            <GoogleMapEmbed 
              address={company.address || `${company.city}, ${company.state}`}
              lat={company.latitude}
              lng={company.longitude}
            />
            
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
              zIndex: 10,
            }}>
              {company.address || `${company.city}, ${company.state}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CityPage({ city, state }: { city: string; state: string }) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null);
  const [carouselOffsets] = useState<Record<number, number>>({});
  const [carouselTransitions] = useState<Record<number, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  const fullStateName = stateAbbreviations[state.toLowerCase()] || stateNames[state] || state;
  
  useSEO(buildCityPageSEO(city, state, fullStateName));
  
  const formatCityName = (citySlug: string) => {
    return citySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const displayCityName = formatCityName(city);
  const formattedCity = formatCityName(city);
  
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies", { city: formattedCity, state: fullStateName }],
    queryFn: async () => {
      const response = await fetch(`/api/companies?city=${encodeURIComponent(formattedCity)}&state=${encodeURIComponent(fullStateName)}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });


  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      const getTierPriority = (company: any) => {
        if (!company.claimed) return 4;
        if (company.subscriptionTier === 'premium') return 1;
        if (company.subscriptionTier === 'standard') return 2;
        return 3;
      };
      const priorityDiff = getTierPriority(a) - getTierPriority(b);
      if (priorityDiff !== 0) return priorityDiff;
      return (a.displayOrder || 999) - (b.displayOrder || 999);
    });
  }, [companies]);

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
    return url;
  };

  return (
    <>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      
      {videoModalUrl && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 999999,
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
          zIndex: 99999,
          overflow: 'auto',
        }} onClick={() => setSelectedCompanyId(null)}>
          <div>
            <CompanyDetailInline company={selectedCompany} onClose={() => setSelectedCompanyId(null)} setVideoModalUrl={setVideoModalUrl} />
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
          .city-nav-header {
            padding-left: calc((100vw - 1400px) / 2 + 24px) !important;
            padding-right: calc((100vw - 1400px) / 2 + 24px) !important;
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
      <div className="city-nav-header" style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10002,
        background: 'rgba(251, 191, 36, 0.15)',
        backdropFilter: 'blur(10px)',
        padding: '10px 16px',
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
          {isAuthenticated && !!user && (
            <button
              onClick={() => {
                if ((user as any)?.isAdmin) {
                  window.location.href = '/admin';
                } else {
                  window.location.href = '/profile/edit';
                }
              }}
              style={{
                backgroundColor: 'transparent',
                color: '#000',
                padding: '0',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              data-testid="button-profile-city"
            >
              <UserCircle size={28} />
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

      <div style={{ padding: '20px 0 0 0', margin: '0', width: '100%' }}>
        <div className="page-title-container" style={{ marginBottom: '12px', padding: '0 16px', margin: '0 0 12px 0' }}>
          <h2 className="city-title" style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            color: '#1a1a1a',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
          }} data-testid="text-page-title">
            {displayCityName}<br className="mobile-break" /> Junk Removal
          </h2>
          <p className="city-subtitle" style={{ fontSize: '15px', color: '#000', margin: 0 }}>
            {companies.length} local independent pro{companies.length !== 1 ? 's' : ''} based in {displayCityName}
          </p>
        </div>

        <div className="city-page-layout">
          <div className="city-main">
            <div className="company-listings-container" style={{ width: '100%', maxWidth: '100%', overflow: 'visible', margin: '0 auto', padding: '0' }}>
                <style dangerouslySetInnerHTML={{__html: `
                  * {
                    box-sizing: border-box;
                  }
                  
                  .city-page-layout {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    padding: 0;
                    margin: 0;
                  }
                  
                  .company-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                    padding-left: 0;
                    padding-right: 0;
                  }
                  
                  .city-sidebar {
                    width: 100%;
                    padding-left: 0;
                    padding-right: 0;
                    margin-top: 24px;
                  }
                  
                  @media (min-width: 1024px) {
                    .page-title-container {
                      max-width: 1400px;
                      margin-left: auto !important;
                      margin-right: auto !important;
                      padding-left: 40px !important;
                      padding-right: 24px !important;
                    }
                    
                    .city-title {
                      font-size: 42px !important;
                    }
                    
                    .city-subtitle {
                      font-size: 18px !important;
                    }
                    
                    .mobile-break {
                      display: none;
                    }
                    
                    .city-page-layout {
                      display: grid;
                      grid-template-columns: 1fr 380px;
                      gap: 24px;
                      max-width: 1400px;
                      margin: 0 auto;
                      padding: 0 24px;
                    }
                    
                    .city-main {
                      min-width: 0;
                    }
                    
                    .company-grid {
                      grid-template-columns: 1fr 1fr;
                      gap: 16px;
                      padding-left: 16px;
                      padding-right: 16px;
                    }
                    
                    .full-width-card {
                      grid-column: span 2;
                    }
                    
                    .city-sidebar {
                      position: sticky;
                      top: 20px;
                      height: fit-content;
                      max-height: calc(100vh - 40px);
                      overflow-y: auto;
                      margin-top: 0;
                      padding-left: 16px;
                      padding-right: 16px;
                    }
                    
                    .video-thumbnail-desktop {
                      display: block !important;
                    }
                    
                    .company-header-section {
                      display: flex;
                      justify-content: space-between;
                      align-items: flex-end;
                      gap: 24px;
                      margin-bottom: 24px !important;
                    }
                    
                    .logo-info-section {
                      margin-bottom: 0 !important;
                      display: flex;
                      gap: 16px;
                      height: 120px;
                    }
                    
                    .company-logo {
                      width: 120px !important;
                      height: 120px !important;
                      font-size: 48px !important;
                      flex-shrink: 0 !important;
                    }
                    
                    .logo-info-section > div:last-child {
                      height: 120px !important;
                      justify-content: space-between !important;
                      display: flex !important;
                      flex-direction: column !important;
                      padding-bottom: 10px;
                    }
                    
                    .logo-info-section h3 {
                      font-size: 24px !important;
                    }
                    
                    .logo-info-section span {
                      font-size: 18px !important;
                    }
                    
                    .logo-info-section svg {
                      width: 20px !important;
                      height: 20px !important;
                    }
                    
                    .quote-buttons-inline {
                      display: flex !important;
                      gap: 12px;
                      flex-shrink: 0;
                      margin-bottom: 10px;
                    }
                    
                    .quote-buttons-inline .quote-button {
                      width: 100px !important;
                      height: 100px !important;
                      flex-shrink: 0 !important;
                    }
                    
                    .quote-buttons-inline .quote-icon {
                      width: 40px !important;
                      height: 40px !important;
                    }
                    
                    .quote-section {
                      display: none !important;
                    }
                  }
                `}} />
                <div className="company-grid">
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280', gridColumn: 'span 2' }} data-testid="text-loading">
                    Loading...
                  </div>
                ) : (
                  sortedCompanies.map((c) => {
                    const isUnclaimed = !c.claimed;
                    const isPremium = c.subscriptionTier === 'premium';
                    const isStandard = c.subscriptionTier === 'standard';
                    const isBasic = c.claimed && c.subscriptionTier === 'basic';
                    const hasFullFeatures = isPremium || isStandard;
                    
                    return (
                <div key={c.id} className={hasFullFeatures ? 'full-width-card' : ''} style={{ width: '100%', maxWidth: '100%' }}>
                <div 
                  onClick={!hasFullFeatures ? undefined : (e) => {
                    if ((e.target as HTMLElement).closest('[data-quote-section]')) {
                      return;
                    }
                    trackBusinessEvent(c.id, 'click');
                    setSelectedCompanyId(c.id);
                  }} 
                  id={`company-${c.id}`}
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
                    borderBottom: '2px solid #000',
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
                  {c.badge && !isUnclaimed && (
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
                  
                  {isBasic && (
                    <div style={{
                      background: '#fff3cd',
                      color: '#856404',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}>
                      Free Listing
                    </div>
                  )}

                  
                  {isUnclaimed ? (
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
                  <div className="company-header-section">
                    <div className="logo-info-section" style={{ display: 'flex', gap: '16px', marginBottom: '16px', padding: '0' }}>
                      <div className="company-logo" style={{
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
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={i < Math.floor(parseFloat(isBasic && (!c.reviews || c.reviews === 0) ? "5" : (c.rating || "0"))) ? "#fbbf24" : "none"}
                                stroke="#fbbf24"
                              />
                            ))}
                          </div>
                          <span style={{ fontWeight: '600', fontSize: '16px' }}>{isBasic && (!c.reviews || c.reviews === 0) ? "5.0" : (c.rating || "0")}</span>
                          <span style={{ color: '#000', fontSize: '15px' }}>({isBasic && (!c.reviews || c.reviews === 0) ? 1 : c.reviews})</span>
                        </div>
                      </div>
                    </div>
                    
                    {hasFullFeatures && (
                      <div className="quote-buttons-inline" style={{ display: 'none' }}>
                        <a
                          href={`tel:${c.phone}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${c.phone}`;
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            window.location.href = `tel:${c.phone}`;
                          }}
                          className="quote-button"
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
                            position: 'relative',
                            zIndex: 1,
                          }}
                          data-testid={`button-call-inline-${c.id}`}
                        >
                          <Phone className="quote-icon" size={26} />
                        </a>

                        <a
                          href={`sms:${c.phone}?body=Hi! I'd like to get a quote for junk removal. Here are some photos:`}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `sms:${c.phone}?body=Hi! I'd like to get a quote for junk removal. Here are some photos:`;
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            window.location.href = `sms:${c.phone}?body=Hi! I'd like to get a quote for junk removal. Here are some photos:`;
                          }}
                          className="quote-button"
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
                            position: 'relative',
                            zIndex: 1,
                          }}
                          data-testid={`button-send-photos-inline-${c.id}`}
                        >
                          <Camera className="quote-icon" size={26} />
                        </a>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            trackBusinessEvent(c.id, 'book_quote');
                            setExpandedQuote(expandedQuote === c.id ? null : c.id);
                          }}
                          className="quote-button"
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
                          data-testid={`button-in-person-inline-${c.id}`}
                        >
                          <FileText className="quote-icon" size={26} />
                        </button>
                      </div>
                    )}

                  </div>
                  )}
                  
                  {isBasic && (
                    <div style={{ marginTop: '16px' }}>
                      <a href={`tel:${c.phone}`} style={{ textDecoration: 'none' }}>
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                          data-testid={`button-call-${c.id}`}
                        >
                          <Phone size={18} />
                          Call Now
                        </button>
                      </a>
                      <div style={{
                        background: '#f5f5f5',
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#666',
                        textAlign: 'center',
                      }}>
                        Upgrade to show photos, videos, and get more leads!
                      </div>
                    </div>
                  )}
                  
                  {hasFullFeatures && ((c.galleryImages && c.galleryImages.length > 0) || c.logoUrl || c.reviews > 0) && (
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
                        const hasGallery = c.galleryImages && c.galleryImages.length > 0;
                        const hasLogo = c.logoUrl;
                        const hasReviews = c.reviews > 0;
                        
                        let imagesToShow: (string | number)[] = [];
                        
                        if (hasGallery) {
                          imagesToShow = [...c.galleryImages!, ...c.galleryImages!, ...c.galleryImages!];
                        } else if (hasLogo || hasReviews) {
                          imagesToShow = [...defaultImages, ...defaultImages, ...defaultImages];
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
                  
                  {hasFullFeatures && (
                  <div 
                    data-quote-section="true"
                    className="quote-section"
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
                    <h4 className="quote-title" style={{
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
                      <a
                        href={`tel:${c.phone}`}
                        onClick={() => {
                          window.location.href = `tel:${c.phone}`;
                        }}
                        onTouchStart={() => {
                          window.location.href = `tel:${c.phone}`;
                        }}
                        className="quote-button"
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
                          position: 'relative',
                          zIndex: 9999,
                        }}
                        data-testid={`button-call-${c.id}`}
                      >
                        <Phone className="quote-icon" size={26} />
                      </a>

                      <a
                        href={`sms:${c.phone}?body=Hi! I'd like to get a quote for junk removal. Here are some photos:`}
                        onClick={() => {
                          window.location.href = `sms:${c.phone}?body=Hi! I'd like to get a quote for junk removal. Here are some photos:`;
                        }}
                        onTouchStart={() => {
                          window.location.href = `sms:${c.phone}?body=Hi! I'd like to get a quote for junk removal. Here are some photos:`;
                        }}
                        className="quote-button"
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
                          position: 'relative',
                          zIndex: 9999,
                        }}
                        data-testid={`button-send-photos-${c.id}`}
                      >
                        <Camera className="quote-icon" size={26} />
                      </a>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          trackBusinessEvent(c.id, 'book_quote');
                          setExpandedQuote(expandedQuote === c.id ? null : c.id);
                        }}
                        className="quote-button"
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
                        <FileText className="quote-icon" size={26} />
                      </button>
                    </div>

                  </div>
                  )}
                  
                  {hasFullFeatures && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '12px 0 8px 0',
                      marginTop: '8px',
                    }}>
                      <ChevronDown 
                        size={24} 
                        color="#000"
                        style={{ opacity: 0.5 }}
                        data-testid={`icon-expand-${c.id}`}
                      />
                    </div>
                  )}
                </div>
                {expandedQuote === c.id && hasFullFeatures && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      backgroundColor: '#fffbeb',
                      padding: '16px',
                      borderRadius: '0',
                      border: '3px solid #fbbf24',
                      borderTop: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}>
                    <QuoteRequestForm
                      companyId={c.id}
                      companyName={c.name}
                      onCancel={() => setExpandedQuote(null)}
                    />
                  </div>
                )}
                </div>
                  );
                  })
                )}
                </div>
            </div>
          </div>

          <aside className="city-sidebar">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0' }}>
              <EstimateBuilderInline />
                  
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
                  info@findlocaljunkpros.com
                </p>
              </div>

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
                  info@findlocaljunkpros.com
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
    </>
  );
}

export default CityPage;
