import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { TagList } from '@/components/profile/TagList';
import { EmergencyContactCard } from '@/components/profile/EmergencyContactCard';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Save, 
  Plus, 
  User, 
  Heart, 
  AlertTriangle, 
  Pill, 
  Stethoscope,
  Phone,
  MapPin,
  FileText,
  X
} from 'lucide-react';
import { EmergencyContact, PatientProfile } from '@/types/patient';
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const genders = ['male', 'female', 'other'] as const;

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    age: profile?.age || 0,
    gender: profile?.gender || 'other',
    bloodGroup: profile?.bloodGroup || '',
    medicalConditions: profile?.medicalConditions || [],
    allergies: profile?.allergies || [],
    currentMedications: profile?.currentMedications || [],
    pastMedicalHistory: profile?.pastMedicalHistory || '',
    emergencyContacts: profile?.emergencyContacts || [],
    doctorInfo: profile?.doctorInfo || { name: '', specialty: '', phone: '', hospital: '' },
    address: profile?.address || '',
    additionalNotes: profile?.additionalNotes || '',
  });

  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      bloodGroup: formData.bloodGroup as PatientProfile['bloodGroup'],
    });
    toast.success('Profile updated successfully');
    navigate('/dashboard');
  };

  const addItem = (field: 'medicalConditions' | 'allergies' | 'currentMedications', value: string, setValue: (v: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setValue('');
    }
  };

  const removeItem = (field: 'medicalConditions' | 'allergies' | 'currentMedications', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        id: Math.random().toString(36).substring(2),
        ...newContact
      };
      setFormData(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, contact]
      }));
      setNewContact({ name: '', relationship: '', phone: '' });
      setShowContactForm(false);
    }
  };

  const removeContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(c => c.id !== id)
    }));
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
              <p className="text-muted-foreground mt-1">Update your emergency medical information</p>
            </div>
            <Button type="submit" variant="medical" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>

          {/* Basic Information */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '50ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Your personal identification details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="150"
                    value={formData.age || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as typeof genders[number] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, bloodGroup: value as typeof bloodGroups[number] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((bg) => (
                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Conditions */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Medical Conditions
              </CardTitle>
              <CardDescription>Chronic conditions, diseases, or health issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="e.g., Diabetes, Hypertension"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('medicalConditions', newCondition, setNewCondition))}
                />
                <Button type="button" variant="secondary" onClick={() => addItem('medicalConditions', newCondition, setNewCondition)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <TagList
                items={formData.medicalConditions}
                variant="warning"
                onRemove={(index) => removeItem('medicalConditions', index)}
              />
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '150ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Allergies
              </CardTitle>
              <CardDescription>Drug allergies, food allergies, environmental allergies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="e.g., Penicillin, Peanuts"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('allergies', newAllergy, setNewAllergy))}
                />
                <Button type="button" variant="secondary" onClick={() => addItem('allergies', newAllergy, setNewAllergy)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <TagList
                items={formData.allergies}
                variant="destructive"
                onRemove={(index) => removeItem('allergies', index)}
              />
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-success" />
                Current Medications
              </CardTitle>
              <CardDescription>Medicines you are currently taking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="e.g., Metformin 500mg"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('currentMedications', newMedication, setNewMedication))}
                />
                <Button type="button" variant="secondary" onClick={() => addItem('currentMedications', newMedication, setNewMedication)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <TagList
                items={formData.currentMedications}
                variant="success"
                onRemove={(index) => removeItem('currentMedications', index)}
              />
            </CardContent>
          </Card>

          {/* Past Medical History */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '250ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Past Medical History
              </CardTitle>
              <CardDescription>Previous surgeries, hospitalizations, or significant health events</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.pastMedicalHistory}
                onChange={(e) => setFormData(prev => ({ ...prev, pastMedicalHistory: e.target.value }))}
                placeholder="e.g., Appendectomy in 2018, Fractured arm in 2015..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Emergency Contacts
              </CardTitle>
              <CardDescription>People to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.emergencyContacts.length > 0 && (
                <div className="space-y-3">
                  {formData.emergencyContacts.map((contact) => (
                    <EmergencyContactCard
                      key={contact.id}
                      contact={contact}
                      onDelete={removeContact}
                    />
                  ))}
                </div>
              )}

              {showContactForm ? (
                <Card className="p-4 border-dashed">
                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-3 gap-3">
                      <Input
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Name"
                      />
                      <Input
                        value={newContact.relationship}
                        onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                        placeholder="Relationship"
                      />
                      <Input
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="default" size="sm" onClick={addContact}>
                        Add Contact
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowContactForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Button type="button" variant="outline" onClick={() => setShowContactForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Emergency Contact
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Doctor Information */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '350ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Primary Doctor
              </CardTitle>
              <CardDescription>Your primary care physician or specialist</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Doctor's Name</Label>
                  <Input
                    value={formData.doctorInfo.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      doctorInfo: { ...prev.doctorInfo, name: e.target.value }
                    }))}
                    placeholder="Dr. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Specialty</Label>
                  <Input
                    value={formData.doctorInfo.specialty}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      doctorInfo: { ...prev.doctorInfo, specialty: e.target.value }
                    }))}
                    placeholder="General Physician"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.doctorInfo.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      doctorInfo: { ...prev.doctorInfo, phone: e.target.value }
                    }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hospital/Clinic</Label>
                  <Input
                    value={formData.doctorInfo.hospital}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      doctorInfo: { ...prev.doctorInfo, hospital: e.target.value }
                    }))}
                    placeholder="City Medical Center"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Address
              </CardTitle>
              <CardDescription>Your home address</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="123 Main St, Apt 4B, New York, NY 10001"
                rows={2}
              />
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '450ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Additional Notes
              </CardTitle>
              <CardDescription>Any other important information for emergency responders</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="e.g., DNR order, organ donor, special instructions..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" variant="medical" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
