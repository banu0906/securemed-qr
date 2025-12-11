import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PatientProfile } from '@/types/patient';

interface AuthContextType {
  user: User | null;
  profile: PatientProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => void;
  updateProfile: (updates: Partial<PatientProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const createDefaultProfile = (userId: string, name: string): PatientProfile => ({
  id: generateId(),
  userId,
  name,
  age: 0,
  gender: 'other',
  bloodGroup: '',
  medicalConditions: [],
  allergies: [],
  currentMedications: [],
  pastMedicalHistory: '',
  emergencyContacts: [],
  doctorInfo: {
    name: '',
    specialty: '',
    phone: '',
    hospital: '',
    countryCode: 'IN',
  },
  address: {
    houseNumber: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  },
  additionalNotes: '',
  qrCodeId: generateId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  phoneNumber: '',
  phoneCountry: 'IN',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('ice_user');
    const savedProfile = localStorage.getItem('ice_profile');
    
    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser));
      setProfile(JSON.parse(savedProfile));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    // Simulate authentication - in production, this would call an API
    const savedUsers = JSON.parse(localStorage.getItem('ice_users') || '{}');
    const userData = savedUsers[email];
    
    if (!userData) {
      return { error: 'No account found with this email' };
    }
    
    if (userData.password !== password) {
      return { error: 'Incorrect password' };
    }

    const userObj: User = {
      id: userData.id,
      email,
      createdAt: new Date(userData.createdAt),
    };

    const savedProfile = localStorage.getItem(`ice_profile_${userData.id}`);
    const profileObj = savedProfile ? JSON.parse(savedProfile) : createDefaultProfile(userData.id, email.split('@')[0]);

    setUser(userObj);
    setProfile(profileObj);
    localStorage.setItem('ice_user', JSON.stringify(userObj));
    localStorage.setItem('ice_profile', JSON.stringify(profileObj));
    
    // Ensure profile is in qrCodeId mapping
    const profilesByQr = JSON.parse(localStorage.getItem('ice_profiles_by_qr') || '{}');
    profilesByQr[profileObj.qrCodeId] = profileObj;
    localStorage.setItem('ice_profiles_by_qr', JSON.stringify(profilesByQr));

    return {};
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    const savedUsers = JSON.parse(localStorage.getItem('ice_users') || '{}');
    
    if (savedUsers[email]) {
      return { error: 'An account with this email already exists' };
    }

    const userId = generateId();
    const newUser = {
      id: userId,
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    savedUsers[email] = newUser;
    localStorage.setItem('ice_users', JSON.stringify(savedUsers));

    const userObj: User = {
      id: userId,
      email,
      createdAt: new Date(),
    };

    const newProfile = createDefaultProfile(userId, name);
    
    setUser(userObj);
    setProfile(newProfile);
    localStorage.setItem('ice_user', JSON.stringify(userObj));
    localStorage.setItem('ice_profile', JSON.stringify(newProfile));
    localStorage.setItem(`ice_profile_${userId}`, JSON.stringify(newProfile));
    
    // Store profile by qrCodeId for easy lookup
    const profilesByQr = JSON.parse(localStorage.getItem('ice_profiles_by_qr') || '{}');
    profilesByQr[newProfile.qrCodeId] = newProfile;
    localStorage.setItem('ice_profiles_by_qr', JSON.stringify(profilesByQr));

    return {};
  };

  const signOut = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('ice_user');
    localStorage.removeItem('ice_profile');
  };

  const updateProfile = (updates: Partial<PatientProfile>) => {
    if (!profile || !user) return;

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date(),
    };

    setProfile(updatedProfile);
    localStorage.setItem('ice_profile', JSON.stringify(updatedProfile));
    localStorage.setItem(`ice_profile_${user.id}`, JSON.stringify(updatedProfile));
    
    // Update profile by qrCodeId mapping
    const profilesByQr = JSON.parse(localStorage.getItem('ice_profiles_by_qr') || '{}');
    profilesByQr[updatedProfile.qrCodeId] = updatedProfile;
    localStorage.setItem('ice_profiles_by_qr', JSON.stringify(profilesByQr));
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
