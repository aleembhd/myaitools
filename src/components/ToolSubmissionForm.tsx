import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tool } from '../types';

interface ToolSubmissionFormProps {
  onNewTool: (tool: Tool) => void;
}

const initialCategories = [
  'Code Generation',
  'Code Analysis',
  'Testing',
  'DevOps',
  'Documentation'
];

const ToolSubmissionForm: React.FC<ToolSubmissionFormProps> = ({ onNewTool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Try to create a valid URL from the input
    let validUrl = url;
    try {
      // If URL doesn't start with protocol, add https://
      if (!/^https?:\/\//i.test(url)) {
        validUrl = 'https://' + url;
      }
      // Test if it's a valid URL
      new URL(validUrl);
    } catch (err) {
      alert('Please enter a valid URL');
      return;
    }

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${validUrl}&sz=128`;

    const newTool: Tool = {
      id: Date.now().toString(),
      name,
      url: validUrl, // Use the validated URL
      description,
      category: category === 'custom' ? customCategory : category,
      favicon: faviconUrl,
      dateAdded: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };

    onNewTool(newTool);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsOpen(false);
    setName('');
    setUrl('');
    setDescription('');
    setCategory('');
    setCustomCategory('');
  };

  return (
    <div className="mb-8">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-full p-3 rounded-lg 
            bg-gradient-to-r from-blue-600 to-blue-700 text-white 
            hover:from-blue-700 hover:to-blue-800 
            transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={22} className="mr-2" strokeWidth={2.5} />
          <span className="font-semibold tracking-wide">Add New AI Tool</span>
        </button>
      )}
      {isOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Tool</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Tool Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200"
              required
            />
            <input
              type="url"
              placeholder="Tool URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200"
              required
            />
            <textarea
              placeholder="Short Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 100))}
              maxLength={100}
              className="w-full p-3 rounded-lg border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200 min-h-[100px] resize-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-200 bg-white"
              required
            >
              <option value="">Select Category</option>
              {initialCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="custom">Add Custom Category</option>
            </select>
            {category === 'custom' && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  transition-all duration-200"
                required
              />
            )}
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium
                hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium
                hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ToolSubmissionForm;

