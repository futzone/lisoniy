import { FileText, Calendar, User, Eye } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Turkic Language Patterns: A Comprehensive Analysis',
    author: 'Madina S.',
    date: '2025-01-20',
    readTime: '12 min read',
    views: 1245,
    excerpt: 'An in-depth exploration of common grammatical patterns across Turkic languages, with special focus on Uzbek, Kazakh, and Turkish...',
    tags: ['linguistics', 'turkic', 'grammar'],
    image: true
  },
  {
    id: 2,
    title: 'Machine Learning Approaches to NER in Low-Resource Languages',
    author: 'Javohir M.',
    date: '2025-01-18',
    readTime: '15 min read',
    views: 892,
    excerpt: 'This paper discusses novel approaches to Named Entity Recognition in languages with limited training data, focusing on transfer learning techniques...',
    tags: ['NER', 'machine-learning', 'AI'],
    image: false
  },
  {
    id: 3,
    title: 'The Evolution of Uzbek Orthography',
    author: 'Alisher K.',
    date: '2025-01-15',
    readTime: '8 min read',
    views: 2104,
    excerpt: 'A historical overview of how Uzbek writing systems have evolved from Arabic script to Latin alphabet, examining the linguistic and political factors...',
    tags: ['history', 'orthography', 'uzbek'],
    image: true
  },
  {
    id: 4,
    title: 'Best Practices for Linguistic Dataset Curation',
    author: 'Dilnoza A.',
    date: '2025-01-12',
    readTime: '10 min read',
    views: 1567,
    excerpt: 'A practical guide to creating high-quality linguistic datasets, covering annotation guidelines, quality control, and community contribution workflows...',
    tags: ['datasets', 'methodology', 'best-practices'],
    image: false
  }
];

export function ArticlesView() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl text-[#1e293b] mb-2">Articles & Research</h2>
        <p className="text-[#64748b]">Scholarly articles and research papers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            {article.image && (
              <div className="h-48 bg-gradient-to-br from-[#0f172a] to-[#3b82f6]"></div>
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-[#f1f5f9] text-[#0f172a] rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h3 className="text-xl text-[#1e293b] mb-3 leading-tight hover:text-[#3b82f6] transition-colors">
                {article.title}
              </h3>
              
              <p className="text-[#64748b] text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#e2e8f0]">
                <div className="flex items-center gap-4 text-xs text-[#64748b]">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-[#64748b]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.views}
                  </span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="px-6 py-3 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors">
          Load More Articles
        </button>
      </div>
    </div>
  );
}
