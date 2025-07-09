import { X } from 'lucide-react';
import Link from 'next/link';

interface CategoryTagProps {
  category: string;
  count?: number;
  isSelected?: boolean;
  onRemove?: () => void;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CategoryTag({
  category,
  count,
  isSelected = false,
  onRemove,
  href,
  size = 'md'
}: CategoryTagProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const baseClasses = `
    inline-flex items-center gap-1.5 rounded-full font-medium transition-all
    ${sizeClasses[size]}
    ${isSelected 
      ? 'bg-blue-600 text-white hover:bg-blue-700' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }
  `;

  const content = (
    <>
      <span>{category}</span>
      {count !== undefined && (
        <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} opacity-75`}>
          ({count})
        </span>
      )}
      {isSelected && onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-blue-500 rounded-full p-0.5"
          aria-label={`Remove ${category} filter`}
        >
          <X className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
        </button>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  if (onRemove) {
    return (
      <button onClick={onRemove} className={baseClasses}>
        {content}
      </button>
    );
  }

  return (
    <span className={baseClasses}>
      {content}
    </span>
  );
}