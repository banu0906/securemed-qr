import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/card';
import { HeartPulseIcon } from '@/components/icons/MedicalIcons';

interface QRCodeDisplayProps {
  qrCodeId: string;
  patientName: string;
  size?: number;
  showBranding?: boolean;
}

export function QRCodeDisplay({ qrCodeId, patientName, size = 200, showBranding = true }: QRCodeDisplayProps) {
  const profileUrl = `http://localhost:8080/emergency/${qrCodeId}`;

  return (
    <Card className="inline-flex flex-col items-center p-6 shadow-elevated bg-card">
      {showBranding && (
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-md medical-gradient">
            <HeartPulseIcon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-medium text-sm text-foreground">Emergency Profile</span>
        </div>
      )}
      
      <div className="p-4 bg-background rounded-xl border-2 border-primary/20">
        <QRCodeSVG
          value={profileUrl}
          size={size}
          level="H"
          includeMargin={false}
          bgColor="transparent"
          fgColor="hsl(205, 85%, 35%)"
        />
      </div>

      {showBranding && (
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-foreground">{patientName}</p>
          <p className="text-xs text-muted-foreground mt-1">Scan for emergency info</p>
        </div>
      )}
    </Card>
  );
}
