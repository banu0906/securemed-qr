export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  countryCode: string;
}

export interface DoctorInfo {
  name: string;
  specialty: string;
  phone: string;
  hospital: string;
  countryCode?: string;
}

export interface StructuredAddress {
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface PatientProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';
  photo?: string;
  medicalConditions: string[];
  allergies: string[];
  currentMedications: string[];
  pastMedicalHistory: string;
  emergencyContacts: EmergencyContact[];
  doctorInfo: DoctorInfo;
  address: string | StructuredAddress;
  additionalNotes: string;
  qrCodeId: string;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber?: string;
  phoneCountry?: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  phoneCountry?: string;
  createdAt: Date;
}
