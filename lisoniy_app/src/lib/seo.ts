export interface SEOData {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
}

/**
 * Truncate text to a specific length for meta descriptions
 */
export function truncateText(text: string, maxLength: number = 160): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Generate dataset structured data (Schema.org Dataset)
 */
export function generateDatasetSchema(dataset: any, baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        name: dataset.name,
        description: dataset.description || `Uzbek ${dataset.type} dataset`,
        url: `${baseUrl}/datasets/${dataset.id}`,
        keywords: [dataset.type, 'uzbek', 'nlp', 'dataset', 'corpus'],
        datePublished: dataset.created_at,
        dateModified: dataset.updated_at,
        creator: {
            '@type': 'Person',
            name: dataset.creator?.full_name || 'Unknown',
        },
        ...(dataset.meta && {
            interactionStatistic: [
                {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/DownloadAction',
                    userInteractionCount: dataset.meta.downloads_count,
                },
                {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/LikeAction',
                    userInteractionCount: dataset.meta.stars_count,
                },
            ],
        }),
    };
}

/**
 * Generate article structured data (Schema.org Article)
 */
export function generateArticleSchema(article: any, baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: truncateText(article.body),
        datePublished: article.created_at,
        dateModified: article.updated_at,
        author: {
            '@type': 'Person',
            name: article.owner?.full_name || 'Unknown',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Lisoniy',
            url: baseUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/hamjamiyat/post/${article.id}`,
        },
    };
}

/**
 * Generate discussion/QA structured data (Schema.org QAPage)
 */
export function generateDiscussionSchema(discussion: any, baseUrl: string, answerCount: number = 0) {
    return {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        mainEntity: {
            '@type': 'Question',
            name: discussion.title,
            text: truncateText(discussion.body),
            answerCount,
            dateCreated: discussion.created_at,
            author: {
                '@type': 'Person',
                name: discussion.owner?.full_name || 'Unknown',
            },
        },
    };
}

/**
 * Generate person/profile structured data (Schema.org Person)
 */
export function generatePersonSchema(user: any, baseUrl: string, slug: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: user.full_name,
        url: `${baseUrl}/hamjamiyat/author/${slug}`,
        email: user.email,
    };
}

/**
 * Generate organization structured data for homepage
 */
export function generateOrganizationSchema(baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Lisoniy',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: 'Uzbek NLP and Language Resources Platform',
        sameAs: [
            // Add social media links here
        ],
    };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[], baseUrl: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
        })),
    };
}

/**
 * Extract plain text from HTML/Markdown for descriptions
 */
export function extractPlainText(html: string): string {
    // Remove markdown formatting
    let text = html
        .replace(/#{1,6}\s/g, '') // Remove headers
        .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.+?)\*/g, '$1') // Remove italic
        .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
        .replace(/`(.+?)`/g, '$1') // Remove code
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();

    return text;
}

/**
 * Generate SEO-friendly URL slug
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove duplicate hyphens
        .trim();
}

/**
 * Get default OG image based on content type
 */
export function getDefaultOGImage(type: 'dataset' | 'article' | 'discussion' | 'profile' | 'default'): string {
    const base = '/og-images';
    switch (type) {
        case 'dataset':
            return `${base}/dataset-default.jpg`;
        case 'article':
            return `${base}/article-default.jpg`;
        case 'discussion':
            return `${base}/discussion-default.jpg`;
        case 'profile':
            return `${base}/profile-default.jpg`;
        default:
            return `${base}/default.jpg`;
    }
}
