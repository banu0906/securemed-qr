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
import { EmergencyContact, PatientProfile, StructuredAddress } from '@/types/patient';
import { 
  countries, 
  validatePhone, 
  validateAge, 
  validateName, 
  validateAddress,
  validateEmergencyContact,
  formatAddress
} from '@/lib/validation';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const genders = ['male', 'female', 'other'] as const;

const defaultAddress: StructuredAddress = {
  houseNumber: '',
  street: '',
  city: '',
  state: '',
  country: '',
  zipCode: ''
};

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  // Parse address if it's a string (legacy) or use structured address
  const getInitialAddress = (): StructuredAddress => {
    if (!profile?.address) return defaultAddress;
    if (typeof profile.address === 'string') {
      return { ...defaultAddress, street: profile.address };
    }
    return profile.address;
  };

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
    doctorInfo: profile?.doctorInfo || { name: '', specialty: '', phone: '', hospital: '', countryCode: 'IN' },
    address: getInitialAddress(),
    additionalNotes: profile?.additionalNotes || '',
    phoneNumber: profile?.phoneNumber || '',
    phoneCountry: profile?.phoneCountry || 'IN',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '', countryCode: 'IN' });
  const [contactError, setContactError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.valid) {
      newErrors.name = nameValidation.message;
    }

    // Validate age
    if (formData.age > 0) {
      const ageValidation = validateAge(formData.age);
      if (!ageValidation.valid) {
        newErrors.age = ageValidation.message;
      }
    }

    // Validate phone if provided
    if (formData.phoneNumber) {
      const phoneValidation = validatePhone(formData.phoneNumber, formData.phoneCountry);
      if (!phoneValidation.valid) {
        newErrors.phoneNumber = phoneValidation.message;
      }
    }

    // Validate address
    const addressErrors = validateAddress(formData.address);
    Object.keys(addressErrors).forEach(key => {
      newErrors[`address.${key}`] = addressErrors[key];
    });

    // Validate doctor phone if provided
    if (formData.doctorInfo.phone && formData.doctorInfo.countryCode) {
      const doctorPhoneValidation = validatePhone(formData.doctorInfo.phone, formData.doctorInfo.countryCode);
      if (!doctorPhoneValidation.valid) {
        newErrors.doctorPhone = doctorPhoneValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

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
    if (!newContact.name.trim()) {
      setContactError('Name is required');
      return;
    }
    
    const validation = validateEmergencyContact(
      newContact.phone, 
      newContact.countryCode,
      formData.phoneNumber,
      formData.phoneCountry
    );
    
    if (!validation.valid) {
      setContactError(validation.message);
      return;
    }

    const contact: EmergencyContact = {
      id: Math.random().toString(36).substring(2),
      ...newContact
    };
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, contact]
    }));
    setNewContact({ name: '', relationship: '', phone: '', countryCode: 'IN' });
    setShowContactForm(false);
    setContactError('');
  };

  const removeContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(c => c.id !== id)
    }));
  };

  const updateAddress = (field: keyof StructuredAddress, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
    // Clear error when user types
    if (errors[`address.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`address.${field}`];
        return newErrors;
      });
    }
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
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="John Doe"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }));
                      if (errors.age) setErrors(prev => ({ ...prev, age: '' }));
                    }}
                    placeholder="25"
                    className={errors.age ? 'border-destructive' : ''}
                  />
                  {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
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

              {/* Phone Number with Country */}
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.phoneCountry}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, phoneCountry: value }))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name} ({country.dialCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setFormData(prev => ({ ...prev, phoneNumber: value }));
                      if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
                    }}
                    placeholder="Phone number"
                    className={`flex-1 ${errors.phoneNumber ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber}</p>}
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
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input
                        value={newContact.name}
                        onChange={(e) => {
                          setNewContact(prev => ({ ...prev, name: e.target.value }));
                          setContactError('');
                        }}
                        placeholder="Name *"
                      />
                      <Input
                        value={newContact.relationship}
                        onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                        placeholder="Relationship"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={newContact.countryCode}
                        onValueChange={(value) => {
                          setNewContact(prev => ({ ...prev, countryCode: value }));
                          setContactError('');
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} ({country.dialCode})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={newContact.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '');
                          setNewContact(prev => ({ ...prev, phone: value }));
                          setContactError('');
                        }}
                        placeholder="Phone number *"
                        className="flex-1"
                      />
                    </div>
                    {contactError && <p className="text-xs text-destructive">{contactError}</p>}
                    <div className="flex gap-2">
                      <Button type="button" variant="default" size="sm" onClick={addContact}>
                        Add Contact
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => {
                        setShowContactForm(false);
                        setContactError('');
                      }}>
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
                <div className="space-y-2 sm:col-span-2">
                  <Label>Phone</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.doctorInfo.countryCode || 'IN'}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        doctorInfo: { ...prev.doctorInfo, countryCode: value }
                      }))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name} ({country.dialCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.doctorInfo.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setFormData(prev => ({
                          ...prev,
                          doctorInfo: { ...prev.doctorInfo, phone: value }
                        }));
                        if (errors.doctorPhone) setErrors(prev => ({ ...prev, doctorPhone: '' }));
                      }}
                      placeholder="Phone number"
                      className={`flex-1 ${errors.doctorPhone ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.doctorPhone && <p className="text-xs text-destructive">{errors.doctorPhone}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
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
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>House/Flat Number *</Label>
                  <Input
                    value={formData.address.houseNumber}
                    onChange={(e) => updateAddress('houseNumber', e.target.value)}
                    placeholder="123, Apt 4B"
                    className={errors['address.houseNumber'] ? 'border-destructive' : ''}
                  />
                  {errors['address.houseNumber'] && <p className="text-xs text-destructive">{errors['address.houseNumber']}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Street/Area *</Label>
                  <Input
                    value={formData.address.street}
                    onChange={(e) => updateAddress('street', e.target.value)}
                    placeholder="Main Street, Downtown"
                    className={errors['address.street'] ? 'border-destructive' : ''}
                  />
                  {errors['address.street'] && <p className="text-xs text-destructive">{errors['address.street']}</p>}
                </div>
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    value={formData.address.city}
                    onChange={(e) => updateAddress('city', e.target.value)}
                    placeholder="New York"
                    className={errors['address.city'] ? 'border-destructive' : ''}
                  />
                  {errors['address.city'] && <p className="text-xs text-destructive">{errors['address.city']}</p>}
                </div>
                <div className="space-y-2">
                  <Label>State/Province *</Label>
                  <Input
                    value={formData.address.state}
                    onChange={(e) => updateAddress('state', e.target.value)}
                    placeholder="NY"
                    className={errors['address.state'] ? 'border-destructive' : ''}
                  />
                  {errors['address.state'] && <p className="text-xs text-destructive">{errors['address.state']}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select
                    value={formData.address.country}
                    onValueChange={(value) => updateAddress('country', value)}
                  >
                    <SelectTrigger className={errors['address.country'] ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors['address.country'] && <p className="text-xs text-destructive">{errors['address.country']}</p>}
                </div>
                <div className="space-y-2">
                  <Label>ZIP/Postal Code *</Label>
                  <Input
                    value={formData.address.zipCode}
                    onChange={(e) => updateAddress('zipCode', e.target.value)}
                    placeholder="10001"
                    className={errors['address.zipCode'] ? 'border-destructive' : ''}
                  />
                  {errors['address.zipCode'] && <p className="text-xs text-destructive">{errors['address.zipCode']}</p>}
                </div>
              </div>
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
