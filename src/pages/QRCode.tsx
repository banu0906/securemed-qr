import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { HeartPulseIcon, ShieldCheckIcon } from '@/components/icons/MedicalIcons';
import { Download, Share2, Maximize2, ArrowLeft, Copy } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRCode() {
  const { profile } = useAuth();
  const qrRef = useRef<HTMLDivElement>(null);

  if (!profile) return null;

  const profileUrl = `${window.location.origin}/emergency/${profile.qrCodeId}`;

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-download canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ice-profile-${profile.name || 'patient'}.png`;
      link.href = url;
      link.click();
      toast.success('QR code downloaded');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Emergency Profile`,
          text: 'Scan this QR code for emergency medical information',
          url: profileUrl,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="animate-fade-in">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 p-3 rounded-xl medical-gradient shadow-medical mb-4">
              <HeartPulseIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Your Emergency QR Code</h1>
            <p className="text-muted-foreground mt-2">
              Share this QR code with emergency responders or add it to your lock screen
            </p>
          </div>

          {/* Main QR Display */}
          <Card className="shadow-elevated animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardContent className="py-8 flex flex-col items-center">
              <div ref={qrRef}>
                <QRCodeDisplay
                  qrCodeId={profile.qrCodeId}
                  patientName={profile.name || 'Patient'}
                  size={250}
                />
              </div>

              {/* Hidden canvas for download */}
              <div id="qr-download" className="hidden">
                <QRCodeCanvas
                  value={profileUrl}
                  size={500}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Button variant="default" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="secondary" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile URL */}
          <Card className="animate-slide-up" style={{ animationDelay: '150ms' }}>
            <CardContent className="py-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Emergency Profile URL
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted p-3 rounded-lg text-foreground break-all">
                  {profileUrl}
                </code>
                <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-secondary/30 border-primary/20 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShieldCheckIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">How to use</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Download the QR code and set it as your lock screen wallpaper</li>
                    <li>• Add a widget with the QR code to your home screen</li>
                    <li>• Print and keep in your wallet or on medical ID bracelet</li>
                    <li>• Share the link with family members and caregivers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Screen Button */}
          <Button variant="medical" size="lg" className="w-full animate-slide-up" style={{ animationDelay: '250ms' }} asChild>
            <Link to={`/emergency/${profile.qrCodeId}`} target="_blank">
              <Maximize2 className="h-4 w-4 mr-2" />
              Preview Emergency Profile
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
