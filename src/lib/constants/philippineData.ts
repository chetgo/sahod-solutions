// 📁 src/lib/constants/philippineData.ts
export const PHILIPPINE_REGIONS = [
  'National Capital Region (NCR)',
  'Cordillera Administrative Region (CAR)',
  'Region I (Ilocos Region)',
  'Region II (Cagayan Valley)',
  'Region III (Central Luzon)',
  'Region IV-A (CALABARZON)',
  'Region IV-B (MIMAROPA)',
  'Region V (Bicol Region)',
  'Region VI (Western Visayas)',
  'Region VII (Central Visayas)',
  'Region VIII (Eastern Visayas)',
  'Region IX (Zamboanga Peninsula)',
  'Region X (Northern Mindanao)',
  'Region XI (Davao Region)',
  'Region XII (SOCCSKSARGEN)',
  'Region XIII (Caraga)',
  'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'
];

export const MAJOR_CITIES = {
  'National Capital Region (NCR)': [
    'Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Mandaluyong', 
    'Marikina', 'Muntinlupa', 'Parañaque', 'Las Piñas', 'Caloocan', 
    'Malabon', 'Navotas', 'Valenzuela', 'Pasay', 'San Juan'
  ],
  'Region VII (Central Visayas)': ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay'],
  'Region XI (Davao Region)': ['Davao City', 'Tagum', 'Panabo', 'Samal'],
  'Region IV-A (CALABARZON)': ['Antipolo', 'Bacoor', 'Imus', 'Dasmariñas', 'San Pedro'],
  'Region III (Central Luzon)': ['Angeles', 'San Fernando', 'Malolos', 'Meycauayan', 'Tarlac City']
};

export const INDUSTRIES = [
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    description: 'Production, assembly, industrial operations',
    popular: true
  },
  {
    id: 'bpo',
    name: 'BPO & Call Centers',
    icon: '📞',
    description: 'Customer service, technical support, outsourcing',
    popular: true
  },
  {
    id: 'retail',
    name: 'Retail & Commerce',
    icon: '🏪',
    description: 'Stores, supermarkets, e-commerce',
    popular: true
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Hospitals, clinics, medical services',
    popular: false
  },
  {
    id: 'food-service',
    name: 'Food Service',
    icon: '🍽️',
    description: 'Restaurants, catering, food delivery',
    popular: false
  },
  {
    id: 'construction',
    name: 'Construction',
    icon: '🏗️',
    description: 'Building, infrastructure, real estate',
    popular: false
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚛',
    description: 'Logistics, shipping, delivery services',
    popular: false
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    description: 'Schools, universities, training centers',
    popular: false
  },
  {
    id: 'finance',
    name: 'Financial Services',
    icon: '🏦',
    description: 'Banks, insurance, investment firms',
    popular: false
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Software, IT services, tech startups',
    popular: false
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    icon: '🏨',
    description: 'Hotels, resorts, tourism services',
    popular: false
  },
  {
    id: 'other',
    name: 'Other',
    icon: '📋',
    description: 'Other business types',
    popular: false
  }
];

export const EMPLOYEE_RANGES = [
  { value: '1-10', label: '1-10 employees', category: 'startup' },
  { value: '11-25', label: '11-25 employees', category: 'small' },
  { value: '26-50', label: '26-50 employees', category: 'small' },
  { value: '51-100', label: '51-100 employees', category: 'medium', popular: true },
  { value: '101-250', label: '101-250 employees', category: 'medium' },
  { value: '251-500', label: '251-500 employees', category: 'large' },
  { value: '500+', label: '500+ employees', category: 'enterprise' }
];