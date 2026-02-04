import { MessageSquare, TrendingUp, Clock } from 'lucide-react';

const discussions = [
  {
    id: 1,
    title: 'Best practices for Cyrillic-Latin transliteration',
    author: 'Alisher K.',
    replies: 24,
    views: 342,
    time: '2 hours ago',
    tags: ['transliteration', 'standards'],
    isHot: true
  },
  {
    id: 2,
    title: 'How to handle dialectal variations in NER?',
    author: 'Madina S.',
    replies: 15,
    views: 198,
    time: '5 hours ago',
    tags: ['NER', 'dialects'],
    isHot: false
  },
  {
    id: 3,
    title: 'Dataset quality assurance methodologies',
    author: 'Javohir M.',
    replies: 31,
    views: 567,
    time: '1 day ago',
    tags: ['quality', 'methodology'],
    isHot: true
  },
  {
    id: 4,
    title: 'Uzbek phonetic annotation guidelines',
    author: 'Dilnoza A.',
    replies: 12,
    views: 156,
    time: '2 days ago',
    tags: ['phonetics', 'guidelines'],
    isHot: false
  }
];

const trendingTopics = [
  { topic: 'Transliteration Standards', posts: 45 },
  { topic: 'NER Techniques', posts: 38 },
  { topic: 'Dataset Quality', posts: 29 },
  { topic: 'Phonetic Notation', posts: 24 },
];

const topContributors = [
  { name: 'Alisher K.', contributions: 127, avatar: 'AK' },
  { name: 'Madina S.', contributions: 98, avatar: 'MS' },
  { name: 'Javohir M.', contributions: 86, avatar: 'JM' },
  { name: 'Dilnoza A.', contributions: 72, avatar: 'DA' },
];

export function ForumView() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl text-[#1e293b] mb-2">Community Forum</h2>
        <p className="text-[#64748b]">Discuss and collaborate with the community</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Forum Feed */}
        <div className="lg:col-span-2 space-y-4">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-white rounded-lg border border-[#e2e8f0] p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#f1f5f9] rounded-lg">
                  <MessageSquare className="w-5 h-5 text-[#0f172a]" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg text-[#1e293b] hover:text-[#3b82f6] transition-colors">
                      {discussion.title}
                      {discussion.isHot && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          Hot
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-[#64748b] mb-3">
                    <span>by {discussion.author}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {discussion.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {discussion.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-[#f1f5f9] text-[#0f172a] rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 text-sm text-[#64748b]">
                      <span>{discussion.replies} replies</span>
                      <span>{discussion.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button className="w-full py-3 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors">
            Load More Discussions
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
            <h3 className="text-lg text-[#1e293b] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Discussions
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((item) => (
                <div
                  key={item.topic}
                  className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-lg hover:bg-[#f1f5f9] cursor-pointer transition-colors"
                >
                  <span className="text-sm text-[#1e293b]">{item.topic}</span>
                  <span className="text-xs text-[#64748b]">{item.posts} posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
            <h3 className="text-lg text-[#1e293b] mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {topContributors.map((contributor, index) => (
                <div key={contributor.name} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-[#0f172a] text-white rounded-full text-sm">
                    {contributor.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#1e293b]">{contributor.name}</div>
                    <div className="text-xs text-[#64748b]">
                      {contributor.contributions} contributions
                    </div>
                  </div>
                  <div className="text-2xl text-[#94a3b8]">#{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
