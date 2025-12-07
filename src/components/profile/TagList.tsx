import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TagListProps {
  items: string[];
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  onRemove?: (index: number) => void;
  emptyMessage?: string;
}

export function TagList({ items, variant = 'default', onRemove, emptyMessage = 'None listed' }: TagListProps) {
  if (items.length === 0) {
    return <span className="text-sm text-muted-foreground">{emptyMessage}</span>;
  }

  const variantStyles = {
    default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
    warning: 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20',
    success: 'bg-success/10 text-success border-success/30 hover:bg-success/20',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`${variantStyles[variant]} transition-colors duration-200 ${onRemove ? 'pr-1.5' : ''}`}
        >
          {item}
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="ml-1.5 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}
