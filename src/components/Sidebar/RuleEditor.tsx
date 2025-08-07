import { useState } from 'react';
interface Rule {
  condition: string;
  color: string;
}

export default function RuleEditor() {
  const [inputValue, setInputValue] = useState('');
  const [rules, setRules] = useState<Rule[]>([]);
  const [error, setError] = useState('');

  const handleAddRule = () => {
    // Basic validation
    if (!inputValue.includes('=')) {
      setError('Rule should contain "=" (e.g., "> 30°C = Red")');
      return;
    }

    const [condition, color] = inputValue.split('=').map(part => part.trim());
    
    if (!condition || !color) {
      setError('Both condition and color are required');
      return;
    }

    setRules([...rules, { condition, color }]);
    setInputValue('');
    setError('');
  };

  const handleDeleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 p-4 bg-gray-800/50 rounded-xl">
      <label className="block text-sm font-medium text-gray-300">Color Threshold Rules</label>
      
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="e.g., > 30°C = Red"
        className="w-full p-3 rounded-xl border border-gray-500 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
      />

      <button 
        onClick={handleAddRule}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-transform hover:scale-105 active:scale-95"
      >
        Add Rule
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="mt-4 space-y-2">
        {rules.map((rule, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: rule.color }}
              />
              <span className="text-gray-200">
                {rule.condition} → {rule.color}
              </span>
            </div>
            <button 
              onClick={() => handleDeleteRule(index)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {rules.length > 0 && (
        <button
          onClick={() => {
            // Here you would typically save to a database or state management
            console.log('Rules saved:', rules);
            alert('Rules saved successfully!');
          }}
          className="w-full mt-4 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-transform hover:scale-105 active:scale-95"
        >
          Save All Rules
        </button>
      )}
    </div>
  );
}