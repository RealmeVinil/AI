import React from 'react';

interface NewsFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ['All', 'Research', 'Industry', 'Ethics', 'Applications'];

export function NewsFilter({ activeCategory, onCategoryChange }: NewsFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}