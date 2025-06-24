// Philippine Business Data Constants

export const INDUSTRIES = [
  // Popular industries (shown first)
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', description: 'Production, assembly, industrial operations', popular: true },
  { id: 'bpo', name: 'BPO & Call Centers', icon: '📞', description: 'Customer service, technical support, outsourcing', popular: true },
  { id: 'retail', name: 'Retail & Commerce', icon: '🏪', description: 'Stores, supermarkets, e-commerce', popular: true },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Hospitals, clinics, medical services', popular: true },
  { id: 'food_service', name: 'Food Service', icon: '🍽️', description: 'Restaurants, cafes, catering', popular: true },
  { id: 'construction', name: 'Construction', icon: '🏗️', description: 'Building, infrastructure, real estate', popular: true },
  
  // Other industries  
  { id: 'transportation', name: 'Transportation', icon: '🚛', description: 'Logistics, shipping, delivery', popular: false },
  { id: 'agriculture', name: 'Agriculture', icon: '🌾', description: 'Farming, fishing, livestock', popular: false },
  { id: 'education', name: 'Education', icon: '📚', description: 'Schools, training, tutoring', popular: false },
  { id: 'finance', name: 'Financial Services', icon: '🏦', description: 'Banking, insurance, fintech', popular: false },
  { id: 'technology', name: 'Technology', icon: '💻', description: 'Software, IT services, startups', popular: false },
  { id: 'hospitality', name: 'Hospitality', icon: '🏨', description: 'Hotels, tourism, events', popular: false },
  { id: 'other', name: 'Other', icon: '📋', description: 'Other business types', popular: false }
];

export const PHILIPPINE_REGIONS = [
  'National Capital Region (NCR)',
  'Cordillera Administrative Region (CAR)',
  'Ilocos Region (Region I)',
  'Cagayan Valley (Region II)', 
  'Central Luzon (Region III)',
  'Calabarzon (Region IV-A)',
  'Mimaropa (Region IV-B)',
  'Bicol Region (Region V)',
  'Western Visayas (Region VI)',
  'Central Visayas (Region VII)',
  'Eastern Visayas (Region VIII)',
  'Zamboanga Peninsula (Region IX)',
  'Northern Mindanao (Region X)',
  'Davao Region (Region XI)',
  'Soccsksargen (Region XII)',
  'Caraga (Region XIII)',
  'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)'
];

export const MAJOR_CITIES = {
  'National Capital Region (NCR)': [
    'Manila',
    'Quezon City', 
    'Makati',
    'Taguig',
    'Pasig',
    'Mandaluyong',
    'Marikina',
    'San Juan',
    'Pasay',
    'Parañaque',
    'Las Piñas',
    'Muntinlupa',
    'Caloocan',
    'Malabon',
    'Navotas',
    'Valenzuela',
    'Pateros'
  ],
  'Calabarzon (Region IV-A)': [
    'Antipolo',
    'Cavite City',
    'Bacoor',
    'Imus',
    'Dasmariñas',
    'Laguna',
    'Santa Rosa',
    'Biñan',
    'San Pedro',
    'Calamba',
    'Batangas City',
    'Lipa',
    'Tanauan',
    'Lucena',
    'Tayabas'
  ],
  'Central Luzon (Region III)': [
    'Angeles',
    'San Fernando',
    'Malolos',
    'Meycauayan',
    'San Jose del Monte',
    'Tarlac City',
    'Cabanatuan',
    'San Jose',
    'Palayan',
    'Gapan',
    'Olongapo',
    'Balanga'
  ],
  'Central Visayas (Region VII)': [
    'Cebu City',
    'Mandaue',
    'Lapu-Lapu',
    'Talisay',
    'Toledo',
    'Danao',
    'Bogo',
    'Carcar',
    'Tagbilaran',
    'Dumaguete',
    'Bayawan',
    'Bais',
    'Canlaon',
    'Guihulngan',
    'Tanjay'
  ],
  'Davao Region (Region XI)': [
    'Davao City',
    'Tagum',
    'Panabo',
    'Samal',
    'Digos',
    'Mati'
  ],
  'Western Visayas (Region VI)': [
    'Iloilo City',
    'Bacolod',
    'Roxas',
    'Kabankalan',
    'Sagay',
    'Silay',
    'Talisay',
    'Victorias',
    'Cadiz',
    'Escalante',
    'Himamaylan',
    'La Carlota',
    'San Carlos',
    'Sipalay'
  ],
  'Northern Mindanao (Region X)': [
    'Cagayan de Oro',
    'Iligan',
    'Butuan',
    'Malaybalay',
    'Valencia',
    'Oroquieta',
    'Ozamiz',
    'Tangub',
    'Gingoog'
  ],
  'Ilocos Region (Region I)': [
    'Laoag',
    'Batac',
    'San Fernando',
    'Candon',
    'Vigan',
    'Alaminos',
    'Dagupan',
    'San Carlos',
    'Urdaneta'
  ]
};

export const EMPLOYEE_RANGES = [
  { value: '1-10' as const, label: '1-10 employees', popular: true },
  { value: '11-25' as const, label: '11-25 employees', popular: true },
  { value: '26-50' as const, label: '26-50 employees', popular: true },
  { value: '51-100' as const, label: '51-100 employees', popular: true },
  { value: '101-250' as const, label: '101-250 employees', popular: false },
  { value: '251-500' as const, label: '251-500 employees', popular: false },
  { value: '500+' as const, label: '500+ employees', popular: false }
];

export const PAYROLL_SCHEDULES = [
  { value: 'weekly' as const, label: 'Weekly', description: 'Every Friday' },
  { value: 'bi-monthly' as const, label: 'Bi-monthly', description: '15th & 30th of each month' },
  { value: 'monthly' as const, label: 'Monthly', description: 'End of each month' }
];