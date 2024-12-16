import React from 'react';
import { Edit, Trash } from 'lucide-react';

interface ToolCardProps {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  favicon: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUse: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ 
  id, name, url, description, category, favicon, onEdit, onDelete, onUse 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onUse(id);
    window.open(url, '_blank');
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div 
      className="bg-white p-2 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center mb-2">
        <img src={favicon} alt={`${name} favicon`} className="w-6 h-6 mr-2 rounded" />
        <h3 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">{name}</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-700">{category}</span>
        <div className="flex space-x-2">
          <button onClick={handleEdit} className="text-gray-600 hover:text-gray-700">
            <Edit size={16} />
          </button>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-600">
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;

