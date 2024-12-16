import React, { useState } from 'react';
import { Tool } from '../types';

interface EditToolFormProps {
  tool: Tool;
  onSubmit: (editedTool: Tool) => void;
  onCancel: () => void;
  categories: string[];
}

const EditToolForm: React.FC<EditToolFormProps> = ({ tool, onSubmit, onCancel, categories }) => {
  const [name, setName] = useState(tool.name);
  const [url, setUrl] = useState(tool.url);
  const [description, setDescription] = useState(tool.description);
  const [category, setCategory] = useState(tool.category);
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

    const editedTool: Tool = {
      ...tool,
      name,
      url: validUrl, // Use the validated URL
      description,
      category: category === 'custom' ? customCategory : category,
    };

    onSubmit(editedTool);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto 
      h-full w-full flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Edit AI Tool</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {categories.map((cat) => (
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
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onCancel}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditToolForm;

