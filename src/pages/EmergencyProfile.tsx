import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoCard } from '@/components/profile/InfoCard';
import { TagList } from '@/components/profile/TagList';
import { PatientProfile } from '@/types/patient';
import { 
  HeartPulseIcon, 
  BloodDropIcon, 
  StethoscopeIcon,
  ShieldCheckIcon 
} from '@/components/icons/MedicalIcons';
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  AlertTriangle,
  Pill,
  FileText,
  ExternalLink
} from 'lucide-react';

export default function EmergencyProfile() {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Search for profile by QR code ID
    const findProfile = () => {
      const users = JSON.parse(localStorage.getItem('ice_users') || '{}');
      
      for (const email of Object.keys(users)) {
        const userId = users[email].id;
        const savedProfile = localStorage.getItem(`ice_profile_${userId}`);
        
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          if (profileData.qrCodeId === qrCodeId) {
            setProfile(profileData);
            setIsLoading(false);
            return;
          }
        }
      }
      
      setNotFound(true);
      setIsLoading(false);
    };

    if (qrCodeId) {
      findProfile();
    }
  }, [qrCodeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background medical-gradient-soft">
        <div className="text-center animate-pulse-gentle">
          <HeartPulseIcon className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading emergency profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full shadow-elevated">
          <CardContent className="py-8 text-center">
            <div className="p-4 rounded-full bg-destructive/10 inline-block mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Profile Not Found</h1>
            <p className="text-muted-foreground">
              This emergency profile could not be found. The QR code may be invalid or the profile may have been deleted.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="medical-gradient py-4 px-4 shadow-medical">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-foreground/20">
              <HeartPulseIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-primary-foreground">Emergency Medical Profile</h1>
              <p className="text-xs text-primary-foreground/80">QuickAid - In Case of Emergency</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-primary-foreground/80" />
            <span className="text-xs text-primary-foreground/80">Verified</span>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Patient Name Banner */}
        <Card className="shadow-elevated bg-card border-primary/20 animate-slide-up">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full medical-gradient shadow-medical">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{profile.name || 'Patient'}</h2>
                <div className="flex flex-wrap gap-3 mt-2">
                  {profile.age > 0 && (
                    <span className="text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {profile.age} years
                    </span>
                  )}
                  {profile.gender && (
                    <span className="text-sm text-muted-foreground">
                      {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                    </span>
                  )}
                  {profile.bloodGroup && (
                    <span className="text-sm font-medium text-destructive">
                      <BloodDropIcon className="h-4 w-4 inline mr-1" />
                      {profile.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Info - Allergies */}
        {profile.allergies.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5 shadow-card animate-slide-up" style={{ animationDelay: '50ms' }}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-destructive text-lg">
                <AlertTriangle className="h-5 w-5" />
                ALLERGIES - CRITICAL
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TagList items={profile.allergies} variant="destructive" />
            </CardContent>
          </Card>
        )}

        {/* Medical Conditions */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HeartPulseIcon className="h-5 w-5 text-primary" />
              Medical Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.medicalConditions.length > 0 ? (
              <TagList items={profile.medicalConditions} variant="warning" />
            ) : (
              <p className="text-sm text-muted-foreground">No conditions listed</p>
            )}
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card className="shadow-card animate-slide-up" style={{ animationDelay: '150ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pill className="h-5 w-5 text-success" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile.currentMedications.length > 0 ? (
              <TagList items={profile.currentMedications} variant="success" />
            ) : (
              <p className="text-sm text-muted-foreground">No medications listed</p>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        {profile.emergencyContacts.length > 0 && (
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                  </div>
                  <Button variant="success" asChild>
                    <a href={`tel:${contact.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Doctor Information */}
        {profile.doctorInfo.name && (
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '250ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <StethoscopeIcon className="h-5 w-5 text-primary" />
                Primary Doctor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{profile.doctorInfo.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.doctorInfo.specialty}</p>
                  {profile.doctorInfo.hospital && (
                    <p className="text-sm text-muted-foreground">{profile.doctorInfo.hospital}</p>
                  )}
                </div>
                {profile.doctorInfo.phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${profile.doctorInfo.phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Past Medical History */}
        {profile.pastMedicalHistory && (
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-wrap">{profile.pastMedicalHistory}</p>
            </CardContent>
          </Card>
        )}

        {/* Address */}
        {profile.address && (
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '350ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{profile.address}</p>
            </CardContent>
          </Card>
        )}

        {/* Additional Notes */}
        {profile.additionalNotes && (
          <Card className="shadow-card border-primary/20 bg-secondary/30 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Additional Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-wrap">{profile.additionalNotes}</p>
            </CardContent>
          </Card>
        )}

        <div className="text-center py-4 text-xs text-muted-foreground">
          <p>This emergency medical profile was created with QuickAid</p>
          <p className="mt-1">Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
          <p className="mt-1">Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
        </div>
      </main>
    </div>
  );
}
