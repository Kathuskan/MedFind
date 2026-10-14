export interface DistrictInfo {
  name: string;
  province: string;
  majorTowns: string[];
}

export const SRI_LANKA_DISTRICTS: DistrictInfo[] = [
  // Western Province
  { name: 'Colombo', province: 'Western', majorTowns: ['Colombo 01-15', 'Dehiwala', 'Moratuwa', 'Kotte', 'Nugegoda'] },
  { name: 'Gampaha', province: 'Western', majorTowns: ['Gampaha', 'Negombo', 'Wattala', 'Kelaniya', 'Kadawatha'] },
  { name: 'Kalutara', province: 'Western', majorTowns: ['Kalutara', 'Panadura', 'Horana', 'Beruwala', 'Matugama'] },

  // Central Province
  { name: 'Kandy', province: 'Central', majorTowns: ['Kandy City', 'Peradeniya', 'Gampola', 'Katugastota', 'Kundasale'] },
  { name: 'Matale', province: 'Central', majorTowns: ['Matale', 'Dambulla', 'Galewela', 'Ukuwela'] },
  { name: 'Nuwara Eliya', province: 'Central', majorTowns: ['Nuwara Eliya', 'Hatton', 'Talawakele', 'Ginigathena'] },

  // Southern Province
  { name: 'Galle', province: 'Southern', majorTowns: ['Galle Fort', 'Karapitiya', 'Hikkaduwa', 'Ambalangoda', 'Elpitiya'] },
  { name: 'Matara', province: 'Southern', majorTowns: ['Matara', 'Weligama', 'Dickwella', 'Akuressa'] },
  { name: 'Hambantota', province: 'Southern', majorTowns: ['Hambantota', 'Tangalle', 'Tissamaharama', 'Ambalantota'] },

  // Northern Province
  { name: 'Jaffna', province: 'Northern', majorTowns: ['Jaffna City', 'Nallur', 'Chavakachcheri', 'Point Pedro', 'Manipay'] },
  { name: 'Kilinochchi', province: 'Northern', majorTowns: ['Kilinochchi', 'Paranthan', 'Pallai'] },
  { name: 'Mannar', province: 'Northern', majorTowns: ['Mannar Town', 'Thalaimannar', 'Murunkan'] },
  { name: 'Vavuniya', province: 'Northern', majorTowns: ['Vavuniya', 'Cheddikulam', 'Nedunkeni'] },
  { name: 'Mullaitivu', province: 'Northern', majorTowns: ['Mullaitivu', 'Puthukkudiyiruppu', 'Oddusuddan'] },

  // Eastern Province
  { name: 'Batticaloa', province: 'Eastern', majorTowns: ['Batticaloa', 'Kattankudy', 'Eravur', 'Valaichchenai'] },
  { name: 'Ampara', province: 'Eastern', majorTowns: ['Ampara', 'Kalmunai', 'Sammanthurai', 'Akkaraipattu'] },
  { name: 'Trincomalee', province: 'Eastern', majorTowns: ['Trincomalee', 'Kinniya', 'Mutur', 'Kantale'] },

  // North Western Province
  { name: 'Kurunegala', province: 'North Western', majorTowns: ['Kurunegala', 'Kuliyapitiya', 'Mawathagama', 'Narammala', 'Pannala'] },
  { name: 'Puttalam', province: 'North Western', majorTowns: ['Puttalam', 'Chilaw', 'Wennappuwa', 'Marawila', 'Anamaduwa'] },

  // North Central Province
  { name: 'Anuradhapura', province: 'North Central', majorTowns: ['Anuradhapura Sacred City', 'Medawachchiya', 'Kekirawa', 'Tambuttegama'] },
  { name: 'Polonnaruwa', province: 'North Central', majorTowns: ['Polonnaruwa', 'Kaduruwela', 'Hingurakgoda', 'Medirigiriya'] },

  // Uva Province
  { name: 'Badulla', province: 'Uva', majorTowns: ['Badulla', 'Bandarawela', 'Haputale', 'Welimada', 'Mahiyanganaya'] },
  { name: 'Monaragala', province: 'Uva', majorTowns: ['Monaragala', 'Wellawaya', 'Bibile', 'Buttala', 'Kataragama'] },

  // Sabaragamuwa Province
  { name: 'Ratnapura', province: 'Sabaragamuwa', majorTowns: ['Ratnapura', 'Balangoda', 'Embilipitiya', 'Pelmadulla', 'Kuruwita'] },
  { name: 'Kegalle', province: 'Sabaragamuwa', majorTowns: ['Kegalle', 'Mawanella', 'Warakapola', 'Rambukkana', 'Yatiyantota'] },
];

export const DISTRICT_NAMES = SRI_LANKA_DISTRICTS.map((d) => d.name);

export const COMMON_MEDICINES = [
  { name: 'Amoxicillin', brand: 'Amoxil', strength: '500mg', form: 'Capsule', category: 'Antibiotic' },
  { name: 'Co-amoxiclav', brand: 'Augmentin', strength: '625mg', form: 'Tablet', category: 'Antibiotic' },
  { name: 'Paracetamol', brand: 'Panadol Extra', strength: '500mg', form: 'Tablet', category: 'Analgesic' },
  { name: 'Metformin', brand: 'Glucophage', strength: '500mg', form: 'Tablet', category: 'Antidiabetic' },
  { name: 'Metformin', brand: 'Glucophage', strength: '850mg', form: 'Tablet', category: 'Antidiabetic' },
  { name: 'Atorvastatin', brand: 'Lipitor', strength: '20mg', form: 'Tablet', category: 'Cardiovascular' },
  { name: 'Losartan', brand: 'Cozaar', strength: '50mg', form: 'Tablet', category: 'Cardiovascular' },
  { name: 'Amlodipine', brand: 'Norvasc', strength: '5mg', form: 'Tablet', category: 'Cardiovascular' },
  { name: 'Omeprazole', brand: 'Losec', strength: '20mg', form: 'Capsule', category: 'Gastrointestinal' },
  { name: 'Pantoprazole', brand: 'Pantocid', strength: '40mg', form: 'Tablet', category: 'Gastrointestinal' },
  { name: 'Salbutamol', brand: 'Ventolin Inhaler', strength: '100mcg', form: 'Inhaler', category: 'Respiratory' },
  { name: 'Cetirizine', brand: 'Zyrtec', strength: '10mg', form: 'Tablet', category: 'Antiallergic' },
  { name: 'Azithromycin', brand: 'Zithromax', strength: '500mg', form: 'Tablet', category: 'Antibiotic' },
  { name: 'Ciprofloxacin', brand: 'Cipro', strength: '500mg', form: 'Tablet', category: 'Antibiotic' },
  { name: 'Insulin Glargine', brand: 'Lantus SoloStar', strength: '100 units/ml', form: 'Injection', category: 'Antidiabetic' },
  { name: 'Ibuprofen', brand: 'Brufen', strength: '400mg', form: 'Tablet', category: 'Analgesic' },
  { name: 'Clopidogrel', brand: 'Plavix', strength: '75mg', form: 'Tablet', category: 'Cardiovascular' },
  { name: 'Montelukast', brand: 'Singulair', strength: '10mg', form: 'Tablet', category: 'Respiratory' },
];
