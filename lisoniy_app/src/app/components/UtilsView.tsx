import { useState } from 'react';
import { Type, CheckCircle, Tag, ArrowRightLeft } from 'lucide-react';

const tools = [
  {
    id: 'transliteration',
    name: 'Cyrillic-Latin Transliteration',
    icon: ArrowRightLeft,
    description: 'Convert between Cyrillic and Latin scripts',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'spellcheck',
    name: 'Uzbek Spellchecker',
    icon: CheckCircle,
    description: 'Check spelling and suggest corrections',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'ner',
    name: 'NER Visualizer',
    icon: Tag,
    description: 'Visualize named entities in text',
    color: 'from-purple-500 to-purple-600'
  }
];

export function UtilsView() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [translitInput, setTranslitInput] = useState('');
  const [translitOutput, setTranslitOutput] = useState('');
  const [spellcheckInput, setSpellcheckInput] = useState('');
  const [nerInput, setNerInput] = useState('Toshkent shahrida Alisher Navoiy nomli teatr joylashgan.');

  const handleTransliterate = () => {
    // Simple mock transliteration (Cyrillic to Latin)
    const mapping: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'j', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'ъ': '\'', 'ы': 'i',
      'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ў': 'o\'', 'қ': 'q', 'ғ': 'g\'',
      'ҳ': 'h'
    };
    
    let result = '';
    for (const char of translitInput.toLowerCase()) {
      result += mapping[char] || char;
    }
    setTranslitOutput(result);
  };

  const nerEntities = [
    { text: 'Toshkent', type: 'LOCATION', start: 0, end: 8, color: 'bg-blue-200 text-blue-900' },
    { text: 'Alisher Navoiy', type: 'PERSON', start: 19, end: 33, color: 'bg-green-200 text-green-900' },
  ];

  const renderNERText = () => {
    const parts = [];
    let lastIndex = 0;

    // Sort entities by start position
    const sortedEntities = [...nerEntities].sort((a, b) => a.start - b.start);

    sortedEntities.forEach(entity => {
      // Add text before entity
      if (entity.start > lastIndex) {
        parts.push(nerInput.slice(lastIndex, entity.start));
      }
      
      // Add entity with highlight
      parts.push(
        <span key={entity.start} className={`${entity.color} px-2 py-1 rounded inline-flex items-center gap-1 mx-1`}>
          {entity.text}
          <span className="text-xs opacity-70">[{entity.type}]</span>
        </span>
      );
      
      lastIndex = entity.end;
    });

    // Add remaining text
    if (lastIndex < nerInput.length) {
      parts.push(nerInput.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl text-[#1e293b] mb-2">Linguistic Utilities</h2>
        <p className="text-[#64748b]">Tools for linguistic analysis and processing</p>
      </div>

      {/* Tool Cards Grid */}
      {!activeTool && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className={`h-32 bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-[#1e293b] mb-2">{tool.name}</h3>
                  <p className="text-sm text-[#64748b]">{tool.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transliteration Tool */}
      {activeTool === 'transliteration' && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl text-[#1e293b]">Cyrillic-Latin Transliteration</h3>
            <button
              onClick={() => setActiveTool(null)}
              className="px-4 py-2 text-[#64748b] hover:text-[#1e293b] transition-colors"
            >
              ← Back to Tools
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#64748b] mb-2">Input (Cyrillic)</label>
              <textarea
                value={translitInput}
                onChange={(e) => setTranslitInput(e.target.value)}
                placeholder="Enter Cyrillic text..."
                className="w-full h-64 p-4 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-[#64748b] mb-2">Output (Latin)</label>
              <div className="w-full h-64 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg overflow-auto">
                {translitOutput || <span className="text-[#94a3b8]">Transliterated text will appear here...</span>}
              </div>
            </div>
          </div>

          <button
            onClick={handleTransliterate}
            className="mt-6 px-6 py-3 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors"
          >
            Transliterate
          </button>
        </div>
      )}

      {/* Spellchecker Tool */}
      {activeTool === 'spellcheck' && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl text-[#1e293b]">Uzbek Spellchecker</h3>
            <button
              onClick={() => setActiveTool(null)}
              className="px-4 py-2 text-[#64748b] hover:text-[#1e293b] transition-colors"
            >
              ← Back to Tools
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-[#64748b] mb-2">Enter text to check</label>
            <textarea
              value={spellcheckInput}
              onChange={(e) => setSpellcheckInput(e.target.value)}
              placeholder="Type or paste Uzbek text here..."
              className="w-full h-64 p-4 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] resize-none"
            />
          </div>

          <button className="px-6 py-3 bg-[#0f172a] text-white rounded-lg hover:bg-[#1e293b] transition-colors">
            Check Spelling
          </button>

          {spellcheckInput && (
            <div className="mt-6 p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
              <div className="text-sm text-[#64748b] mb-2">Analysis:</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">No spelling errors detected</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NER Visualizer Tool */}
      {activeTool === 'ner' && (
        <div className="bg-white rounded-lg border border-[#e2e8f0] p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl text-[#1e293b]">NER Visualizer</h3>
            <button
              onClick={() => setActiveTool(null)}
              className="px-4 py-2 text-[#64748b] hover:text-[#1e293b] transition-colors"
            >
              ← Back to Tools
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-[#64748b] mb-2">Enter text for entity recognition</label>
            <textarea
              value={nerInput}
              onChange={(e) => setNerInput(e.target.value)}
              placeholder="Enter text to identify named entities..."
              className="w-full h-32 p-4 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f172a] resize-none"
            />
          </div>

          <div className="mb-6">
            <div className="text-sm text-[#64748b] mb-3">Detected Entities:</div>
            <div className="p-6 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] leading-relaxed text-lg">
              {renderNERText()}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-200 rounded"></span>
              <span className="text-[#64748b]">Location</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-200 rounded"></span>
              <span className="text-[#64748b]">Person</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-yellow-200 rounded"></span>
              <span className="text-[#64748b]">Organization</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
