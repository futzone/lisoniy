import { User, Mail, MapPin, Calendar, Award, TrendingUp } from 'lucide-react';

const contributionData = [
  { month: 'Jan', count: 23 },
  { month: 'Feb', count: 31 },
  { month: 'Mar', count: 28 },
  { month: 'Apr', count: 35 },
  { month: 'May', count: 42 },
  { month: 'Jun', count: 38 },
  { month: 'Jul', count: 45 },
  { month: 'Aug', count: 51 },
  { month: 'Sep', count: 48 },
  { month: 'Oct', count: 39 },
  { month: 'Nov', count: 44 },
  { month: 'Dec', count: 37 },
];

const uploadedDatasets = [
  { name: 'Uzbek Phonetic Dataset', entries: 1250, date: '2025-01-15', type: 'Phonetic' },
  { name: 'NER Annotations - Locations', entries: 890, date: '2025-01-10', type: 'NER' },
  { name: 'Translation Pairs EN-UZ', entries: 3420, date: '2024-12-28', type: 'Translation' },
  { name: 'Grammar Conjugations', entries: 567, date: '2024-12-15', type: 'Grammar' },
];

const badges = [
  { name: 'Early Adopter', icon: '🌟', description: 'Joined in the first month' },
  { name: 'Dataset Contributor', icon: '📊', description: '1000+ entries contributed' },
  { name: 'Community Helper', icon: '💬', description: '50+ forum replies' },
  { name: 'Quality Guardian', icon: '✓', description: '100+ verified entries' },
];

export function ProfileView() {
  const maxCount = Math.max(...contributionData.map(d => d.count));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl text-[#1e293b] mb-2">My Profile</h2>
        <p className="text-[#64748b]">Manage your profile and view your contributions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-[#0f172a] text-white rounded-full flex items-center justify-center text-3xl mb-4">
                AK
              </div>
              <h3 className="text-xl text-[#1e293b] mb-1">Alisher Karimov</h3>
              <p className="text-sm text-[#64748b]">@alisher_k</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-[#64748b]">
                <Mail className="w-4 h-4" />
                <span>alisher@lisoniy.org</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#64748b]">
                <MapPin className="w-4 h-4" />
                <span>Tashkent, Uzbekistan</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#64748b]">
                <Calendar className="w-4 h-4" />
                <span>Joined January 2024</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#e2e8f0]">
              <div className="text-center">
                <div className="text-2xl text-[#1e293b] mb-1">127</div>
                <div className="text-xs text-[#64748b]">Contributions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-[#1e293b] mb-1">4</div>
                <div className="text-xs text-[#64748b]">Datasets</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mt-6">
            <h3 className="text-lg text-[#1e293b] mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Badges
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex flex-col items-center p-3 bg-[#f8fafc] rounded-lg hover:bg-[#f1f5f9] cursor-pointer transition-colors"
                  title={badge.description}
                >
                  <span className="text-2xl mb-2">{badge.icon}</span>
                  <span className="text-xs text-center text-[#1e293b]">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contribution Heatmap */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
            <h3 className="text-lg text-[#1e293b] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Contribution Activity (2024)
            </h3>
            <div className="flex items-end justify-between gap-2 h-40">
              {contributionData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#3b82f6] rounded-t hover:bg-[#2563eb] transition-colors cursor-pointer"
                    style={{ height: `${(data.count / maxCount) * 100}%` }}
                    title={`${data.month}: ${data.count} contributions`}
                  ></div>
                  <span className="text-xs text-[#64748b]">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Uploaded Datasets */}
          <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
            <h3 className="text-lg text-[#1e293b] mb-4">My Uploaded Datasets</h3>
            <div className="space-y-3">
              {uploadedDatasets.map((dataset) => (
                <div
                  key={dataset.name}
                  className="p-4 bg-[#f8fafc] rounded-lg hover:bg-[#f1f5f9] cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-[#1e293b] mb-1">{dataset.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-[#64748b]">
                        <span>{dataset.entries} entries</span>
                        <span>•</span>
                        <span>{dataset.date}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-white text-[#0f172a] text-xs rounded border border-[#e2e8f0]">
                      {dataset.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
