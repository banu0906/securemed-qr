import { z } from 'zod';

// Country data with phone validation rules
export const countries = [
  { code: 'IN', name: 'India', dialCode: '+91', phoneLength: 10, phoneRegex: /^[6-9]\d{9}$/ },
  { code: 'US', name: 'United States', dialCode: '+1', phoneLength: 10, phoneRegex: /^\d{10}$/ },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', phoneLength: 10, phoneRegex: /^\d{10}$/ },
  { code: 'CA', name: 'Canada', dialCode: '+1', phoneLength: 10, phoneRegex: /^\d{10}$/ },
  { code: 'AU', name: 'Australia', dialCode: '+61', phoneLength: 9, phoneRegex: /^\d{9}$/ },
  { code: 'DE', name: 'Germany', dialCode: '+49', phoneLength: 11, phoneRegex: /^\d{10,11}$/ },
  { code: 'FR', name: 'France', dialCode: '+33', phoneLength: 9, phoneRegex: /^\d{9}$/ },
  { code: 'JP', name: 'Japan', dialCode: '+81', phoneLength: 10, phoneRegex: /^\d{10}$/ },
  { code: 'CN', name: 'China', dialCode: '+86', phoneLength: 11, phoneRegex: /^1\d{10}$/ },
  { code: 'AE', name: 'UAE', dialCode: '+971', phoneLength: 9, phoneRegex: /^[5]\d{8}$/ },
  { code: 'SG', name: 'Singapore', dialCode: '+65', phoneLength: 8, phoneRegex: /^[89]\d{7}$/ },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', phoneLength: 9, phoneRegex: /^\d{8,9}$/ },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', phoneLength: 9, phoneRegex: /^\d{9}$/ },
  { code: 'BR', name: 'Brazil', dialCode: '+55', phoneLength: 11, phoneRegex: /^\d{10,11}$/ },
  { code: 'MX', name: 'Mexico', dialCode: '+52', phoneLength: 10, phoneRegex: /^\d{10}$/ },
] as const;

export type CountryCode = typeof countries[number]['code'];

// ZIP/Postal code validation by country
export const zipCodePatterns: Record<string, { regex: RegExp; example: string }> = {
  IN: { regex: /^\d{6}$/, example: '110001' },
  US: { regex: /^\d{5}(-\d{4})?$/, example: '10001 or 10001-1234' },
  GB: { regex: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, example: 'SW1A 1AA' },
  CA: { regex: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i, example: 'K1A 0B1' },
  AU: { regex: /^\d{4}$/, example: '2000' },
  DE: { regex: /^\d{5}$/, example: '10115' },
  FR: { regex: /^\d{5}$/, example: '75001' },
  JP: { regex: /^\d{3}-?\d{4}$/, example: '100-0001' },
  CN: { regex: /^\d{6}$/, example: '100000' },
  AE: { regex: /^.{0,10}$/, example: 'Optional' },
  SG: { regex: /^\d{6}$/, example: '018956' },
  NZ: { regex: /^\d{4}$/, example: '1010' },
  ZA: { regex: /^\d{4}$/, example: '0001' },
  BR: { regex: /^\d{5}-?\d{3}$/, example: '01310-100' },
  MX: { regex: /^\d{5}$/, example: '06600' },
};

// Validate phone number based on country
export function validatePhone(phone: string, countryCode: string): { valid: boolean; message: string } {
  const country = countries.find(c => c.code === countryCode);
  if (!country) {
    return { valid: false, message: 'Please select a country' };
  }

  // Remove any spaces or dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');

  if (!cleanPhone) {
    return { valid: false, message: 'Phone number is required' };
  }

  if (!country.phoneRegex.test(cleanPhone)) {
    return { 
      valid: false, 
      message: `Invalid phone number for ${country.name}. Expected ${country.phoneLength} digits.` 
    };
  }

  return { valid: true, message: '' };
}

// Validate ZIP/Postal code based on country
export function validateZipCode(zipCode: string, countryCode: string): { valid: boolean; message: string } {
  const pattern = zipCodePatterns[countryCode];
  if (!pattern) {
    // If no pattern defined, accept any non-empty value
    return zipCode.trim() ? { valid: true, message: '' } : { valid: false, message: 'ZIP/Postal code is required' };
  }

  if (!zipCode.trim()) {
    if (countryCode === 'AE') {
      return { valid: true, message: '' }; // UAE doesn't require postal codes
    }
    return { valid: false, message: 'ZIP/Postal code is required' };
  }

  if (!pattern.regex.test(zipCode.trim())) {
    return { 
      valid: false, 
      message: `Invalid format. Example: ${pattern.example}` 
    };
  }

  return { valid: true, message: '' };
}

// Email validation
export function validateEmail(email: string): { valid: boolean; message: string } {
  if (!email.trim()) {
    return { valid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  return { valid: true, message: '' };
}

// Age validation
export function validateAge(age: number | string): { valid: boolean; message: string } {
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;

  if (isNaN(ageNum) || ageNum < 0) {
    return { valid: false, message: 'Please enter a valid age' };
  }

  if (ageNum < 1) {
    return { valid: false, message: 'Age must be at least 1' };
  }

  if (ageNum > 120) {
    return { valid: false, message: 'Please enter a realistic age (1-120)' };
  }

  return { valid: true, message: '' };
}

// Name validation
export function validateName(name: string): { valid: boolean; message: string } {
  if (!name.trim()) {
    return { valid: false, message: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }

  if (name.trim().length > 100) {
    return { valid: false, message: 'Name must be less than 100 characters' };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return { valid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true, message: '' };
}

// Structured Address type
export interface StructuredAddress {
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Validate structured address
export function validateAddress(address: StructuredAddress): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!address.houseNumber.trim()) {
    errors.houseNumber = 'House/Flat number is required';
  }

  if (!address.street.trim()) {
    errors.street = 'Street/Area is required';
  }

  if (!address.city.trim()) {
    errors.city = 'City is required';
  }

  if (!address.state.trim()) {
    errors.state = 'State/Province is required';
  }

  if (!address.country) {
    errors.country = 'Country is required';
  }

  if (address.country) {
    const zipValidation = validateZipCode(address.zipCode, address.country);
    if (!zipValidation.valid) {
      errors.zipCode = zipValidation.message;
    }
  }

  return errors;
}

// Format address for display
export function formatAddress(address: StructuredAddress): string {
  const parts = [
    address.houseNumber,
    address.street,
    address.city,
    address.state,
    countries.find(c => c.code === address.country)?.name || address.country,
    address.zipCode
  ].filter(Boolean);

  return parts.join(', ');
}

// Emergency contact validation (check if same as user's number)
export function validateEmergencyContact(
  contactPhone: string, 
  contactCountry: string,
  userPhone?: string,
  userCountry?: string
): { valid: boolean; message: string } {
  // First validate the phone format
  const phoneValidation = validatePhone(contactPhone, contactCountry);
  if (!phoneValidation.valid) {
    return phoneValidation;
  }

  // Check if it's the same as user's number
  if (userPhone && userCountry) {
    const contactFull = countries.find(c => c.code === contactCountry)?.dialCode + contactPhone.replace(/[\s-]/g, '');
    const userFull = countries.find(c => c.code === userCountry)?.dialCode + userPhone.replace(/[\s-]/g, '');
    
    if (contactFull === userFull) {
      return { valid: false, message: 'Emergency contact cannot be the same as your phone number' };
    }
  }

  return { valid: true, message: '' };
}
