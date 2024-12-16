import React, { useState, useEffect } from 'react';
import { Tool } from '../types';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import ToolCard from './ToolCard';
import EditToolForm from './EditToolForm';
import { toast } from 'react-hot-toast';

interface ToolGridProps {
  tools: Tool[];
  setTools: React.Dispatch<React.SetStateAction<Tool[]>>;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, setTools }) => {
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [categories, setCategories] = useState<string[]>([]);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [deletedTool, setDeletedTool] = useState<{ tool: Tool, timeoutId: NodeJS.Timeout } | null>(null);

  const extractCategories = (tools: Tool[]): string[] => {
    const uniqueCategories = new Set(tools.map(tool => tool.category));
    return Array.from(uniqueCategories);
  };

  useEffect(() => {
    const updatedCategories = extractCategories(tools);
    setCategories(updatedCategories);
  }, [tools]);

  useEffect(() => {
    let sorted = [...tools];
    if (selectedCategory) {
      sorted = sorted.filter(tool => tool.category === selectedCategory);
    }
    switch (sortBy) {
      case 'dateAdded':
        sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recentlyUsed':
        sorted.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
        break;
    }
    setFilteredTools(sorted);
  }, [tools, selectedCategory, sortBy]);

  const handleEdit = (id: string) => {
    const toolToEdit = tools.find(tool => tool.id === id);
    if (toolToEdit) {
      setEditingTool(toolToEdit);
    }
  };

  const handleEditSubmit = (editedTool: Tool) => {
    const updatedTools = tools.map(tool => 
      tool.id === editedTool.id ? editedTool : tool
    );
    setTools(updatedTools);
    localStorage.setItem('tools', JSON.stringify(updatedTools));
    setEditingTool(null);
  };

  const handleDelete = async (id: string) => {
    const toolToDelete = tools.find(tool => tool.id === id);
    if (!toolToDelete) return;

    // Remove tool from UI immediately
    setTools(tools.filter(tool => tool.id !== id));

    // Clear any existing undo timeout
    if (deletedTool) {
      clearTimeout(deletedTool.timeoutId);
      // Perform the actual deletion of the previous deleted tool
      await deleteDoc(doc(db, 'tools', deletedTool.tool.id));
    }

    // Set up new undo timeout
    const timeoutId = setTimeout(async () => {
      try {
        await deleteDoc(doc(db, 'tools', id));
        setDeletedTool(null);
      } catch (error) {
        console.error("Error deleting tool: ", error);
        toast.error("Failed to delete tool");
      }
    }, 5000);

    setDeletedTool({ tool: toolToDelete, timeoutId });

    // Show toast with undo button
    toast((t) => (
      <div className="flex items-center gap-2">
        <span>Tool deleted</span>
        <button
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            // Clear the deletion timeout
            clearTimeout(timeoutId);
            // Restore the tool
            setTools(prev => [...prev, toolToDelete]);
            setDeletedTool(null);
            toast.dismiss(t.id);
          }}
        >
          Undo
        </button>
      </div>
    ), {
      duration: 5000,
      position: 'bottom-center',
    });
  };

  const handleToolUse = (id: string) => {
    const updatedTools = tools.map(tool => 
      tool.id === id ? { ...tool, lastUsed: new Date().toISOString() } : tool
    );
    setTools(updatedTools);
    localStorage.setItem('tools', JSON.stringify(updatedTools));
  };

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="dateAdded">Date Added</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="recentlyUsed">Recently Used</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {filteredTools.map((tool) => (
          <ToolCard 
            key={tool.id} 
            {...tool} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onUse={handleToolUse}
          />
        ))}
      </div>
      {editingTool && (
        <EditToolForm
          tool={editingTool}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingTool(null)}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ToolGrid;

