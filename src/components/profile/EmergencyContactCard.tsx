import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmergencyContact } from '@/types/patient';
import { Phone, User, Trash2 } from 'lucide-react';

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onDelete?: (id: string) => void;
  readonly?: boolean;
}

export function EmergencyContactCard({ contact, onDelete, readonly = false }: EmergencyContactCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${contact.phone}`;
  };

  return (
    <Card className="p-4 shadow-card hover:shadow-elevated transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-secondary">
            <User className="h-4 w-4 text-secondary-foreground" />
          </div>
          <div>
            <h4 className="font-medium text-foreground">{contact.name}</h4>
            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
            <p className="text-sm text-primary font-medium mt-1">{contact.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={handleCall}
            className="gap-1.5"
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </Button>
          
          {!readonly && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(contact.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
