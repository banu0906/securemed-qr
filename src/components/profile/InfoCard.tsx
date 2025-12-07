import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface InfoCardProps {
  icon: ReactNode;
  label: string;
  value: string | ReactNode;
  variant?: 'default' | 'highlight' | 'warning';
}

export function InfoCard({ icon, label, value, variant = 'default' }: InfoCardProps) {
  const variantStyles = {
    default: 'bg-card',
    highlight: 'bg-secondary border-primary/20',
    warning: 'bg-warning/10 border-warning/30',
  };

  return (
    <Card className={`p-4 shadow-card ${variantStyles[variant]}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          variant === 'highlight' ? 'bg-primary/10 text-primary' :
          variant === 'warning' ? 'bg-warning/20 text-warning' :
          'bg-muted text-muted-foreground'
        }`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <div className="mt-1 text-sm font-medium text-foreground break-words">{value || '—'}</div>
        </div>
      </div>
    </Card>
  );
}
