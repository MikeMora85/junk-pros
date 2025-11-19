import { useEffect } from 'react';

// SEO Metadata Types
export interface SEOMetadata {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  keywords?: string;
}

// Update meta tags in document head
export function updateMetaTags(metadata: SEOMetadata) {
  // Update title
  document.title = metadata.title;

  // Helper to set meta tag
  const setMetaTag = (name: string, content: string, property = false) => {
    const attr = property ? 'property' : 'name';
    let element = document.querySelector(`meta[${attr}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Set canonical link
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = `https://findjunkpros.com${metadata.canonical}`;

  // Basic meta tags
  setMetaTag('description', metadata.description);
  if (metadata.keywords) {
    setMetaTag('keywords', metadata.keywords);
  }

  // Open Graph tags
  setMetaTag('og:title', metadata.ogTitle || metadata.title, true);
  setMetaTag('og:description', metadata.ogDescription || metadata.description, true);
  setMetaTag('og:url', `https://findjunkpros.com${metadata.canonical}`, true);
  setMetaTag('og:type', metadata.ogType || 'website', true);
  if (metadata.ogImage) {
    setMetaTag('og:image', metadata.ogImage, true);
  }
  setMetaTag('og:site_name', 'Find Junk Pros', true);

  // Twitter Card tags
  setMetaTag('twitter:card', metadata.twitterCard || 'summary_large_image');
  setMetaTag('twitter:title', metadata.ogTitle || metadata.title);
  setMetaTag('twitter:description', metadata.ogDescription || metadata.description);
  if (metadata.ogImage) {
    setMetaTag('twitter:image', metadata.ogImage);
  }
}

// Hook to update SEO metadata
export function useSEO(metadata: SEOMetadata) {
  useEffect(() => {
    updateMetaTags(metadata);
  }, [metadata.title, metadata.description, metadata.canonical]);
}

// Metadata Builders for each page type

export function buildLandingPageSEO(): SEOMetadata {
  return {
    title: 'Find Junk Pros - Local Junk Removal Companies Nationwide',
    description: 'Find trusted local junk removal companies across all 50 states. Compare pricing, read reviews, and connect with professional junk haulers in your city. No franchises - independent pros only.',
    canonical: '/',
    ogType: 'website',
    keywords: 'junk removal, junk haulers, junk removal companies, local junk removal, professional junk removal',
  };
}

export function buildStatePageSEO(stateName: string, stateSlug: string): SEOMetadata {
  return {
    title: `${stateName} Junk Removal Companies - Find Local Pros | Find Junk Pros`,
    description: `Find professional junk removal companies throughout ${stateName}. Browse trusted local junk haulers, compare pricing tiers, and connect with independent pros serving cities across ${stateName}.`,
    canonical: `/${stateSlug}`,
    ogType: 'website',
    keywords: `${stateName} junk removal, junk removal ${stateName}, junk haulers ${stateName}, local junk removal ${stateName}`,
  };
}

export function buildCityPageSEO(city: string, state: string, stateName: string): SEOMetadata {
  const cityTitle = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    title: `${cityTitle}, ${stateName} Junk Removal - Local Companies & Pricing | Find Junk Pros`,
    description: `Top junk removal companies serving ${cityTitle}, ${stateName}. Compare local pros, view pricing tiers (Premium, Standard, Basic), read reviews, and get quotes from independent junk haulers in ${cityTitle}.`,
    canonical: `/${state}/${city}`,
    ogType: 'website',
    keywords: `${cityTitle} junk removal, junk removal ${cityTitle}, ${cityTitle} junk haulers, junk removal companies ${cityTitle} ${stateName}`,
  };
}

export function buildCompanyPageSEO(
  companyName: string, 
  city: string, 
  state: string, 
  stateName: string,
  description?: string
): SEOMetadata {
  const cityTitle = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const desc = description || `Professional junk removal services in ${cityTitle}, ${stateName}. Contact ${companyName} for fast, reliable junk hauling, cleanouts, and debris removal.`;
  
  return {
    title: `${companyName} - Junk Removal in ${cityTitle}, ${stateName} | Find Junk Pros`,
    description: desc,
    canonical: `/${state}/${city}/${companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    ogType: 'business.business',
    keywords: `${companyName}, ${cityTitle} junk removal, junk haulers ${cityTitle}, ${companyName} reviews`,
  };
}

export function buildServicePageSEO(service: string, title: string, description: string): SEOMetadata {
  return {
    title: `${title} Services - Find Local Pros Nationwide | Find Junk Pros`,
    description: description.slice(0, 160),
    canonical: `/services/${service}`,
    ogType: 'article',
    keywords: `${title}, junk removal services, ${service} removal, professional ${service}`,
  };
}

export function buildItemPageSEO(item: string, title: string, description: string): SEOMetadata {
  return {
    title: `${title} - Find Local Junk Removal Pros | Find Junk Pros`,
    description: description.slice(0, 160),
    canonical: `/items/${item}`,
    ogType: 'article',
    keywords: `${title}, ${item} removal, ${item} disposal, junk removal`,
  };
}

export function buildBlogPageSEO(): SEOMetadata {
  return {
    title: 'Blog - Junk Removal Tips & Guides | Find Junk Pros',
    description: 'Expert tips, guides, and insights about junk removal, cleanouts, and working with local haulers. Learn best practices from industry professionals.',
    canonical: '/blog',
    ogType: 'website',
    keywords: 'junk removal tips, cleanout guides, junk hauling advice',
  };
}

// Schema.org JSON-LD Generators

export interface Company {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  city: string;
  state: string;
  address?: string;
  zipCode?: string;
  description?: string;
  logoUrl?: string;
  rating?: number;
  reviews?: number;
  pricingTier?: string;
}

export function buildLocalBusinessSchema(company: Company) {
  const cityTitle = company.city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://findjunkpros.com/${company.state}/${company.city}/${company.id}`,
    "name": company.name,
    "description": company.description || `Professional junk removal services in ${cityTitle}`,
    "url": `https://findjunkpros.com/${company.state}/${company.city}/${company.id}`,
    "telephone": company.phone,
    "email": company.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": company.address || "",
      "addressLocality": cityTitle,
      "addressRegion": company.state.toUpperCase(),
      "postalCode": company.zipCode || "",
      "addressCountry": "US"
    },
    "image": company.logoUrl,
    "priceRange": company.pricingTier === 'premium' ? '$$$' : company.pricingTier === 'standard' ? '$$' : '$',
    ...(company.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": company.rating,
        "reviewCount": company.reviews || 0,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    "serviceArea": {
      "@type": "City",
      "name": cityTitle
    }
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://findjunkpros.com${item.url}`
    }))
  };
}

export function buildWebPageSchema(title: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": `https://findjunkpros.com${url}`,
    "publisher": {
      "@type": "Organization",
      "name": "Find Junk Pros",
      "url": "https://findjunkpros.com"
    }
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Find Junk Pros",
    "url": "https://findjunkpros.com",
    "logo": "https://findjunkpros.com/logo.png",
    "description": "Nationwide directory connecting customers with local, independent junk removal companies across all 50 US states.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

// Helper to create JSON-LD script tag content
export function getSchemaScriptContent(schema: object): string {
  return JSON.stringify(schema);
}
