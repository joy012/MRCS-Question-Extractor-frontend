import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Predefined color palette for cards
const CARD_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#8B5CF6', // violet
  '#EF4444', // red
  '#06B6D4', // cyan
  '#DC2626', // red-600
  '#F97316', // orange
  '#EC4899', // pink
  '#84CC16', // lime
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#F43F5E', // rose
  '#8B5A2B', // brown
  '#64748B', // slate
  '#059669', // emerald-600
  '#7C3AED', // violet-600
  '#EA580C', // orange-600
  '#BE185D', // pink-600
  '#65A30D', // lime-600
];

// Generate a unique color based on the item's name or ID
export function getCardColor(identifier: string): string {
  // Create a hash from the identifier
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color from the palette
  const index = Math.abs(hash) % CARD_COLORS.length;
  return CARD_COLORS[index];
}

// Get color classes for Tailwind CSS
export function getCardColorClasses(identifier: string): {
  bg: string;
  text: string;
  border: string;
} {
  const color = getCardColor(identifier);
  
  // Map hex colors to Tailwind classes
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    '#3B82F6': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    '#10B981': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    '#F59E0B': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    '#8B5CF6': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    '#EF4444': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    '#06B6D4': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    '#DC2626': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    '#F97316': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    '#EC4899': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    '#84CC16': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
    '#6366F1': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    '#14B8A6': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    '#F43F5E': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    '#8B5A2B': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    '#64748B': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
    '#059669': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    '#7C3AED': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    '#EA580C': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    '#BE185D': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    '#65A30D': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  };
  
  return colorMap[color] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
}
