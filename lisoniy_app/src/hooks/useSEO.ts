import { useEffect } from 'react';

interface UseSEOOptions {
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

/**
 * Custom hook for managing SEO meta tags
 * 
 * @example
 * useSEO({
 *   title: 'My Page Title - Lisoniy',
 *   description: 'Page description',
 *   keywords: ['uzbek', 'nlp'],
 *   structuredData: datasetSchema
 * });
 */
export function useSEO(options: UseSEOOptions) {
    useEffect(() => {
        // Update document title
        document.title = options.title;

        // Set meta tags
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
        setMetaTag('description', options.description);

        if (options.keywords && options.keywords.length > 0) {
            setMetaTag('keywords', options.keywords.join(', '));
        }

        // Open Graph
        setMetaTag('og:title', options.title, true);
        setMetaTag('og:description', options.description, true);
        setMetaTag('og:type', options.type || 'website', true);

        if (options.url) {
            setMetaTag('og:url', options.url, true);
        }

        if (options.image) {
            setMetaTag('og:image', options.image, true);
        }

        // Twitter Card
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:title', options.title);
        setMetaTag('twitter:description', options.description);

        if (options.image) {
            setMetaTag('twitter:image', options.image);
        }

        // Article-specific
        if (options.type === 'article') {
            if (options.author) {
                setMetaTag('article:author', options.author, true);
            }
            if (options.publishedTime) {
                setMetaTag('article:published_time', options.publishedTime, true);
            }
            if (options.modifiedTime) {
                setMetaTag('article:modified_time', options.modifiedTime, true);
            }
        }

        // Canonical URL
        if (options.url) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                document.head.appendChild(canonical);
            }
            canonical.setAttribute('href', options.url);
        }

        // Structured Data
        if (options.structuredData) {
            let script = document.getElementById('structured-data');

            if (!script) {
                script = document.createElement('script');
                script.id = 'structured-data';
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }

            script.textContent = JSON.stringify(options.structuredData);
        }

        // Cleanup
        return () => {
            const script = document.getElementById('structured-data');
            if (script) {
                script.remove();
            }
        };
    }, [options]);
}
