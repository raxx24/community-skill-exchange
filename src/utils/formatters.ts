import { SkillCategory, ProficiencyLevel } from '../types';

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function getCategoryBadgeClass(category: SkillCategory): {
  bg: string;
  text: string;
  border: string;
} {
  switch (category) {
    case 'Programming':
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
      };
    case 'Design':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
      };
    case 'Communication':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
      };
    case 'Writing':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'Media':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
      };
    case 'Business':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      };
    case 'Other':
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-300',
      };
  }
}

export function getProficiencyBadgeClass(proficiency: ProficiencyLevel): {
  bg: string;
  text: string;
  dots: number;
} {
  switch (proficiency) {
    case 'Beginner':
      return { bg: 'bg-blue-100 text-blue-800', text: 'text-blue-700', dots: 1 };
    case 'Intermediate':
      return { bg: 'bg-emerald-100 text-emerald-800', text: 'text-emerald-700', dots: 2 };
    case 'Advanced':
      return { bg: 'bg-purple-100 text-purple-800', text: 'text-purple-700', dots: 3 };
    case 'Expert':
      return { bg: 'bg-amber-100 text-amber-900', text: 'text-amber-700', dots: 4 };
  }
}
