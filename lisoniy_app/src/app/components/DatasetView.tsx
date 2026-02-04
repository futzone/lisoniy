import { useState } from 'react';
import { Search, Filter, Download, ChevronDown, ChevronRight } from 'lucide-react';

interface DataEntry {
  id: number;
  keyword: string;
  type: string;
  date: string;
  language: string;
  status: string;
  jsonData: Record<string, any>;
}

const mockData: DataEntry[] = [
  {
    id: 1,
    keyword: 'олма',
    type: 'Translation',
    date: '2025-01-25',
    language: 'Uzbek',
    status: 'verified',
    jsonData: {
      source: 'олма',
      target: 'apple',
      context: 'fruit',
      phonetic: '/ɑlmɑ/',
      examples: ['Олма емоқ - eat an apple', 'Қизил олма - red apple']
    }
  },
  {
    id: 2,
    keyword: 'сўз',
    type: 'Phonetic',
    date: '2025-01-24',
    language: 'Uzbek',
    status: 'pending',
    jsonData: {
      word: 'сўз',
      ipa: '/sʊz/',
      stress: 'initial',
      syllables: ['сўз'],
      variants: ['so\'z']
    }
  },
  {
    id: 3,
    keyword: 'Tashkent',
    type: 'NER',
    date: '2025-01-23',
    language: 'English',
    status: 'verified',
    jsonData: {
      entity: 'Tashkent',
      type: 'LOCATION',
      confidence: 0.98,
      coordinates: { lat: 41.2995, lon: 69.2401 },
      aliases: ['Ташкент', 'Toshkent']
    }
  },
  {
    id: 4,
    keyword: 'ёзмоқ',
    type: 'Grammar',
    date: '2025-01-22',
    language: 'Uzbek',
    status: 'verified',
    jsonData: {
      infinitive: 'ёзмоқ',
      meaning: 'to write',
      conjugations: {
        present: 'ёзяпман',
        past: 'ёздим',
        future: 'ёзаман'
      },
      aspectType: 'imperfective'
    }
  },
  {
    id: 5,
    keyword: 'algorithm',
    type: 'Terminology',
    date: '2025-01-21',
    language: 'English',
    status: 'pending',
    jsonData: {
      term: 'algorithm',
      field: 'computer science',
      uzbekTranslation: 'алгоритм',
      definition: 'A step-by-step procedure for solving a problem',
      relatedTerms: ['data structure', 'programming', 'logic']
    }
  }
];

export function DatasetView() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const toggleRow = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const filteredData = mockData.filter(entry => {
    const matchesSearch = entry.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || entry.type === typeFilter;
    const matchesLanguage = languageFilter === 'all' || entry.language === languageFilter;
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    return matchesSearch && matchesType && matchesLanguage && matchesStatus;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl text-[#1e293b] mb-2">Dataset Explorer</h2>
        <p className="text-[#64748b]">Browse and manage linguistic datasets</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            />
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            >
              <option value="all">All Types</option>
              <option value="Translation">Translation</option>
              <option value="Phonetic">Phonetic</option>
              <option value="NER">NER</option>
              <option value="Grammar">Grammar</option>
              <option value="Terminology">Terminology</option>
            </select>

            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            >
              <option value="all">All Languages</option>
              <option value="Uzbek">Uzbek</option>
              <option value="English">English</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {selectedRows.length > 0 && (
        <div className="bg-[#0f172a] text-white rounded-lg p-4 mb-6 flex items-center justify-between">
          <span>{selectedRows.length} items selected</span>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#1e293b] rounded-lg hover:bg-[#334155] transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export JSONL
            </button>
            <button className="px-4 py-2 bg-[#1e293b] rounded-lg hover:bg-[#334155] transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-[#cbd5e1]"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(filteredData.map(d => d.id));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm text-[#64748b]">ID</th>
                <th className="px-6 py-4 text-left text-sm text-[#64748b]">Keyword</th>
                <th className="px-6 py-4 text-left text-sm text-[#64748b]">Type</th>
                <th className="px-6 py-4 text-left text-sm text-[#64748b]">Language</th>
                <th className="px-6 py-4 text-left text-sm text-[#64748b]">Status</th>
                <th className="px-6 py-4 text-left text-sm text-[#64748b]">Date</th>
                <th className="px-6 py-4 text-left text-sm text-[#64748b]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry) => (
                <>
                  <tr key={entry.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(entry.id)}
                        onChange={() => toggleSelectRow(entry.id)}
                        className="rounded border-[#cbd5e1]"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748b]">{entry.id}</td>
                    <td className="px-6 py-4 text-[#1e293b]">{entry.keyword}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#f1f5f9] text-[#0f172a] rounded text-sm">
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748b]">{entry.language}</td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-2 py-1 rounded text-sm
                        ${entry.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                      `}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748b]">{entry.date}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRow(entry.id)}
                        className="text-[#0f172a] hover:text-[#3b82f6] transition-colors"
                      >
                        {expandedRows.includes(entry.id) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.includes(entry.id) && (
                    <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="bg-white rounded-lg p-4 border border-[#e2e8f0]">
                          <div className="text-sm text-[#64748b] mb-2">JSONB Data:</div>
                          <pre className="text-xs bg-[#f1f5f9] p-4 rounded overflow-x-auto text-[#1e293b]">
                            {JSON.stringify(entry.jsonData, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Info */}
      <div className="mt-4 text-sm text-[#64748b]">
        Showing {filteredData.length} of {mockData.length} entries
      </div>
    </div>
  );
}
