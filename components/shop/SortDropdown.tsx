"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';


interface SortDropdownProps {
  currentSort: string;
  categorySlug: string;
}

export default function SortDropdown({ currentSort, categorySlug }: SortDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'default', label: 'Sort by: Default' },
    { value: 'price-low-high', label: 'Sort by: Price (Low to High)' },
    { value: 'price-high-low', label: 'Sort by: Price (High to Low)' },
    { value: 'name-a-z', label: 'Sort by: Name (A-Z)' },
    { value: 'name-z-a', label: 'Sort by: Name (Z-A)' },
  ];

  const currentOption = sortOptions.find(option => option.value === currentSort) || sortOptions[0];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams();
    if (value !== 'default') {
      params.set('sort', value);
    }
    
    const queryString = params.toString();
    const url = `/shop/${categorySlug}${queryString ? `?${queryString}` : ''}`;
    
    router.push(url);
    setIsOpen(false);
  };

  return (
    <div className="relative font-argesta">
      {/* Dropdown Button */}
      <button
        className="flex items-center gap-2 justify-between w-56 md:w-auto px-4 py-2 text-sm font-argesta bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-argesta">{currentOption.label}</span>
        <svg
          className={`w-4 h-4 transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg font-argesta">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full px-4 py-2 text-sm text-left font-argesta hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                option.value === currentSort ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 