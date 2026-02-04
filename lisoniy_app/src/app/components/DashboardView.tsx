import { TrendingUp, Users, Database, Activity } from 'lucide-react';

const stats = [
  { label: 'Total Entries', value: '15,742', icon: Database, change: '+12%' },
  { label: 'Active Contributors', value: '248', icon: Users, change: '+5%' },
  { label: 'Data Types', value: '8', icon: Activity, change: '0%' },
  { label: 'Monthly Growth', value: '1,234', icon: TrendingUp, change: '+18%' },
];

const recentActivity = [
  { user: 'Alisher K.', action: 'Added 50 new phonetic entries', time: '2 hours ago', type: 'dataset' },
  { user: 'Madina S.', action: 'Published article: "Turkic Language Patterns"', time: '4 hours ago', type: 'article' },
  { user: 'Javohir M.', action: 'Updated NER annotations', time: '6 hours ago', type: 'dataset' },
  { user: 'Dilnoza A.', action: 'Started discussion on transliteration standards', time: '8 hours ago', type: 'forum' },
  { user: 'Sardor B.', action: 'Contributed to spell-checking dataset', time: '1 day ago', type: 'dataset' },
];

export function DashboardView() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl text-[#1e293b] mb-2">Dashboard</h2>
        <p className="text-[#64748b]">Welcome back to the Lisoniy platform</p>
      </div>
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg p-6 border border-[#e2e8f0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#f1f5f9] rounded-lg">
                  <Icon className="w-5 h-5 text-[#0f172a]" />
                </div>
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-[#64748b]'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl text-[#1e293b] mb-1">{stat.value}</div>
              <div className="text-sm text-[#64748b]">{stat.label}</div>
            </div>
          );
        })}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-sm">
        <div className="p-6 border-b border-[#e2e8f0]">
          <h3 className="text-xl text-[#1e293b]">Recent Activity</h3>
        </div>
        <div className="divide-y divide-[#e2e8f0]">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-[#f8fafc] transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#1e293b]">{activity.user}</span>
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full
                      ${activity.type === 'dataset' ? 'bg-blue-100 text-blue-700' : ''}
                      ${activity.type === 'article' ? 'bg-purple-100 text-purple-700' : ''}
                      ${activity.type === 'forum' ? 'bg-green-100 text-green-700' : ''}
                    `}>
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-[#64748b] text-sm">{activity.action}</p>
                </div>
                <span className="text-xs text-[#94a3b8] whitespace-nowrap ml-4">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
