import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay';
import { InfoCard } from '@/components/profile/InfoCard';
import { TagList } from '@/components/profile/TagList';
import { EmergencyContactCard } from '@/components/profile/EmergencyContactCard';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HeartPulseIcon, 
  BloodDropIcon, 
  PillIcon,
  StethoscopeIcon,
  ShieldCheckIcon 
} from '@/components/icons/MedicalIcons';
import { 
  User, 
  Calendar, 
  Edit, 
  QrCode, 
  AlertTriangle,
  Phone,
  MapPin
} from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();

  if (!profile) return null;

  const isProfileComplete = profile.name && profile.age > 0 && profile.bloodGroup;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Hello, {profile.name || 'Patient'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Your emergency medical profile
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/profile">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
            <Button variant="medical" asChild>
              <Link to="/qr-code">
                <QrCode className="h-4 w-4 mr-2" />
                View QR Code
              </Link>
            </Button>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {!isProfileComplete && (
          <Card className="border-warning/50 bg-warning/5 animate-slide-up">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Complete Your Profile</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add your medical information so emergency responders can help you quickly.
                  </p>
                  <Button variant="warning" size="sm" className="mt-3" asChild>
                    <Link to="/profile">Complete Profile</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - QR Code */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-elevated animate-slide-up" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <QrCode className="h-5 w-5 text-primary" />
                  Your QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <QRCodeDisplay 
                  qrCodeId={profile.qrCodeId} 
                  patientName={profile.name || 'Patient'}
                  size={180}
                />
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Share this QR code with emergency responders
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/qr-code">Full Screen</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <Card className="bg-secondary/30 border-primary/20 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ShieldCheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Secure Profile</p>
                    <p className="text-xs text-muted-foreground">
                      Only accessible via QR code
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Patient Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card className="shadow-card animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoCard
                    icon={<User className="h-4 w-4" />}
                    label="Full Name"
                    value={profile.name}
                    variant="highlight"
                  />
                  <InfoCard
                    icon={<Calendar className="h-4 w-4" />}
                    label="Age"
                    value={profile.age > 0 ? `${profile.age} years` : ''}
                  />
                  <InfoCard
                    icon={<User className="h-4 w-4" />}
                    label="Gender"
                    value={profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : ''}
                  />
                  <InfoCard
                    icon={<BloodDropIcon className="h-4 w-4" />}
                    label="Blood Group"
                    value={profile.bloodGroup}
                    variant={profile.bloodGroup ? 'highlight' : 'default'}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medical Info */}
            <Card className="shadow-card animate-slide-up" style={{ animationDelay: '250ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HeartPulseIcon className="h-5 w-5 text-primary" />
                  Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Medical Conditions
                  </p>
                  <TagList 
                    items={profile.medicalConditions} 
                    variant="warning"
                    emptyMessage="No conditions listed"
                  />
                </div>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Allergies
                  </p>
                  <TagList 
                    items={profile.allergies} 
                    variant="destructive"
                    emptyMessage="No allergies listed"
                  />
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Current Medications
                  </p>
                  <TagList 
                    items={profile.currentMedications} 
                    variant="success"
                    emptyMessage="No medications listed"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="shadow-card animate-slide-up" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.emergencyContacts.length > 0 ? (
                  <div className="space-y-3">
                    {profile.emergencyContacts.map((contact) => (
                      <EmergencyContactCard 
                        key={contact.id} 
                        contact={contact}
                        readonly
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Phone className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No emergency contacts added</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link to="/profile">Add Contact</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Doctor & Address */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="shadow-card animate-slide-up" style={{ animationDelay: '350ms' }}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <StethoscopeIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Primary Doctor
                      </p>
                      {profile.doctorInfo.name ? (
                        <div className="mt-1">
                          <p className="font-medium text-foreground">{profile.doctorInfo.name}</p>
                          <p className="text-sm text-muted-foreground">{profile.doctorInfo.specialty}</p>
                          {profile.doctorInfo.phone && (
                            <a 
                              href={`tel:${profile.doctorInfo.phone}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {profile.doctorInfo.phone}
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">Not specified</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card animate-slide-up" style={{ animationDelay: '400ms' }}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Address
                      </p>
                      <p className="text-sm text-foreground mt-1 break-words">
                        {profile.address || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
