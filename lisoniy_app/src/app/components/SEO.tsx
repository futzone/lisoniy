
import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: Record<string, any>;
}

export function SEO({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to set/update meta tag
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    if (keywords.length > 0) {
      setMetaTag('keywords', keywords.join(', '));
    }

    // Open Graph tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type, true);
    
    if (url) {
      setMetaTag('og:url', url, true);
    }
    
    if (image) {
      setMetaTag('og:image', image, true);
    }

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    
    if (image) {
      setMetaTag('twitter:image', image);
    }

    // Article-specific tags
    if (type === 'article') {
      if (author) {
        setMetaTag('article:author', author, true);
      }
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        setMetaTag('article:modified_time', modifiedTime, true);
      }
    }

    // Canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.getElementById('structured-data');
      
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Remove structured data when component unmounts
      const script = document.getElementById('structured-data');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, structuredData]);

  return null; // This component doesn't render anything
}
