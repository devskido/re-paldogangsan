import CategoryTag from './CategoryTag';

interface TagCloudProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  selectedCategories?: Set<string>;
  onCategoryClick?: (category: string) => void;
  maxTags?: number;
}

export default function TagCloud({
  categories,
  categoryCounts,
  selectedCategories = new Set(),
  onCategoryClick,
  maxTags = 50
}: TagCloudProps) {
  // Calculate size based on count
  const getTagSize = (count: number): 'sm' | 'md' | 'lg' => {
    const maxCount = Math.max(...Object.values(categoryCounts));
    const ratio = count / maxCount;
    
    if (ratio > 0.7) return 'lg';
    if (ratio > 0.3) return 'md';
    return 'sm';
  };

  // Limit categories if maxTags is set
  const displayCategories = categories.slice(0, maxTags);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {displayCategories.map(category => (
        <CategoryTag
          key={category}
          category={category}
          count={categoryCounts[category]}
          isSelected={selectedCategories.has(category)}
          onRemove={onCategoryClick ? () => onCategoryClick(category) : undefined}
          size={getTagSize(categoryCounts[category])}
        />
      ))}
      
      {categories.length > maxTags && (
        <span className="text-sm text-gray-500 ml-2">
          +{categories.length - maxTags} more
        </span>
      )}
    </div>
  );
}